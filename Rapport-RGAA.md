# Rapport d'audit RGAA statique

Prompt (vscode) :

```text
@rgaa.md Analyse mes fichiers de composants actuels et les pages de vues par rapport aux critères RGAA définis dans ce skill. Liste les écarts de conformité potentiels, l'impact pour les utilisateurs (ex: navigation au clavier, lecteurs d'écran) et fournis un exemple de code corrigé pour chaque problème.
Le résultat est à placer dans un fichier : Rapport-RGAA.md
```

```text
Analyse de la navigation au clavier de la page principale uniquement.
```

## Diagnostic RGAA

### Résumé

- Périmètre : composants Vue de `src/components/` et vues de `src/views/`, avec vérification de `index.html` et des points d'intégration globaux.
- Méthode : analyse statique des templates et scripts. Les composants DSFR et `geopf-extensions-openlayers` n'ont pas été audités dans leur code généré ; les points qui en dépendent restent à confirmer au navigateur.
- Statut : conformité non démontrée ; plusieurs écarts potentiels et risques élevés sont identifiés.
- Risque utilisateur : élevé pour les personnes naviguant au clavier ou avec un lecteur d'écran, notamment autour de la carte, des menus et des modales.

### Critères RGAA concernés

- **1.1, 1.2** : les logos et pictogrammes doivent avoir une alternative pertinente ou être correctement masqués.
- **2.1, 2.2** : les cadres externes et contenus intégrés doivent avoir un titre explicite ; les vues embarquées doivent rester compréhensibles.
- **3.2, 3.3** : le contraste et l'indication d'état ne doivent pas reposer uniquement sur la couleur.
- **6.1, 6.2** : les liens doivent avoir un intitulé explicite et une destination compréhensible.
- **7.1, 7.3, 7.5** : les scripts doivent être utilisables au clavier, conserver le focus et annoncer les changements de contexte.
- **8.2, 8.5, 8.6** : le titre, la langue et la structure HTML doivent être cohérents.
- **9.1, 9.2** : les titres, régions et listes doivent structurer l'information.
- **10.1, 10.7, 10.11** : la présentation ne doit pas supprimer le focus ni empêcher l'adaptation à 200 %.
- **11.1, 11.2, 11.9, 11.10** : les champs doivent avoir un libellé, un état et des erreurs compréhensibles.
- **12.1, 12.2, 12.6, 12.8** : l'ordre de tabulation, les liens d'évitement, les zones de navigation et l'absence de piège au clavier doivent être vérifiés.
- **13.3** : les contenus et fonctions doivent rester utilisables avec agrandissement et reflow.

## Écarts détectés

### 1. Focus de la carte déplacé au survol

- **Fichier** : `src/components/carte/Map.vue`, dans `onFocusOnMap` et le template du conteneur.
- **Critère RGAA** : 7.1, 7.3, 10.7.
- **Constat** : `@mouseover` appelle `mapRef.value.focus()`. Un simple passage de la souris peut donc retirer le focus d'un champ, d'un bouton ou d'un lien. Le conteneur et le canvas sont aussi rendus focusables sans nom accessible ni instruction textuelle.
- **Impact** : une personne au clavier ou utilisant une loupe peut perdre sa position de lecture ; une personne avec un handicap moteur peut voir son focus interrompu sans action volontaire.
- **Correctif proposé** : supprimer le focus automatique au survol. Donner un nom à la carte et documenter une commande clavier. Garder un seul point de tabulation, sauf besoin technique démontré.
- **Exemple de code corrigé** :

```vue
<template>
  <div
    :id="mapId"
    ref="mapRef"
    role="application"
    :aria-label="mapLabel"
    tabindex="0"
  >
    <p class="sr-only" :id="`${mapId}-help`">
      Carte interactive. Utilisez les flèches pour vous déplacer et les touches plus et moins pour modifier le zoom.
    </p>
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  mapLabel: { type: String, default: 'Carte interactive' }
})
</script>
```

- **Vérification** : parcourir un formulaire au clavier, passer la souris au-dessus de la carte et vérifier que le focus reste sur le champ actif ; vérifier que la carte est annoncée par NVDA/VoiceOver.

### 2. Carte canvas sans alternative fonctionnelle

