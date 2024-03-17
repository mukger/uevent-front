import React, {useState, useCallback} from "react";
import classes from "./MapContainer.module.css";

import Map, {MODES} from "./Map/Map.js";
import { useJsApiLoader } from "@react-google-maps/api";
import { useWindowSize } from "../../hooks/useWindowSize";
import Autocomplete from "./Autocomplete/Autocomplete.js";

const API_KEY = process.env.REACT_APP_API_KEY;
const libraries = ["places"];



const MapContainer = ({isChangable, center, setCenter})=>{
    
    const [mode, setMode] = useState(MODES.MOVE);
    const [width] = useWindowSize();
    const onPlaceSelect = useCallback((coordinates) =>{
        setCenter(coordinates);// eslint-disable-next-line
    },[])


    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY, 
        libraries: libraries
    })
    const handleToggleMode = () =>{
        switch(mode){
            case MODES.MOVE:
                setMode(MODES.SET_MARKER);
                break;
            case MODES.SET_MARKER:
                setMode(MODES.MOVE);
                break;
            default:
                setMode(MODES.MOVE);
            
        }
    };
    const onMarkerAdd =(coordinates) =>{
        setCenter(coordinates);
    };

    
    if(isChangable){
        return( 
            <div className={classes.navigationContainer}>
                {isLoaded ? 
                    <div className={classes.autocomplete}>
                        <Autocomplete isLoaded={isLoaded} onSelect={onPlaceSelect} className={classes.autocomplete}/>
                        <button onClick={handleToggleMode} type="button">
                            {mode === MODES.MOVE ? 
                                <i className="fa fa-search" aria-hidden="true"></i> : 
                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                
                            }
                        </button>
                    </div> 
                    :<div>loadingText</div>
                }
               
                {isLoaded ?<Map center={center} className={classes.map} mode={mode} onMarkerAdd={onMarkerAdd} width={width >= 500 ? '400px' : '220px'} height={width >= 500 ? '400px' : '220px'} />:<div>loadingText2</div>}
            </div>
            
        );
    }
    else{
        return(
        <div className={classes.navigationContainer}> 
            {isLoaded ? <Map center={center} className={classes.map} mode={mode} onMarkerAdd={onMarkerAdd}  width={width >= 550 ? '400px' : '220px'} height={width >= 550 ? '400px' : '220px'}/>:<div>loadingText2</div>}
        </div>);
    }
    
}

export default MapContainer;