const BASE='/api';
export async function api(path, options={}){
 const token=localStorage.getItem('brandforge-token');
 const headers={...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),...(token?{Authorization:`Bearer ${token}`}:{ }),...options.headers};
 const response=await fetch(`${BASE}${path}`,{...options,headers});
 const data= response.status===204?{}:await response.json().catch(()=>({message:'Unexpected server response.'}));
 if(!response.ok)throw new Error(data.message||'Request failed');return data;
}
