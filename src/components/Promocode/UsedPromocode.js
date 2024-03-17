import { parseDate } from "../../helpers/parseDate";
import classes from "./UsedPromocode.module.css";

const Promocode = ({promocode})=>{
    console.log(promocode);
    return(
        <li className={classes.promocode}>
                {promocode.event ?
                    <div className={classes["center-container"]}>
                        <p title="Event name" className={classes["center-content"]}>{promocode.event.event_name}</p>
                        <p className={classes["center-title"]}><span>Type:</span> Event promocode</p>
                    </div>
                    :<></>
                }
                {promocode.event_name ?
                    <div className={classes["center-container"]}>
                        <p title="Event name" className={classes["center-content"]}>{promocode.event_name}</p>
                        <p className={classes["center-title"]}><span>Type:</span> Event promocode</p>
                        
                    </div>
                    :<></>
                }
                {promocode.event ? 
                    <div className={classes["help-container"]}>
                        <p title="Company name" className={classes["center-content"]}><span>Company:</span> {promocode.event.cname}</p>
                        
                    </div>
                    :promocode.company ?
                        <div className={classes["center-container"]}>
                            <p title="Company name" className={classes["center-content"]}>{promocode.company.cname}</p>
                            <p className={classes["center-title"]}><span>Type:</span> Company promocode</p>
                        </div>
                        :<></>
                }
                <p className={classes["promocode-name"]} title="Name promocode">{promocode.promocode}</p>
                <p className={classes["discount"]}><span>Discount:</span> {promocode.discount} %</p>
                <p className={classes["activation-date"]} title="Activation date">{parseDate(promocode.activation_date)}</p>
        </li>
    );
}

export default Promocode;