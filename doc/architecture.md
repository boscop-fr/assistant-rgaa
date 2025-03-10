# Architecture du code

L'extension est basée sur le standard
[WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions).

Le `manifest.json` décrit la configuration de l'application et permet d'avoir
une vue globale sur quelle partie du code est chargée où.

## Contenu de chaque dossier

- `/bin` : utilitaires en ligne de commande. Contient entre autre de quoi
  récupérer les référentiels et instructions sur les sites du RGAA et de quoi
  créer une build.
- `/css` : les styles de chaque module
- `/data` : pour chaque version du RGAA disponible, la liste des critères et
  tests, les instructions de test et les _helpers_ à appliquer pour chaque test
- `/fixtures` : des données de test pour aider lors des développements (fichiers
  d'import, page web où beaucoup de tests peuvent être appliqués).
- `/img`: les images utilisées dans toute l'extension.
- `/src`: les sources de chaque module

## Différents modules

Le code (dans `src` et `css`) est divisé en plusieurs "modules" qui représentent
les grandes fonctionnalités de l'application.

### Module `common`

Des fonctions utilitaires utilisées par plusieurs des autres modules.

### Module `background`

Le _service worker_ de l'extension, qui :

- ouvre le panneau latéral au clic sur l'icône de l'extension
- injecte les _content scripts_ (_helpers_ et _minimap_) dans la page courante
  au chargement de l'extension
- exécute certaines tâches nécessaires pour les autres modules mais nécessitant
  des permissions particulières

### Module `helpers`

Un _helper_ permet d'agir sur la page, par exemple pour mettre en valeur des
éléments ou ajouter des informations. Ce module rassemble tous les helpers
disponibles.

Suivant le test RGAA activé, on applique un jeu de helpers déterminé grâce aux
fichiers de mapping présents dans `data/helpers`, suivant la version du
référentiel choisie dans les options.

:warning: le CSS étant directement injecté sur la page, toutes les règles sont
préfixées par `rgaaExt-` et sont déclarées en `!important`.

### Module `minimap`

Un _content script_ chargé d'afficher une minimap en surimpression de la page
lorsqu'un test est activé.

Ce module surveille le DOM pour détecter l'injection des helpers et leur
position dans la page afin d'en présenter une vue globale.

### Module `options`

Un formulaire de configuration permettant notamment de configurer la version du
référentiel à utiliser.

La configuration est sauvegardée dans le _storage local_ de l'extension.

### Module `panel`

L'interface principale de l'extension, chargée dans un panneau latéral natif du
navigateur.

On utilise `redux` et `redux-toolkit` pour gérer l'état de l'extension pour une
page donnée, et on stocke cet état en `session storage` afin de pouvoir le
recharger au besoin.
