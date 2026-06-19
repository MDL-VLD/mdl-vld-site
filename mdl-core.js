/* mdl-core.js - Scripts partagés MDL Viollet-le-Duc */

// ============================================================
// MODE SOMBRE
// ============================================================
(function() {
  var saved = localStorage.getItem('mdl-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

function initDarkMode() {
  var btn = document.getElementById('darkToggle');
  if (!btn) return;
  
  var theme = localStorage.getItem('mdl-theme') || 'light';
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  
  btn.addEventListener('click', function() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('mdl-theme', next);
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

// ============================================================
// ANIMATIONS AU SCROLL
// ============================================================
function initScrollReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  
  els.forEach(function(el) { observer.observe(el); });
}

// ============================================================
// MOTEUR DE RECHERCHE
// ============================================================
var SEARCH_INDEX = [
  { title: 'Accueil', desc: 'Page principale de la MDL', url: 'index.html', icon: '🏠' },
  { title: 'Événements', desc: 'Bal des Terminales, Course contre la Faim...', url: 'evenements.html', icon: '🎉' },
  { title: 'Bal des Terminales 2026', desc: '3 juillet 2026 · Salle polyvalente de Thoiry · Thème Cannes', url: 'evenement-bal.html', icon: '🎬' },
  { title: 'Course contre la Faim', desc: '6 mai 2026 · Action Contre la Faim', url: 'evenement-ccf.html', icon: '🌍' },
  { title: 'Projets', desc: 'Sorties culturelles, actions solidaires, site web...', url: 'projets.html', icon: '💡' },
  { title: 'Clubs', desc: 'Théâtre, chorale, manga, lecture, vidéo...', url: 'clubs.html', icon: '🎭' },
  { title: 'Planning', desc: 'Calendrier Google Agenda de la MDL', url: 'planning.html', icon: '📅' },
  { title: 'La MDL', desc: 'Qu\'est-ce que la Maison des Lycéens ?', url: 'mdl.html', icon: '🏫' },
  { title: 'Équipe', desc: 'Bureau, Conseil d\'Administration, Membres actifs', url: 'equipe.html', icon: '👥' },
  { title: 'Adhérer', desc: 'Rejoindre la MDL · 5€ · HelloAsso', url: 'adhesion.html', icon: '✋' },
  { title: 'Partenaires', desc: 'Lycée, CVL, AS, Ambassadeurs, VLMag...', url: 'partenaires.html', icon: '🤝' },
  { title: 'Merch', desc: 'Hoodie MDL, Tote-bag...', url: 'merch.html', icon: '🛍' },
  { title: 'Documents', desc: 'Statuts, règlement intérieur, PV, bilans...', url: 'documents.html', icon: '📄' },
  { title: 'Contact', desc: 'Formulaire de contact · contact@mdl-vld.fr', url: 'contact.html', icon: '✉️' },
  { title: 'Crédits', desc: 'Conception du site, photos © Ewan Foucaud', url: 'credits.html', icon: '✨' },
  { title: 'Billetterie Bal', desc: 'Réserver une place pour le bal · Billetweb', url: 'evenements.html#billetterie', icon: '🎟' },
];

function initSearch() {
  var overlay = document.getElementById('searchOverlay');
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');
  var openBtn = document.getElementById('searchOpenBtn');
  if (!overlay || !input) return;

  function openSearch() {
    overlay.classList.add('open');
    setTimeout(function() { input.focus(); }, 50);
  }
  function closeSearch() {
    overlay.classList.remove('open');
    input.value = '';
    renderResults('');
  }

  if (openBtn) openBtn.addEventListener('click', openSearch);

  // Raccourci clavier Ctrl+K / Cmd+K
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      overlay.classList.contains('open') ? closeSearch() : openSearch();
    }
    if (e.key === 'Escape') closeSearch();
  });

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeSearch();
  });

  document.getElementById('searchCloseBtn') && 
    document.getElementById('searchCloseBtn').addEventListener('click', closeSearch);

  input.addEventListener('input', function() {
    renderResults(this.value.trim().toLowerCase());
  });

  function renderResults(query) {
    if (!query) {
      results.innerHTML = '<div class="search-empty">Tapez pour rechercher une page, un événement...</div>';
      return;
    }
    var found = SEARCH_INDEX.filter(function(item) {
      return item.title.toLowerCase().includes(query) || 
             item.desc.toLowerCase().includes(query);
    });
    if (!found.length) {
      results.innerHTML = '<div class="search-empty">Aucun résultat pour "' + query + '"</div>';
      return;
    }
    results.innerHTML = found.map(function(item) {
      return '<a href="' + item.url + '" class="search-result-item">' +
        '<div class="search-result-icon">' + item.icon + '</div>' +
        '<div><div class="search-result-title">' + item.title + '</div>' +
        '<div class="search-result-desc">' + item.desc + '</div></div>' +
        '</a>';
    }).join('');
  }

  renderResults('');
}