- **Fichier** : `src/components/carte/Map.vue`.
- **Critère RGAA** : 7.1, 7.3, 9.2, 13.3.
- **Constat** : le canvas OpenLayers est seulement rendu focusable avec `tabIndex = 0`. Aucun parcours textuel des couches, objets, résultats de recherche ou informations affichées sur la carte n'est fourni dans ce composant.
- **Impact** : les utilisateurs de lecteur d'écran ne peuvent pas comprendre les informations géographiques ni atteindre les fonctions de la carte si elles ne sont disponibles que par interaction visuelle ou pointeur.
- **Correctif proposé** : fournir une alternative hors carte : liste des couches actives, résultats de recherche et informations sélectionnées, avec les mêmes actions essentielles.
- **Exemple de code corrigé** :

```vue
<template>
  <section aria-labelledby="map-title">
    <h1 id="map-title" class="sr-only">Carte de France</h1>
    <div :id="mapId" ref="mapRef" tabindex="0" role="application" aria-describedby="map-help">
      <slot />
    </div>
    <p id="map-help" class="sr-only">
      Cette carte est interactive. Une liste textuelle des couches et des résultats est disponible ci-dessous.
    </p>
    <div aria-live="polite">
      <slot name="accessible-summary" />
    </div>
  </section>
</template>
```

- **Vérification** : sans souris, atteindre la liste alternative, lire une couche/résultat et exécuter ses actions ; confirmer que le contenu essentiel n'existe pas uniquement dans le canvas.

### 3. Boutons contenant des liens et bouton de connexion ambigu

- **Fichier** : `src/components/header/CustomNavigationMenu.vue`.
- **Critère RGAA** : 7.1, 7.3, 8.5, 8.6.
- **Constat** : un `DsfrButton` contient un élément `<a>`, et un `<button>` contient aussi un `<a>` pour la connexion/déconnexion. Cela produit des contrôles imbriqués avec des rôles et comportements contradictoires.
- **Impact** : la tabulation peut rencontrer deux contrôles pour une seule action ; les lecteurs d'écran peuvent annoncer un bouton puis un lien avec un libellé incohérent. L'activation avec Espace ou Entrée peut différer.
- **Correctif proposé** : choisir un seul élément interactif. Pour une navigation, utiliser un lien stylisé ; pour une action Vue, utiliser un bouton sans lien enfant.
- **Exemple de code corrigé** :

```vue
<a
  v-if="menu.connexionMenu && !authenticated"
  :href="`${url}/login`"
  class="fr-btn fr-nav__btn fr-nav__btn-no-dropdown"
>
  Se connecter
</a>

<a
  v-else
  :href="authenticated ? `${url}/logout` : `${url}/login`"
  class="fr-btn fr-btn--tertiary w100 justify-center"
>
  {{ authenticated ? 'Se déconnecter' : 'Se connecter' }}
</a>
```

- **Vérification** : compter les arrêts de tabulation sur le contrôle ; tester Entrée et Espace ; vérifier l'arbre d'accessibilité avec Axe ou Accessibility Insights.

### 4. Menus et modales : focus et fermeture incomplets à confirmer/corriger

- **Fichiers** : `src/components/header/CustomNavigation.vue`, `src/components/modals/Modal.vue`, `src/components/modals/Modals.vue`.
- **Critère RGAA** : 7.1, 7.3, 12.1, 12.6, 12.8.
- **Constat** : le menu ferme sur `Escape`, mais le focus n'est pas explicitement replacé sur le bouton qui l'a ouvert. `Modal.vue` délègue la gestion au `DsfrModal`, sans test local prouvant le piège de focus, le focus initial et le retour au déclencheur. La modale de bienvenue peut s'ouvrir automatiquement.
- **Impact** : après fermeture, l'utilisateur peut être renvoyé au début du document ou dans un élément masqué ; une personne utilisant un lecteur d'écran peut ne pas savoir qu'une modale est apparue.
- **Correctif proposé** : mémoriser le déclencheur, placer le focus dans le menu/dialogue à l'ouverture, le maintenir dans la modale et le rendre au déclencheur à la fermeture. Ajouter une action d'accès au contenu si le header est long.
- **Exemple de code corrigé** :

```vue
<button
  ref="trigger"
  :aria-expanded="expanded"
  :aria-controls="id"
  @click="toggleId(id)"
>
  {{ menu.title }}
</button>

<div v-show="expanded" :id="id" ref="panel" tabindex="-1">
  <slot />
</div>
```

