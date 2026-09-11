# Rapport d'audit RGAA statique

Prompt (vscode):

```text
@rgaa.md Analyse mes fichiers de composants actuels et les pages de vues par rapport aux critères RGAA définis dans ce skill. Liste les écarts de conformité potentiels, l'impact pour les utilisateurs (ex: navigation au clavier, lecteurs d'écran) et fournis un exemple de code corrigé pour chaque problème.
Le résultat est à placer dans un fichier : Rapport-RGAA.md
```

```text
Analyse de la navigation au clavier de la page principal uniquement
```

## Diagnostic RGAA

### Resume

- Perimetre : composants Vue de `src/components/` et vues de `src/views/`, avec verification de `index.html` et des points d'integration globaux.
- Methode : analyse statique des templates et scripts. Les composants DSFR et `geopf-extensions-openlayers` n'ont pas ete audites dans leur code genere ; les points qui en dependent restent a confirmer au navigateur.
- Statut : conformite non demontree ; plusieurs ecarts potentiels et risques eleves sont identifies.
- Risque utilisateur : eleve pour les personnes naviguant au clavier ou avec un lecteur d'ecran, notamment autour de la carte, des menus et des modales.

### Criteres RGAA concernes

- **1.1, 1.2** : les logos et pictogrammes doivent avoir une alternative pertinente ou etre correctement masques.
- **2.1, 2.2** : les cadres externes et contenus integres doivent avoir un titre explicite ; les vues embarquees doivent rester comprehensibles.
- **3.2, 3.3** : le contraste et l'indication d'etat ne doivent pas reposer uniquement sur la couleur.
- **6.1, 6.2** : les liens doivent avoir un intitule explicite et une destination comprehensible.
- **7.1, 7.3, 7.5** : les scripts doivent etre utilisables au clavier, conserver le focus et annoncer les changements de contexte.
- **8.2, 8.5, 8.6** : le titre, la langue et la structure HTML doivent etre coherents.
- **9.1, 9.2** : les titres, regions et listes doivent structurer l'information.
- **10.1, 10.7, 10.11** : la presentation ne doit pas supprimer le focus ni empecher l'adaptation a 200 %.
- **11.1, 11.2, 11.9, 11.10** : les champs doivent avoir un label, un etat et des erreurs comprehensibles.
- **12.1, 12.2, 12.6, 12.8** : l'ordre de tabulation, les liens d'evitement, les zones de navigation et l'absence de piege au clavier doivent etre verifies.
- **13.3** : les contenus et fonctions doivent rester utilisables avec agrandissement et reflow.

## Ecarts detectes

### 1. Focus de la carte deplace au survol

- **Fichier** : `src/components/carte/Map.vue`, dans `onFocusOnMap` et le template du conteneur.
- **Critere RGAA** : 7.1, 7.3, 10.7.
- **Constat** : `@mouseover` appelle `mapRef.value.focus()`. Un simple passage de la souris peut donc retirer le focus d'un champ, d'un bouton ou d'un lien. Le conteneur et le canvas sont aussi rendus focusables sans nom accessible ni instruction textuelle.
- **Impact** : une personne au clavier ou utilisant une loupe peut perdre sa position de lecture ; une personne avec un handicap moteur peut voir son focus interrompu sans action volontaire.
- **Correctif propose** : supprimer le focus automatique au survol. Donner un nom a la carte et documenter une commande clavier. Garder un seul point de tabulation, sauf besoin technique demontre.
- **Exemple de code corrige** :

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
      Carte interactive. Utilisez les fleches pour vous deplacer et les touches plus et moins pour modifier le zoom.
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

- **Verification** : parcourir un formulaire au clavier, passer la souris au-dessus de la carte et verifier que le focus reste sur le champ actif ; verifier que la carte est annoncee par NVDA/VoiceOver.

### 2. Carte canvas sans alternative fonctionnelle

- **Fichier** : `src/components/carte/Map.vue`.
- **Critere RGAA** : 7.1, 7.3, 9.2, 13.3.
- **Constat** : le canvas OpenLayers est seulement rendu focusable avec `tabIndex = 0`. Aucun parcours textuel des couches, objets, resultats de recherche ou informations affichees sur la carte n'est fourni dans ce composant.
- **Impact** : les utilisateurs de lecteur d'ecran ne peuvent pas comprendre les informations geographiques ni atteindre les fonctions de la carte si elles ne sont disponibles que par interaction visuelle ou pointeur.
- **Correctif propose** : fournir une alternative hors carte : liste des couches actives, resultats de recherche et informations selectionnees, avec les memes actions essentielles.
- **Exemple de code corrige** :

