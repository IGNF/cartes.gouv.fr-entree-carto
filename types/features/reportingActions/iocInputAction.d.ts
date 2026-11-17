export default MyInputAction;
declare class MyInputAction {
    constructor(map: any);
    map: any;
    data: {
        location: {
            type: string;
            crs: {
                type: string;
                properties: {
                    name: any;
                };
            };
            features: {
                type: string;
                crs: {
                    type: string;
                    properties: {
                        name: any;
                    };
                };
                geometry: {
                    type: string;
                    coordinates: any;
                };
                properties: {
                    description: string;
                    date: string;
                    author: string;
                };
            }[];
        };
    } | null;
    coordinate: any;
    listener: any;
    icon: string;
    setMap(map: any): void;
    setIcon(icon: any): void;
    getData(): {
        location: {
            type: string;
            crs: {
                type: string;
                properties: {
                    name: any;
                };
            };
            features: {
                type: string;
                crs: {
                    type: string;
                    properties: {
                        name: any;
                    };
                };
                geometry: {
                    type: string;
                    coordinates: any;
                };
                properties: {
                    description: string;
                    date: string;
                    author: string;
                };
            }[];
        };
    };
    clear(): void;
    marker: Overlay | null | undefined;
    active(): void;
    disable(): void;
    _addEventsListeners(): void;
    _removeEventsListeners(): void;
    _handler(e: any): void;
}
import Overlay from "ol/Overlay";
