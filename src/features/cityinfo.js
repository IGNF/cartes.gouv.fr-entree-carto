// URL du service distant
let serviceUrl = import.meta.env.VITE_GPF_SERVICE_CITYINFO;

// INFO
// http://localhost:3000/cityinfo/city/69123
// {
//   "code_insee": "69123",
//   "id": "COMMUNE_0000000009752008",
//   "nom": "Lyon",
//   "population": 520774,
//   "coordonnees": [],
//   "arrondissement": "691",
//   "departement": "Rhône",
//   "region": "Auvergne-Rhône-Alpes",
//   "statut": "chef_lieu_de_region",
//   "enveloppe": {
//     "lowerCorner": [
//       45.70748121,
//       4.77185194
//     ],
//     "upperCorner": [
//       45.80842026,
//       4.89839571
//     ]
//   },
//   "centre": [
//     45.757950734999994,
//     4.835123825
//   ],
//   "slug": "lyon"
// }
const getCityInfo = async (insee, city) => {
  const apiUrlCity = `${serviceUrl}/cityinfo/city/${insee}/`;
  try {
    const response = await fetch(apiUrlCity);
    if (!response.ok) throw new Error('Erreur API CityInfo !');
    const dataCity = await response.json();
    if (!dataCity) throw new Error(`Informations de la ville ${city} non trouvées !`);
    return dataCity; // Retourner les informations de la ville
  } catch (e) {
    // INFO
    // Gérer l'erreur (affichage, log, etc.)
    console.warn('Erreur lors de la récupération de la ville :', e);
    return null; // Retourner null en cas d'erreur
  }
};

// INFO
// http://localhost:3000/cityinfo/closestCities/45.757950734999994,4.835123825
// {
//   "closest_cities": [
//   {
//   "nom": "Lyon",
//   "code_insee": "69123",
//   "slug": "lyon",
//   "distance": 0
//   },
//   {
//   "nom": "La Mulatière",
//   "code_insee": "69142",
//   "slug": "la-mulatiere",
//   "distance": 0.033587134649257715
//   },
//   {
//   "nom": "Caluire-et-Cuire",
//   "code_insee": "69034",
//   "slug": "caluire-et-cuire",
//   "distance": 0.043094289978067864
//   },
//   {
//   "nom": "Sainte-Foy-lès-Lyon",
//   "code_insee": "69202",
//   "slug": "sainte-foy-les-lyon",
//   "distance": 0.047738056143622365
//   },
//   {
//   "nom": "Oullins-Pierre-Bénite",
//   "code_insee": "69149",
//   "slug": "oullins-pierre-benite",
//   "distance": 0.055361316655685534
//   },
//   {
//   "nom": "Villeurbanne",
//   "code_insee": "69266",
//   "slug": "villeurbanne",
//   "distance": 0.05645086500877354
//   },
//   {
//   "nom": "Saint-Fons",
//   "code_insee": "69199",
//   "slug": "saint-fons",
//   "distance": 0.0604662679590956
//   },
//   {
//   "nom": "Champagne-au-Mont-d'Or",
//   "code_insee": "69040",
//   "slug": "champagne-au-mont-d-or",
//   "distance": 0.06477995080108274
//   },
//   {
//   "nom": "Écully",
//   "code_insee": "69081",
//   "slug": "ecully",
//   "distance": 0.06602830582961076
//   },
//   {
//   "nom": "Saint-Cyr-au-Mont-d'Or",
//   "code_insee": "69191",
//   "slug": "saint-cyr-au-mont-d-or",
//   "distance": 0.06642141989917036
//   },
//   {
//   "nom": "Saint-Didier-au-Mont-d'Or",
//   "code_insee": "69194",
//   "slug": "saint-didier-au-mont-d-or",
//   "distance": 0.06762028642166747
//   },
//   {
//   "nom": "Vénissieux",
//   "code_insee": "69259",
//   "slug": "venissieux",
//   "distance": 0.07270625048908859
//   }]
// }
const getClosestCities = async (city, latitude, longitude) => {
  const apiUrlClosestCities = `${serviceUrl}/cityinfo/closestCities/${latitude},${longitude}`;
  try {
    const response = await fetch(apiUrlClosestCities);
    if (!response.ok) throw new Error('Erreur API ClosestCities !');
    const dataClosestCities = await response.json();
    if (!dataClosestCities) throw new Error(`Informations des villes proches de ${city} non trouvées !`);
    return dataClosestCities.closest_cities; // Retourner les villes proches
  } catch (e) {
    // INFO
    // Gérer l'erreur (affichage, log, etc.)
    console.warn('Erreur lors de la récupération des villes proches :', e);
    return []; // Retourner un tableau vide en cas d'erreur
  }
};

export {
  getCityInfo,
  getClosestCities
}