import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import classes from "./Autocomplete.module.css"
import { useEffect } from "react";

const Autocomplete = ({isLoaded, onSelect})=> {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        init,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
          /* Define search scope here */
        },
        debounce: 300,
    });
    const ref = useOnclickOutside(() => {
        clearSuggestions();
    });
    
    const handleInput = (e) => {setValue(e.target.value);};
    
    const handleSelect =
        ({ description }) =>
        () => {
            setValue(description, false);
            clearSuggestions();
            getGeocode({ address: description }).then((results) => {
                const { lat, lng } = getLatLng(results[0]);                
                onSelect({lat, lng})
            });
        };
    
        const renderSuggestions = () =>
            data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;
        
            return (
                <li key={place_id} onClick={handleSelect(suggestion)}>
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });
    useEffect(()=>{
        if(isLoaded){
            init();
        }
    }, [isLoaded, init])
    return(
        <div ref={ref} className={classes.autocompleteContainer}>
            <input
                type="text"
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Set place of your event"
            />
        {status === "OK" && <ul>{renderSuggestions()}</ul>}
      </div>
    );
}

export default Autocomplete;