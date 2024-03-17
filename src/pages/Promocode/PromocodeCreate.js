import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import promocodeValidator from "../../helpers/validator/promocode";
import classes from './PromocodeCreate.module.css';
import SelectTime from "../../components/Time/SelectTime";
import MyInput from "../../components/UI/MyInput";
import MyButton from "../../components/UI/MyButton";
import Checkbox from '../../components/UI/MyCheckbox';

import getFormatedDate from "../../helpers/getFormatedDate";

import PostService from "../../API/PostService";
import OnePromocode from "../../components/Promocode/CreatedPromocode";

import { useFetching } from "../../hooks/useFetching";
import Modal from "../../components/Modal/Modal";
import MyLoader from "../../components/UI/MyLoader";

import Select from 'react-select';

const PromocodeCreate = () => {

    const [promocodes, setPromocodes] = useState([]);
    const [promocode, setPromocode] = useState('');
    const [discount, setDiscount] = useState(1);

    const [modalActive, setModalActive] = useState(false);

    const [errorText, setErrorText] = useState('');
    const curTimeoutID = useRef(false);

    const router = useNavigate();

    const [date, setDate] = useState({year: new Date(new Date().setDate(new Date().getDate() + 3)).getFullYear(), month: new Date(new Date().setDate(new Date().getDate() + 3)).getMonth(), date: new Date(new Date().setDate(new Date().getDate() + 3)).getDay(), hours: new Date(new Date().setDate(new Date().getDate() + 3)).getHours(), minutes: new Date(new Date().setDate(new Date().getDate() + 3)).getMinutes()});
    const [extendDate, setExtendDate] = useState({year: new Date(new Date().setDate(new Date().getDate() + 3)).getFullYear(), month: new Date(new Date().setDate(new Date().getDate() + 3)).getMonth(), date: new Date(new Date().setDate(new Date().getDate() + 3)).getDay(), hours: new Date(new Date().setDate(new Date().getDate() + 3)).getHours(), minutes: new Date(new Date().setDate(new Date().getDate() + 3)).getMinutes()});
    
    const [isDatePicked, setIsDatePicked] = useState(false);
    const [isExtendDatePicked, setIsExtendDatePicked] = useState(false);

    const [extendingPromocode, setExtendingPromocode] = useState({promocode_id: '', promocode: ''});

    const[isCheckGenerated, setIsCheckGenerated] = useState(true);
    const[isCheckEnter, setIsCheckEnter] = useState(false);

    const [isEvent, setIsEvent] = useState(false);
    const [event, setEvent] = useState({});
    const [events, setEvents] = useState([]);
    const [fetchPromocodes, isPromocodesLoading, promocodeError] = useFetching(async () => {
        const response = await PostService.getAllPromocodesByCompany(localStorage.getItem('access'));
        setPromocodes(response.data);
        fetchGetEvents();
    });
    const [fetchGetEvents, isLoadingEvents, errorEvents] = useFetching(async()=>{
        const res = await PostService.getEventsYourself(localStorage.getItem('access'));
        console.log(res);
        setEvents(res.data);
        setEvent({value: res.data[0].event_id, label: res.data[0].event_name});
    });

    const [fetchCreatePromocode, isLoading, error] = useFetching(async()=>{
        await PostService.createPromocode(localStorage.getItem('access'), 
            { promocode: (isCheckEnter)?(promocode):(undefined), discount: discount, expiration_date: getFormatedDate(date) }, isEvent ? event.value: '')
        setPromocode('');
        setDiscount(1);
        setDate({year: new Date(new Date().setDate(new Date().getDate() + 3)).getFullYear(), month: new Date(new Date().setDate(new Date().getDate() + 3)).getMonth(), date: new Date(new Date().setDate(new Date().getDate() + 3)).getDay(), hours: new Date(new Date().setDate(new Date().getDate() + 3)).getHours(), minutes: new Date(new Date().setDate(new Date().getDate() + 3)).getMinutes()});
        setIsDatePicked(false);
        setTimeout(()=>{router('/create/promocode')}, 50);
        fetchPromocodes();
    });

    const [fetchExtendPromocode, isExtendLoading, extendError] = useFetching(async () => {
        await PostService.extendingPromocodeExpirationDate(localStorage.getItem('access'), {expiration_date: getFormatedDate(extendDate)}, extendingPromocode.promocode_id);
        setModalActive(false);
        fetchPromocodes();
    });

    const [fetchDeletePromocode, isDeleteLoading, deleteError] = useFetching(async (promocodeId) => {
        await PostService.deletePromocodeById(localStorage.getItem('access'), promocodeId);
        fetchPromocodes();
    });

    const extendPromocodeFunction = (promocodeId, promocode) => {
        setModalActive(true);
        setExtendingPromocode({promocode_id: promocodeId, promocode: promocode});
    }

    const extendingPromocodeExpDate = async () => {
        if(!isExtendDatePicked){
            setErrorText('You must choose expiration date of the promocode');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
        }
        else {
            fetchExtendPromocode();
        }
    }

    const deletePromocodeFunction = (promocodeId) => {
        fetchDeletePromocode(promocodeId);
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(!isDatePicked){
            setErrorText('You must choose expiration date of the promocode');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
        }
        else if(new Date(date.year, date.month, date.date, date.hours, date.minutes).getTime() - new Date().getTime() <= 0){
            setErrorText('You cannot set expiration date of the promocode in past');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
        }
        else if ((!/(([a-zA-Z].*\d)|(\d.*[a-zA-Z]))/.test(promocode) || promocode.length < 8 || promocode.length > 12) && isCheckEnter) {
            setErrorText('You have enter a wrong format promocode, use only a-z, A-Z and 0-9 combination with a length of 8 and more characters (less than 12)');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
        }
        else if(isEvent && !event.value){
            setErrorText('You didn`t select any event');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
        }
        else {
            fetchCreatePromocode();
        }
    }

    const handleChangeDiscount = (e) => {
        if(e.value < 1) {
            setDiscount(1);
        }
        else if(e.value > 100) {
            setDiscount(100);
        }
        else {
            setDiscount(e.value);
        }
    };

    useEffect(() =>{

        if(promocodeError){
            setTimeout(()=>{router('/error')}, 10);
        }
    }, [promocodeError, router]);

    useEffect(() =>{
        if(!modalActive) {
            setExtendingPromocode({promocode_id: '', promocode: ''})
            setExtendDate({year: new Date(new Date().setDate(new Date().getDate() + 3)).getFullYear(), month: new Date(new Date().setDate(new Date().getDate() + 3)).getMonth(), date: new Date(new Date().setDate(new Date().getDate() + 3)).getDay(), hours: new Date(new Date().setDate(new Date().getDate() + 3)).getHours(), minutes: new Date(new Date().setDate(new Date().getDate() + 3)).getMinutes()})
            setIsExtendDatePicked(false);
            setTimeout(()=>{router('/create/promocode')}, 50);
        }
    }, [modalActive, router])

    useEffect(() => {
        if(error){
            if(error.data.message === 'This promocode is already busy by someone, please enter another promocode'){
                setErrorText('This promocode is already busy by someone, please enter another promocode');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                curTimeoutID.current = id;
            }
            else{ setTimeout(()=>{router('/error')}, 10) }  
        }
    }, [error, router]);
    useEffect(()=>{
        if(extendError || deleteError || errorEvents){
            setTimeout(()=>{router('/error')}, 10)
        }
    }, [extendError, deleteError, router, errorEvents])
    useEffect(()=>{
        fetchPromocodes();//eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(isCheckEnter) {
            setIsCheckGenerated(false);
        }
    }, [isCheckEnter])

    useEffect(() => {
        if(isCheckGenerated) {
            setIsCheckEnter(false);
        }
    }, [isCheckGenerated])
    if(isExtendLoading || isDeleteLoading || isLoading || isPromocodesLoading || isLoadingEvents){
        return(
            <div className={classes["promocode-create"]}>
                <form className={classes['main-container']} onSubmit={handleSubmit} >
                    <p className={classes.header}>CREATE PROMOCODE</p>
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
            <div className={classes["promocode-create"]}>
                <form className={classes['main-container']} onSubmit={handleSubmit} >
                    <h2 className={classes["header"]}>CREATE PROMOCODE</h2>
                    <Checkbox label="Automatically generate a name" isChecked={isCheckGenerated} setIsChecked={() =>{ setIsCheckGenerated((isCheckEnter)?(!isCheckGenerated):(isCheckGenerated))}}/>
                    <Checkbox label="Enter the name yourself" isChecked={isCheckEnter} setIsChecked={() => { setIsCheckEnter((isCheckGenerated)?(!isCheckEnter):(isCheckEnter))}}/>
                    {isCheckEnter &&
                        <>
                            <label htmlFor="promocode" className={classes["promocode-title"]}>Promocode:</label>
                            <MyInput 
                                id="promocode"
                                value={promocode}
                                type="text"
                                placeholder="Enter promocode..." 
                                onChange={e => promocodeValidator(e.target, setPromocode, isCheckEnter, setErrorText, curTimeoutID)}
                            />
                        </>
                    }
                    <p className={classes["title-type"]} >{isEvent ? 'Event promocode':'Company promocode'}</p>
                    <Checkbox label="Use promocode only for one event" isChecked={isEvent} setIsChecked={() => { setIsEvent(isEvent => !isEvent)}}/>
                    {isEvent ?
                        <div className={classes["select-container"]}>
                            <Select 
                                className='select-create' 
                                id='theme'
                                name="theme" 
                                value={{value: event.value, label: event.label}}
                                options={events.map((value)=> {return {value: value.event_id, label: value.event_name}})}
                                onChange={(e)=> {setEvent({value: e.value, label: e.label})}}
                                theme={theme => ({
                                    ...theme,
                                    colors: {
                                        primary: 'green',
                                        primary25: 'rgba(0, 0, 0, 0.2)',
                                        neutral0: '#FFFFFF',
                                        neutral10: 'rgba(0, 0, 0, 0.2)',
                                        neutral20: 'rgba(0, 0, 0, 0.5)',
                                        neutral30: 'rgba(0, 0, 0, 0.3)',
                                        neutral40: 'rgb(0, 125, 0)',
                                        neutral50: 'rgba(0, 0, 0, 0.7)',
                                        neutral80: 'green',
                                        danger: 'red',
                                        dangerLight: 'rgba(255, 0, 0, 0.2)',
                                    }
                                    
                                })}
                            />
                        </div>
                        :<></>

                    }
                    <label htmlFor="discount" className={classes["discount-title"]}>Discount(%):</label>
                    <MyInput 
                        id="discount"
                        value={discount}
                        type="number"
                        placeholder="Enter discount(%)..." 
                        onChange={e => handleChangeDiscount(e.target)}
                    />
                    <SelectTime startDate={date} setStartDate={setDate} minDate={new Date().setDate(new Date().getDate() + 3)} isDatePicked={isDatePicked} setIsDatePicked={setIsDatePicked}  id='promocode-date'/>
                    {errorText && <p className={classes["error"]} >{errorText}</p>}
                    <MyButton>Button</MyButton>
                </form>
                {promocodes.length > 0 ?
                    <p className={classes["title-promocode"]}>Existing your promocodes</p>
                    :<></>
                }
                {promocodes.length > 0 ?
                    <ul>
                        {promocodes.map(promocode => <OnePromocode promocode={promocode} key={promocode.promocode_id} deletePromocodeFunction={deletePromocodeFunction} extendPromocodeFunction={extendPromocodeFunction}/>)}
                    </ul>
                    :<></>
                }
               
                <Modal modalActive={modalActive} setModalActive={setModalActive}>
                    <div className={classes["modal-extending"]}>
                        <p className={classes["header"]} >EXPIRING</p>
                        <p className={classes['promocode-name']} title="Name of promocode">{extendingPromocode.promocode}</p>
                        <p className={classes["content-text"]}>If you want to extend the validity of this promo code, enter the time when it will expire next time:</p>
                        <SelectTime startDate={extendDate} setStartDate={setExtendDate} minDate={new Date().setDate(new Date().getDate() + 3)} isDatePicked={isExtendDatePicked} setIsDatePicked={setIsExtendDatePicked}  id='promocode-extend-date'/>
                        {errorText && <p className={classes["error"]} >{errorText}</p>}
                        <MyButton onClick={()=>extendingPromocodeExpDate()}>Confirm</MyButton>
                    </div>
                </Modal>
                
            </div>

            
        );
    }
}

export default PromocodeCreate;