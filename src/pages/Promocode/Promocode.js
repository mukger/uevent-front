import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import classes from './Promocode.module.css';

import MyInput from "../../components/UI/MyInput";
import MyButton from "../../components/UI/MyButton";

import PostService from "../../API/PostService";
import OnePromocode from "../../components/Promocode/UsedPromocode";

import { useFetching } from "../../hooks/useFetching";
import MyLoader from "../../components/UI/MyLoader";

const Promocode = () => {
    const [promocodes, setPromocodes] = useState([]);
    const [promocode, setPromocode] = useState('');

    const [errorText, setErrorText] = useState('');

    const curTimeoutID = useRef(false);

    const router = useNavigate();

    const [fetchPromocodes, isPromocodesLoading, promocodeError] = useFetching(async () => {
        const response = await PostService.getAllPromocodesByUser(localStorage.getItem('access'));
        setPromocodes(response.data);
    });

    const [fetchActivatePromocode, isLoading, error] = useFetching(async()=>{
        await PostService.activatePromocode(localStorage.getItem('access'), { promocode: promocode });
        setPromocode('');
        fetchPromocodes();
        setTimeout(()=>{router('/promocode')}, 2000);
    });

    useEffect(() =>{
        if(error){
            if(error.data.message === 'You have entered incorrect promocode'){
                setErrorText('You have entered incorrect promocode');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                curTimeoutID.current = id;
            }
            else if(error.data.message === 'You already used this promocode'){
                setErrorText('You already used this promocode');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                curTimeoutID.current = id;
            }
            else{ setTimeout(()=>{router('/error')}, 10) }  
        }
    }, [error, router]);
    //localStorage.getItem('access')

    useEffect(() =>{

        if(promocodeError){
            setTimeout(()=>{router('/error')}, 10);
        }
    }, [promocodeError, router]);

    useEffect(()=>{
        fetchPromocodes();//eslint-disable-next-line
    }, []);

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(promocode.length >= 1) {
            fetchActivatePromocode();
        }
    }

    const handleChangePromocode = (e) => {
        setPromocode(e.value);
    };
    if(isLoading || isPromocodesLoading){
        return(
            <div className={classes["promocode"]}>
                <form className={classes['main-container']} onSubmit={handleSubmit} >
                    <p className={classes.header}>PROMOCODE</p>
                    <p className={classes.loadingText}>Data is being loading. Wait...</p>
                    <div className={classes.loader}>
                        <MyLoader />
                    </div>
                </form>
            </div>
        );
    }
    else{
        return (
            <div className={classes.promocode}>
                <form className={classes['main-container']} onSubmit={handleSubmit}>
                    <p className={classes.header}>PROMOCODE</p>
                    <label htmlFor="promocode">Enter the name of the promocode you want to enter.</label>
                    <MyInput 
                        id="promocode"
                        value={promocode} 
                        type="text"
                        placeholder="Enter promocode..." 
                        onChange={e => handleChangePromocode(e.target)}
                    />
                     {errorText && <p className={classes["error"]} >{errorText}</p>}
                    <MyButton>Activate</MyButton>
                </form>
                <div className={classes["promocodes-container"]}>
                    {promocodes.length > 0 ?
                        <p className={classes["title-promocodes"]}>Activated promocodes</p>
                        :<></>
                    }
                    <ul>
                        {promocodes.map(promocode => <OnePromocode promocode={promocode} key={promocode.promocode_id} />)}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Promocode;

//