```js
const trigger = ref(null)
const panel = ref(null)

watch(expanded, async (isExpanded) => {
  await nextTick()
  if (isExpanded) panel.value?.focus()
  else trigger.value?.focus()
})
```

- **Vérification** : ouvrir/fermer chaque menu et modale avec le clavier, presser `Echap`, tabuler en boucle et vérifier le retour au déclencheur. Refaire le test avec NVDA/Firefox ou VoiceOver/Safari.

### 5. Recherche et widgets OpenLayers générés non vérifiés

- **Fichier** : `src/components/carte/control/SearchEngine.vue` et `src/components/carte/Controls.vue`.
- **Critère RGAA** : 7.1, 7.3, 7.5, 11.1, 11.9, 12.1.
- **Constat** : le template Vue ne rend qu'un `<div />` ; les champs, boutons, autocomplétions et popups sont injectés par `SearchEngineAdvanced`. Les options de placeholder ne constituent pas une étiquette. Le code ne contrôle pas l'association libellé/champ, l'annonce des résultats, la navigation par flèches ou le message d'erreur.
- **Impact** : une recherche peut être utilisable à la souris mais silencieuse ou impossible à parcourir au clavier et au lecteur d'écran.
- **Correctif proposé** : vérifier le DOM final et compléter le widget avec un libellé visible, `aria-autocomplete`, `aria-controls`, `aria-expanded`, une liste de résultats et une région live.
- **Exemple de code corrigé** :

```html
<label for="search-place">Rechercher un lieu</label>
<input
  id="search-place"
  type="search"
  role="combobox"
  aria-autocomplete="list"
  :aria-expanded="isOpen"
  aria-controls="search-results"
  aria-describedby="search-status"
>
<ul id="search-results" role="listbox">
  <li v-for="result in results" :key="result.id" role="option">
    {{ result.label }}
  </li>
</ul>
<p id="search-status" role="status" aria-live="polite">{{ status }}</p>
```

- **Vérification** : rechercher sans souris, parcourir les résultats avec les flèches, entendre le nombre de résultats et l'erreur ; inspecter le DOM après injection du widget.

### 6. Formulaires de contrôles et états non reliés de manière démontrable

- **Fichiers** : `src/components/carte/control/PrintModal.vue`, `src/components/menu/ControlListElement.vue`, `src/components/menu/MenuControl.vue`.
- **Critère RGAA** : 11.1, 11.2, 11.9, 11.10.
- **Constat** : les composants DSFR fournissent probablement une partie du balisage, mais plusieurs champs réutilisent le même `name="checkbox-simple"`. Le composant `ControlListElement` passe à la fois `v-model` et `:model-value` au toggle. Aucun message d'erreur, d'aide ou d'état de traitement n'est relié au bouton d'export.
- **Impact** : des champs peuvent être regroupés ou annoncés de façon ambiguë ; les utilisateurs ne savent pas toujours quel contrôle est actif ni pourquoi une exportation est indisponible.
- **Correctif proposé** : utiliser un nom unique par champ, un `id` stable, un libellé associé et une description/erreur reliée par `aria-describedby` et `aria-invalid`. Ne pas fournir deux sources de vérité au même composant.
- **Exemple de code corrigé** :

```vue
<DsfrCheckbox
  v-model="printFormState.hasTitle"
  name="print-has-title"
  input-id="print-has-title"
  label="Afficher le titre de la carte"
  aria-describedby="print-title-help"
/>
<p id="print-title-help" class="fr-hint-text">
  Le titre sera ajouté à la sortie imprimée.
</p>

<DsfrButton
  :disabled="isExportInProgress"
  :aria-describedby="isExportInProgress ? 'print-status' : undefined"
  @click="onClickExportMap"
>
  Imprimer la carte
</DsfrButton>
<p id="print-status" role="status" aria-live="polite">
  {{ isExportInProgress ? 'Traitement en cours' : '' }}
</p>
```

- **Vérification** : inspecter chaque champ dans l'arbre d'accessibilité, tester la relation libellé/description, puis déclencher une erreur et vérifier son annonce.

### 7. Accordions et contrôles d'état incomplets

- **Fichier** : `src/components/utils/CustomAccordeon.vue`.
- **Critère RGAA** : 7.1, 7.3, 9.2.
- **Constat** : le bouton change son texte mais ne déclare ni `aria-expanded` ni `aria-controls`. Le contenu n'a pas d'identifiant cible.
- **Impact** : le lecteur d'écran ne connaît pas l'état ouvert/fermé et peut lire le bouton sans associer le contenu qu'il contrôle.
- **Correctif proposé** : utiliser `<details>/<summary>` quand le comportement suffit, ou déclarer explicitement l'état et la relation.
- **Exemple de code corrigé** :

