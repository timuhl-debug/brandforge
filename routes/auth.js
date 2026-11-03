const router = require('express').Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
// - Trim account input before validating or saving it.
const clean = (v, n=180) => String(v || '').trim().slice(0,n);
// - Keep the session token short-lived and tied to the user ID.
const tokenFor = user => jwt.sign({sub:user._id.toString()}, process.env.JWT_SECRET, {expiresIn:'7d'});
function verificationUrl(rawToken) {
  return `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${rawToken}`;
}
async function sendVerification(user, rawToken) {
  const configured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  const url = verificationUrl(rawToken);
  if (!configured) { console.log(`\n[BrandForge development verification] ${user.email}: ${url}\n`); return false; }
  const transporter = nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:String(process.env.SMTP_SECURE)==='true',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
  await transporter.sendMail({from:process.env.SMTP_FROM || process.env.SMTP_USER,to:user.email,subject:'Verify your BrandForge email',text:`Welcome to BrandForge. Verify your email by opening this link: ${url}`,html:`<div style="font-family:Arial,sans-serif;line-height:1.6;color:#20231f;max-width:560px;margin:0 auto;padding:32px"><h1 style="font-size:26px">Welcome to BrandForge</h1><p>Thanks for creating your account. Click the button below to verify your email address.</p><p style="margin:28px 0"><a href="${url}" style="display:inline-block;padding:13px 20px;background:#263d31;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700">Verify email address</a></p><p>If the button does not work, copy and paste this link into your browser:</p><p><a href="${url}">${url}</a></p><p>This link expires in 24 hours. If you did not create a BrandForge account, you can ignore this email.</p></div>`}); return true;
}
router.post('/register', async (req,res,next) => { try {
  const name=clean(req.body.name,80), email=clean(req.body.email).toLowerCase(), password=String(req.body.password||'');
  if(!name || !/^\S+@\S+\.\S+$/.test(email) || password.length<12) return res.status(400).json({message:'Enter your name, a valid email, and a password with at least 12 characters.'});
  if(await User.exists({email})) return res.status(409).json({message:'An account with this email already exists.'});
  const raw=crypto.randomBytes(32).toString('hex');
  const user=await User.create({name,email,passwordHash:await bcrypt.hash(password,12),verificationTokenHash:crypto.createHash('sha256').update(raw).digest('hex'),verificationExpiresAt:new Date(Date.now()+24*60*60*1000)});
  let emailSent=false; try { emailSent=await sendVerification(user,raw); } catch(e) { console.error('Verification email failed:',e.message); if(process.env.NODE_ENV!=='production') console.log(`[BrandForge development verification] ${email}: ${(process.env.CLIENT_URL || 'http://localhost:5173')}/verify-email?token=${raw}`); }
  const directVerificationUrl=!emailSent&&process.env.NODE_ENV!=='production'?verificationUrl(raw):undefined;
  res.status(201).json({message:emailSent?'Account created. Check your email to verify it.':process.env.NODE_ENV==='production'?'Account created, but the verification email could not be sent. Please try again later.':'Account created. Use the verification link below, or find it in the server terminal.',emailSent,...(directVerificationUrl?{verificationUrl:directVerificationUrl}:{})});
} catch(e){next(e)} });

router.post('/resend-verification', async (req,res,next) => { try {
  const email=clean(req.body.email).toLowerCase();
  if(!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({message:'Enter a valid email address.'});
  const user=await User.findOne({email}).select('+verificationTokenHash +verificationExpiresAt');
  // Use a generic response so this endpoint does not reveal which addresses have accounts.
  if(!user || user.isVerified) return res.json({message:'If the account exists and still needs verification, a new email will be sent.'});
  const raw=crypto.randomBytes(32).toString('hex');
  user.verificationTokenHash=crypto.createHash('sha256').update(raw).digest('hex');
  user.verificationExpiresAt=new Date(Date.now()+24*60*60*1000);
  await user.save();
  try { const emailSent=await sendVerification(user,raw); const directVerificationUrl=!emailSent&&process.env.NODE_ENV!=='production'?verificationUrl(raw):undefined; return res.json({message:emailSent?'A new verification email has been sent. Check your inbox and spam folder.':process.env.NODE_ENV==='production'?'Email could not be sent right now. Please try again later.':'Use the verification link below, or find it in the server terminal.',emailSent,...(directVerificationUrl?{verificationUrl:directVerificationUrl}:{})}); }
  catch(e){console.error('Resend verification email failed:',e.message);if(process.env.NODE_ENV!=='production'){const url=verificationUrl(raw);console.log(`[BrandForge development verification] ${email}: ${url}`);return res.json({message:'Email could not be sent right now. Use the development verification link below.',emailSent:false,verificationUrl:url});}return res.json({message:'Email could not be sent right now. Check SMTP settings and try again.'});}
} catch(e){next(e)} });

router.get('/verify', async(req,res,next)=>{try{
  const raw=String(req.query.token||''); if(!raw) return res.status(400).json({message:'Verification token is required.'});
  const hash=crypto.createHash('sha256').update(raw).digest('hex');
  const user=await User.findOne({verificationTokenHash:hash,verificationExpiresAt:{$gt:new Date()}}).select('+verificationTokenHash +verificationExpiresAt');
  if(!user) return res.status(400).json({message:'Verification link is invalid or expired.'});
  user.isVerified=true; user.verificationTokenHash=undefined; user.verificationExpiresAt=undefined; await user.save();
  res.json({message:'Email verified successfully. You can now sign in.'});
}catch(e){next(e)}});
router.post('/login', async(req,res,next)=>{try{
  const email=clean(req.body.email).toLowerCase(), password=String(req.body.password||'');
  const user=await User.findOne({email}).select('+passwordHash');
  if(!user || !(await bcrypt.compare(password,user.passwordHash))) return res.status(401).json({message:'Sign-in failed. Check your email and password.'});
  if(!user.isVerified) return res.status(403).json({message:'Please verify your email before signing in.'});
  res.json({token:tokenFor(user),user:{id:user._id,name:user.name,email:user.email}});
}catch(e){next(e)}});
module.exports=router;
