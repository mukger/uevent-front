import classes from "./Ticket.module.css";
import { parseDate } from "../../helpers/parseDate";
import { Link } from "react-router-dom";

const Ticket = ({ticket})=>{
    console.log(ticket);
    return(
        <li className={classes.ticket}>
            <div className={classes['ticket-container']}>
            <div className={classes['container-purchase']}><p><span>Purchase ticket date:</span> {parseDate(ticket.purchase_date)}</p></div>
                <div className={classes['title-ticket']}><Link to={`/event/${ticket.event_id}`} title="Name of event">{ticket.event_name}</Link></div>
                <p title="Name of company" className={classes['company-name']}><span>Company name: </span>{ticket.cname}</p>
                <p className={classes['place-name']} title="place"><span>Name of place: </span>{ticket.name_place}</p>
                {ticket.discount ?
                    <div className={classes['ticket-price-container']}>
                        <div>
                            <p className={classes['ticket-title']}>Price:</p>
                            <p className={classes['ticket-price-discounted']}>{(ticket.ticket_price - ticket.ticket_price * ticket.discount / 100)} UAH</p>
                            <p className={classes['ticket-price-full']}>{ticket.ticket_price} UAH</p>
                            
                        </div>
                            <p className={classes['ticket-price-discount']}><span>Discount:</span> {ticket.discount} %</p>
                    </div>:
                    <div className={classes['ticket-price-container']}>
                        <p><span>Price:</span> {ticket.ticket_price} UAH</p>
                    </div>
                }
                <div className={classes['container-purchase']}><p><span>Date of event:</span> {parseDate(ticket.execution_date)}</p></div>
            </div> 
        </li>
    );
}

export default Ticket;