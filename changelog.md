# Changelog 2025

## 2.1.2

### Fixes

- Table captions are now properly shown
  ([original issue](https://github.com/boscop-fr/assistant-rgaa/issues/118) /
  [pull request](https://github.com/boscop-fr/assistant-rgaa/pull/119))

## 2.1.1

### Fixes

- Attributes are now sanitized before being shown
  ([original issue](https://github.com/boscop-fr/assistant-rgaa/issues/116) /
  [pull request](https://github.com/boscop-fr/assistant-rgaa/pull/117))

## Thématique 1 – Images

- **1.1.x**

  - Ajout de la gestion de l’attribut `hidden` pour tous les sélecteurs.
  - Sélecteurs raffinés afin d’exclure correctement les images cliquable.
  - Découpage entre règles pour distinguer la vérification de `alt` des autres
    attributs (`aria-label`, `aria-labelledby`, `title`, `role`, `aria-hidden`)
    pour marquer systématiquement l'absence d'alternative
  - Suppression de la mise en avant des role=link

- **1.2.x**

  - Ajout de la gestion de l’attribut `hidden` pour tous les sélecteurs.
  - Sélecteurs raffinés afin d’exclure correctement les images cliquable.
  - Support étendu pour les `<area>` sans lien, `<object type^="image">`, avec
    meilleure prise en compte des attributs (`title`, `role`,
    `aria-describedby`).

- **1.3.x (Balises multimédia alternatives)**

  - Ajout de `showTag: true` sur les sélecteurs (`map`, `input[type=image]`,
    `object`, `embed`, `canvas`).

- **1.4.x**

  - Extension des sélecteurs pour inclure `[role="img"]` (1.4.1).
  - Ajout de `showTag: true` sur les sélecteurs (`map`, `input[type=image]`,
    `object`, `embed`, `canvas`).

- **1.5.x**

  - Extension des sélecteurs pour inclure `[role="img"]` (1.5.1).

- **1.6.x**

  - Extension des sélecteurs pour inclure `[role="img"]` (1.6.1).
  - Ajout d’attributs àffichés (`hidden`, `role`, `aria-*`, `title`).
  - Amélioration des helpers `showChildElements` pour SVG (prise en compte de
    `title, desc, text`).
  - Réorganisation des règles canvas (vérification du contenu + affichage des
    attributs ARIA).

- **1.8.x**

  - Extension des sélecteurs pour inclure `[role="img"]` (1.8.1).
  - Amélioration des SVG : ajout de `title, desc` dans les enfants affichés.

- **1.9.x**
  - Ajout des sélecteurs `figcaption` aux règles pour images, objets, embeds,
    SVG, canvas.
  - Mise en avant systématique des balises `figcaption` et `figure`

---

## Thématique 2 – Cadres

- **2.1.x et 2.2.x**
  - Ajout de l’attribut `src` dans `showAttributes`.
  - Vérification des attributs ARIA supplémentaires (`aria-hidden`, `hidden`,
    `role`).
  - Application de `showMissingAttributes: true` sur les titres de
    frames/iframes.

---

## Thématique 5 – Tableaux

- Correction des sélecteurs enfants de tables :
  - `& > caption` remplacé par `caption` pour fiabiliser la détection.
- Maintien des règles d’outline pour identifier la présence de `caption`.

---

## Thématique 6 – Liens

- **6.1.x**

  - update test 6.1.1 pour ne prendre en compte que les liens textes et pas les
    liens qui comportent des images
  - update test 6.1.2 pour ne prendre en compte que les liens images + ajout de
    l'affichage des attr role/hidden/aria-hidden sur les images contenus dans
    des liens
  - update test 6.1.4 pour prendre en compte les attributs aria sur le liens
    dans le SVG

- **6.2.x**
  - Ajout de `showTag: true` pour tous les sélecteurs de liens.
  - Affichage de nouveaux attributs sur les liens (`role`, `title`).
  - Ajout des images avec `[role="img"]` dans les liens.
  - Découpage entre règles pour distinguer la vérification de `alt` des autres
    attributs (`aria-label`, `aria-labelledby`, `title`, `role`, `aria-hidden`)
    pour marquer systématiquement l'absence d'alternative
  - update test 6.2.1 pour mieux prendre en compte les liens image sans intitulé

---

## Thématique 7 – Scripts

- **7.1.1**

  - Extension de la couverture aux éléments interactifs générés via événements
    (`[onclick]`, `[onchange]`).
  - Ajout des attributs ARIA récents (`popover`, `popovertarget`) et du rôle
    `dialog`.

- **7.5.x (Régions dynamiques / live regions)**
  - Séparation claire des rôles :
    - 7.5.1 → `status`, `aria-live="polite"`.
    - 7.5.2 → `alert`, `aria-live="polite|assertive"`.
    - 7.5.3 → `log`, `progressbar`, `status`, `aria-live="polite"`.
  - Ajout de `showTag: true` pour faciliter la visualisation.

---

## Thématique 8 – Elements obligatoires

- **8.9.1**
  - Extension des sélecteurs : ajout de `br`, `q`, `[role='presentation']`.

---

## Thématique 9 – Structuration de l'information

- **9.2.1**

  - Couverture élargie : ajout de `aside`, `section`, `search`, ainsi que leurs
    équivalents ARIA (`role="banner"`, `role="region"`, etc.).

- **9.3.x (Listes)**

  - Distinction claire entre listes HTML natives sans rôle et listes avec rôle
    explicite.
  - Ajout de `showTag: true` pour les listes ARIA.

- **9.3.3**
  - Restriction aux définitions sans rôle explicite (`dl:not([role])`,
    `dt:not([role])`, `dd:not([role])`).

---

## Thématique 10 – Présentation de l'information

- **10.1.1**

  - Ajout de la balise obsolète `<big>` dans les sélecteurs.

- **10.1.2**
  - Restriction de l'attribut `color` qui doit se trouver dans la balise `body`
    (pour ne pas mettre en avant des éléments de la balise `head` par ex).

---

## Thématique 11 – Formulaires

- **11.1.x**

  - Restriction de l'affichage des attributs id uniquement pour des sélecteurs
    de champs de formulaire et de labels.
  - Ajout systématique de `showTag: true` sur les balises de formulaire.
  - Vérification des attributs d’association (`id`, `aria-labelledby`,
    `aria-label`, `role`) pour les champs de formulaires et pas seulement
    l'identifiant.

- **11.2.x à 11.4.x**

  - Ajout du rôle explicite sur les champs de formulaires.

- **11.8.x**

  - Ajout du support de `role="listbox"` et `role="group"`.
  - Vérification des attributs `label`, `aria-labelledby`.

- **11.9.x**
  - Meilleur prise en compte des différents types de boutons ainsi que les
    éléments qui peuvent etre encapsulés dans des boutons (image par exemple).
  - Ajout du rôle explicite sur les boutons.

---

## Thématique 13 – Consultation

- **13.1.1**
  - Mise en avant des urls des liens avec une destiantion de document
    bureautique (via le tld)
  - Mise en avant des liens sans destination et des boutons qui peuvent faire
    l'objet de documents a télécharger
