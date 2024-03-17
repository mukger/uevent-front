import { Link} from "react-router-dom";
import classes from "./Event.module.css";

import { parseDate } from "../../helpers/parseDate";

const Event = ({event, isSimilar, setId})=> {
    const handleChange = () =>{
        if(isSimilar === 1){
            setId(event.event_id);
        }
    }
    const handleChangeCompany = () =>{
        if(isSimilar === 2){
            setId(event.company_id);
        }
    }
    return(
        <li className={classes.event}>
                <div className={classes["event-name"]}><Link to={`/event/${event.event_id}`} onClick={handleChange} title="event">{event.event_name}</Link></div>
                <div className={classes["cname"]}><Link to={`/company/info/${event.company_id}`} onClick={handleChangeCompany} title="company name">{event.cname}</Link></div>
                
                    {event.edescription.length <= 300 
                        ?  <p className={classes["event-description"]}>{event.edescription}</p>
                        :  <p className={classes["event-description"]}>{event.edescription.slice(0, 300)}<Link to={`/event/${event.event_id}`} onClick={handleChange}> ...</Link></p>
                    }


                {(new Date(event.execution_date).getTime() + 2 * 60 * 60 * 1000) - new Date().getTime() > 0
                    ?
                    <div className={classes["execution-date"]}><p title="date of event">{parseDate(event.execution_date)}</p></div> 
                    :
                    <div className={classes["execution-date"]}><i className="fa fa-check" aria-hidden="true" title="event happened"></i></div>
                }
                
                <div className={classes["category-container"]}>
                    <p title="format" className={classes["event-format"]}>{event.format}</p>
                    <p title="theme" className={classes["event-theme"]}>{event.theme}</p>
                </div>
                <div className={classes["event-ticket-price"]}>
                    <Link to={`/event/${event.event_id}`} title="price" onClick={handleChange}>{event.ticket_price} UAH</Link>
                </div>
                {event.ticket_count > 0
                    ?
                    <div className={classes["ticket-container"]}>
                        <p className={classes["event-ticket-count"]} title="remains" >{event.ticket_count}</p>
                        <p>/</p>
                        <p title="total" className={classes["event-ticket-limit"]}>{event.ticket_limit}</p>
                    </div>
                    :
                    <div className={classes["ticket-container"]}>
                        <p className={classes["no-tickets"]}>No available tickets</p>
                    </div>
                }
        </li>
    );
}

export default Event;

/*
    {localStorage.getItem('access').length > 2?
        jwt_decode(localStorage.getItem('access')).id === event.user_id ?
            <p>МАЙ</p>
            :
            <p>НОТ МАЙ!</p>
        :
        <p>НОТ МАЙ!</p>
    }
*/