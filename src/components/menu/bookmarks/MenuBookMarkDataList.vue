<script lang="js">
/**
 * @description
 * Liste des Favoris avec les documents suivants : 
 * - cartes ou permaliens
 * - données : croquis, imports, calculs et services
 * 
 * @fires emitter#layerimport:open:clicked
 * @todo gestion de l'accessibilité des onglets
 * @todo obtenir plus d'informations complementaires sur les documents
 * @todo mécanisme de date (tag extra de l'API Entrepôt): creation et modification
 */
export default {
  name: 'MenuBookMarkDataList'
};
</script>

<script setup lang="js">

import { inject, ref, useId, useTemplateRef, watch } from 'vue';

import Sort from '@/components/utils/Sort.vue';
import MenuBookMarkEntry from '@/components/menu/bookmarks/MenuBookMarkEntry.vue';
import ModalConfirm from '@/components/modals/ModalConfirm.vue';

import { fromShare } from "@/features/share";

import { useMapStore } from '@/stores/mapStore';

// lib notification
import { push } from 'notivue'
import t from '@/features/translation';

const mapStore = useMapStore();
const service = inject('services');
const emitter = inject('emitter');

// options
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
});

/************************************************************************
 * Recherche de données
 ***********************************************************************/

const searchString = ref('');
function updateSearch(e) {
  searchString.value = e;
}

const normalizeSearchValue = (value = "") => {
  return String(value)
    .toLowerCase()
    .normalize("NFD") // normalisation Unicode
    .replace(/[\u0300-\u036f]/g, "") // supprime les accents
    .trim();
};

/**
 * Parse une requête de recherche en tokens.
 * Chaque token peut être de la forme "field:value" 
 * ou simplement "value".
 */
const parseSearchQuery = (rawQuery = "") => {
  const normalized = normalizeSearchValue(rawQuery);
  if (!normalized) {
    return [];
  }

  return normalized
    .split(/\s+/)
    .map((token) => {
      const sepIndex = token.indexOf(":");
      if (sepIndex > 0) {
        return {
          field: token.slice(0, sepIndex),
          value: token.slice(sepIndex + 1)
        };
      }
      return { field: null, value: token };
    })
    .filter((token) => token.value);
};

/**
 * 
 * @param item 
 * @param token 
 * @param fieldMap 
 */
const matchesToken = (item, token, fieldMap) => {
  const fieldEntries = Object.entries(fieldMap);
  const fieldsByToken = new Map(fieldEntries);
  const allFields = fieldEntries.flatMap(([, values]) => values);
  const fields = token.field && fieldsByToken.has(token.field) ? fieldsByToken.get(token.field) : allFields;

  return fields.some((field) => {
    const valuesByField = new Map(Object.entries(item || {}));
    return normalizeSearchValue(valuesByField.get(field)).includes(token.value);
  });
};

/**
 * 
 * @param item 
 * @param rawQuery 
 * @param fieldMap 
 */
const matchesQuery = (item, rawQuery, fieldMap) => {
  const tokens = parseSearchQuery(rawQuery);
  if (!tokens.length) {
    return true;
  }

  // Tous les tokens doivent matcher: "name:croquis type:service"
  return tokens.every((token) => matchesToken(item, token, fieldMap));
};

/************************************************************************
 * Gestion des onglets
 ************************************************************************/

const tabListName = 'Liste des données';
const tabTitles = [
  { title: "Cartes", tabId: 'tab-bookmark-maps', panelId: 'tab-content-bookmark-maps'},
  { title: 'Données', tabId: 'tab-bookmark-data', panelId: 'tab-content-bookmark-data' }
];

const selectedIndex = ref(0);

/************************************************************************
 * Gestion des données et des cartes
 ************************************************************************/

// mapping label i18n FR
const i18n = (label) => {
  var mapping = label;
  if (service.labels.includes(label)) {
      if (label === "drawing") {
        mapping = "croquis";
      }
      if (label === "compute") {
        mapping = "calcul";
      }
  } else {
      mapping = label;
  }
  return mapping;
};
// mapping label icon (dsfr)
const icon = (label) => {
  var icon = "";
  if (service.labels.includes(label)) {
      if (label === "drawing") {
        icon = "ri:pencil-line";
      }
      if (label === "import") {
        icon = "ri:file-upload-line";
      }
      if (label === "service") {
        icon = "ri:cloud-line";
      }
      if (label === "compute") {
        icon = "ri:settings-5-line";
      }
  } else {
      icon = "ri:pencil-line";
  }
  return icon;
};

