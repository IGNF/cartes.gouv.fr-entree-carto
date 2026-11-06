export default GetDocuments;
declare namespace GetDocuments {
    function getDrawing(id: any): Promise<any>;
    function getImport(id: any): Promise<any>;
    function getCompute(id: any): Promise<any>;
    function getService(id: any): Promise<any>;
    function getCartes(id: any): Promise<any>;
}
