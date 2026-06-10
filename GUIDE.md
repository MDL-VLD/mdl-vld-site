# Guide de mise en place — Site MDL Viollet-le-Duc

## Structure des fichiers

Tous les fichiers doivent être dans le même dossier :

```
mdl-site/
├── index.html
├── evenements.html
├── evenement-bal.html
├── evenement-ccf.html
├── planning.html
├── mdl.html
├── merch.html
├── adhesion.html
├── contact.html
├── mentions-legales.html
├── confidentialite.html
├── style.css
├── favicon.ico
├── apple-touch-icon.png
└── assets/
    ├── logo.png
    ├── lycee-entree.jpg
    ├── lycee-1.jpg  lycee-2.jpg  lycee-3.jpg  lycee-5.jpg
    ├── lycee-etang.jpg  lycee-piste.jpg  lycee-escaliers.jpg  lycee-facade.jpg
    ├── photo-course-lycees.jpg  photo-course-banniere.jpg
    ├── photo-course-tshirts.jpg  photo-course-groupe.jpg
    ├── photo-course-run.jpg  photo-course-foule.jpg
    ├── affiche-bal.jpg
    └── affiche-ccf.jpg
```

---

## ÉTAPE 1 — Créer un compte GitHub

1. Aller sur https://github.com → Sign up (gratuit)
2. Vérifier l'email reçu
3. Cliquer **New repository** (bouton vert)
4. Nom : `mdl-vld-site`, laisser en **Public**
5. Cliquer **Create repository**

---

## ÉTAPE 2 — Uploader les fichiers

1. Sur la page du repo, cliquer **uploading an existing file**
2. Glisser-déposer TOUS les fichiers HTML, CSS, ICO, PNG
3. Cliquer **Commit changes**
4. Répéter pour le dossier `assets/` :
   - Cliquer **Add file > Upload files**
   - Dans le champ de chemin, taper `assets/` avant de glisser les images
   - Commit

---

## ÉTAPE 3 — Déployer sur Cloudflare Pages

> Cloudflare Pages = hébergement gratuit, bande passante illimitée, HTTPS automatique

1. Aller sur https://pages.cloudflare.com
2. Créer un compte gratuit (ou se connecter)
3. Cliquer **Create a project > Connect to Git**
4. Autoriser l'accès à GitHub, sélectionner `mdl-vld-site`
5. **Framework preset : None** (laisser vide)
6. **Build command : laisser vide**
7. **Build output directory : laisser vide** (ou mettre `/`)
8. Cliquer **Save and Deploy**

Le site sera en ligne sur `mdl-vld-site.pages.dev` en 2 minutes.

---

## ÉTAPE 4 — Connecter mdl-vld.fr

1. Dans Cloudflare Pages → ton projet → **Custom domains**
2. Cliquer **Set up a custom domain**
3. Entrer `mdl-vld.fr` → Continue
4. Cloudflare va afficher les DNS à configurer

Dans OVH :
1. Aller sur ovh.com → Zone DNS de mdl-vld.fr
2. Supprimer les anciens enregistrements A pointant vers l'ancien hébergeur
3. Ajouter un enregistrement **CNAME** :
   - Sous-domaine : `@` (ou laisser vide selon OVH)
   - Cible : `mdl-vld-site.pages.dev`
4. Ajouter un **CNAME** pour `www` → `mdl-vld-site.pages.dev`
5. Attendre 10–30 minutes

---

## ÉTAPE 5 — Formulaire de contact (Formspree)

1. Aller sur https://formspree.io → créer un compte gratuit
2. **New Form** → nommer "Contact MDL" → l'email de réception sera contact@mdl-vld.fr
3. Copier l'**ID** affiché (format : `xabcdefg`)
4. Sur GitHub, ouvrir `contact.html` → cliquer le crayon ✏️
5. Chercher `VOTRE_ID_FORMSPREE` et remplacer par ton ID
6. **Commit changes** → le site se redéploie automatiquement en 1 min

---

## ÉTAPE 6 — Google Agenda (page Planning)

Le plus simple pour obtenir le code iframe :

1. Aller sur https://calendar.google.com avec **admin@mdl-vld.fr**
2. Dans la colonne gauche, cliquer les **3 points (⋮)** à côté du calendrier MDL
3. **Paramètres et partage**
4. Scroller jusqu'à **Autorisations d'accès aux événements**
5. Cocher **Rendre disponible au public** → confirmer
6. Scroller jusqu'à **Intégrer l'agenda**
7. Copier le code `<iframe src="https://calendar.google.com/calendar/embed?src=...`

Dans GitHub → `planning.html` → crayon ✏️ :
- Chercher `<!-- Remplacer ce bloc par votre iframe Google Agenda -->`
- Supprimer le bloc `<div class="calendar-placeholder">...</div>`
- Coller à la place :
```html
<iframe src="COLLER_VOTRE_URL_ICI"
  style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
  frameborder="0" scrolling="no">
</iframe>
```

---

## Modifier le contenu du site

### Modifier un texte
1. GitHub → cliquer le fichier HTML
2. Cliquer le crayon ✏️ (Edit this file)
3. Modifier le texte
4. **Commit changes** en bas
5. Le site se met à jour en 1–2 minutes automatiquement

### Ajouter un événement à l'agenda
Directement dans Google Agenda avec le compte admin@mdl-vld.fr → apparaît sur le site automatiquement.

### Ajouter une photo dans le slider de l'accueil
1. Uploader la photo dans `assets/` sur GitHub (compressée, max 1Mo de préférence)
2. Dans `index.html`, ajouter dans la liste des slides :
```html
<div class="hero-slide hero-slide-7" style="background: url('assets/ma-photo.jpg') center/cover no-repeat;"></div>
```
3. Ajouter un point de navigation dans `.hero-dots` :
```html
<button class="hero-dot" onclick="goSlide(6)"></button>
```

### Ajouter une page événement
1. Copier `evenement-bal.html` ou `evenement-ccf.html`
2. Renommer (ex : `evenement-carnaval.html`)
3. Modifier les textes, couleurs du hero, photos
4. Dans `evenements.html`, ajouter une card pointant vers cette page

---

## Tableau récap — Qui fait quoi

| Action | Comment |
|--------|---------|
| Ajouter un événement au calendrier | Google Agenda avec admin@mdl-vld.fr |
| Modifier un texte | GitHub → fichier → ✏️ → Commit |
| Ajouter une photo | Upload dans assets/ sur GitHub |
| Voir les messages de contact | Formspree dashboard ou email contact@mdl-vld.fr |
| Mettre à jour le site | Automatique dès qu'on commit sur GitHub |

---

## En cas de problème

**Le site ne se met pas à jour** : Cloudflare Pages → onglet Deployments → vérifier que le dernier déploiement est "Success"

**Le formulaire ne fonctionne pas** : Formspree → vérifier l'ID dans contact.html

**Le domaine ne fonctionne pas** : DNS peuvent prendre jusqu'à 48h. Vérifier sur https://dnschecker.org

**Questions** : contact@mdl-vld.fr