const update = ref(null);

const getTimestamp = (value) => {
  if (!value) {
    return null;
  }
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

// liste des données avec filtre sur la recherche
const lstData = computed(() => {
  if (update.value) {
    console.log("update data !");
  }
  if (sortField.value) {
    console.log("sort data by", sortField.value);
  }
  if (sortOrder.value) {
    console.log("sort data by", sortOrder.value);
  }
  var data = [];
  for (const type in service.documents) {
    if (Object.prototype.hasOwnProperty.call(service.documents, type)) {
      if (type === "carte") {
        continue;
      }
      var documents = service.documents[type];
      if (!documents) {
        continue;
      } 
      for (let i = 0; i < documents.length; i++) {
        var document = documents[i];
        // INFO
        // on a des informations partielles sur les documents...
        var extensions = [ ".geojson", ".gpx", ".kml", ".json"];
        var ext = extensions.find((ext) => document.name.includes(ext));
        data.push({
          id : document._id,
          name : (ext) ? document.name.replace(ext, "").slice(0, -1) : document.name,
          date : document.update,
          date_create : document.creation,
          type : type,
          type_fr : i18n(type) || type, // traduction du type de document
          icon : icon(type)
        });
      }
    }
  }

  // tri combiné : le champ peut être de la forme "field1+field2"
  data.sort((a, b) => {
    const fields = sortField.value.split("+");
    for (const field of fields) {
      const result = compareByField(a, b, field, sortOrder.value);
      if (result !== 0) return result;
    }
    return 0;
  });

  // filtrage sur la recherche (globale ou par préfixe)
  return data.filter((el) =>
    matchesQuery(el, searchString.value, {
      name: ["name"],
      type: ["type", "type_fr"]
    })
  );
});

//  liste des cartes avec filtre sur la recherche
const lstMap = computed(() => {
  if (update.value) {
    console.log("update map !");
  }
  var map = [];
  if (service.documents.carte) {
    for (let i = 0; i < service.documents.carte.length; i++) {
      const document = service.documents.carte[i];
      // les anciens documents n'ont pas de permalien court !
      var isOldDocument = Object.prototype.hasOwnProperty.call(document, "public_url") === false;
      map.push({
        id : document._id,
        name : document.name,
        date : document.update,
        date_create : document.creation,
        type : "carte",
        type_fr : "", // no translation, otherwise e.g. "carte", "permalien"
        icon : "ri-map-2-line",
        status : isOldDocument
      });
    }
  }
  // tri par date uniquement : plus recent en premier
  map.sort((a, b) => {
    const timestampA = getTimestamp(a.date) ?? getTimestamp(a.date_create);
    const timestampB = getTimestamp(b.date) ?? getTimestamp(b.date_create);
    if (timestampA !== null && timestampB !== null) {
      return timestampB - timestampA;
    }
    if (timestampA !== null) {
      return 1;
    }
    if (timestampB !== null) {
      return -1;
    }
    return 0;
  });
  // filtrage sur la recherche (globale ou par préfixe)
  return map.filter((el) =>
    matchesQuery(el, searchString.value, {
      name: ["name"],
      type: ["type", "type_fr"]
    })
  );
});

const onUpdateBookmark = (e) => {
  console.log(e);
  // mise à jour du menu si 
  // - nouveau document
  // - mise à jour
  // - suppression
  // attention à la mise à jour du même document !
  var timestamp = Date.now();
  update.value = Object.assign(e, { timestamp : timestamp });
}

// abonnements
emitter.addEventListener("document:saved", onUpdateBookmark);
emitter.addEventListener("document:updated", onUpdateBookmark);
emitter.addEventListener("document:deleted", onUpdateBookmark);
emitter.addEventListener("document:exported", onUpdateBookmark);
emitter.addEventListener("document:synchronized", onUpdateBookmark);

/**
 * gestionnaire d'evenements
 * 
 * Action d'enregistrement du document sur l'espace personnel :
 * - un permalien pour "Enregistrer la carte"
 * - une donnée de type vecteur ou service pour "Ajouter une donnée"
 * @fires emitter#layerimport:open:clicked
 */
const addMap = () => {
  nameError.value = "";
  isMapNameOpened.value = !isMapNameOpened.value;
};
const addData = () => {
  // envoi d'un evenement pour l'ouverture du contrôle d'import de données
  // et le widget realise l'enregistrement automatique dans l'espace personnel
  // envoi d'un evenement pour l'ouverture du contrôle d'import de données
  emitter.dispatchEvent("layerimport:open:clicked", {
    open : true,
    componentName: "LayerImport"
  });
  emitter.dispatchEvent("leftmenu:close", {
    open : false,
    componentName: "LeftMenu"
  });
};

/************************************************************************
 * Gestion de l'enregistrement d'un permalien
 ************************************************************************/

// affichage du champ de nommage : état réactif, et non classList,
// sinon Vue réécrit l'attribut class (et remet fr-hidden) à chaque rendu
const isMapNameOpened = ref(false);
const refInputMapName = useTemplateRef('input-map-name');
const name = ref('');

// message d'erreur du champ de nommage (le nom est obligatoire)
const nameError = ref('');
const nameMessagesId = useId();
// l'erreur n'est plus valable dès que l'utilisateur saisit un nom
watch(name, (value) => {
  if (nameError.value && value && value.trim()) {
    nameError.value = "";
  }
});

// documents de la carte non enregistrés dans l'espace personnel
const unsavedDocuments = ref([]);
const isUnsavedDocumentsModalOpened = ref(false);

const onClickMapButtonValidateName = () => {
  // le nom est obligatoire : on le vérifie avant toute autre étape
  // (y compris l'avertissement sur les documents non enregistrés)
  if (!name.value || !name.value.trim()) {
    nameError.value = t.bookmark.failed_map_name_required;
    refInputMapName.value?.focus();
    return;
  }
  nameError.value = "";

  unsavedDocuments.value = service.getUnsavedDocuments(mapStore.getMap());
  if (unsavedDocuments.value.length > 0) {
    isUnsavedDocumentsModalOpened.value = true;
    return;
  }
  saveMap();
};

// les paramètres issus d'une URL de partage sont des chaînes ("true", "false", "1", "0")
// et peuvent être absents (ex. grayscale non défini sur une couche de croquis)
const parseBoolean = (value, defaultValue) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }
  return value === true || value === "true" || value === "1";
};