```vue
<button
  :aria-expanded="isExpanded"
  :aria-controls="contentId"
  @click="ExpandAction"
>
  {{ BtnLabel }}
</button>
<div v-show="isExpanded" :id="contentId">
  {{ description }}
</div>
```

- **Vérification** : vérifier l'annonce « développée / repliée » et l'accès au contenu avec Tab et un lecteur d'écran.

### 8. Chargements et changements dynamiques non annoncés

- **Fichiers** : `src/components/utils/Patience.vue`, `src/views/Plan.vue`, `src/views/Main.vue`.
- **Critère RGAA** : 7.5, 9.2, 12.2.
- **Constat** : `Patience` ne contient qu'un `<span>` animé sans texte, `role` ou `aria-live`. `Plan` affiche un texte seulement si `city` est présent, puis redirige vers `/` sans annonce ni mise à jour du titre/focus. Les notifications Notivue sont montées globalement sans preuve de leur rôle live.
- **Impact** : une personne non voyante peut attendre sans savoir si l'application charge, a échoué ou a changé de page.
- **Correctif proposé** : ajouter un statut live, un message textuel et une gestion explicite du titre/focus après navigation.
- **Exemple de code corrigé** :

```vue
<div class="patience-container" role="status" aria-live="polite" aria-busy="true">
  <span class="loader" aria-hidden="true" />
  <span class="sr-only">Chargement en cours</span>
</div>
```

```js
import { useHead } from '@unhead/vue'

useHead({ title: computed(() => city ? `Chargement du plan : ${city}` : 'Chargement du plan') })

onMounted(async () => {
  // Après une erreur, afficher un message focusable avant la redirection
  // ou conserver la vue pour permettre la lecture de l'erreur.
})
```

- **Vérification** : utiliser un lecteur d'écran pendant le chargement, une erreur réseau et une notification ; vérifier une annonce unique et utile, sans répétition continue.

### 9. Titres de pages et hiérarchie des vues

- **Fichiers** : `src/views/Bookmarks.vue`, `src/views/Embed.vue`, `src/views/Plan.vue`, `src/views/Login.vue`.
- **Critère RGAA** : 8.6, 9.1, 12.2.
- **Constat** : la page document a un titre statique dans `index.html`, mais les vues SPA n'actualisent pas le titre selon la route. `Bookmarks.vue` commence par un `<h2>` et les vues de chargement/authentification ne fournissent pas de contenu de page structuré.
- **Impact** : l'utilisateur peut ne pas savoir quelle vue est active dans l'historique du lecteur d'écran ou parmi les onglets ; la navigation par titres devient incohérente.
- **Correctif proposé** : définir un titre unique par route et commencer chaque vue autonome par un titre de niveau 1, ou documenter l'en-tête global comme titre principal unique.
- **Exemple de code corrigé** :

```vue
<template>
  <main tabindex="-1" ref="mainContent" aria-labelledby="page-title">
    <h1 id="page-title">Favoris</h1>
    <DsfrAlert type="info" title="Information" :description="description" />
  </main>
</template>

<script setup>
import { useHead } from '@unhead/vue'
useHead({ title: 'Favoris | cartes.gouv.fr' })
</script>
```

- **Vérification** : ouvrir directement chaque route, vérifier le titre de l'onglet, le premier titre annoncé et le focus après navigation SPA.

### 10. Liens ouvrant une nouvelle fenêtre et images/pictogrammes

- **Fichiers** : `src/components/modals/ModalReportingStart.vue`, `src/components/modals/Alerts.vue`, `src/components/modals/ModalWelcome.vue`, `src/components/header/CustomHeader.vue`.
- **Critère RGAA** : 1.1, 6.1, 6.2, 7.3.
- **Constat** : plusieurs liens ont `target="_blank"`. Certains ont un `title`, d'autres non. Le logo cartes.gouv.fr de la modale de bienvenue a `alt=""` alors qu'il peut porter une information de marque ; les icônes décoratives ne sont pas toutes vérifiées dans le DOM généré.
- **Impact** : l'utilisateur peut ne pas savoir qu'une nouvelle fenêtre va s'ouvrir, ou perdre le contexte. Un lecteur d'écran peut manquer l'identité ou la fonction associée à un visuel informatif.
- **Correctif proposé** : annoncer l'ouverture dans l'intitulé visible ou par texte masqué ; attribuer une alternative aux images informatives et masquer explicitement les icônes décoratives.
- **Exemple de code corrigé** :

