import checkEmail from "../checkEmail";
export default function companyValidator(company, setErrorText, curTimeoutID){
    if(company.cname.length < 4){
        setErrorText('Enter a name of your company with more than 4 characters');
        const id = setTimeout(()=>{setErrorText('')}, 2000);
        curTimeoutID.current = id;
        return false;
    }
    else if(!checkEmail(company.cemail)){
        setErrorText('Enter an existing email address');
        const id = setTimeout(()=>{setErrorText('')}, 2000);
        curTimeoutID.current = id;
        return false;
    }
    else if(company.company_account.length < 4){
        setErrorText('Enter an account');
        const id = setTimeout(()=>{setErrorText('')}, 2000);
        curTimeoutID.current = id;
        return false;
    }
    else if(company.name_place.length <= 0){
        setErrorText('Enter name of your place');
        const id = setTimeout(()=>{setErrorText('')}, 2000);
        curTimeoutID.current = id;
        return false;
    }
    else{
        return true;
    }
}