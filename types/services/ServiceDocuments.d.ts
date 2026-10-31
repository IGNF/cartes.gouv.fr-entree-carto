export default Documents;
declare namespace Documents {
    let tag: string;
    let labels: string[];
    let labelsFormats: string[];
    let labelsService: string[];
    let labelsTarget: string[];
    let labelsCompute: string[];
    function isValideLabel(label: any): boolean;
    function isValideFormat(format: any): boolean;
    function isValideService(service: any): boolean;
    function isValideTarget(target: any): boolean;
    function isValideCompute(compute: any): boolean;
    function isEmpty(): boolean;
    function find(uuid: any): any;
    function hasDocumentInCarte(uuid: any): boolean;
    function findInCartes(uuid: any): any[];
    function isValidDataResponse(data: Object): boolean;
    function getDocuments(): Promise<any>;
    function getDocumentsByLabel(label: any): Promise<any>;
    function _getDocumentsByLabelPerPage(label: any, page?: any, limit?: any): Promise<any>;
    function getDocumentById(id: any): Promise<any>;
    function getFileById(id: any): Promise<any>;
}
