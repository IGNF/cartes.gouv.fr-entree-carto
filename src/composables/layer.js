import { useDataStore } from "@/stores/dataStore"

import { 
  LayerMapBox as GeoportalMapBox,
  LayerWMS as GeoportalWMS,
  LayerWMTS as GeoportalWMTS
} from 'geopf-extensions-openlayers'


export function getLayerConf(layerOptions) {
    const dataStore = useDataStore();
    var value  = dataStore.getLayerByName(layerOptions.name, layerOptions.service);
    var params = dataStore.getLayerParamsByName(layerOptions.name, layerOptions.service);
    value.params = params; // fusion
  
    var service = layerOptions.service;
    var name = layerOptions.name;
    switch (service) {
      case "WMS":
        return new GeoportalWMS({
          layer : name,
          configuration : value
        });
      case "WMTS":
        return new GeoportalWMTS({
          layer : name,
          configuration : value
        });
      case "TMS":
        // INFO le style par defaut est utilisé !
        return new GeoportalMapBox({
          layer : name,
          configuration : value
        });
      default:
    }
}

export function getLayerOptions(layer) {
    return {
        name : layer.name,
        service : layer.serviceParams.id.split(":")[1]
    }
}