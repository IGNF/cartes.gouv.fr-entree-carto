<script lang="js">
/**
 * @description
 * Menu des Favoris sans documents disponible
 * dans l'espace de l'utilisateur
 * 
 * @fires emitter#catalog:open:clicked
 * @fires emitter#layerimport:open:clicked
 * @todo impl. handler sur l'enregistrement de la carte
 */
export default {
  name: 'MenuBookMarkNoData'
};
</script>

<script setup lang="js">
import { useMapStore } from '@/stores/mapStore';
import { inject } from 'vue';

// lib notification
import { push } from 'notivue'
import t from '@/features/translation';

const mapStore = useMapStore();
const service = inject('services');
const emitter = inject('emitter');

const createTempCarteDocument = async (data) => {
  // enregistrement du permalien dans un document temporaire
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

    return o;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const buttons = [
  {
    label: 'Enregistrer une carte',
    icon: "fr-icon-save-line",
    iconOnly: false,
    iconRight: false,
    secondary: true,
    class: 'bookmark-button-container',
    onclick: () => {
      // realiser un enregistrement du permalien
      // dans l'espace personnel
      // - creer un document generique afin d'ouvrir le menu
      // - proposer de renommer l'enregistrement
      const name = "Ma carte";

      // recupèrer le permalien
      var permalink = mapStore.permalink;
      
      const data = {
        name : name,
        description : "permalien",
        format : "json",
        target : "internal",
        type : "carte",
        content : JSON.stringify({
          name : name,
          date : new Date().toISOString(),
          permalink : permalink
        })
      };

      createTempCarteDocument(data)
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
    }
  },
  {
    label: 'Consulter le catalogue',
    icon: "fr-icon-highlight",
    iconOnly: false,
    iconRight: false,
    secondary: true,
    class: 'bookmark-button-container',
    onclick: () => {
      // envoi d'un evenement pour l'ouverture du catalogue
      emitter.dispatchEvent("catalog:open:clicked", {
        open : true,
        componentName: "MenuCatalogue"
      });
    }
  },
  {
    label: 'Ajouter une donnée',
    icon: "fr-icon-upload-line",
    iconOnly: false,
    iconRight: false,
    secondary: true,
    class: 'bookmark-button-container',
    onclick: () => {
      // envoi d'un evenement pour l'ouverture du contrôle d'import de données
      emitter.dispatchEvent("layerimport:open:clicked", {
        open : true,
        componentName: "LayerImport"
      });
    }
  }
];
</script>

<template>
  <div class="fr-container">
    <div class="bookmark-content-container">
      <h4>
        Aucun enregistrement pour le moment
      </h4>
      <div>
        Enregsitrer vos cartes et données créées sur votre espace afin de les retrouver
        et de les utiliser à tout moment.
      </div>
      <div id="location-france" />
    </div>
    <div class="bookmark-buttons-container">
      <DsfrButtonGroup
        :buttons="buttons"
      />
    </div>
  </div>
</template>

<style scoped>
.bookmark-content-container {
  width: 100%;
  text-align: center;
}
#location-france {
  display: inline-block;
  background-image: url(../../../assets/location-france.svg);
  background-repeat: no-repeat;
  height: 80px;
  width: 80px;
}
.bookmark-buttons-container {}
</style>

<style>
/* HACK : centrage des boutons */
.bookmark-button-container {
  display: flex;
  width: 100%;
  justify-content: center !important;
}
/* HACK : sinon imposible d'avoir l'icone et le label */
.fr-btns-group:not(.fr-btns-group--sm):not(.fr-btns-group--lg):not([class^=fr-btns-group--icon-]):not([class*=" fr-btns-group--icon-"]) .fr-btn[class*=" fr-icon-"] {
  max-width: unset;
}
</style>