const saveMap = () => {
  isMapNameOpened.value = false;

  // recupérer les couches du catalogue
  // on retourne un tableau d'objets avec les propriétés utiles pour l'enregistrement du document
  var _layers = mapStore.getLayers().map((id) => {
    var props = mapStore.getLayerProperty(id);
    return {
      id : id,
      position : props.position,
      opacity : props.opacity,
      visible : props.visible,
      grayscale : props.grayscale,
      style : props.style
    };
  });
  
  // recupérer les bookmarks de la carte
  // on retourne un tableau d'objets avec les propriétés utiles pour l'enregistrement du document
  var _bookmarks = mapStore.getBookmarks().map((bookmark) => {
    var obj = fromShare(decodeURIComponent(bookmark));
    if (!obj) {
      return null;
    };
    var doc = service.find(obj.id);
    if (!doc) {
      return null;
    }
    return {
      ...doc,
      opacity : (obj.opacity === undefined) ? 1 : Number(obj.opacity),
      visible : parseBoolean(obj.visible, true),
      grayscale : parseBoolean(obj.grayscale, false),
      position : Number(obj.position)
    };
  }).filter((bookmark) => bookmark !== null);

  // fournir un nom au document via UI
  const mapName = name.value.trim();
  const data = {
    name : mapName,
    description : "permalien",
    format : "json",
    target : "internal",
    type : "carte",
    content : JSON.stringify({
      name : mapName,
      date : new Date().toISOString(),
      permalink : mapStore.permalink,
      x : mapStore.x,
      y : mapStore.y,
      zoom : mapStore.zoom,
      documents : {
        layers : _layers, // lien vers les couches du catalogue
        bookmarks : _bookmarks // lien vers les bookmarks de la carte
      }
    }),
    extra : { // trace !
      layers : mapStore.getLayers(),
      bookmarks : mapStore.getBookmarksByID()
    }
  };

  createCarteDocument(data)
  .then(() => {
    name.value = "";
  })
  .then(() => {
    // notification
    push.success({
      title: t.bookmark.title,
      message: t.bookmark.success_save_map
    });
  })
  .catch((e) => {
    console.error(e);
    push.error({
      title: t.bookmark.title,
      message: t.bookmark.failed_save_map
    });
  });
  
};
const onClickMapButtonCancelName  = () => {
  nameError.value = "";
  isMapNameOpened.value = false;
};

