declare const Netlify:any;
const enc=new TextEncoder();
const b64u=(s:Uint8Array)=>Buffer.from(s).toString("base64url");
const ub64=(s:string)=>Buffer.from(s,"base64url").toString("utf8");
function keys(){try{return JSON.parse(Netlify.env.get("ZUME_BRAND_KEYS")||"{}")}catch{return {}}}
async function sign(raw:string){const secret=Netlify.env.get("ZUME_BRAND_KEYS")||"zume";const k=await crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return b64u(new Uint8Array(await crypto.subtle.sign("HMAC",k,enc.encode(raw))))}
async function token(payload:any){const raw=Buffer.from(JSON.stringify(payload)).toString("base64url");return raw+"."+await sign(raw)}
async function verify(t:string){try{const [raw,sig]=t.split(".");if(!raw||!sig||await sign(raw)!==sig)return null;const p=JSON.parse(ub64(raw));if(!p.exp||Date.now()>p.exp)return null;return p}catch{return null}}
function cookie(req:Request){const h=req.headers.get("cookie")||"";const m=h.match(/(?:^|;\s*)zume_portal=([^;]+)/);return m?.[1]||""}
const json=(x:any,status=200,headers:any={})=>new Response(JSON.stringify(x),{status,headers:{"content-type":"application/json; charset=utf-8",...headers}});
export default async(req:Request)=>{
  const method=req.method.toUpperCase();
  if(method==="GET"){const p=await verify(cookie(req));return json(p?{ok:true,role:p.role,brand:p.brand}:{ok:false},p?200:401)}
  if(method!=="POST")return json({ok:false},405);
  let body:any={};try{body=await req.json()}catch{}
  if(body.action==="logout")return json({ok:true},200,{"set-cookie":"zume_portal=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"});
  const all=keys();
  if(body.action==="admin"){
    if(!body.key||body.key!==all.__admin)return json({ok:false,message:"Clave incorrecta"},401);
    const t=await token({role:"admin",brand:"*",exp:Date.now()+1000*60*60*12});
    return json({ok:true,role:"admin"},200,{"set-cookie":`zume_portal=${t}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=43200`});
  }
  const brand=String(body.brand||"");
  if(!brand||!body.key||body.key!==all[brand])return json({ok:false,message:"Marca o clave incorrecta"},401);
  const t=await token({role:"client",brand,exp:Date.now()+1000*60*60*24*7});
  return json({ok:true,role:"client",brand},200,{"set-cookie":`zume_portal=${t}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`});
};
export const config={path:"/.netlify/functions/portal-auth"};