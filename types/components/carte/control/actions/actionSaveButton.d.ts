/**
 * Créer un document pour un vecteur de type :
 * - drawing
 * - import
 * - compute
 *
 * @param {Object} data - parametres
 * @property {String} data.content - export data
 * @property {String} data.name - name
 * @property {String} data.description - description
 * @property {String} data.format - format : kml, geojson, ...
 * @property {String} data.target - internal, external
 * @property {String} data.compute - route
 * @property {String} data.type - drawing, import, bookmark, compute
 * @property {Object} data.layer - layer
 * @param {Object} iocEmitter - injection composant Emitter
 * @param {Object} iocService - injection composant Services
 */
export function useCreateDocument(data: Object, iocEmitter: Object, iocService: Object): Promise<any>;
/**
 * Mettre à jour un document pour un vecteur de type :
 * - drawing
 * - import
 * - compute
 *
 * @param {Object} data - parametres
 * @property {String} data.content - export data
 * @property {String} data.name - name
 * @property {String} data.description - description
 * @property {String} data.format - format : kml, geojson, ...
 * @property {Object} data.layer - layer
 * @param {Object} iocEmitter - injection composant Emitter
 * @param {Object} iocService - injection composant Services
 */
export function useUpdateDocument(data: Object, iocEmitter: Object, iocService: Object): Promise<any>;