```vue
<a :href="faq" target="_blank" rel="noopener noreferrer">
  Foire aux questions (nouvelle fenêtre)
</a>

<img
  :src="logoUrl"
  alt="Logo cartes.gouv.fr"
>
<span class="fr-icon-brush-line" aria-hidden="true" />
```

- **Vérification** : vérifier chaque lien hors contexte, son annonce dans NVDA/VoiceOver et les alternatives de toutes les images non décoratives.

## Analyse ciblée : navigation au clavier de la page principale

### Périmètre et méthode

- Page ciblée : route `/`, rendue par `Main.vue` puis `Load.vue`/`CartoAndTools.vue`.
- Parcours analysé : `Tab`, `Shift+Tab`, `Entrée`, `Espace`, `Echap` et flèches dans les composants de carte.
- Cette analyse est statique : elle déduit l'ordre probable du DOM et les comportements à partir du code. Elle ne peut pas confirmer les éléments injectés par DSFR ou OpenLayers sans inspection du navigateur.

### Parcours clavier attendu

Le parcours attendu devrait être proche de celui-ci :

1. lien d'accès rapide vers le contenu principal ;
2. logo ou lien d'accueil, navigation principale et liens du header ;
3. alertes et notifications actives ;
4. recherche et contrôles de carte exposés ;
5. boutons des menus latéraux « Gérer la carte » et « Choisir mes outils » ;
6. contenu du panneau ouvert, puis son bouton « Fermer » ;
7. carte et son alternative textuelle ;
8. footer.

L'ordre réel est incertain pour les contrôles OpenLayers, mais la structure de `Main.vue` et `CartoAndTools.vue` place `Carto` avant `LeftMenuTool` dans le DOM. Les boutons latéraux, pourtant visuellement superposés à la carte, risquent donc d'être atteints après le canvas et les widgets de carte. Cette divergence doit être vérifiée dans l'arbre d'accessibilité.

### Écarts et risques du parcours principal

#### A. Absence de lien d'accès rapide vers la carte et les outils

- **Fichiers** : `src/views/Main.vue`, `src/components/header/CustomHeader.vue`.
- **Critère RGAA** : 12.1, 12.2, 12.6.
- **Constat** : aucun lien « Aller au contenu » n'est visible dans le montage de la page principale. Le header peut précéder un grand nombre de liens et de boutons avant la carte.
- **Impact** : une personne naviguant avec `Tab` doit traverser tout le header à chaque chargement avant d'atteindre la fonction principale de cartographie.
- **Correctif proposé** : ajouter un lien d'évitement en première position du document et une cible focusable autour du contenu principal.
- **Exemple de code corrigé** :

```vue
<template>
  <a class="fr-skiplinks__link" href="#main-content">
    Aller au contenu principal
  </a>
  <CustomHeader />
  <main id="main-content" tabindex="-1" aria-label="Carte et outils">
    <router-view />
  </main>
</template>
```

- **Vérification** : depuis le début de la page, presser `Tab`, activer le lien, puis vérifier que le focus arrive sur `main-content` sans parcourir le header.

#### B. Focus non restitué après fermeture des menus latéraux

- **Fichiers** : `src/components/menu/MenuLateralWrapper.vue`, `src/components/menu/LeftMenuTool.vue`, `src/components/menu/RightMenuTool.vue`.
- **Critère RGAA** : 7.1, 7.3, 12.1, 12.6.
- **Constat** : `closeMenu()` modifie uniquement `is_expanded`. Il n'appelle pas `focus()` sur le bouton qui a ouvert le panneau. Aucun traitement `Escape` n'est visible dans `MenuLateralWrapper`.
- **Impact** : après fermeture, le focus peut rester sur un élément masqué, revenir à un emplacement imprévisible ou obliger l'utilisateur à refaire une longue tabulation.
- **Correctif proposé** : conserver une référence au bouton déclencheur, rendre le panneau focusable à l'ouverture et restituer le focus au déclencheur à la fermeture. Gérer `Escape` au niveau du panneau.
- **Exemple de code corrigé** :

