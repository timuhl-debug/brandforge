const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  hex: {
    type: String,
    required: true,
    match: /^#[0-9A-F]{6}$/i
  },
  role: {
    type: String,
    default: 'Accent',
    maxlength: 40
  }
}, { timestamps: true });

const fontSchema = new mongoose.Schema({
  family: {
    type: String,
    required: true,
    maxlength: 80
  },
  purpose: {
    type: String,
    enum: ['Headline', 'Body', 'Accent'],
    default: 'Body'
  },
  weight: {
    type: Number,
    enum: [300, 400, 500, 600, 700, 800],
    default: 400
  }
}, { timestamps: true });

const assetSchema = new mongoose.Schema({
  fileName: String,
  mimeType: String,
  size: Number,
  url: String,
  data: {
    type: Buffer,
    select: false
  },
  dataBase64: {
    type: String,
    select: false
  }
}, { timestamps: true });

const brandSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },

  description: {
    type: String,
    maxlength: 500,
    default: ''
  },

  industry: {
    type: String,
    maxlength: 80,
    default: ''
  },

  slogan: {
    type: String,
    maxlength: 160,
    default: ''
  },

  logoPreset: {
    type: String,
    enum: ['monogram', 'orbit', 'bloom', 'frame'],
    default: 'monogram'
  },

  colors: {
    type: [colorSchema],
    default: () => [
      { name: 'Primary', hex: '#6C5CE7', role: 'Primary' },
      { name: 'Ink', hex: '#171820', role: 'Text' },
      { name: 'Canvas', hex: '#F7F7F5', role: 'Background' },
      { name: 'Accent', hex: '#F4A261', role: 'Accent' }
    ]
  },

  fonts: {
    type: [fontSchema],
    default: () => [
      { family: 'DM Sans', purpose: 'Body', weight: 400 },
      { family: 'Manrope', purpose: 'Headline', weight: 700 }
    ]
  },

  assets: {
    type: [assetSchema],
    default: []
  }

}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);