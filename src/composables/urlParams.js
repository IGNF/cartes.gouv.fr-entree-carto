import { useUrlSearchParams } from '@vueuse/core';

export function useUrlParams() {
  var params = {};
  const urlParams = useUrlSearchParams("history");
  if (urlParams) {
    const keys = Object.keys(urlParams);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      switch (key) {
        case "c":
          var xy = urlParams[key].split(",");
          params.x = xy[0];
          params.y = xy[1];
          params.lon = 0; // on ne fait pas la conversion...
          params.lat = 0;
          params.center = [params.x, params.y];
          break;
        case "l":
          params.layers = urlParams[key];
          break;
        case "w":
          params.controls = urlParams[key];
          break;
        case "m":
          console.debug("not yet implemented !");
          break;
        case "t":
          console.debug("not yet implemented !");
          break;
        case "i":
          console.debug("not yet implemented !");
          break;  
        case "z":
          params.zoom = parseInt(urlParams[key], 10);
          break;
        default:
          break;
      }
    }
  }
  return params;
};