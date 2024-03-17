import classes from "./CreatedPromocode.module.css";

import MyButton from "../../components/UI/MyButton";
import { parseDate } from "../../helpers/parseDate";


const Promocode = ({promocode, deletePromocodeFunction, extendPromocodeFunction})=>{
   
    return(
        <li className={classes.promocode}>
            <div className={classes["main-container"]}>
                <p className={classes["promocode-name"]} title="Name promocode">{promocode.promocode}</p>
                <p className={classes["discount"]}><span>Discount:</span> {promocode.discount} %</p>
                <p className={classes["expiration-date"]} title="Expiration date:"><span>Expiration date:</span> {parseDate(promocode.expiration_date)}</p>
            </div>
            {((new Date(promocode.expiration_date).getTime() + 2 * 60 * 60 * 1000) < new Date().getTime())?
                <div className={classes["button-container"]}>
                    <MyButton title="Extend promocode" onClick={() => extendPromocodeFunction(promocode.promocode_id, promocode.promocode)}><i className="fa fa-refresh" aria-hidden="true"></i></MyButton>
                    <MyButton title="Delete promocode" onClick={() => deletePromocodeFunction(promocode.promocode_id)}><i className="fa fa-times" aria-hidden="true"></i></MyButton>
                </div> 
                : <div className={classes["button-container"]}>
                    <button style={{display:'none'}}></button>
                    <MyButton title="Delete promocode" onClick={() => deletePromocodeFunction(promocode.promocode_id)}><i className="fa fa-times" aria-hidden="true"></i></MyButton>
                </div>
            }
            
        </li>
    );
}

export default Promocode;