```vue
<template>
  <section aria-labelledby="map-title">
    <h1 id="map-title" class="sr-only">Carte de France</h1>
    <div :id="mapId" ref="mapRef" tabindex="0" role="application" aria-describedby="map-help">
      <slot />
    </div>
    <p id="map-help" class="sr-only">
      Cette carte est interactive. Une liste textuelle des couches et des resultats est disponible ci-dessous.
    </p>
    <div aria-live="polite">
      <slot name="accessible-summary" />
    </div>
  </section>
</template>
```

- **Verification** : sans souris, atteindre la liste alternative, lire une couche/resultat et executer ses actions ; confirmer que le contenu essentiel n'existe pas uniquement dans le canvas.

### 3. Boutons contenant des liens et bouton de connexion ambigu

- **Fichier** : `src/components/header/CustomNavigationMenu.vue`.
- **Critere RGAA** : 7.1, 7.3, 8.5, 8.6.
- **Constat** : un `DsfrButton` contient un element `<a>`, et un `<button>` contient lui aussi un `<a>` pour la connexion/deconnexion. Cela produit des controles imbriques avec des roles et comportements contradictoires.
- **Impact** : la tabulation peut rencontrer deux controles pour une seule action ; les lecteurs d'ecran peuvent annoncer un bouton puis un lien avec un libelle incoherent. L'activation avec Espace ou Entree peut differer.
- **Correctif propose** : choisir un seul element interactif. Pour une navigation, utiliser un lien stylise ; pour une action Vue, utiliser un bouton sans lien enfant.
- **Exemple de code corrige** :

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
  {{ authenticated ? 'Se deconnecter' : 'Se connecter' }}
</a>
```

- **Verification** : compter les arrets de tabulation sur le controle ; tester Entree et Espace ; verifier l'arbre d'accessibilite avec axe ou Accessibility Insights.

### 4. Menus et modales : focus et fermeture incomplets a confirmer/corriger

- **Fichiers** : `src/components/header/CustomNavigation.vue`, `src/components/modals/Modal.vue`, `src/components/modals/Modals.vue`.
- **Critere RGAA** : 7.1, 7.3, 12.1, 12.6, 12.8.
- **Constat** : le menu ferme sur `Escape`, mais le focus n'est pas explicitement replace sur le bouton qui l'a ouvert. `Modal.vue` delegue la gestion au `DsfrModal`, sans test local prouvant le piege de focus, le focus initial et le retour au declencheur. La modale de bienvenue peut s'ouvrir automatiquement.
- **Impact** : apres fermeture, l'utilisateur peut etre renvoye au debut du document ou dans un element masque ; une personne de lecteur d'ecran peut ne pas savoir qu'une modale est apparue.
- **Correctif propose** : memoriser le declencheur, placer le focus dans le menu/dialogue a l'ouverture, le maintenir dans la modale et le rendre au declencheur a la fermeture. Ajouter une action d'acces au contenu si le header est long.
- **Exemple de code corrige** :

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

- **Verification** : ouvrir/fermer chaque menu et modale avec clavier, presser `Echap`, tabuler en boucle et verifier le retour au declencheur. Refaire le test avec NVDA/Firefox ou VoiceOver/Safari.

### 5. Recherche et widgets OpenLayers generes non verifies

- **Fichier** : `src/components/carte/control/SearchEngine.vue` et `src/components/carte/Controls.vue`.
- **Critere RGAA** : 7.1, 7.3, 7.5, 11.1, 11.9, 12.1.
- **Constat** : le template Vue ne rend qu'un `<div />` ; les champs, boutons, autocompletions et popups sont injectes par `SearchEngineAdvanced`. Les options de placeholder ne constituent pas une etiquette. Le code ne controle pas l'association label/champ, l'annonce des resultats, la navigation par fleches ou le message d'erreur.
- **Impact** : une recherche peut etre utilisable a la souris mais silencieuse ou impossible a parcourir au clavier et au lecteur d'ecran.
- **Correctif propose** : verifier le DOM final et completer le widget avec un label visible, `aria-autocomplete`, `aria-controls`, `aria-expanded`, une liste de resultats et une region live.
- **Exemple de code corrige** :

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

- **Verification** : rechercher sans souris, parcourir les resultats avec les fleches, entendre le nombre de resultats et l'erreur ; inspecter le DOM apres injection du widget.

### 6. Formulaires de controles et etats non relies de maniere demontrable

- **Fichiers** : `src/components/carte/control/PrintModal.vue`, `src/components/menu/ControlListElement.vue`, `src/components/menu/MenuControl.vue`.
- **Critere RGAA** : 11.1, 11.2, 11.9, 11.10.
- **Constat** : les composants DSFR fournissent probablement une partie du balisage, mais plusieurs champs reutilisent le meme `name="checkbox-simple"`. Le composant `ControlListElement` passe a la fois `v-model` et `:model-value` au toggle. Aucun message d'erreur, d'aide ou d'etat de traitement n'est relie au bouton d'export.
- **Impact** : des champs peuvent etre regroupes ou annonces de facon ambigue ; les utilisateurs ne savent pas toujours quel controle est actif ni pourquoi une exportation est indisponible.
- **Correctif propose** : utiliser un nom unique par champ, un `id` stable, un label associe et une description/erreur reliee par `aria-describedby` et `aria-invalid`. Ne pas fournir deux sources de verite au meme composant.
- **Exemple de code corrige** :

```vue
<DsfrCheckbox
  v-model="printFormState.hasTitle"
  name="print-has-title"
  input-id="print-has-title"
  label="Afficher le titre de la carte"
  aria-describedby="print-title-help"
