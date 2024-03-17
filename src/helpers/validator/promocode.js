export default function promocodeValidator(e, setPromocode, setErrorText, curTimeoutID){
    if(/^[a-zA-Z0-9]+$/u.test(e.value)) {
        console.log(e.value);
        setPromocode(e.value);
    }
    else{
        clearTimeout(curTimeoutID.current);
        e.style.outline = '1px red solid';
        setTimeout(()=>{ e.style.outline = 'none';}, 1000);
    }
}