const defaultCenter = {
    lat: -6.745,
    lng: -38.523
};

export const getBrowserLocation = () => {
    return new Promise((resolve, reject) => {
        if('geolocation' in navigator){
            navigator.geolocation.getCurrentPosition(
                (pos) =>{
                    const {latitude: lat, longitude: lng} = pos.coords;
                    resolve({lat, lng});
                },
                () =>{
                    reject(defaultCenter);
                },
            );
        }
        else {
            reject(defaultCenter);
        }
    });
};