const createCarteDocument = async (data) => {
  // enregistrement du permalien dans un document
  // avec le nom fourni par l'utilisateur
  try {
    const o = await service.setDocument(data)
    var uuid = o.uuid;
    var action = o.action;

    // emettre un event pour prévenir l'ajout d'un document
    // au composant des favoris
    emitter.dispatchEvent("document:saved", {
      uuid : uuid,
      action : action // added, updated, deleted
    });

    // mise à jour des extras du document
    // transmission des bookmarks de la carte afin d'avoir une trace 
    // de l'état de la carte dans le temps (suppresion des bookmarks, etc.)
    const x = await service.updateMetadataDocument({
      uuid : uuid,
      type : data.type,
      extra : data.extra
    });
    console.debug(x);

    // rendre public le document
    const s = await service.sharingDocument({
      uuid : uuid,
      type : data.type
    });
    console.debug(s);

    return o;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

/************************************************************************
 * Gestion du tri
 ***********************************************************************/

const sortFields = [
  { label: "Nom", value: "name" },
  { label: "Type", value: "type" },
  { label: "Date", value: "date" },
  { label: "Type + Nom", value: "type+name" },
  { label: "Type + Date", value: "type+date" },
];

/**
 * Compare deux éléments sur un champ unique, en tenant compte du type date.
 */
const compareByField = (a, b, field, order) => {
  const valuesA = new Map(Object.entries(a || {}));
  const valuesB = new Map(Object.entries(b || {}));

  if (field === "date" || field === "date_create") {
    const tsA = getTimestamp(valuesA.get(field));
    const tsB = getTimestamp(valuesB.get(field));
    if (tsA !== null && tsB !== null) {
      return order === "desc" ? tsB - tsA : tsA - tsB;
    }
    if (tsA !== null) return -1;
    if (tsB !== null) return 1;
    return 0;
  }
  const strA = String(valuesA.get(field) || "");
  const strB = String(valuesB.get(field) || "");
  const cmp = strA.localeCompare(strB, "fr", { numeric: true, sensitivity: "base" });
  return order === "desc" ? -cmp : cmp;
};

const sortField = ref("date");
const sortOrder = ref("desc"); // desc ou asc

const onUpdateSortField = (value) => {
  sortField.value = value;
  onUpdateBookmark();
};
const onUpdateSortOrder = (value) => {
  sortOrder.value = value;
  onUpdateBookmark();
};

onBeforeMount(() => {});

onMounted(() => {});

</script>

<template>
  <div class="fr-container fr-p-0">
    <h4 v-if="props.title">
      {{ props.title }}
    </h4>
    <!-- Module de recherche des données utilisateur -->
    <div class="search-bookmark fr-p-1w">
      <DsfrSearchBar
        v-model="searchString"
        label="Rechercher un enregistrement"
        placeholder="Nom ou type du document recherché"
        @update:model-value="updateSearch"
      />
    </div>

    <!-- Module d'affichage des données sur 2 rubriques : 
      - cartes : permaliens
      - données : croquis, imports, calculs et services
    -->
    <div class="tabs-bookmark fr-p-1w">
      <DsfrTabs
        id="tabs-bookmark"
        v-model="selectedIndex"
        :tab-list-name="tabListName"
        :tab-titles="tabTitles"
      >
        <!-- TODO Ajouter l'accessibilité avec l'update vers la v6 ou sup
        <template #tab-items>
          <DsfrTabItem
            v-for="(tab, index) of tabTitles"
            :key="tab.tabId"
            :tab-id="tab.tabId"
            :panel-id="tab.panelId"
            @click="selectedTabBookmarkIndex = index"
            @next="selectNext()"
            @previous="selectPrevious()"
            @first="selectFirst()"
            @last="selectLast()">
            {{ tab.title }}
          </DsfrTabItem>
        </template> 
        -->

        <DsfrTabContent
          panel-id="tab-content-bookmark-maps"
          tab-id="tab-bookmark-maps"
        >
          <!-- Bouton pour enregistrer la carte -->
          <DsfrButton
            label="Enregistrer la carte"
            tertiary
            size="sm"
            class="button-action"
            icon="fr-icon-save-line"
            @click="addMap()"
          />
          <!-- Affichage du menu pour nommer le permalien dans les favoris -->
          <div
            class="fr-input-group container-bookmark-map-name-group"
            :class="{ 'fr-hidden': !isMapNameOpened, 'fr-input-group--error': nameError }"
            data-testid="bookmark-map-name"
          >
            <div class="container-bookmark-map-name">
              <DsfrInput
                ref="input-map-name"
                v-model="name"
                label="Nommer"
                placeholder=""
                required
                :is-invalid="!!nameError"
                :description-id="nameMessagesId"
              />
              <div class="container-bookmark-map-buttons-name">
                <DsfrButton
                  size="sm"
                  icon="ri:close-line"
                  :title="t.bookmark.label_cancel_map_name"
                  :aria-label="t.bookmark.label_cancel_map_name"
                  tertiary
                  no-outline
                  class="fr-p-1w"
                  @click="onClickMapButtonCancelName"
                />
                <DsfrButton
                  size="sm"
                  icon="ri:check-line"
                  :title="t.bookmark.label_validate_map_name"
                  :aria-label="t.bookmark.label_validate_map_name"
                  tertiary
                  no-outline
                  class="fr-p-1w"
                  @click="onClickMapButtonValidateName"
                />
              </div>
            </div>
            <!-- message d'erreur DSFR, annoncé aux lecteurs d'écran -->
            <div
              :id="nameMessagesId"
              class="fr-messages-group"
              aria-live="polite"
            >
              <p
                v-if="nameError"
                class="fr-message fr-message--error"
              >
                {{ nameError }}
              </p>
            </div>
          </div>
          <!-- Affichage des cartes ou permaliens -->
          <div
            v-for="map in lstMap"
            :key="map.id"
            class="container-bookmark-map-item fr-p-1w"
          >
            <MenuBookMarkEntry
              :data="map"
              type="map"
            />
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          panel-id="tab-content-bookmark-data"
          tab-id="tab-bookmark-data"
        >
          <!-- Bouton pour importer un fichier -->
          <DsfrButton
            label="Ajouter une donnée"
            tertiary
            size="sm"
            class="button-action"
            icon="fr-icon-upload-line"
            @click="addData()"
          />
          <div class="fr-mb-2w">
            <!-- Menu de tri :
              - 2 boutons pour l'action : croissant / decroissant
              - un menu déroulant pour choisir le champ de tri
            -->
            <Sort 
              v-model:sort-field="sortField"
              v-model:sort-order="sortOrder"
              sort-id="sort-bookmark-data"
              :sort-fields="sortFields"
              @update:sort-field="onUpdateSortField"
              @update:sort-order="onUpdateSortOrder"
            />
            <!-- Affichage des données :
              - nom
              - icone en fonction du type de données
              - type de données
              - date
              - menu options : renommer, partager, supprimer
            -->
            <div
              v-for="data in lstData"
              :key="data.id"
              class="container-bookmark-data-item fr-p-1w"
            >
              <MenuBookMarkEntry
                :data="data"
                type="data"
              />
            </div>
          </div>
        </DsfrTabContent>
      </DsfrTabs>
    </div>
    <ModalConfirm
      v-model="isUnsavedDocumentsModalOpened"
      :title="t.bookmark.title_unsaved_documents"
      :message="t.bookmark.warning_unsaved_documents"
      :confirm-label="t.bookmark.confirm_save_unsaved_documents"
      :cancel-label="t.bookmark.cancel_save_unsaved_documents"
      @confirm="saveMap"
    >
      <ul class="fr-mt-2w">
        <li
          v-for="doc in unsavedDocuments"
          :key="doc.id"
        >
          {{ doc.name }} ({{ i18n(doc.type) }})
        </li>
      </ul>
      <p>{{ t.bookmark.confirm_save_map_without_unsaved_documents }}</p>
    </ModalConfirm>
  </div>
</template>

<style>
.container-bookmark-map-name {
  display: flex;
}
/* pas de marge DSFR sous le groupe : la liste des cartes suit directement */
.fr-input-group.container-bookmark-map-name-group:not(:last-child) {
  margin-bottom: 0;
}
.container-bookmark-map-buttons-name {
  display: flex;
}
</style>

<style lang="css" scoped>
#tab-content-bookmark-maps,
#tab-content-bookmark-data {
  overflow-y: scroll;
  scrollbar-width: thin;
  overflow-x: hidden;
  padding: 1em;
}
.button-action {
    display: flex;
    width: 100%;
    justify-content: center;
}
</style>