/>
<p id="print-title-help" class="fr-hint-text">
  Le titre sera ajoute a la sortie imprimee.
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

- **Verification** : inspecter chaque champ dans l'arbre d'accessibilite, tester la relation label/description, puis declencher une erreur et verifier son annonce.

### 7. Accordions et controles d'etat incomplets

- **Fichier** : `src/components/utils/CustomAccordeon.vue`.
- **Critere RGAA** : 7.1, 7.3, 9.2.
- **Constat** : le bouton change son texte mais ne declare ni `aria-expanded` ni `aria-controls`. Le contenu n'a pas d'identifiant cible.
- **Impact** : le lecteur d'ecran ne connait pas l'etat ouvert/ferme et peut lire le bouton sans associer le contenu qu'il controle.
- **Correctif propose** : utiliser `<details>/<summary>` quand le comportement suffit, ou declarer explicitement l'etat et la relation.
- **Exemple de code corrige** :

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

- **Verification** : verifier l'annonce « developpe/replie » et l'acces au contenu avec Tab et un lecteur d'ecran.

### 8. Chargements et changements dynamiques non annonces

- **Fichiers** : `src/components/utils/Patience.vue`, `src/views/Plan.vue`, `src/views/Main.vue`.
- **Critere RGAA** : 7.5, 9.2, 12.2.
- **Constat** : `Patience` ne contient qu'un `<span>` anime sans texte, `role` ou `aria-live`. `Plan` affiche un texte seulement si `city` est present, puis redirige vers `/` sans annonce ni mise a jour du titre/focus. Les notifications Notivue sont montees globalement sans preuve de leur role live.
- **Impact** : une personne non voyante peut attendre sans savoir si l'application charge, a echoue ou a change de page.
- **Correctif propose** : ajouter un statut live, un message textuel et une gestion explicite du titre/focus apres navigation.
- **Exemple de code corrige** :

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
  // Apres une erreur, afficher un message focusable avant la redirection
  // ou conserver la vue pour permettre la lecture de l'erreur.
})
```

- **Verification** : utiliser un lecteur d'ecran pendant le chargement, une erreur reseau et une notification ; verifier une annonce unique et utile, sans repetition continue.

### 9. Titres de pages et hierarchie des vues

- **Fichiers** : `src/views/Bookmarks.vue`, `src/views/Embed.vue`, `src/views/Plan.vue`, `src/views/Login.vue`.
- **Critere RGAA** : 8.6, 9.1, 12.2.
- **Constat** : la page document a un titre statique dans `index.html`, mais les vues SPA n'actualisent pas le titre selon la route. `Bookmarks.vue` commence par un `<h2>` et les vues de chargement/authentification ne fournissent pas de contenu de page structure.
- **Impact** : l'utilisateur peut ne pas savoir quelle vue est active dans l'historique du lecteur d'ecran ou parmi les onglets ; la navigation par titres devient incoherente.
- **Correctif propose** : definir un titre unique par route et commencer chaque vue autonome par un titre de niveau 1, ou documenter l'en-tete global comme titre principal unique.
- **Exemple de code corrige** :

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

- **Verification** : ouvrir directement chaque route, verifier le titre de l'onglet, le premier titre annonce et le focus apres navigation SPA.

### 10. Liens ouvrant une nouvelle fenetre et images/pictogrammes

- **Fichiers** : `src/components/modals/ModalReportingStart.vue`, `src/components/modals/Alerts.vue`, `src/components/modals/ModalWelcome.vue`, `src/components/header/CustomHeader.vue`.
- **Critere RGAA** : 1.1, 6.1, 6.2, 7.3.
- **Constat** : plusieurs liens ont `target="_blank"`. Certains ont un `title`, d'autres non. Le logo cartes.gouv.fr de la modale de bienvenue a `alt=""` alors qu'il peut porter une information de marque ; les icones decoratives ne sont pas toutes verifiees dans le DOM genere.
- **Impact** : l'utilisateur peut ne pas savoir qu'une nouvelle fenetre va s'ouvrir, ou perdre le contexte. Un lecteur d'ecran peut manquer l'identite ou la fonction associee a un visuel informatif.
- **Correctif propose** : annoncer l'ouverture dans l'intitule visible ou par texte masque ; attribuer une alternative aux images informatives et masquer explicitement les icones decoratives.
- **Exemple de code corrige** :

```vue
<a :href="faq" target="_blank" rel="noopener noreferrer">
  Foire aux questions (nouvelle fenetre)
