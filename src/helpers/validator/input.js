export default function inputValidator(e, company, setCompany, setErrorText, curTimeoutID, errorText, maxLength, field){
    if(e.value.length > maxLength){
        clearTimeout(curTimeoutID.current);
        e.style.outline = '1px red solid';
        setErrorText(`The maximum length of your ${errorText} is ${maxLength} characters`);
        const id = setTimeout(()=>{setErrorText('')}, 2000);
        curTimeoutID.current = id;
        setTimeout(()=>{ e.style.outline = 'none';}, 1000);
    }
    else if(!e.value.match(/[/\\]/)) {
        
        setCompany({...company, [field]: e.value})

    }
    else{
        clearTimeout(curTimeoutID.current);
        e.style.outline = '1px red solid';
        setErrorText(`You cannot enter these characters: / \\ for your ${errorText}`);
        const id = setTimeout(()=>{setErrorText('')}, 2000);
        curTimeoutID.current = id;
        setTimeout(()=>{ e.style.outline = 'none'}, 1000);
    }
}