export default function emailValidator(e, company, setCompany, setErrorText, curTimeoutID){
    if(!e.value.match(/[^a-z_\-.@0-9]/)) {
        setCompany({...company, cemail: e.value})
    }
    else{
        clearTimeout(curTimeoutID.current);
        e.style.outline = '1px red solid';
        setErrorText("Allowed characters for email input: a-z, 0-9, _, -, .");
        const id = setTimeout(()=>{setErrorText('')}, 2000);
        curTimeoutID.current = id;
        setTimeout(()=>{ e.style.outline = 'none';}, 1000);
    }
}