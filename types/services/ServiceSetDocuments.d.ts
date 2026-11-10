export default SetDocuments;
declare namespace SetDocuments {
    function getMimeType(format: string): string;
    function sliceText(text: any, maxLength: any): string;
    function setDocument(obj: Object): Promise<any>;
    function updateGeometryDocument(obj: any): Promise<any>;
    function updateMetadataDocument(obj: any): Promise<any>;
    function updateLabelsDocument(obj: any): Promise<any>;
    function sharingDocument(obj: any): Promise<any>;
    function renameDocument(obj: any): Promise<any>;
    function deleteDocument(obj: any): Promise<any>;
    function exportDocument(obj: any): Promise<any>;
}
