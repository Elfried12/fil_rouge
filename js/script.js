/* ==========================================================================
   STREAMFLIX – script.js
   Exercice 1 : afficher / masquer les sections de films
   ========================================================================== */

// 1. On récupère toutes les sections de films
const sections = document.querySelectorAll('.film-section');

// 2. Pour chaque section, on crée un bouton "Masquer"
sections.forEach(function (section) {
  const grille = section.querySelector('.film-grid');

  const bouton = document.createElement('button');
  bouton.type = 'button';
  bouton.className = 'btn btn-secondary btn-toggle';
  bouton.textContent = 'Masquer';
  bouton.setAttribute('aria-expanded', 'true');

  // On place le bouton juste au-dessus de la grille de films
  section.insertBefore(bouton, grille);

  // 3. Au clic : on bascule la visibilité et on change le texte du bouton
  bouton.addEventListener('click', function () {
    // toggle() ajoute la classe si elle est absente, la retire sinon,
    // et renvoie true si la classe est maintenant présente
    const estMasquee = grille.classList.toggle('masque');

    if (estMasquee) {
      bouton.textContent = 'Afficher';
    } else {
      bouton.textContent = 'Masquer';
    }

    // Accessibilité : indique aux lecteurs d'écran si le contenu est visible
    bouton.setAttribute('aria-expanded', String(!estMasquee));
  });
});


/* ==========================================================================
   Exercice 2 : compteur de films
   ========================================================================== */

// 1. On compte tous les <article> de la page (chaque film est un <article>)
const nombreDeFilms = document.querySelectorAll('article').length;

// 2. On crée un nouveau paragraphe pour afficher le résultat
const compteur = document.createElement('p');
compteur.className = 'compteur-films';
compteur.textContent = 'Catalogue : ' + nombreDeFilms + ' films disponibles';

// 3. On l'ajoute à la fin du footer
const footer = document.querySelector('.site-footer');
footer.appendChild(compteur);


/* ==========================================================================
   Exercice 3 : marquer un film comme "vu"
   ========================================================================== */

// 1. On récupère toutes les cartes de films
const cartes = document.querySelectorAll('.film-card');

// 2. On ajoute un écouteur de clic sur chaque carte
cartes.forEach(function (carte) {
  carte.addEventListener('click', function (event) {
    // Un clic sur l'affiche ou le titre (des liens) ouvre la modal (exercice 5) :
    // dans ce cas, on ne marque pas le film comme vu
    if (event.target.closest('a')) {
      return;
    }

    // event.target = l'élément exact sur lequel on a cliqué
    // (l'affiche, le titre, une étiquette de genre...).
    // closest() remonte jusqu'à la carte qui le contient.
    const carteCliquee = event.target.closest('.film-card');

    // 3. On ajoute ou retire la classe "watched" : le CSS affiche le badge
    carteCliquee.classList.toggle('watched');
  });
});


/* ==========================================================================
   Exercice 4 : recherche simple
   ========================================================================== */

// Dans notre HTML, le champ de recherche a l'id "recherche" (et non "search")
const searchInput = document.querySelector('#recherche');
const searchForm = document.querySelector('.search-form');

// On prépare un message "Aucun résultat" (caché) dans chaque section de films
sections.forEach(function (section) {
  const message = document.createElement('p');
  message.className = 'aucun-resultat';
  message.textContent = 'Aucun résultat';
  message.hidden = true;
  section.appendChild(message);
});

searchInput.addEventListener('input', function () {
  const searchTerm = this.value.trim().toLowerCase();

  sections.forEach(function (section) {
    const articles = section.querySelectorAll('article');
    let nombreVisibles = 0;

    articles.forEach(function (article) {
      const title = article.querySelector('h3').textContent.toLowerCase();
      // On masque le <li> qui contient l'article, sinon une case vide
      // resterait dans la grille
      const caseDeGrille = article.closest('li');

      if (title.includes(searchTerm)) {
        caseDeGrille.style.display = ''; // '' = on revient au style du CSS
        nombreVisibles++;
      } else {
        caseDeGrille.style.display = 'none';
      }
    });

    // Si aucun film de la section ne correspond, on affiche le message
    section.querySelector('.aucun-resultat').hidden = nombreVisibles > 0;
  });
});

// Appuyer sur Entrée ne doit pas recharger la page
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
});


/* ==========================================================================
   Exercice 5 : modal simple
   ========================================================================== */

const modal = document.querySelector('#modal');
const boutonFermer = modal.querySelector('.close');
let dernierLienClique = null; // pour rendre le focus au bon endroit à la fermeture

// Fonction fournie, complétée pour afficher toutes les infos du film
function openModal(film) {
  const modalBody = document.querySelector('#modal-body');

  modalBody.innerHTML = `
    <img src="${film.image}" alt="${film.alt}">
    <div>
      <h2 id="modal-titre">${film.title}</h2>
      <p class="modal-infos">${film.infos}</p>
      <p class="modal-genres">${film.genres}</p>
    </div>
  `;
  modal.style.display = 'flex';
  boutonFermer.focus();
}

function closeModal() {
  modal.style.display = 'none';
  if (dernierLienClique) {
    dernierLienClique.focus();
  }
}

// 1. Event listeners sur les films : un clic sur l'affiche ou le titre ouvre la modal
cartes.forEach(function (carte) {
  carte.addEventListener('click', function (event) {
    const lien = event.target.closest('a');
    if (!lien) {
      return; // clic ailleurs sur la carte : c'est l'exercice 3 qui s'en occupe
    }
    event.preventDefault(); // le lien ne doit pas changer l'adresse de la page
    dernierLienClique = lien;

    // 2. On récupère les infos du film cliqué
    const image = carte.querySelector('img');
    const durees = carte.querySelectorAll('.film-meta time');  // année + durée
    const note = carte.querySelector('.film-meta [aria-hidden="true"]');
    const genres = carte.querySelectorAll('.genres li');

    const listeGenres = [];
    genres.forEach(function (genre) {
      listeGenres.push(genre.textContent);
    });

    openModal({
      title: carte.querySelector('h3').textContent,
      image: image.src,
      alt: image.alt,
      infos: durees[0].textContent + ' · ' + durees[1].textContent + ' · ' + note.textContent,
      genres: listeGenres.join(', ')
    });
  });
});

// 3. Event listener sur le bouton de fermeture (le X)
boutonFermer.addEventListener('click', closeModal);

// Bonus : fermer en cliquant sur le fond sombre ou avec la touche Échap
modal.addEventListener('click', function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && modal.style.display === 'flex') {
    closeModal();
  }
});


/* ==========================================================================
   Exercice 6 (bonus) : changement de thème
   ========================================================================== */

const boutonTheme = document.querySelector('#bouton-theme');

boutonTheme.addEventListener('click', function () {
  // On ajoute/retire la classe sur <body> : le CSS change les couleurs
  const estSombre = document.body.classList.toggle('dark-theme');

  // Le bouton propose toujours l'autre mode
  if (estSombre) {
    boutonTheme.textContent = 'Mode clair';
  } else {
    boutonTheme.textContent = 'Mode sombre';
  }
});
