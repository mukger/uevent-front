import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import PostService from "../../API/PostService";

import { useFetching } from "../../hooks/useFetching";
import classes from './EventPage.module.css';

import PayData from "../../components/PayModale/PayData.js";
import MyButton from "../../components/UI/MyButton";
import jwt_decode from "jwt-decode";

import config from '../../helpers/config.json';
import { Link } from "react-router-dom";
import { parseDate } from "../../helpers/parseDate";

import MyLoader2 from "../../components/UI/MyLoader2";
import SimilarEvents from "../../components/SimilarEvents/SimilarEvents";
import Comments from "../../components/Comments/Comments";
import MapContainer from "../../components/Navigations/MapContainer";


const server = config.server_url;

/*



*/

const EventPage = () => {
    const [event, setEvent] = useState()
    const [modalActive, setModalActive] = useState(false);
    const [isComments, setIsComments] = useState(true);
    const [users, setUsers] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [promocode_id, setPromocode_id] = useState('');
    const router = useNavigate();
    const [fetchEventVisitors, isEventVisitorsLoading, eventVisitorsError] = useFetching(async(id)=>{ 
        const res = await PostService.getEventVisitors(localStorage.getItem('access'), id);
        setUsers(res.data);
    })
    const [fetchEvent, isEventLoading, eventError] =useFetching(async(id)=>{
        const response = await PostService.getEventByID(localStorage.getItem('access'), id);
        setEvent(response.data);
        window.scrollTo(0, 0);
        if(localStorage.getItem('access') && localStorage.getItem('access').length > 2 && jwt_decode(localStorage.getItem('access')).id !== response.data.user_id){
            fetchGetSubscribeEvent(response.data.event_id);
            if(response.data.ticket_count > 0 && (new Date(response.data.execution_date).getTime() + 2 * 60 * 60 * 1000) - new Date().getTime() > 0){
                const res = await PostService.getAllPromocodesByEvent(localStorage.getItem('access'), response.data.event_id);
                setDiscount(res.data.discount);
                setPromocode_id(res.data.promocode_id);
            }
            
        }
        if(response.data.show_subscribers === 1){
            fetchEventVisitors(response.data.event_id);
        }
        


    })

    const [fetchGetSubscribeEvent, isEventGetSubscribeLoading, eventGetSubscribeError] =useFetching(async(id)=>{
        const response = await PostService.getSubscribeFromEvent(localStorage.getItem('access'), id);
        if(response.data.user_id){
            setIsSubscribed(true);
        }
        else{
            setIsSubscribed(false);
        }
    })
    const [fetchSubscribeEvent, isEventSubscribeLoading, eventSubscribeError] = useFetching(async()=>{
        if(isSubscribed){
            await PostService.unsubscribeFromEvent(localStorage.getItem('access'), window.location.pathname.slice(window.location.pathname.indexOf('event/') + 6));
        }
        else {
            await PostService.subscribeToEvent(localStorage.getItem('access'), window.location.pathname.slice(window.location.pathname.indexOf('event/') + 6));
        }
        
        setIsSubscribed(isSubscribed => !isSubscribed);
        window.scrollTo(0, 0);
    })
    useEffect(()=>{
        fetchEvent(window.location.pathname.slice(window.location.pathname.indexOf('event/') + 6));//eslint-disable-next-line
    }, []);
    useEffect(() =>{
        if(eventError || eventVisitorsError || eventSubscribeError || eventGetSubscribeError){
            setTimeout(()=>{router('/error')}, 10);
        }
    }, [eventError, eventVisitorsError, router, eventSubscribeError, eventGetSubscribeError]);
    
    const handleButton = useCallback(() =>{
        setModalActive(true);
    },[]);
    const handleSubscribe = () =>{
        fetchSubscribeEvent();
    };

    if(isEventLoading || isEventVisitorsLoading || isEventSubscribeLoading || isEventGetSubscribeLoading){
        return (
            <div className={classes["loader-component"]}>
                <p>Wait, information is being loaded...</p>
                <div>
                    <MyLoader2 />
                </div>
            </div>
        )
    }
    else{
        return (
            <div className={classes.eventPage}>
                {event &&
                    <>
                        <div className={["page-up-side"]} >
                            <div className={classes["page-up-image"]} style={{backgroundImage: `url(${server}${event.picture})`}}></div>
                            <div className={classes["page-up-gradient"]}></div>
                            <div className={classes["page-up-content"]}>
                                <p className={[classes["subtitle"]]}>
                                    <span className={classes["page-up-date"]} title="Date of event">{parseDate(event.execution_date)}</span> 
                                    <span className={classes["page-up-cname"]} title="Company name"><Link to={`/company/info/${event.company_id}`} title="Company name">{event.cname}</Link></span>   
                                </p>
                                <h1>{event.event_name}</h1>
                                
                            </div>
                        </div>
                        <div className={classes["main-content"]}>
                        <div className={classes["main-cname"]}><Link to={`/company/info/${event.company_id}`} title="Company name">{event.cname}</Link></div>
                            <div className={classes["main-event"]} title="Name of event"><p>{event.event_name}</p></div>
                            <div className={classes["content-container"]}>
                                <div className={classes["main-edescription"]}>
                                    <p className={classes["title-desc"]}>DESCRIPTION</p>
                                    <p className={classes["content-desc"]} title="Description">{event.edescription}</p>
                                </div>
                                <div className={classes["right-container"]}>
                                    <div className={classes["main-category-container"]}>
                                        <div className={classes["main-format"]}>
                                            <p>format:</p>
                                            <p title="format" >{event.format}</p>
                                        </div>
                                        <div className={classes["main-theme"]}>
                                            <p className="title">theme:</p>
                                            <p title="theme" >{event.theme}</p>
                                        </div>
                                        
                                       
                                    </div>
                                    
                                    <div className={classes.mapContainer}>
                                        <p className={classes["name-place"]} title="name of place">{event.name_place}</p>
                                        <div className={classes["map"]}>
                                            <MapContainer isChangable={false} center={{lat: event.latitude, lng: event.longitude}} setCenter={()=>{}}/>
                                        </div>
                                        {(new Date(event.execution_date).getTime() + 2 * 60 * 60 * 1000) - new Date().getTime() > 0
                                            ?
                                            <div className={classes["main-execution-date"]}><p title="date of event">{parseDate(event.execution_date)}</p></div> 
                                            :
                                            <div className={classes["main-execution-no-date"]}><i className="fa fa-check" aria-hidden="true" title="event happened"></i></div>
                                        }
                                    </div>
                                    <div className={classes["main-ticket-price"]}>
                                        <p title="price">{event.ticket_price} UAH</p>
                                    </div>
                                    {event.ticket_count > 0
                                        ?
                                        <div className={classes["main-ticket-container"]}>
                                            <p className={classes["main-ticket-count"]} title="remains" >{event.ticket_count}</p>
                                            <p>/</p>
                                            <p title="total" className={classes["main-ticket-limit"]}>{event.ticket_limit}</p>
                                        </div>
                                        :
                                        <div className={classes["main-ticket-container"]}>
                                            <p className={classes["main-no-tickets"]}>No available tickets</p>
                                        </div>
                                    }
                                </div>
                            </div>
                            {users.length !== 0 ?
                                <div className={classes["users-container"]}>
                                    <p className={classes["user-title"]}>Visitors</p>
                                    <div className={classes["users"]}>{users.map((user)=> 
                                        <div className={classes["one-user"]} key={user.user_id + user.purchase_date}>
                                            <img src={`${server}${user.avatar}`} alt="text"/>
                                            <div className={classes["text-container"]}>
                                                <p className={classes["login"]} title="login">{user.login}</p>
                                                <p className={classes["purchase-date"]} title="time of purchase">{parseDate(user.purchase_date)}</p>
                                            </div>
                                        </div>)}
                                    </div>
                                </div>
                                :<></>
                            }
                        </div>
                        {localStorage.getItem('access').length > 2 ?
                            <>
                                {event.user_id === jwt_decode(localStorage.getItem('access')).id ?
                                    <>
                                    {(new Date(event.execution_date).getTime() + 2 * 60 * 60 * 1000) - new Date().getTime() > 0 ?  
                                        <div className={classes["change-event"]}>
                                            <p>Change this event:</p>
                                            <Link to={`/create/events/${event.event_id}`}><i className="fa fa-pencil-square" aria-hidden="true"></i></Link>
                                        </div>
                                        :<></>
                                    }
                                    </>
                                    
                                    :
                                    <div className={classes["buttons-container"]}>  
                                        {(new Date(event.execution_date).getTime() + 2 * 60 * 60 * 1000) - new Date().getTime() > 0 ?
                                            <div className={classes["button-subscribe-container"]}><MyButton onClick={handleSubscribe}>{isSubscribed ? 'Unsubscribe from notifications' :'Subscribe to notifications'}</MyButton></div> : <></>
                                        }
                                        {(event.ticket_count > 0 && (new Date(event.execution_date).getTime() + 2 * 60 * 60 * 1000) - new Date().getTime() > 0)
                                            ? 
                                            <div className={classes["buy-container"]}>
                                                <MyButton onClick={handleButton}>Buy ticket</MyButton>
                                                <PayData 
                                                    event_id={event.event_id} 
                                                    price={event.ticket_price} 
                                                    company_account={event.company_account} 
                                                    discount={discount}
                                                    promocode_id={promocode_id}
                                                    modalActive={modalActive} 
                                                    setModalActive={setModalActive}
                                                />
                                            </div> : <></>
                                        }
                                    </div>
                                }
                            </>
                            :
                            <div className={classes["no-acc"]}>
                                <Link to="/login">If you want to buy a ticket, you must log in</Link>
                            </div>
                        }
                        <div className={classes["publication-date"]}><p><span>Publication time:</span> {parseDate(event.publication_date)}</p></div>     
                        <button className={classes['hide-button']} onClick={()=>{setIsComments(isComments =>!isComments)}}>{isComments ? 'Hide comments to this event' : 'Show comments to this event'}</button>
                        {isComments ?
                            <Comments type={1} id={event.event_id}/>
                            :<></>
                        }
                        
                        <SimilarEvents id={event.event_id} format={event.format} theme={event.theme} handleChangeId={fetchEvent} type={1}/>
                    </>
                    
                }
            </div>
        );
    }
}

export default EventPage;