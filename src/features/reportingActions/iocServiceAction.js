import {
  transform as olTransformProj
} from "ol/proj";

import { useMapStore } from "@/stores/mapStore";
let mapStore = useMapStore();

class MyServiceAction {
    constructor () {
        console.info("MyServiceAction constructor");
        this.url = import.meta.env.VITE_GPF_SERVICE_ANOMALY || "https://cartes.gouv.fr/anomaily";
    }
    // ######################################################## //
    // ########################## API ######################### //
    active () {
        console.info("MyServiceAction active");
    }
    disable () {
        console.info("MyServiceAction disable");
    }
    send (data) {
        console.info("MyServiceAction send");
        return this._send(data);
    }
    clear () {
        console.info("MyServiceAction clear");
    }
    // ######################################################## //
    // ######################### privates ##################### //


    _getCaptchaToken () {
        return new Promise((resolve, reject) => {
            if (!window.geoCaptcha) {
                reject(new Error("GéoCaptcha non chargé"));
            }
            window.geoCaptcha.launch({
                submit: resolve,
                cancel: () => reject(new Error("GéoCaptcha non résolu")),
            });
        });
    }

    /**
     * @summary
     * Le code est issu de l'appli mobile Carte IGN
     */
    async _send (data) {
        console.info("MyServiceAction #send", data);

        // geocaptcha
        let token = await this._getCaptchaToken(); // resolved uniquement si captcha ok
        data.geocaptchaToken = token;

        var location = data.location.features[0].geometry.coordinates;
        if (data.location.crs.properties.name !== "EPSG:4326") {
            // reprojection
            location = olTransformProj(
                data.location.features[0].geometry.coordinates,
                data.location.crs.properties.name,
                "EPSG:4326"
            );
        }

        // KML par défaut si aucun croquis n'a été renseigné
        // on positionne sur la saisie initiale
        var kml = `
        <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/kml/2.2 https://developers.google.com/kml/schema/kml22gx.xsd">
          <ExtendedData>
            <Data name="description">"Signalement (cartes.gouv.fr)"</Data>
          </ExtendedData>
          <Placemark>
            <name>Signalement</name>
            <Style>
              <IconStyle>
                <scale>0.03125</scale>
                <Icon>
                  <href>data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII=</href>
                  <gx:w>1</gx:w>
                  <gx:h>1</gx:h>
                </Icon>
                <hotSpot x="0" y="1" xunits="pixels" yunits="pixels"/>
              </IconStyle>
              <LabelStyle>
                <color>ff000000</color>
                <LabelStyleSimpleExtensionGroup fontSize="16px" fontFamily="sans" haloColor="ffffffff" haloRadius="3" haloOpacity="1"/>
              </LabelStyle>
            </Style>
            <Point>
              <coordinates>${location[0]},${location[1]}</coordinates>
            </Point>
          </Placemark>
        </kml>`;

        let layername = data.name + " (Anomalie) (cartes.gouv.fr)";
        let mapZoom = Math.round(mapStore.getMap().getView().getZoom());

        let anomaly = {
            anomaly: {
                name: layername,
                description: data.desc,
                theme: data.theme,
                mail: data.mail,
                center: location,
                zoom: mapZoom,
            },
            drawing: {
                kml: data.drawing || kml,
                layername: layername,
                name: layername,
            },
            geocaptchaToken: data.geocaptchaToken,
        };

        await fetch(this.url + "/anomaly", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer undefined",
            },
            mode: "cors",
            credentials: "same-origin",
            body: JSON.stringify(anomaly),
        });
    }

}

export default MyServiceAction;

if (typeof window !== "undefined") {
    window.MyServiceAction = MyServiceAction;
}
// EOF