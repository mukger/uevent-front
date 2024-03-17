import React, {useRef, useEffect} from "react";
import classes from "./SimilarEvents.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import PostService from "../../API/PostService";
import { useFetching } from "../../hooks/useFetching";

import { useObserver } from "../../hooks/useObserver";
import { changePageEvents } from "../../store/filterReducer";
import MyLoader from "../UI/MyLoader2";
import Event from "../Events/Event";

const LIMIT = 6;

const SimilarEvents = ({id, format, theme, handleChangeId, type, isCompany}) =>{
    const allEvents = useSelector(state => state.filterData);
    const router = useNavigate();
    const dispatch = useDispatch();
    const lastElement = useRef();
    const [fetchAllEvents, loader, eventError] = useFetching(async (page = 1) => {
        if(isCompany === 1){
            const response = await PostService.getEventsByCompany(localStorage.getItem('access'), {page: page}, id);
            console.log(response);
            const totalCount = response.headers['x-total-count'] ?? 100;
            dispatch(changePageEvents({totalPages: Math.ceil(totalCount / LIMIT), page: page, data: page === 1 ? response.data : [...allEvents.result , ...response.data]}));
        }
        else{
            const response = await PostService.getEventsSimilar(localStorage.getItem('access'), {page: page, format: format, search: '', theme: theme}, id);
            const totalCount = response.headers['x-total-count'] ?? 100;
            dispatch(changePageEvents({totalPages: Math.ceil(totalCount / LIMIT), page: page, data: page === 1 ? response.data : [...allEvents.result , ...response.data]}));
        }
      
    })

    useEffect(() =>{
        fetchAllEvents(1);//eslint-disable-next-line
    }, []);
    useObserver(lastElement, allEvents.page < allEvents.totalPages, loader, allEvents.result.length, allEvents, () => {
        fetchAllEvents(allEvents.page + 1);
    })

    useEffect(() =>{
        if(eventError){
            setTimeout(()=>{router('/error')}, 10);
        }
    }, [eventError, router]);
  
    return(
        <div className={classes['similar-events-container']}>
            {allEvents.result.length > 0 ?
                <p className={classes['similar-events-title']}>{isCompany !== 1 ?  'These events are similar to the following:' : 'Events from this company:'}</p>
            :<></>
            }
            {allEvents.result.length > 0 ?
                <>
                    <div className={classes["main-container"]}>
                        <ul>
                            <div className={classes["events-container"]}>
                                {allEvents.result.map(event => <Event event={event} key={event.event_id} isSimilar={type} setId={handleChangeId}/>)}
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
                        </ul>
                    </div>          
                    <div ref={lastElement} />
                </>
                :<></>
            }
        </div>
    );
}


export default SimilarEvents;