```vue
<script setup>
const trigger = ref(null)
const panel = ref(null)
const isExpanded = defineModel({ type: Boolean, default: false })

async function openMenu(event) {
  trigger.value = event.currentTarget
  isExpanded.value = true
  await nextTick()
  panel.value?.focus()
}

function closeMenu({ restoreFocus = true } = {}) {
  isExpanded.value = false
  if (restoreFocus) nextTick(() => trigger.value?.focus())
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu()
  }
}
</script>

<template>
  <button @click="openMenu">Gérer la carte</button>
  <div
    v-show="isExpanded"
    ref="panel"
    tabindex="-1"
    role="region"
    aria-label="Outils de gestion de la carte"
    @keydown="onKeydown"
  >
    <slot name="content" />
  </div>
</template>
```

- **Vérification** : ouvrir chaque panneau avec `Entrée` et `Espace`, presser `Echap`, puis vérifier que le focus revient exactement au bouton d'origine.

#### C. Panneaux ouverts sans relation explicite avec leur déclencheur

- **Fichiers** : `src/components/menu/MenuLateralNavButton.vue`, `src/components/menu/MenuLateralWrapper.vue`.
- **Critère RGAA** : 7.1, 7.3, 9.2.
- **Constat** : le bouton latéral possède un `aria-label`, mais le code ne lui associe pas `aria-expanded` ni `aria-controls`. Le panneau contient un titre visuel mais n'est pas exposé comme une région liée au bouton.
- **Impact** : un lecteur d'écran annonce le bouton « Gérer la carte » sans annoncer clairement si le panneau est ouvert ni quel contenu il contrôle.
- **Correctif proposé** : utiliser un identifiant stable du panneau et synchroniser `aria-expanded`/`aria-controls` sur le bouton.
- **Exemple de code corrigé** :

```vue
<DsfrButton
  :id="`${id}-trigger`"
  :aria-label="title"
  :aria-expanded="isExpanded"
  :aria-controls="`${id}-panel`"
  :icon="icon"
  :icon-only="true"
  @click="tabClicked"
/>

<div
  :id="`${id}-panel`"
  :aria-labelledby="`${id}-trigger`"
  role="region"
  v-show="isExpanded"
>
  <slot name="content" />
</div>
```

- **Vérification** : inspecter l'arbre d'accessibilité avant et après ouverture ; vérifier l'annonce du nom, de l'état et de la relation contrôle/panneau.

#### D. Focus carte déplacé par la souris et carte placée dans le parcours sans alternative

- **Fichiers** : `src/components/carte/Map.vue`, `src/components/carte/Carto.vue`.
- **Critère RGAA** : 7.1, 7.3, 10.7, 13.3.
- **Constat** : `Map.vue` applique le focus au `mouseover`. Le conteneur principal est focusable, mais le code ne fournit pas de résumé textuel des couches, résultats ou objets visibles. Les contrôles clavier propres à la carte ne sont pas définis dans ce composant.
- **Impact** : le focus d'un utilisateur peut être volé par un mouvement de souris ; un utilisateur de lecteur d'écran peut atteindre une carte dont le contenu et les actions ne sont pas compréhensibles.
- **Correctif proposé** : supprimer le `mouseover` qui force le focus, donner un nom et une aide clavier à la carte et fournir une alternative textuelle équivalente.
- **Exemple de correction minimale** :

```vue
<div
  :id="mapId"
  ref="mapRef"
  tabindex="0"
  role="application"
  aria-label="Carte interactive"
  aria-describedby="map-keyboard-help"
>
  <p id="map-keyboard-help" class="sr-only">
    Utilisez les flèches pour vous déplacer dans la carte. Les contrôles de zoom sont disponibles avant la carte.
  </p>
  <slot />
</div>
```

- **Vérification** : placer le focus sur un champ puis déplacer la souris au-dessus de la carte ; le focus ne doit pas changer. Atteindre ensuite la carte au clavier et lire son nom et son aide.

#### E. Visibilité clavier des menus et panneaux basée sur `v-show`/CSS

