# Publier une nouvelle version de l'extension

## 1. Augmenter le n° de version

Avant de construire la build, n'oubliez pas de changer la version de
l'application dans `package.json` et `manifest.json`.

## 2. Taguer

N'oubliez pas de taguer, sur master, l'état de l'application avec le nouveau n°
de version.

## 3. Construire la build

À la racine du projet, lancez

```sh
npm run sign-extension -- --api-key CLE --api-secret SECRET
```

Les paramètres `--api-key` et `--api-secret` renseignent les clés publiques et
privées associées au compte qui publie l'extension (voir
https://developer.mozilla.org/en-US/Add-ons/WebExtensions/web-ext_command_reference#web-ext_sign).
