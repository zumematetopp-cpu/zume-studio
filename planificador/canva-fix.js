// ZUME Canva interaction fix: Canva cards open the real Canva design directly.
(function(){
  function getItemFromCard(card){
    const grid=card.closest('.grid');
    if(!grid) return null;
    const cards=[...grid.querySelectorAll('.card')];
    const index=cards.indexOf(card);
    if(index<0) return null;
    if(grid.id==='postsGrid') return (DATA[currentBrand]?.posts||[])[index]||null;
    if(grid.id==='storiesGrid') return (DATA[currentBrand]?.stories||[])[index]||null;
    return null;
  }

  // Capture before app.js card click handler. For Canva cards, open the original design.
  document.addEventListener('click',function(e){
    const card=e.target.closest('.card.post,.card.story');
    if(!card || e.target.closest('a,button')) return;
    const item=getItemFromCard(card);
    if(!item?.open) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    window.open(item.open,'_blank','noopener,noreferrer');
  },true);

  // If a time-limited Canva thumbnail expires, keep the card useful and clickable.
  document.addEventListener('error',function(e){
    const img=e.target;
    if(!(img instanceof HTMLImageElement)) return;
    const card=img.closest('.card.post,.card.story');
    if(!card || card.dataset.canvaFallback==='1') return;
    card.dataset.canvaFallback='1';
    const media=img.closest('.media');
    if(!media) return;
    img.style.display='none';
    const box=document.createElement('div');
    box.style.cssText='position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:14px;background:#f4f4f4;color:#111;font:600 11px Poppins,Arial,sans-serif;cursor:pointer';
    box.innerHTML='Vista de Canva<br><span style="font-weight:400;color:#777;margin-top:4px">Tocá para abrir el diseño</span>';
    media.appendChild(box);
  },true);
})();