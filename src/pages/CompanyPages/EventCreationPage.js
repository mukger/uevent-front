
import classes from './EventCreationPage.module.css';

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Select from 'react-select';

import PostService from "../../API/PostService";
import MyInput from "../../components/UI/MyInput";
import { useFetching } from "../../hooks/useFetching";
import {getBrowserLocation} from '../../utils/geo.js';

import MyButton from "../../components/UI/MyButton";
import SelectTime from "../../components/Time/SelectTime";
import getFormatedDate from "../../helpers/getFormatedDate";

import jwt_decode from "jwt-decode";
import ChangePicture from '../../components/ChangePicture/ChangePicture';
import DeleteContainer from '../../components/DeleteContainer/DeleteContainer';

import inputValidator from '../../helpers/validator/input';
import digitInputValidator from '../../helpers/validator/digitInput';
import Checkbox from '../../components/UI/MyCheckbox';
import eventValidator from '../../helpers/validator/resultEventValidator';


import MyLoader from '../../components/UI/MyLoader';
import { Link } from 'react-router-dom';

import MapContainer from "../../components/Navigations/MapContainer";
/*


*/
const formatArr= ['conference', 'lecture', 'workshop', 'fest', 'contest', 'concert'];
const themeArr= ['business', 'politic', 'psychology', 'sport', 'religion'];
const EventCreationPage = () => {
    const router = useNavigate();
    const [event_id, setEventId] = useState(null);
    const [event, setEvent] = useState({event_name: '', edescription:'', format:formatArr[0], theme:themeArr[0], ticket_price: '', ticket_count: '', ticket_limit: '', name_place:'', show_subscribers: false, notify_subscription: false});
    const [center, setCenter] = useState({ lat: -6.7451231,lng: -38.5231231});
    const [isPatch, setIsPatch] = useState(0);
    const [date, setDate] = useState({year: new Date().getFullYear(), month: new Date().getMonth(), date: new Date().getDay(), hours: new Date().getHours(), minutes: new Date().getMinutes()});
    const [isDatePicked, setIsDatePicked] = useState(false);
    const [publicationDate, setPublicationDate] = useState({year: new Date().getFullYear(), month: new Date().getMonth(), date: new Date().getDay(), hours: new Date().getHours(), minutes: new Date().getMinutes()});
    const [isPublicationDatePicked, setIsPublicationDatePicked] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [successRes, setSuccessRes] = useState(false);

    const[isPublicationDate, setIsPublicationDate] = useState(false);
    const [errorText, setErrorText] = useState('');
    const curTimeoutID = useRef(false);
    const [fetchGetEventInfo, isEventInfoLoading, erroGetEventInfo] = useFetching(async (id) => {

        const res = await PostService.getEventByID(localStorage.getItem('access'), id);
        if(jwt_decode(localStorage.getItem('access')).id !== res.data.user_id){
            router('/create/events');
        } 
        else{
            setIsPatch(1);
            console.log(res);
            setEvent({
                event_name: res.data.event_name, 
                edescription: res.data.edescription, 
                notify_subscription: res.data.notify_subscription,
                show_subscribers: res.data.show_subscribers,
                format: res.data.format, 
                theme: res.data.theme, 
                ticket_price: res.data.ticket_price, 
                name_place: res.data.name_place,
                picture: res.data.picture
            })
            setEventId(res.data.event_id);
            setCenter({lat: res.data.latitude, lng: res.data.longitude})
        }
    })

    const [fetchGetCompany, isCompanyLoading, erroGetInfo] = useFetching(async () => {
        const res = await PostService.getCompanyByUserId(localStorage.getItem('access'));    
        console.log(res.data);
        if(!res.data.company_id){
            router(`/create/company`);
        }
        if(window.location.pathname.length - '/create/events/'.length > 0){
            fetchGetEventInfo(window.location.pathname.slice('/create/events/'.length));
        }
        else{
            getBrowserLocation().then((curLoc) => {
                setCenter(curLoc)
            })
            .catch((defaultLocation)=>{
                setCenter(defaultLocation);
            })
        }
    })

    const [fetchCreateEvent, isLoading, error] = useFetching(async()=>{
        if(isPatch === 1){
            
            await PostService.changeEvent(localStorage.getItem('access'), {
                event_name: event.event_name,
                edescription: event.edescription,
                notify_subscription: +event.notify_subscription,
                show_subscribers: +event.show_subscribers,
                format: event.format,
                theme: event.theme,
                ticket_count: event.ticket_limit,
                ticket_limit: event.ticket_limit,
                ticket_price: event.ticket_price, 
                name_place: event.name_place,
                latitude: center.lat,
                longitude: center.lng,
            }, event_id)
        }
        else{
            await PostService.createEvent(localStorage.getItem('access'), {
                event_name: event.event_name,
                edescription: event.edescription,
                execution_date: getFormatedDate(date),
                publication_date: isPublicationDate ? getFormatedDate(publicationDate): '',
                notify_subscription: +event.notify_subscription,
                show_subscribers: +event.show_subscribers,
                format: event.format.toLowerCase(),
                theme: event.theme.toLowerCase(),
                ticket_count: event.ticket_limit,
                ticket_limit: event.ticket_limit,
                ticket_price: event.ticket_price,
                name_place: event.name_place,
                latitude: center.lat,
                longitude: center.lng,
            })
        }
        setSuccessRes(true);
        setTimeout(()=>{router('/events')}, 2000);
    })
    const handleSubmit = (e)=>{
        e.preventDefault();
        if(eventValidator(event, date, isDatePicked, setErrorText, curTimeoutID, isPatch, publicationDate, isPublicationDatePicked, isPublicationDate)){
            fetchCreateEvent();
        }
    }

    useEffect(()=>{
        fetchGetCompany();//eslint-disable-next-line
    }, []);

    useEffect(() =>{
        if(error || erroGetEventInfo){
            setTimeout(()=>{router('/error')}, 10);
        }
    }, [error, router, erroGetEventInfo]);

    useEffect(()=>{
        if(erroGetInfo){
            if(erroGetInfo.data.message === "This user didn't create a company"){
                setTimeout(()=>{router('/create/company')}, 10);
            }
            else{
                setTimeout(()=>{router('/error')}, 10);
            } 
        }
    }, [erroGetInfo, router]);

    if(successRes){
        return(
            <div className={classes.eventCreationPage}>
                <p className={classes.header}>EVENT CREATION</p>
                <div className={classes.resultText}>
                    <p className={classes.mainText}>Event successfully created.</p>
                    <p className={classes.secondText}>You will now be redirected to the main page.</p>
                </div> 
            </div>
        );
    }
    else if(isLoading || isCompanyLoading || isEventInfoLoading){
        return(
            <div className={classes.eventCreationPage}>
                <p className={classes.header}>EVENT CREATION</p>
                <p className={classes.loadingText}>Data is being loading. Wait...</p>
                <div className={classes.loader}>
                    <MyLoader />
                </div>
            </div>
        );
    }
    else{
        
        return (
            <div className={classes.eventCreationPage}>
                <p className={classes.header}>EVENT CREATION</p>
                {isPatch === 1 &&
                     <div className={classes["change-container"]}>
                        <MyButton type="button" onClick={() =>{setModalActive(1)}}>Change Picture</MyButton>
                    </div>
                }
               
                <form onSubmit={handleSubmit} >

                    <label htmlFor="event_name">Event name</label>
                    <MyInput 
                        id="event_name" 
                        value={event.event_name} 
                        type="text"
                        placeholder="company name" 
                        onChange={e => {inputValidator(e.target, event, setEvent, setErrorText, curTimeoutID, "event name", 25, 'event_name')}}

                    />
                    <label className={classes["textarea-label"]} htmlFor="edescription">Event description</label>
                    <textarea 
                        id="edescription" 
                        placeholder="description" 
                        value={event.edescription} 
                        type="text"
                        onChange={e => {inputValidator(e.target, event, setEvent, setErrorText, curTimeoutID, "description", 50000, 'edescription')}}
                    />
                    
                    {isPatch === 0 &&
                        <>
                            <SelectTime startDate={date} setStartDate={setDate} minDate={new Date()} isDatePicked={isDatePicked} setIsDatePicked={setIsDatePicked}  id='event-date'/>
                            <Checkbox label="Select date of publication" isChecked={isPublicationDate} setIsChecked={() =>{ setIsPublicationDate(!isPublicationDate)}}/>
                            {isPublicationDate &&
                                <SelectTime startDate={publicationDate} setStartDate={setPublicationDate} minDate={new Date()} isDatePicked={isPublicationDatePicked} setIsDatePicked={setIsPublicationDatePicked} id='publication-date'/>
                            }
                        </>
                    }
                    <Checkbox label="Show subscribers" isChecked={event.show_subscribers} setIsChecked={() =>{ setEvent({...event, show_subscribers: !event.show_subscribers})}}/>
                    <Checkbox label="Notify subscriptions" isChecked={event.notify_subscription} setIsChecked={() =>{ setEvent({...event, notify_subscription: !event.notify_subscription})}}/>
                    
                    <label className={classes["select-label"]} htmlFor='format'>format</label>
                    <div className={classes["select-container"]}>
                        <Select 
                            className='select-create' 
                            id='format'
                            name="format" 
                            value={{value: event.format, label: event.format}}
                            defaultValue={{value: event.format, label: event.format}}
                            isClearable={false}
                            isSearchable={false}
                            options={formatArr.map((value)=> {return {value: value, label: value}})}
                            onChange={(e)=>{setEvent({...event, format: e.value})}} 
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
                    <label className={classes["select-label"]} htmlFor='theme'>theme</label>
                    <div className={classes["select-container"]}>
                        <Select 
                            className='select-create' 
                            id='theme'
                            name="theme" 
                            value={{value: event.theme, label: event.theme}}
                            defaultValue={{value: event.theme, label: event.theme}}
                            isClearable={false}
                            isSearchable={false}
                            options={themeArr.map((value)=> {return {value: value, label: value}})}
                            onChange={(e)=>{setEvent({...event, theme: e.value})}} 
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
                    <div className={classes["container-ticket"]}>
                        <div>
                            <label htmlFor="ticket_price">Ticket Price</label>
                            <MyInput
                                id="ticket_price"
                                value={event.ticket_price} 
                                type="text"
                                placeholder="ticket price(UAH)" 
                                onChange={e => {digitInputValidator(e.target, event, setEvent, setErrorText, curTimeoutID, "ticket price", 8, 'ticket_price')}}
                            />
                        </div>
                        {isPatch === 0 &&
                            <div>
                                <label htmlFor="ticket_limit">Ticket LIMIT</label>
                                <MyInput 
                                    id="ticket_limit"
                                    value={event.ticket_limit} 
                                    type="text"
                                    placeholder="ticket limit" 
                                    onChange={e => {digitInputValidator(e.target, event, setEvent, setErrorText, curTimeoutID, "ticket limit", 8, 'ticket_limit')}}
                                />
                            </div>
                        }
                    </div>
                    <p className={classes["place-title"]}>Place</p>
                    <label htmlFor="name_place">place name</label>
                    <MyInput 
                        id="name_place"
                        value={event.name_place}
                        type="text"
                        placeholder="place name" 
                        onChange={e => {inputValidator(e.target, event, setEvent, setErrorText, curTimeoutID, "place name", 60, 'name_place')}}

                    />
                    <p className={classes["map-title"]}>Select place on map</p>
                    <div className={classes["map-container"]}>
                        <MapContainer isChangable={true} center={center} setCenter={setCenter}/> 
                    </div>
                    {errorText && <p className={classes["error"]} >{errorText}</p>}
                    <MyButton>Submit</MyButton>
                </form>
                {isPatch ?
                    <>
                        
                        <ChangePicture modalActive={modalActive === 1} setModalActive={setModalActive} picture={event.picture} getInfo={fetchGetEventInfo} id={event_id}/>
                        <div className={classes['promocode-link']}>
                            <Link to="/create/promocode">Create promocode to event?</Link>
                        </div>
                        <div  className={classes['delete-button-container']}>
                            <button type="button" className={classes['delete-button']} onClick={() =>{setModalActive(2)}}>Delete event</button> 
                        </div>
                        <DeleteContainer modalActive={modalActive === 2} setModalActive={setModalActive} type="event" id={event_id}/>
                    </> : <></>
                }
            </div>

        );
    }
}

export default EventCreationPage;