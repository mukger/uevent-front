import { useEffect, useRef } from "react";
import classes from './EventList.module.css';
import PostService from "../../API/PostService";
import { useFetching } from "../../hooks/useFetching";
import { useObserver } from "../../hooks/useObserver";
import Event from "../../components/Events/Event";

import { useDispatch, useSelector } from "react-redux";
import { changeCategoryEvents, changePageEvents, futureEvents } from "../../store/filterReducer";
import CategoryChoose from "../../components/category/Category";

import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import MyLoader from "../../components/UI/MyLoader2";

const LIMIT = 6;
let isInit = false;

const EventList = () => {

    const allEvents = useSelector(state => state.filterData);
    const acc = useSelector(state => state.acc);
    const router = useNavigate();
    const dispatch = useDispatch();
    const lastElement = useRef();
    const [fetchAllEvents, loader, eventError] = useFetching(async (page = 1, category = allEvents.category, theme = allEvents.theme, isCategory = false, future = allEvents.future) => {
        if(page === 1){
            window.scrollTo(0, 0);   
        }
        const response = await PostService.getEvents(localStorage.getItem('access'), {page: page, format: category !== null ? category : allEvents.category, search: allEvents.filter, theme: theme !== null ? theme : allEvents.theme, future: !future ? '': 1});
        
        
        const totalCount = response.headers['x-total-count'] ?? 100;
        if(page === 1){
            if(!isCategory){
                dispatch(changePageEvents({totalPages: Math.ceil(totalCount / LIMIT), page: page, data: response.data}));
                dispatch(changeCategoryEvents({totalPages: Math.ceil(totalCount / LIMIT), category: '', theme: '', data:response.data}));
            }
            if(isCategory === 1){
                dispatch(changeCategoryEvents({totalPages: Math.ceil(totalCount / LIMIT), category: category, theme: theme, data:response.data}));
            }
            else if(isCategory === 2){
                
                dispatch(futureEvents({totalPages: Math.ceil(totalCount / LIMIT), future: future, data:response.data}))
            }
        }
        else {
            if(!isCategory){
                dispatch(changePageEvents({totalPages: Math.ceil(totalCount / LIMIT), page: page, data: [...allEvents.result , ...response.data]}));
            }
            if(isCategory === 1){
                dispatch(changeCategoryEvents({totalPages: Math.ceil(totalCount / LIMIT), category: category, theme: theme, data:response.data}));
            }

        }
       
       
        if(!isInit) {isInit = true};
    })

    useEffect(() =>{
        isInit = false;
        fetchAllEvents(1, '', '', false);//eslint-disable-next-line
    }, []);

    useObserver(lastElement, allEvents.page < allEvents.totalPages, loader, allEvents.result.length, allEvents, () => {
        if(isInit){
            fetchAllEvents(allEvents.page + 1);
        }
    })
    useEffect(() =>{
        if(eventError){
            setTimeout(()=>{router('/error')}, 10);
        }
    }, [eventError, router]);

    return (
        <div className={classes.eventList}>
            <div className={classes.linkEvent}>
                {acc.auth ?
                        <>
                            <Link to='/create/events'>Create your own event</Link>
                        </>
                    :
                    <Link to='/login'>Create your own event</Link>
                }
            </div>
            {!loader ?
                <p className={classes["events-title"]}>{ 
                    allEvents.result.length > 0 ? 'Events' : 'There are currently no events to subscribe to:('}
                </p> :<></>
            }
                <>
                    <div className={classes["main-container"]}>
                        
                        <CategoryChoose fetchAllEvents={fetchAllEvents} currentFuture={allEvents.future} currentCategory={allEvents.category} currentTheme={allEvents.theme} isInit={isInit}/>
                        {allEvents.result.length > 0 ?
                            <ul>
                                <div className={classes["events-container"]}>
                                    {allEvents.result.map(event => <Event event={event} key={event.event_id} />)}
                                </div>
                                {loader 
                                    ? 
                                        <>
                                            <div className={classes["loader-container"]}>
                                                <MyLoader />
                                            </div>
                                        
                                        </>
                                    :<></>
                                    
                                }
                            </ul>:<></>
                        }
                    </div>          
                    <div ref={lastElement} />
                </>
        </div>
    );
}

export default EventList;