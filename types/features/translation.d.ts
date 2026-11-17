declare namespace _default {
    namespace auth {
        let title: string;
        let not_authentificated: string;
        let need_authentification: string;
        function failed(value: any): string;
    }
    namespace bookmark {
        let title_1: string;
        export { title_1 as title };
        export function failed_1(value: any): string;
        export { failed_1 as failed };
        export function success_add_data(value: any): string;
        export function failed_add_data(value: any): string;
        export let success_save_map: string;
        export let failed_save_map: string;
        export let success_copy_permalink: string;
        export function failed_type_unknow(value: any): string;
        export function failed_not_yet_implemented(value: any): string;
        export let failed_transform_format: string;
        export function failed_export_data(value: any): string;
        export function failed_copy_permalink(value: any): string;
        export function failed_delete_data(value: any): string;
        export function failed_rename_data(value: any): string;
        export let warning_delete_document_in_bookmarks_carte: string;
        export let warning_delete_permalink_in_bookmarks_carte: string;
        export let confirm_delete_document: string;
        export function confirm_delete_document_with_name(value: any): string;
    }
    namespace drawing {
        let title_2: string;
        export { title_2 as title };
        export let save_success: string;
        export let save_failed: string;
        export let restore_failed: string;
    }
    namespace layerimport {
        let title_3: string;
        export { title_3 as title };
        let save_success_1: string;
        export { save_success_1 as save_success };
        let save_failed_1: string;
        export { save_failed_1 as save_failed };
        export function add_success_service(value: any): string;
        export function add_failed_service(value: any): string;
        export let add_success_mapbox: string;
        export let add_failed_mapbox: string;
    }
    namespace layerswitcher {
        let title_4: string;
        export { title_4 as title };
        export let add_success: string;
        export let add_failed: string;
        export let remove_success: string;
        export let remove_failed: string;
        let failed_not_yet_implemented_1: string;
        export { failed_not_yet_implemented_1 as failed_not_yet_implemented };
    }
    namespace route {
        let title_5: string;
        export { title_5 as title };
        export let failed_import: string;
        export let save_already: string;
        let save_success_2: string;
        export { save_success_2 as save_success };
        let save_failed_2: string;
        export { save_failed_2 as save_failed };
    }
    namespace iso {
        let title_6: string;
        export { title_6 as title };
        let failed_import_1: string;
        export { failed_import_1 as failed_import };
        let save_already_1: string;
        export { save_already_1 as save_already };
        let save_success_3: string;
        export { save_success_3 as save_success };
        let save_failed_3: string;
        export { save_failed_3 as save_failed };
    }
    namespace profil {
        let title_7: string;
        export { title_7 as title };
        let failed_import_2: string;
        export { failed_import_2 as failed_import };
        let save_already_2: string;
        export { save_already_2 as save_already };
        let save_success_4: string;
        export { save_success_4 as save_success };
        let save_failed_4: string;
        export { save_failed_4 as save_failed };
    }
    namespace searchengine {
        let title_8: string;
        export { title_8 as title };
    }
    namespace territories {
        let title_9: string;
        export { title_9 as title };
        export let change: string;
        export let reset: string;
        export function remove(value: any): string;
        export function add(value: any): string;
    }
    namespace ol {
        let title_10: string;
        export { title_10 as title };
        export function failed_2(value: any): string;
        export { failed_2 as failed };
        export function failed_format(value: any): string;
        export function failed_source(value: any): string;
        export function failed_layer(value: any): string;
        export function failed_mapbox(value: any): string;
    }
    namespace notification {
        let title_11: string;
        export { title_11 as title };
        export function unknown_add_layer(name: any, service: any): string;
        export function exception_add_layer(name: any, message: any): string;
    }
}
export default _default;
