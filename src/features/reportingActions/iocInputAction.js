import { unByKey as olObservableUnByKey } from "ol/Observable";
import Overlay from "ol/Overlay";

class MyInputAction {
    constructor (map /* optionnel !!! */) {
        console.info("MyInputAction constructor");
        this.map = map || null;
        this.data = null;
        this.coordinate = null;
        this.listener = null;
        this.icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAzNiIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48cGF0aCBmaWxsPSIjMDAwMDkxIiBkPSJNMTguMzY0IDMuNjM2YTkgOSAwIDAgMSAwIDEyLjcyOEwxMiAyMi43MjhsLTYuMzY0LTYuMzY0QTkgOSAwIDAgMSAxOC4zNjQgMy42MzZaTTEyIDhhMiAyIDAgMSAwIDAgNCAyIDIgMCAwIDAgMC00WiIvPjwvc3ZnPg==";
    }

    // ######################################################## //
    // ########################## API ######################### //

    setMap (map) {
        console.info("MyInputAction map");
        this.map = map;
    }
    
    setIcon (icon) {
        console.info("MyInputAction icon");
        if (icon) {
            this.icon = icon;
        }
    }
    
    getData () {
        console.info("MyInputAction data");
        var projection = this.map.getView().getProjection();
        if (!this.coordinate) {
          this.coordinate = this.map.getView().getCenter();
        }
        var geometry = {
            type : "FeatureCollection",
            crs : {
                type : "name",
                properties : {
                    name : projection.getCode()
                }
            },
            features : [
                {
                    type : "Feature",
                    crs : {
                        type : "name",
                        properties : {
                            name : projection.getCode()
                        }
                    },
                    geometry : {
                        type : "Point",
                        coordinates : this.coordinate || [0, 0]
                    },
                    properties : {
                        description : "Point de signalement",
                        date : new Date().toISOString(),
                        author : "Anonyme"
                    }
                }
            ]
        };
        this.data = {
            location : geometry
        };
        return this.data || { location : null };
    }

    clear () {
        console.info("MyInputAction clear");
        this.data = null;
        this.coordinate = null;
        if (this.listener) {
            olObservableUnByKey(this.listener);
            this.listener = null;
        }
        if (this.marker != null) {
            this.map.removeOverlay(this.marker);
            this.marker = null;
        }
    }

    active () {
        this._addEventsListeners();
    }

    disable () {
        this._removeEventsListeners();
    }

    // ######################################################## //
    // ######################### privates ##################### //

    _addEventsListeners () {
        console.info("MyInputAction active");
        if (!this.map) {
            return;
        }
        this.listener = this.map.on("singleclick", this._handler.bind(this));
    }
    _removeEventsListeners () {
        console.info("MyInputAction disable");
        if (!this.map) {
            return;
        }
        olObservableUnByKey(this.listener);
    }
    _handler (e) {
        console.info("MyInputAction handler", e);
        if (!this.map) {
            return;
        }
        this.coordinate = e.coordinate;
        // on supprime le marqueur précédent
        if (this.marker != null) {
            this.map.removeOverlay(this.marker);
            this.marker = null;
        }
        // on ajoute un marqueur sur la carte
        var markerDiv = document.createElement("img");
        markerDiv.src = this.icon;
        this.marker = new Overlay({
            position : this.coordinate,
            positioning : "center-center",
            element : markerDiv,
            stopEvent : false
        });
        this.map.addOverlay(this.marker);
    }

}

export default MyInputAction;

if (typeof window !== "undefined") {
    window.MyInputAction = MyInputAction;
}
// EOF