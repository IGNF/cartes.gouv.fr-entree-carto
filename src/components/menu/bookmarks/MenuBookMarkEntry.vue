<script lang="js">
/**
 * @description
 * Entrée d'un favori :
 * - nom
 * - icone en fonction du type de données
 * - type de données
 * - date (creer et modifier)
 * - menu options : renommer, partager, supprimer
 * 
 * En cliquant sur une entrée, la donnée est ajoutée à la carte.
 * On procede :
 * - récupèration des informations complementaires
 * - téléchargement du fichier
 * - enregistrement de l'ID dans la couche native : 
 *   ex. gpResultLayerId = 'bookmark:3fa85f64-5717-4562-b3fc-2c963f66afa5'
 * 
 * @todo gestion des exceptions à transmettre
 * @todo le type service mapbox est à mettre en place
 * @todo le type compute est à mettre en place
 */
export default {
  name: 'MenuBookMarkEntry'
};
</script>

<script setup lang="js">
import { 
  createVectorLayer, 
  createServiceLayer,
  createMapBoxLayer 
} from '@/features/ol.js';

import { getLayersFromPermalink } from '@/features/permalink.js';

// lib notification
import { push } from 'notivue'

import { useMapStore } from "@/stores/mapStore";
const mapStore = useMapStore();

/**
 * Options :
 * - type : 'map' ou 'data'
 * - data : {id, full_name, name, ext, type, type_fr, icon, date}
 */
const props = defineProps({
  type : String,
  data : Object
});

const service = inject('services');

/**
 * Gestionnaire d'evenement d'affichage de la couche sur la carte
 * 
 * @param data - {id, full_name, name, ext, type, type_fr, icon, date}
 */
const displayDataOnMap = (data) => {
  service.getDocumentById(data.id)
  .then((infos) => {
    var fct = null;
    switch (data.type) {
      case "drawing":
        fct = service.getDrawing;
        break;
      case "import":
        fct = service.getImport;
        break;
      case "compute":
        // TODO
        // Ce type de données doit initialisé un contrôle : 
        // - isochrone
        // - profil altimétrique
        // - itineraire
        fct = service.getCompute;
        throw new Error(`Le type ${data.type} n'est pas implementé !`);
        break;
      case "service":
        fct = service.getService;
        break;
      case "carte":
        fct = service.getCartes;
        break;
      default:
        break;
    }
    if (!fct) {
      throw new Error("Impossible de determiner le type de données !?");
    }
    // appel de la requête de télechargement du fichier
    fct.call(service, data.id)
    .then((response) => {
      
      var opts = {};
      var target = {};
      var layer = null;
      
      // creation de l'objet layer pour afficher un Vecteur ou un Service
      if (data.type === "carte") {
        getLayersFromPermalink(response);
        push.success({
          title: "Espace personnel",
          message: "Ajout du permalien sur la carte",
        });
        return;
      } else if (data.type === "service") {
        // les reponses possibles :
        // - style (json) ou url pour mapbox, 
        // - liste de parametres (json) pour wms et wmts
        opts = {
          id : data.id,
          title : data.name,
          description : infos.description,
          format : infos.extra.format // wms, wmts ou mapbox
        };
        if (infos.extra.format === "mapbox") {
          target = (infos.extra.target && infos.extra.target === "internal") ? { data : response } : { url : response };
          createMapBoxLayer({
            ...opts,
            ...target
          })
          .then((layer) => {
            mapStore.getMap().addLayer(layer);
            push.success({
              title: "Espace personnel",
              message: "Ajout de la donnée MapBox sur la carte",
            });
          })
          .catch((e) => {
            throw e;
          });
          return;
        } else {
          target = { data : response };
          layer = createServiceLayer({
            ...opts,
            ...target
          });
        }
      } else {
        opts = {
          id : data.id,
          extended : true, // on utilise le format étendu de GeoJSON, KML et GPX
          title : data.name,
          description : infos.description,
          format : infos.extra.format
        };
        target = (infos.extra.target && infos.extra.target === "external") ? { url : response } : { data : response };
        layer = createVectorLayer({
          ...opts,
          ...target
        });
      }
      
      mapStore.getMap().addLayer(layer);
      push.success({
        title: "Espace personnel",
        message: "Ajout de la donnée sur la carte",
      });
    })
    .catch((e) => {
      throw e;
    });
  })
  .catch((e) => {
    console.error(e);
    push.error({
      title: "Espace personnel",
      message: "Exception sur l'ajout d'une donnée : " + e.message,
    });
  })
};

onBeforeMount(() => {});

onMounted(() => {});

</script>

<template>
  <DsfrButton 
    :data-id="data.id"
    :data-type="data.type"
    :title="data.full_name"
    tertiary
    no-outline
    :icon="data.icon"
    @click="displayDataOnMap(data)">
      {{ data.name }}
  </DsfrButton>
  <div class="container-bookmark-advanced-infos fr-hint-text">
    <span>{{ data.type_fr }}</span>
    <span v-if="data.ext"> - {{ data.ext }}</span>
    <span v-if="data.date"> - {{ data.date }}</span>
  </div>
  <div class="container-bookmark-advanced-options"></div>
  <slot></slot>
</template>