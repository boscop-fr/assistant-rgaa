# Helpers

Les helpers sont utilisés pour appliquer des modifications à la page en cours
d'audit.

Un helper est réparti entre deux contextes :

- la page auditée, où un script de contenu applique ses effets ;
- le panneau, qui le décrit et affiche éventuellement un widget.

## Types de helpers

Le type de chaque helper est déclaré avec ses options dans
[`src/helpers/types.ts`](../src/helpers/types.ts) :

- **effect** : modifie la page tant qu'il est appliqué (`disableAllStyles`,
  `style`) ;
- **service** : répond aux requêtes de son widget dans le panneau tant qu'il est
  appliqué (`colorContrast`, `headingsHierarchy`) ;
- **highlight** : affiche des informations sur des éléments de la page
  (`outline`, `showAttributes`, `showElement`, `showChildElements`) ;
- **tool** : n'existe que dans le panneau, sous forme de widget (`externalTool`,
  `validateLocalPage`, `viewSource`).

## Côté page

Les helpers sont dans [`src/helpers/helpers/`](../src/helpers/helpers/) et
recensés par type dans `index.ts`.

Un _effect_ ou un _service_ reçoit ses options et retourne un `Effect` : une
fonction qui modifie la page et retourne une fonction annulant cette
modification.

```ts
export default ({style}: HelperOptions<'style'>): Effect =>
  () => {
    const tag = document.createElement('style');
    tag.textContent = style;
    document.head.append(tag);

    return () => {
      tag.remove();
    };
  };
```

Un _highlight_ ne modifie pas la page lui-même : il décrit ce qu'il faut
afficher sur les éléments correspondant à un sélecteur. Les descriptions de tous
les helpers sont fusionnées par élément, puis affichées ensemble par
[`highlightElementsEffect`](../src/helpers/effects/highlight.ts).

```ts
export default ({selector}: HelperOptions<'outline'>): Highlight => ({
  selector,
  outline: true
});
```

## Côté panneau

Chaque helper a un module dans [`src/panel/helpers/`](../src/panel/helpers/),
avec :

- `describe(intl, options)` : la description affichée pour le test ;
- `component` (optionnel) : un widget recevant les options du helper.

## Ajouter un helper

1. Déclarer ses options dans `src/helpers/types.ts`, sous son type, ainsi que
   ses options par défaut.
2. Pour un _effect_, un _service_ ou un _highlight_, l'ajouter dans
   `src/helpers/helpers/` et dans le registre correspondant. Un oubli est une
   erreur de type.
3. Ajouter sa description, et son widget s'il en a un, dans
   `src/panel/helpers/`.
4. L'utiliser dans `data/helpers/*.json`.

## Configuration

Les configurations des helpers à appliquer suivant les tests RGAA sont définies
dans les fichiers `/data/helpers/*.json`. Chaque fichier correspond à une
version de référentiel et est nommé en fonction.

Ces fichiers définissent une liste de helpers pour chaque test, sous cette forme
:

```json
{
  // identifiant du test
  "1.1.1": [
    {
      // nom d'un helper à utiliser avec plusieurs options
      "helper": "something",
      "option1": "valeur",
      "option2": "valeur"
    },
    {
      // deuxième helper à utiliser sur le même test
      "helper": "something2",
      "option1": "valeur"
    },
    {
      // troisième helper à utiliser sur le même test, sans option
      "helper": "something3"
    }
  ]
}
```
