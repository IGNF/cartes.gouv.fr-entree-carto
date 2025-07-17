import {
  transform as olTransformProj
} from "ol/proj";

class MyServiceAction {
    constructor () {
        console.info("MyServiceAction constructor");
        this.url = import.meta.env.VITE_GPF_SERVICE_ANOMALY || "https://www.geoportail.gouv.fr/wp-json/wp/v2";
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

    /**
     * @summary
     * Le code est issu de l'appli mobile Carte IGN
     */
    async _send (data) {
        console.info("MyServiceAction #send", data);
        var location = data.location.features[0].geometry.coordinates;
        if (data.location.crs.properties.name !== "EPSG::4326") {
            // reprojection
            location = olTransformProj(
                data.location.features[0].geometry.coordinates,
                data.location.crs.properties.name,
                "EPSG:4326"
            );
        }
        const permalink = `https://cartes.gouv.fr/cartes?c=${location[0]},${location[1]}&p=${location[0]},${location[1]}&z=11&l=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2$GEOPORTAIL:OGC:WMTS(1;1;1;0)&w=OverviewMap,SearchEngine,ScaleLine,LayerSwitcher,GetFeatureInfo,Legends,Zoom,FullScreen,Share,Print,Territories,LayerImport,ControlList,ContextMenu&permalink=yes`;
        const anomaly = {
            name: data.name + " (Anomalie) (cartes.gouv.fr)",
            description: data.desc,
            theme: data.theme,
            permalink: permalink,
            id_drawing: "",
            mail: data.mail,
        };

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
        const drawing = {
            is_anomaly: 1,
            kml: data.drawing || kml,
            layername: data.name,
            name: data.name,
        };

        const drawingRequestBody = {drawing: drawing};
        const drawingResponse = await fetch(this.url + "/drawing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer undefined",
            },
            mode: "cors",
            credentials: "same-origin",
            body: JSON.stringify(drawingRequestBody),
        });
        const drawingResults = await drawingResponse.json();

        anomaly.id_drawing = drawingResults.drawing[0].id;

        const requestBody = {anomaly: anomaly};
        await fetch(this.url + "/anomaly", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer undefined",
            },
            mode: "cors",
            credentials: "same-origin",
            body: JSON.stringify(requestBody),
        });
    }

}

export default MyServiceAction;

if (typeof window !== "undefined") {
    window.MyServiceAction = MyServiceAction;
}
// EOF