</a>

<img
  :src="logoUrl"
  alt="Logo cartes.gouv.fr"
>
<span class="fr-icon-brush-line" aria-hidden="true" />
```

- **Verification** : verifier chaque lien hors contexte, son annonce dans NVDA/VoiceOver et les alternatives de toutes les images non decoratives.

## Analyse ciblee : navigation au clavier de la page principale

### Perimetre et methode

- Page ciblee : route `/`, rendue par `Main.vue` puis `Load.vue`/`CartoAndTools.vue`.
- Parcours analyse : `Tab`, `Shift+Tab`, `Entree`, `Espace`, `Echap` et fleches dans les composants de carte.
- Cette analyse est statique : elle deduit l'ordre probable du DOM et les comportements a partir du code. Elle ne peut pas confirmer les elements injectes par DSFR ou OpenLayers sans inspection du navigateur.

### Parcours clavier attendu

Le parcours attendu devrait etre proche de celui-ci :

1. lien d'acces rapide vers le contenu principal ;
2. logo ou lien d'accueil, navigation principale et liens du header ;
3. alertes et notifications actives ;
4. recherche et controles de carte exposes ;
5. boutons des menus lateraux « Gerer la carte » et « Choisir mes outils » ;
6. contenu du panneau ouvert, puis son bouton « Fermer » ;
7. carte et son alternative textuelle ;
8. footer.

L'ordre reel est incertain pour les controles OpenLayers, mais la structure de `Main.vue` et `CartoAndTools.vue` place `Carto` avant `LeftMenuTool` dans le DOM. Les boutons lateraux, pourtant visuellement superposes a la carte, risquent donc d'etre atteints apres le canvas et les widgets de carte. Cette divergence doit etre verifiee dans l'arbre d'accessibilite.

### Ecarts et risques du parcours principal

#### A. Absence de lien d'acces rapide vers la carte et les outils

- **Fichiers** : `src/views/Main.vue`, `src/components/header/CustomHeader.vue`.
- **Critere RGAA** : 12.1, 12.2, 12.6.
- **Constat** : aucun lien « Aller au contenu » n'est visible dans le montage de la page principale. Le header peut preceder un grand nombre de liens et de boutons avant la carte.
- **Impact** : une personne naviguant avec `Tab` doit traverser tout le header a chaque chargement avant d'atteindre la fonction principale de cartographie.
- **Correctif propose** : ajouter un lien d'evitement en premiere position du document et une cible focusable autour du contenu principal.
- **Exemple de code corrige** :

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

- **Verification** : depuis le debut de la page, presser `Tab`, activer le lien, puis verifier que le focus arrive sur `main-content` sans parcourir le header.

#### B. Focus non restitue apres fermeture des menus lateraux

- **Fichiers** : `src/components/menu/MenuLateralWrapper.vue`, `src/components/menu/LeftMenuTool.vue`, `src/components/menu/RightMenuTool.vue`.
- **Critere RGAA** : 7.1, 7.3, 12.1, 12.6.
- **Constat** : `closeMenu()` modifie uniquement `is_expanded`. Il n'appelle pas `focus()` sur le bouton qui a ouvert le panneau. Aucun traitement `Escape` n'est visible dans `MenuLateralWrapper`.
- **Impact** : apres fermeture, le focus peut rester sur un element masque, revenir a un emplacement imprevisible ou obliger l'utilisateur a refaire une longue tabulation.
- **Correctif propose** : conserver une reference au bouton declencheur, rendre le panneau focusable a l'ouverture et restituer le focus au declencheur a la fermeture. Gerer `Escape` au niveau du panneau.
- **Exemple de code corrige** :

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
  <button @click="openMenu">Gerer la carte</button>
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

- **Verification** : ouvrir chaque panneau avec `Entree` et `Espace`, presser `Echap`, puis verifier que le focus revient exactement au bouton d'origine.

#### C. Panneaux ouverts sans relation explicite avec leur declencheur

- **Fichiers** : `src/components/menu/MenuLateralNavButton.vue`, `src/components/menu/MenuLateralWrapper.vue`.
- **Critere RGAA** : 7.1, 7.3, 9.2.
- **Constat** : le bouton lateral possede un `aria-label`, mais le code ne lui associe pas `aria-expanded` ni `aria-controls`. Le panneau contient un titre visuel mais n'est pas expose comme une region liee au bouton.
- **Impact** : un lecteur d'ecran annonce le bouton « Gerer la carte » sans annoncer clairement si le panneau est ouvert ni quel contenu il controle.
- **Correctif propose** : utiliser un identifiant stable du panneau et synchroniser `aria-expanded`/`aria-controls` sur le bouton.
- **Exemple de code corrige** :

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

- **Verification** : inspecter l'arbre d'accessibilite avant et apres ouverture ; verifier l'annonce du nom, de l'etat et de la relation controle/panneau.

#### D. Focus carte deplace par la souris et carte placee dans le parcours sans alternative

- **Fichiers** : `src/components/carte/Map.vue`, `src/components/carte/Carto.vue`.
- **Critere RGAA** : 7.1, 7.3, 10.7, 13.3.
- **Constat** : `Map.vue` applique le focus au `mouseover`. Le conteneur principal est focusable, mais le code ne fournit pas de resume textuel des couches, resultats ou objets visibles. Les controles clavier propres a la carte ne sont pas definis dans ce composant.
- **Impact** : le focus d'un utilisateur peut etre vole par un mouvement de souris ; un utilisateur de lecteur d'ecran peut atteindre une carte dont le contenu et les actions ne sont pas comprehensibles.
- **Correctif propose** : supprimer le `mouseover` qui force le focus, donner un nom et une aide clavier a la carte et fournir une alternative textuelle equivalente.
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
    Utilisez les fleches pour vous deplacer dans la carte. Les controles de zoom sont disponibles avant la carte.
  </p>
  <slot />
</div>
```

