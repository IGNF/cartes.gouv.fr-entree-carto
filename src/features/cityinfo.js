/**
 * Ce module fournit des fonctions pour récupérer les informations d'une ville 
 * à partir de son code INSEE et de son nom.
 * Ces informations peuvent être utilisées pour afficher des détails sur la ville, 
 * centrer la carte sur ses coordonnées, etc.
 * 
 * @see https://github.com/IGNF/cartes.gouv.fr-cityinfo
 */

/**
 * Exemple de structure de données retournée par getCityInfo :
 * // {
 * //   "code_insee": "69123",
 * //   "id": "COMMUNE_0000000009752008",
 * //   "nom": "Lyon",
 * //   "population": 520774,
 * //   "coordonnees": [],
 * //   "arrondissement": "691",
 * //   "departement": "Rhône",
 * //   "region": "Auvergne-Rhône-Alpes",
 * //   "statut": "chef_lieu_de_region",
 * //   "enveloppe": {
 * //     "lowerCorner": [
 * //       45.70748121,
 * //       4.77185194
 * //     ],
 * //     "upperCorner": [
 * //       45.80842026,
 * //       4.89839571
 * //     ]
 * //   },
 * //   "centre": [
 * //     45.757950734999994,
 * //     4.835123825
 * //   ],
 * //   "slug": "lyon"
 * // }
 */

const WFS_BASE_URL = 'https://data.geopf.fr/wfs/ows';
const WFS_WORKSPACE_CITY = 'BDTOPO_V3';
const WFS_TYPENAME_CITY = 'commune';
const WFS_OUTPUT_FORMAT = 'application/json';

/**
 * Récupère les informations d'une ville à partir de son code INSEE et de son nom.
 * 
 * @param {string} insee - code INSEE de la ville
 * @param {string} city - nom de la ville (informative)
 * @return {Promise} - Promise qui résout les informations de la ville au format JSON
 * @sample
 * getCityInfo('75056', 'Paris')
 *   .then(cityInfo => {
 *     console.log(cityInfo);
 *   })
 *   .catch(error => {
 *     console.error('Erreur lors de la récupération des informations de la ville :', error);
 *   });
 */
export const getCityInfo = async (insee, city) => {
  if (!insee) {
    throw new Error('Le code INSEE est requis pour récupérer les informations de la ville.');
  }
  if (!city) {
    // TODO informatif !
  }

  try {
    const response = await _getFeatureWfs(insee);
    if (!response) {
      throw new Error(`Aucune donnée trouvée pour la ville avec le code INSEE ${insee}.`);
    }
    return _extractCityInfo(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations de la ville :', error);
    throw error;
  }
}

/**
 * Requête les données à partir du service WFS de l'IGN en utilisant le code INSEE.
 * 
 * @param {string} insee - code INSEE de la ville
 * @return {Promise} - Promise qui résout les données de la ville au format JSON
 * @sample
 * _getFeatureWfs('75056')
 *   .then(response => {
 *     console.log(response);
 *   })
 *   .catch(error => {
 *     console.error('Erreur lors de la récupération des données WFS :', error);
 *   });
 */
const _getFeatureWfs = async (insee) => {
  if (!insee) {
    throw new Error('Le code INSEE est requis pour récupérer les informations de la ville.');
  }

  // ex : 
  // curl 'https://data.geopf.fr/wfs/ows?request=GetFeature&service=WFS&version=2.0.0&TypeNames=BDTOPO_V3:commune&count=1&CQL_FILTER=code_insee=%2775056%27&outputFormat=application/json'
  var url = WFS_BASE_URL + '?request=GetFeature&service=WFS&version=2.0.0&TypeNames=';
  url = url + WFS_WORKSPACE_CITY + ':' + WFS_TYPENAME_CITY;
  url = url + '&count=1&CQL_FILTER=code_insee=\'' + insee + '\'';
  url = url + '&outputFormat=' + WFS_OUTPUT_FORMAT;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status} lors de la récupération des données WFS : ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des données WFS :', error);
    throw error;
  }
};

/**
 * Extrait les informations d'une ville à partir de la réponse WFS.
 * 
 * @param {Object} response - réponse WFS au format JSON 
 * @return {Object} - objet contenant les informations de la ville
 * @sample
 * const wfsResponse = { ... }; // réponse WFS au format JSON
 * const cityInfo = _extractCityInfoFromWfsResponse(wfsResponse);
 * console.log(cityInfo);
 */
