import React, {useCallback, useMemo, useRef} from "react";
import { GoogleMap, Marker} from "@react-google-maps/api";

import classes from "./Map.module.css";
import { defaultTheme } from "./defaultTheme";


const defaultOptions = {
    panControl: true,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    clickableIcons: false,
    keyboardShortcuts: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    styles: defaultTheme
};

export const MODES = {
    MOVE: 0, 
    SET_MARKER: 1
}


const Map = ({center, mode, onMarkerAdd, width, height, zoom})=>{
   
    const mapRef = useRef(undefined);

    const onLoad = useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        //const bounds = new window.google.maps.LatLngBounds(center);
        //map.fitBounds(bounds);
    
        //setMap(map)
        mapRef.current = map;
    }, [])
    
    const onUnmount = useCallback(function callback(map) {
        mapRef.current = undefined;
    }, [])

    const onClick = useCallback((location) =>{
        if(mode === MODES.SET_MARKER){
            const lat = location.latLng.lat();
            const lng = location.latLng.lng();
            onMarkerAdd({lat, lng});
        }
    }, [mode, onMarkerAdd])

    const containerStyle = useMemo(()=>{
        return {
            width: width,
            height: height
        };
    }, [width, height]);
    return <div className={classes.mapContainer}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={onClick}
                options={defaultOptions}
            >  
                <Marker position={center} />

                <></>
            </GoogleMap>
        </div>
}

export default Map;