- **Verification** : placer le focus sur un champ puis deplacer la souris au-dessus de la carte ; le focus ne doit pas changer. Atteindre ensuite la carte au clavier et lire son nom et son aide.

#### E. Visibilite clavier des menus et panneaux basee sur `v-show`/CSS

- **Fichiers** : `src/components/menu/MenuLateralWrapper.vue`, `src/components/menu/LeftMenuTool.vue`, `src/components/menu/RightMenuTool.vue`.
- **Critere RGAA** : 7.1, 7.3, 12.8.
- **Constat** : les panneaux utilisent `v-show` et des classes `activeTab`/`inactiveTab`. Le comportement attendu est probablement correct si le CSS applique `display: none`, mais il faut confirmer qu'aucun element masque ne reste focusable ou accessible aux lecteurs d'ecran. Le bouton de fermeture n'est pas relie au panneau par `aria-controls`.
- **Impact** : un utilisateur peut tabuler vers un controle invisible, ou entendre le contenu d'un panneau qui semble ferme visuellement.
- **Correctif propose** : utiliser `v-if` pour detruire les panneaux non actifs lorsque leur etat n'a pas besoin d'etre conserve, ou garantir `hidden`, `aria-hidden` et l'absence de focus sur tout panneau ferme.
- **Exemple de code corrige** :

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

- **Verification** : fermer le panneau puis presser `Tab` ; aucun controle du panneau ferme ne doit recevoir le focus ni etre annonce.

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