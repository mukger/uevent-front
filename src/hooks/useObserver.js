import {useEffect, useRef} from "react";

export const useObserver = (ref, canLoad, isLoading, length, allEvents, callback) => {
    const observer = useRef();

    useEffect(() => {
        if(isLoading) return;
        if(observer.current) observer.current.disconnect();
        if(ref.current !== undefined){
            const cb = function(entries) {
                if (entries[0].isIntersecting && canLoad) {
                    callback()
                }
            };
            if(length > 0){
                observer.current = new IntersectionObserver(cb);
                observer.current.observe(ref.current)
            }
        }// eslint-disable-next-line
    }, [isLoading, ref, allEvents])
}