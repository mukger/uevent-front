import {useState, useEffect } from "react";

import { createSignString } from "../../helpers/hashing";
import config from '../../helpers/config.json';
import MyButton from "../UI/MyButton";
import { v4 as uuid } from 'uuid';
import jwt_decode from "jwt-decode";
import Modal from "../Modal/Modal";
import classes from "./PayData.module.css";
import Checkbox from "../UI/MyCheckbox";

const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY
let data = '';
const PayData = ({price, event_id, company_account, modalActive, setModalActive, discount = 0, promocode_id = ''}) => {
    const [signature, setSignature] = useState('');  
    console.log(promocode_id);
    const [isVisit, setIsVisit] = useState(false);
        useEffect(() => {
            
            if(price && event_id){
                const unique_id = uuid();
                data = createSignString( {
                    public_key: PUBLIC_KEY,
                    version: "3",
                    action: "pay",
                    amount: Math.round((price - (discount * price / 100)) * 100) / 100,
                    currency: "UAH",
                    description: btoa(JSON.stringify({event_id: event_id, user_id: jwt_decode(localStorage.getItem('access')).id, show_visit: +isVisit, promocode_id: promocode_id})),
                    order_id: unique_id, 
                    server_url: config.server_url + '/api/event/callback_pay',
                    result_url: config.result_url,
                    split_rules:[{public_key: company_account, amount: Math.round((price - (discount * price / 100)) * 100) / 100, commission_payer: "receiver"}]   
                }, setSignature);
            }
        }, [price, event_id, company_account, isVisit, discount, promocode_id]);
        return (
            <Modal modalActive={modalActive} setModalActive={setModalActive}>
                <div className={classes.payData}>
                    <p className={classes["header"]}>PURCHASE</p>
                    <p className={classes["main-text"]}>Are you sure you want to buy a ticket for this event?</p>
                    <Checkbox label="Show you as visitor?" isChecked={isVisit} setIsChecked={() =>{ setIsVisit(!isVisit)}}/>
                    {discount > 0 ?
                        <p className={classes['ticket-price']}>
                            <span>Price:</span> 
                            <span className={classes['new-price']}>{Math.round((price - (discount * price / 100)) * 100) / 100} UAH</span>  
                            <span className={classes['old-price']}>{price} UAH</span>  
                            
                        </p>
                        :
                        <p className={classes['ticket-price']}><span>Price:</span> {price} UAH</p>
                    }
                    
                    <form method="POST" action="https://www.liqpay.ua/api/3/checkout" acceptCharset="utf-8">
                        <input type="hidden" name="data" value={data} />
                        <input type="hidden" name="signature" value={signature} />
                    <MyButton>Buy a ticket</MyButton>
                </form>
                </div>
                
            </Modal>
        );
}

export default PayData;