const _extractCityInfo = (response) => {
  var data = (typeof response === 'string') ? JSON.parse(response) : response;
  if (!data || !data.features || data.features.length === 0) {
    throw new Error('Aucune donnée trouvée dans la réponse WFS pour la ville demandée.');
  }

  var feature = data.features[0] || {};
  var properties = feature.properties || {};
  var geometry = feature.geometry || {};

  var cityInfo = {};

  cityInfo.id = properties.cleabs || null;
  cityInfo.nom = properties.nom_officiel || null;
  cityInfo.code_insee = properties.code_insee || null;
  cityInfo.population = parseInt(properties.population) || null;
  cityInfo.arrondissement = properties.code_insee_de_l_arrondissement || null;
  cityInfo.departement = properties.code_insee_du_departement || null;
  cityInfo.region = properties.code_insee_de_la_region || null;

  if (properties.capitale_d_etat === true) {
    cityInfo.statut = 'capitale_d_etat';
  } else if (properties.chef_lieu_de_region === true) {
    cityInfo.statut = 'chef_lieu_de_region';
  } else if (properties.chef_lieu_de_departement === true) {
    cityInfo.statut = 'chef_lieu_de_departement';
  } else if (properties.chef_lieu_de_collectivite_terr === true) {
    cityInfo.statut = 'chef_lieu_de_collectivite_terr';
  } else if (properties.chef_lieu_d_arrondissement === true) {
    cityInfo.statut = 'chef_lieu_d_arrondissement';
  } else {
    cityInfo.statut = 'commune_simple';
  }

  // Aplatir les Polygon/MultiPolygon en un tableau de points [x, y]
  if (geometry && geometry.coordinates) {
    var rawCoordinates = [];
    if (geometry.type === 'Polygon') {
      rawCoordinates = geometry.coordinates;
    } else if (geometry.type === 'MultiPolygon') {
      for (var pIndex = 0; pIndex < geometry.coordinates.length; pIndex++) {
        rawCoordinates = rawCoordinates.concat(geometry.coordinates[pIndex]);
      }
    }

    cityInfo.coordonnees = [];
    for (var ringIndex = 0; ringIndex < rawCoordinates.length; ringIndex++) {
      var ring = rawCoordinates[ringIndex];
      if (!Array.isArray(ring)) {
        continue;
      }
      for (var pointIndex = 0; pointIndex < ring.length; pointIndex++) {
        var point = ring[pointIndex];
        if (!Array.isArray(point) || point.length < 2) {
          continue;
        }
        cityInfo.coordonnees.push([point[0], point[1]]);
      }
    }
  }

  // Calcul de l'enveloppe à partir de la géométrie de la commune
  if (cityInfo.coordonnees && cityInfo.coordonnees.length > 0) {
    var boundingBox = _calculateBoundingBox(cityInfo.coordonnees);
    if (boundingBox) {
      cityInfo.enveloppe = boundingBox;
      cityInfo.centre = [
        (cityInfo.enveloppe.upperCorner[0] + cityInfo.enveloppe.lowerCorner[0]) / 2,
        (cityInfo.enveloppe.upperCorner[1] + cityInfo.enveloppe.lowerCorner[1]) / 2
      ];
    } else {
      console.warn('Unable to calculate bounding box from coordinates for city: ' + cityInfo.nom);
    }
  } else {
    console.warn('No coordinates available to calculate bounding box for city: ' + cityInfo.nom);
  }

  cityInfo.slug = _toSlug(cityInfo.nom);

  return cityInfo;
}

/**
 * Calcule les coins inférieur et supérieur de l'enveloppe à partir 
 * d'un tableau de coordonnées.
 * @param {Array<Array<number>>} coordinates 
 * @returns {Object|null} - objet contenant les coins inférieur et supérieur de l'enveloppe
 */
const _calculateBoundingBox = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  var minX = coordinates[0][0];
  var minY = coordinates[0][1];
  var maxX = coordinates[0][0];
  var maxY = coordinates[0][1];

  for (let i = 1; i < coordinates.length; i++) {
    const x = coordinates[i][0];
    const y = coordinates[i][1];

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  return {
    lowerCorner: [minX, minY],
    upperCorner: [maxX, maxY]
  };
}

/**
 * Convertit une chaîne de caractères en slug.
 * @param {string} str - La chaîne de caractères à convertir.
 * @returns {string} - Le slug généré.
 */
const _toSlug = (str) => {
  str = str || "";
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;'";
  var to = "aaaaaeeeeeiiiiooooouuuunc-------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}