// ============================================================
// BANDEAU COOKIE
// ============================================================
function initCookieBanner() {
  var banner = document.getElementById('cookieBanner');
  if (!banner) return;
  
  // Si déjà répondu, ne pas afficher du tout
  if (localStorage.getItem('mdl-cookies-ok')) {
    banner.style.display = 'none';
    return;
  }
  
  setTimeout(function() {
    banner.style.display = 'flex';
    // Force reflow
    banner.offsetHeight;
    banner.classList.add('show');
  }, 1500);
  
  document.getElementById('cookieAccept') && 
    document.getElementById('cookieAccept').addEventListener('click', function() {
      localStorage.setItem('mdl-cookies-ok', '1');
      banner.classList.remove('show');
    });
  
  document.getElementById('cookieRefuse') && 
    document.getElementById('cookieRefuse').addEventListener('click', function() {
      localStorage.setItem('mdl-cookies-ok', 'refused');
      banner.classList.remove('show');
    });
}

// ============================================================
// LIGHTBOX
// ============================================================
function initLightbox() {
  var overlay = document.getElementById('lightboxOverlay');
  if (!overlay) return;
  
  var img = overlay.querySelector('.lightbox-img');
  var caption = overlay.querySelector('.lightbox-caption');
  
  document.querySelectorAll('img.lightbox-trigger').forEach(function(el) {
    el.addEventListener('click', function() {
      img.src = this.src;
      caption.textContent = this.alt || '';
      overlay.classList.add('open');
    });
  });
  
  overlay.querySelector('.lightbox-close').addEventListener('click', function() {
    overlay.classList.remove('open');
  });
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.classList.remove('open');
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') overlay.classList.remove('open');
  });
}

// ============================================================
// COMPTE À REBOURS
// ============================================================
function initCountdown() {
  var wrap = document.getElementById('countdown');
  if (!wrap) return;
  
  var target = new Date('2026-07-03T19:00:00');
  
  function update() {
    var now = new Date();
    var diff = target - now;
    
    if (diff <= 0) {
      wrap.innerHTML = '<div style="color:white;font-size:18px;font-weight:600;">🎉 La soirée a commencé !</div>';
      return;
    }
    
    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var secs = Math.floor((diff % 60000) / 1000);
    
    wrap.innerHTML = 
      '<div class="countdown-unit"><div class="countdown-num">' + pad(days) + '</div><div class="countdown-label">Jours</div></div>' +
      '<div class="countdown-unit"><div class="countdown-num">' + pad(hours) + '</div><div class="countdown-label">Heures</div></div>' +
      '<div class="countdown-unit"><div class="countdown-num">' + pad(mins) + '</div><div class="countdown-label">Min</div></div>' +
      '<div class="countdown-unit"><div class="countdown-num">' + pad(secs) + '</div><div class="countdown-label">Sec</div></div>';
  }
  
  function pad(n) { return n < 10 ? '0' + n : n; }
  update();
  setInterval(update, 1000);
}

// ============================================================
// NEWSLETTER (via Brevo) — À CONFIGURER
// ============================================================
// Cette fonction affiche un message clair tant que la newsletter
// n'est pas branchée à un vrai compte Brevo. L'API Brevo ne peut pas
// être appelée directement depuis le navigateur (la clé API serait
// visible publiquement) : il faut utiliser le formulaire d'inscription
// embed fourni par Brevo (Campagnes > Formulaires > Créer un formulaire),
// puis remplacer le contenu de ce formulaire par le code qu'il donne.
var NEWSLETTER_CONFIGURED = false; // passer à true une fois le formulaire Brevo branché

function initNewsletter() {
  var form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = form.querySelector('.newsletter-btn');
    var success = document.getElementById('newsletterSuccess');

    if (!NEWSLETTER_CONFIGURED) {
      success.textContent = '⚠️ Inscription temporairement indisponible — contactez-nous directement à contact@mdl-vld.fr en attendant.';
      success.style.background = 'rgba(255,255,255,0.18)';
      form.style.display = 'none';
      success.style.display = 'block';
      return;
    }

    btn.textContent = 'Inscription...';
    btn.disabled = true;
    // TODO une fois NEWSLETTER_CONFIGURED = true :
    // soumettre le formulaire vers l'URL d'action fournie par Brevo
    // (form.action déjà configuré dans le HTML) plutôt que de faire
    // un fetch manuel vers l'API.
    form.style.display = 'none';
    success.style.display = 'block';
  });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  initDarkMode();
  initScrollReveal();
  initSearch();
  initCookieBanner();
  initLightbox();
  initCountdown();
  initNewsletter();
  
  // Retour en haut
  var btn = document.getElementById('backToTop');
  window.addEventListener('scroll', function() {
    if (btn) btn.classList.toggle('visible', window.scrollY > 400);
  });
  
  // Année auto
  document.querySelectorAll('.year-auto').forEach(function(e) {
    e.textContent = new Date().getFullYear();
  });
});
