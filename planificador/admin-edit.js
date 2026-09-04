(function(){
  const STORAGE_PREFIX='zumePlannerBrandConfig:';
  function key(brand){return STORAGE_PREFIX+brand;}
  function readSaved(brand){
    try{return JSON.parse(localStorage.getItem(key(brand))||'null');}catch{return null;}
  }
  function applySaved(brand){
    const saved=readSaved(brand);
    if(!saved||!DATA[brand]) return;
    DATA[brand].sources={...(DATA[brand].sources||{}),...(saved.sources||{})};
    if(typeof saved.rules==='string') DATA[brand].rules=saved.rules;
  }
  Object.keys(BRANDS).forEach(applySaved);

  const originalRender=render;
  render=function(){
    applySaved(currentBrand);
    originalRender();
  };

  const originalRenderSources=renderSources;
  renderSources=function(d){
    originalRenderSources(d);
    ['srcPosts','srcStories','srcPhotos','srcReels','srcRules'].forEach(id=>{
      const el=$(id); if(el) el.removeAttribute('readonly');
    });
    let bar=$('zumeAdminSaveBar');
    if(!bar){
      bar=document.createElement('div');
      bar.id='zumeAdminSaveBar';
      bar.style.cssText='display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:12px';
      bar.innerHTML='<button id="zumeSaveBrand" class="btn primary" type="button">Guardar marca</button><span id="zumeSaveStatus" style="font-size:11px;color:#666"></span>';
      $('sourcesPanel').appendChild(bar);
      $('zumeSaveBrand').onclick=saveBrand;
    }
  };

  function saveBrand(){
    if(role!=='admin'||!currentBrand) return;
    const cfg={
      sources:{
        canvaPosts:$('srcPosts').value.trim(),
        canvaStories:$('srcStories').value.trim(),
        drivePhotos:$('srcPhotos').value.trim(),
        driveReels:$('srcReels').value.trim()
      },
      rules:$('srcRules').value.trim(),
      savedAt:new Date().toISOString()
    };
    localStorage.setItem(key(currentBrand),JSON.stringify(cfg));
    DATA[currentBrand].sources={...(DATA[currentBrand].sources||{}),...cfg.sources};
    DATA[currentBrand].rules=cfg.rules;
    const s=$('zumeSaveStatus');
    if(s){s.textContent='Guardado ✓';setTimeout(()=>s.textContent='',1800);}
    renderSources(DATA[currentBrand]);
  }
})();
