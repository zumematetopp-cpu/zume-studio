export default async () => {
  const urls = {
    posts: 'https://www.canva.com/design/DAHQ46YAqvQ/ufqc3nUH1zr6HaVCGBqY1Q/view',
    stories: 'https://www.canva.com/design/DAHUET8AGI8/ny_G8yVuUKW8BOzyvn5jkg/view'
  };
  const out:any = {};
  for (const [kind,url] of Object.entries(urls)) {
    try {
      const r = await fetch(url,{headers:{'user-agent':'Mozilla/5.0'}});
      const text = await r.text();
      const media = text.match(/https:\/\/media\.canva\.com[^"'\\\s<]+/g) || [];
      const docs = text.match(/document-image/g) || [];
      out[kind] = {status:r.status,length:text.length,mediaCount:media.length,documentImageCount:docs.length,hasOgImage:/property=["']og:image/i.test(text)};
    } catch (e:any) {
      out[kind] = {error:String(e?.message||e)};
    }
  }
  return new Response(JSON.stringify(out),{headers:{'content-type':'application/json','access-control-allow-origin':'https://zumestudio.com'}});
};
export const config={path:'/canva-probe'};
