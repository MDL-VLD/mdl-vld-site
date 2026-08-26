/* MDL Viollet-le-Duc · recherche globale + pastille nouveautes (commun a toutes les pages) */
(function(){
  var SB='https://ksvqjbcnqphnyxfpjhvz.supabase.co';
  var KEY='sb_publishable_KJntHDOzJXgogIKxXNvWDg_p65OruJ0';
  var PAGES=[
    {t:'Accueil',u:'index.html',k:'accueil maison des lyceens mdl'},
    {t:'À propos',u:'apropos.html',k:'a propos qui sommes nous bureau association'},
    {t:'Actualités',u:'actu.html',k:'actualites articles journal nouvelles blog'},
    {t:'Événements',u:'evenements.html',k:'evenements bal carnaval halloween octobre rose saint valentin course faim'},
    {t:'Agenda',u:'planning.html',k:'agenda planning calendrier dates vacances bac'},
    {t:'Galerie',u:'galerie.html',k:'galerie photos videos affiches'},
    {t:'Documents & liens',u:'documents.html',k:'documents statuts reglement liens utiles'},
    {t:'Partenaires',u:'partenaires.html',k:'partenaires clubs associations'},
    {t:'Merch',u:'merch.html',k:'merch boutique pulls tote bag'},
    {t:'Concours de logos',u:'concours-logos.html',k:'concours logo'},
    {t:'Adhérer',u:'adherer.html',k:'adherer adhesion helloasso cotisation'},
    {t:'Contact',u:'contact.html',k:'contact nous ecrire message'},
    {t:'FAQ',u:'faq.html',k:'faq questions frequentes aide'},
    {t:'Mentions légales',u:'mentions-legales.html',k:'mentions legales'},
    {t:'Confidentialité',u:'confidentialite.html',k:'confidentialite donnees rgpd'},
    {t:'CGU',u:'cgu.html',k:'cgu conditions utilisation'},
    {t:'CGV',u:'cgv.html',k:'cgv conditions vente'}
  ];
  function slugify(s){return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60)}
  function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
  function esc(s){return (s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  function api(path){return fetch(SB+'/rest/v1/'+path,{headers:{apikey:KEY,Authorization:'Bearer '+KEY}}).then(function(r){return r.ok?r.json():[]}).catch(function(){return []})}

  var ARTS=[],EVTS=[];
  function loadData(){
    api('articles?select=title,tags,published_at&status=eq.publie&deleted_at=is.null').then(function(d){ARTS=d||[]});
    api('evenements?select=titre,date_affichee,tags&deleted_at=is.null').then(function(d){EVTS=d||[]});
  }

  /* ---- styles ---- */
  function injectCSS(){
    var css='.site-search-btn{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:100px;border:1px solid var(--line,#e7e1ea);background:transparent;color:var(--prune,#2d1a28);cursor:pointer;flex:none}'
    +'.site-search-btn:hover{background:rgba(125,15,100,.08);color:var(--mg,#7d0f64)}'
    +'.ss-btn-lbl{display:none}.nav-links a{white-space:nowrap}'
    +'html.a11y-dys .nav-links,html.a11y-big .nav-links{gap:14px}html.a11y-dys .nav-links a,html.a11y-big .nav-links a{white-space:nowrap}'
    +'@media(max-width:1250px){.nav-links .site-search-btn{order:-1;width:auto;height:auto;border:none;border-radius:12px;justify-content:flex-start;gap:12px;padding:16px 12px;margin:6px 14px 2px;color:var(--prune,#2d1a28)}.nav-links .site-search-btn .ss-btn-lbl{display:inline;font-family:var(--syne,sans-serif);font-weight:600;font-size:16px}.nav-links .site-search-btn:hover{background:var(--paper2,#efe8e3)}.nav-links .nav-badge{margin-left:auto}}'
    +'.site-search-ov{position:fixed;inset:0;z-index:300;background:rgba(20,6,15,.55);display:none;align-items:flex-start;justify-content:center;padding:14vh 20px 20px}'
    +'.site-search-ov.open{display:flex}'
    +'.site-search-box{width:100%;max-width:620px;background:var(--paper,#f6f2ef);border-radius:18px;box-shadow:0 30px 80px rgba(20,6,15,.4);overflow:hidden}'
    +'.site-search-top{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid var(--line,#e7e1ea)}'
    +'.site-search-top input{flex:1;border:none;background:transparent;font-family:inherit;font-size:17px;color:var(--ink,#241019);outline:none}'
    +'.site-search-top input:focus,.site-search-top input:focus-visible{outline:none!important;box-shadow:none!important}'
    +'.site-search-top input::-webkit-search-cancel-button,.site-search-top input::-webkit-search-decoration{-webkit-appearance:none;appearance:none;display:none}'
    +'.site-search-close{border:none;background:transparent;font-size:22px;line-height:1;color:var(--grey,#6d6169);cursor:pointer}'
    +'.site-search-res{max-height:56vh;overflow:auto;padding:8px}'
    +'.ss-group{font-family:var(--syne),sans-serif;font-weight:700;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mg,#7d0f64);padding:12px 12px 4px}'
    +'.ss-item{display:block;padding:10px 12px;border-radius:10px;color:var(--ink,#241019);text-decoration:none;font-size:15px}'
    +'.ss-item:hover,.ss-item.sel{background:rgba(125,15,100,.09);color:var(--mg,#7d0f64)}'
    +'.ss-item small{display:block;color:var(--grey,#6d6169);font-size:12.5px}'
    +'.ss-empty{color:var(--grey,#6d6169);padding:18px 14px;font-size:14px}'
    +'.ss-hint{color:var(--grey,#6d6169);padding:10px 14px;font-size:12.5px}'
    +'.nav-badge{display:inline-block;min-width:16px;height:16px;line-height:16px;text-align:center;background:var(--mg,#7d0f64);color:#fff;border-radius:100px;font-size:10px;font-weight:700;padding:0 4px;margin-left:5px;vertical-align:1px}'
    +'html.dark .site-search-box{background:#241019}html.dark .site-search-top input{color:#fff}'
    +'@media print{nav,footer,.a11y-btn,.a11y-panel,.totop,.site-search-btn,.site-search-ov,.crumb,.notice,.read-progress,.hero-actions,.foot-social,.burger,.ag-toggle,.share,.next-article{display:none!important}html,body{background:#fff!important;color:#000!important}a{color:#000!important;text-decoration:underline}.wrap{max-width:100%!important;padding:0!important}*{box-shadow:none!important;text-shadow:none!important}.phero,.hero{min-height:auto!important;color:#000!important}.phero::after,.hero-bg::after{display:none!important}}';
    var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
    /* --- lien "Aller au contenu" (skip-link) --- */
    var css2='.skip-link{position:fixed;left:12px;top:-80px;z-index:500;background:var(--mg,#7d0f64);color:#fff;font-family:var(--syne,sans-serif);font-weight:700;font-size:15px;padding:12px 18px;border-radius:0 0 12px 12px;text-decoration:none;box-shadow:0 10px 30px rgba(45,26,40,.28);transition:top .18s ease}'
    +'.skip-link:focus,.skip-link:focus-visible{top:0;outline:2px solid #fff;outline-offset:-4px}'
    /* --- bascule forcee en menu burger : dyslexie + grand texte ensemble --- */
    +'html.a11y-dys.a11y-big .nav-links{display:none!important;position:fixed;left:0;right:0;top:70px;flex-direction:column;align-items:stretch;gap:0;background:var(--paper,#f6f2ef);border-bottom:1px solid var(--line,#e7e1ea);padding:8px 0 16px;box-shadow:0 18px 44px rgba(45,26,40,.22);z-index:120;max-height:calc(100vh - 70px);overflow:auto;border-radius:0 0 18px 18px}'
    +'html.a11y-dys.a11y-big .nav-links.open{display:flex!important}'
    +'html.a11y-dys.a11y-big .nav-links a{padding:13px 32px;opacity:1}'
    +'html.a11y-dys.a11y-big .nav-links a:not(.cta){margin:0 12px;border-bottom:1px solid var(--line,#e7e1ea);display:flex;align-items:center;justify-content:space-between}'
    +'html.a11y-dys.a11y-big .nav-links a.cta{margin:14px 16px 4px;justify-content:center}'
    +'html.a11y-dys.a11y-big .burger{display:flex!important}'
    +'html.a11y-dys.a11y-big .nav-links .site-search-btn{order:-1;width:auto;height:auto;border:none;border-radius:12px;justify-content:flex-start;gap:12px;padding:16px 12px;margin:6px 14px 2px}'
    +'html.a11y-dys.a11y-big .nav-links .site-search-btn .ss-btn-lbl{display:inline;font-family:var(--syne,sans-serif);font-weight:600;font-size:16px}'
    +'html.dark.a11y-dys.a11y-big .nav-links{background:#241019}'
    /* --- hauteur uniforme des bannieres (phero) sur toutes les pages + pas de coupure au milieu des mots --- */
    +'.phero{min-height:460px!important}'
    +'.phero h1,.lhead h1{word-break:normal!important;overflow-wrap:break-word}'
    +'@media(max-width:640px){.phero{min-height:300px!important}}';
    var st2=document.createElement('style');st2.textContent=css2;document.head.appendChild(st2);
  }
  function addSkipLink(){
    if(document.querySelector('.skip-link'))return;
    var tgt=document.getElementById('main')||document.querySelector('main,header.hero,.phero,.page-hero,.wrap,section');
    if(tgt&&!tgt.id)tgt.id='main';
    var id=(tgt&&tgt.id)?tgt.id:'main';
    var a=document.createElement('a');a.className='skip-link';a.href='#'+id;a.textContent='Aller au contenu';
    a.addEventListener('click',function(){if(tgt){tgt.setAttribute('tabindex','-1');setTimeout(function(){tgt.focus()},0)}});
    document.body.insertBefore(a,document.body.firstChild);
  }

  function buildOverlay(){
    var ov=document.createElement('div');ov.className='site-search-ov';ov.id='site-search-ov';
    ov.innerHTML='<div class="site-search-box" role="dialog" aria-label="Recherche sur le site"><div class="site-search-top"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><input id="site-search-input" type="search" placeholder="Rechercher une page, un article, un événement…" aria-label="Rechercher"><button class="site-search-close" aria-label="Fermer" id="site-search-close">×</button></div><div class="site-search-res" id="site-search-res"><div class="ss-hint">Tape pour rechercher dans tout le site.</div></div></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){if(e.target===ov)closeSearch()});
    document.getElementById('site-search-close').addEventListener('click',closeSearch);
    document.getElementById('site-search-input').addEventListener('input',function(){render(this.value)});
    return ov;
  }
  function openSearch(){var ov=document.getElementById('site-search-ov')||buildOverlay();ov.classList.add('open');var inp=document.getElementById('site-search-input');inp.value='';render('');setTimeout(function(){inp.focus()},30)}
  function closeSearch(){var ov=document.getElementById('site-search-ov');if(ov)ov.classList.remove('open')}

  function render(q){
    var res=document.getElementById('site-search-res');if(!res)return;
    var nq=norm(q).trim();
    if(!nq){res.innerHTML='<div class="ss-hint">Tape pour rechercher dans tout le site.</div>';return}
    var pg=PAGES.filter(function(p){return norm(p.t+' '+p.k).indexOf(nq)>=0}).slice(0,6);
    var ar=ARTS.filter(function(a){return norm((a.title||'')+' '+((a.tags||[]).join(' '))).indexOf(nq)>=0}).slice(0,6);
    var ev=EVTS.filter(function(e){return norm((e.titre||'')+' '+((e.tags||[]).join(' '))).indexOf(nq)>=0}).slice(0,6);
    var h='';
    if(ar.length){h+='<div class="ss-group">Articles</div>'+ar.map(function(a){return '<a class="ss-item" href="actu.html#'+slugify(a.title)+'">'+esc(a.title)+'<small>Actualités</small></a>'}).join('')}
    if(ev.length){h+='<div class="ss-group">Événements</div>'+ev.map(function(e){return '<a class="ss-item" href="evenements.html">'+esc(e.titre)+'<small>'+esc(e.date_affichee||'Événement')+'</small></a>'}).join('')}
    if(pg.length){h+='<div class="ss-group">Pages</div>'+pg.map(function(p){return '<a class="ss-item" href="'+p.u+'">'+esc(p.t)+'</a>'}).join('')}
    res.innerHTML=h||'<div class="ss-empty">Aucun résultat pour « '+esc(q)+' ».</div>';
  }

  function addLoupe(){
    var nav=document.querySelector('.nav-links');if(!nav||document.querySelector('.site-search-btn'))return;
    var b=document.createElement('button');b.type='button';b.className='site-search-btn';b.setAttribute('aria-label','Rechercher sur le site');
    b.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><span class="ss-btn-lbl">Rechercher</span>';
    b.addEventListener('click',openSearch);
    var adminLink=nav.querySelector('a[href*="admin"]');
    if(adminLink)nav.insertBefore(b,adminLink); else nav.appendChild(b);
  }

  function pastille(){
    var since=new Date(Date.now()-14*86400000).toISOString();
    api('articles?select=id&status=eq.publie&deleted_at=is.null&published_at=gte.'+since).then(function(d){
      var n=(d||[]).length;if(!n)return;
      document.querySelectorAll('.nav-links a').forEach(function(a){
        var h=(a.getAttribute('href')||'');
        if(h.indexOf('actu')>=0 && !a.querySelector('.nav-badge')){var s=document.createElement('span');s.className='nav-badge';s.textContent=n;s.title=n+' nouvel article'+(n>1?'s':'');a.appendChild(s)}
      });
    });
  }

  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSearch();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}});
  function init(){injectCSS();addSkipLink();addLoupe();loadData();pastille()}
  if(document.readyState!=='loading')init();else document.addEventListener('DOMContentLoaded',init);
})();