- **Fichiers** : `src/components/menu/MenuLateralWrapper.vue`, `src/components/menu/LeftMenuTool.vue`, `src/components/menu/RightMenuTool.vue`.
- **Critère RGAA** : 7.1, 7.3, 12.8.
- **Constat** : les panneaux utilisent `v-show` et des classes `activeTab`/`inactiveTab`. Le comportement attendu est probablement correct si le CSS applique `display: none`, mais il faut confirmer qu'aucun élément masqué ne reste focusable ou accessible aux lecteurs d'écran. Le bouton de fermeture n'est pas relié au panneau par `aria-controls`.
- **Impact** : un utilisateur peut tabuler vers un contrôle invisible, ou entendre le contenu d'un panneau qui semble fermé visuellement.
- **Correctif proposé** : utiliser `v-if` pour détruire les panneaux non actifs lorsque leur état n'a pas besoin d'être conservé, ou garantir `hidden`, `aria-hidden` et l'absence de focus sur tout panneau fermé.
- **Exemple de code corrigé** :

```vue
<section
  v-if="isExpanded"
  :id="panelId"
  role="region"
  :aria-labelledby="triggerId"
>
  <button
    type="button"
    :aria-controls="panelId"
    @click="closeMenu"
  >
    Fermer le panneau
  </button>
  <slot name="content" />
</section>
```

- **Vérification** : fermer le panneau puis presser `Tab` ; aucun contrôle du panneau fermé ne doit recevoir le focus ni être annoncé.

### Conclusion pour la page principale

- Navigation clavier : **partiellement utilisable en theorie**, car les boutons DSFR sont probablement focusables, mais le parcours est a risque autour de la carte et des menus superposes.
- Risques prioritaires : absence de lien d'acces rapide, absence de restauration du focus, relations ARIA incompletes des panneaux et focus force au survol.
- Verification indispensable : lancer Chromium avec `Tab`/`Shift+Tab` en journalisant `document.activeElement`, puis refaire le parcours avec NVDA ou VoiceOver. L'inspection des widgets OpenLayers generes est necessaire avant toute conclusion de conformite.

## Points a confirmer par inspection navigateur

- Contraste reel des textes, boutons, etats actifs, indicateurs de focus et pictogrammes (criteres 3.2, 3.3, 10.7).
- Presence d'un lien d'acces rapide vers le contenu et ordre de tabulation global header > alertes > carte/outils > footer (criteres 12.1, 12.2).
- Structure et etiquettes des controles OpenLayers injectes, notamment fermeture des panneaux, zoom, plein ecran, couches et popups (criteres 7.1, 7.3, 11.1).
- Titres et alternatives des eventuels `iframe` ou medias rendus par les bibliotheques ou les URLs externes (criteres 2.1, 2.2, 4.x).
- Reflow a 200 % et a 320 CSS px, sans perte de fonctionnalite ni defilement horizontal inutile (criteres 10.11, 13.3).
- Validite HTML finale : les composants DSFR doivent etre inspectes apres rendu, car un template Vue valide peut produire un DOM invalide via une bibliotheque tierce.

## Plan de verification

- [ ] Executer un audit axe-core/Lighthouse sur l'accueil, la recherche, une modale, l'impression, le partage et une vue integree.
- [ ] Parcourir chaque parcours au clavier uniquement : `Tab`, `Shift+Tab`, `Entree`, `Espace`, `Echap` et fleches dans les widgets.
- [ ] Verifier le focus initial, le focus de fermeture et l'absence de focus dans un panneau masque.
- [ ] Tester avec NVDA/Firefox et VoiceOver/Safari : titres, landmarks, boutons, menus, modales, alertes, chargements et erreurs.
- [ ] Tester les champs d'impression, de recherche, de favoris et d'import avec labels, aides, erreurs et etats desactivees.
- [ ] Verifier les contrastes avec un outil dedie, y compris focus, survol et etats actifs.
- [ ] Tester le zoom navigateur a 200 %, 400 % et une largeur de 320 CSS px.
- [ ] Verifier l'alternative textuelle et fonctionnelle de la carte pour une personne n'utilisant pas la souris.
- [ ] Reexecuter les tests E2E existants et ajouter des scenarios d'accessibilite dans `tests/e2e/` si les regressions sont couvertes par le parcours utilisateur.

## Decision

- Pret pour recette accessibilite : **Non, pas avant verification et correction des points 1 a 8**.
- Points bloquants prioritaires : focus de la carte au survol, absence d'alternative textuelle fonctionnelle a la carte, controles interactifs imbriques, focus des menus/modales, recherche OpenLayers injectee et annonces de chargement.
- Ce rapport est un audit statique : il ne remplace pas une evaluation RGAA complete avec inspection du rendu, tests clavier, lecteur d'ecran et verification des contrastes.