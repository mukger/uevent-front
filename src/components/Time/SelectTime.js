import React,{useRef} from "react";
import DatePicker from "react-datepicker";
import classes from "./SelectTime.module.css";
import "react-datepicker/dist/react-datepicker.css";
import getNameMonth from "../../helpers/getNameMonth";
import { registerLocale } from  "react-datepicker";
import uk from 'date-fns/locale/uk';
import "react-datepicker/dist/react-datepicker.css";
import MyInput from "../UI/MyInput";
registerLocale('uk', uk);

const SelectTime = ({setStartDate, startDate, isDatePicked, setIsDatePicked, minDate, id})=>{
    const curTimeoutID = useRef('');

    return(

        <div className={classes["date-container"]}>
            <p className={classes["title-time"]}>Date</p>
            <div className={classes["input-container"]}>
                <DatePicker 
                    locale="uk"
                    className={classes["input-file"]} 
                    id={id}
                    selected={new Date(startDate.year, startDate.month, startDate.date)} 
                    onChange={(date) => {
                            setStartDate({...startDate, year: date.getFullYear(), month: date.getMonth(), date: date.getDate()});
                            setIsDatePicked(true);
                        }
                    } 
                    minDate={minDate}
                />
                <label htmlFor={id} className={classes["input-file-desc"]}>
                    <span className={classes["input-file-icon"]}>
                        <i className="fa fa-calendar" aria-hidden="true"></i>
                    </span>
                    {isDatePicked 
                        ? 
                        <span className={classes["input-file-text"]}>{getNameMonth(startDate.month) + ' ' + startDate.date + ", " + startDate.year}</span>
                        :
                        <span className={classes["input-file-text"]}>Select a date</span>
                    }
                    
                </label>
            </div> 
            
            <p className={classes["title-time"]}>Time</p>
            <div className={classes["time-container"]}>
                <MyInput 
                    type="text" 
                    value={startDate.hours.toString()} 
                    onChange={e => {
                        if(!e.target.value || (e.target.value.match(/^\d*$/) !== null)) {
                            if(+e.target.value >= 24){
                                setStartDate({...startDate, hours: '23'});
                              
                                
                            } 
                            else{
                                setStartDate({...startDate, hours: e.target.value});
                            }
                            if(e.target.value.length >= 2){
                                e.target.blur();
                                e.target.nextElementSibling.nextElementSibling.focus();
                            }  
                            
                        }
                        else{
                            clearTimeout(curTimeoutID.current);
                            e.target.style.outline = '1px red solid';
                            const id = setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                            curTimeoutID.current = id;
                        }
                    }}
                />
                <p>:</p>
                <MyInput 
                    type="text" 
                    value={startDate.minutes.toString()} 
                    onChange={e => {
                        if(!e.target.value || (e.target.value.match(/^\d*$/) !== null)) {
                            if(+e.target.value >= 59){
                                setStartDate({...startDate, minutes: '59'});
                            } 
                            else{
                                setStartDate({...startDate, minutes: e.target.value});
                            }
                            if(e.target.value.length >= 2){
                                e.target.blur();
                            }  
                            
                        }
                        else{
                            clearTimeout(curTimeoutID.current);
                            e.target.style.outline = '1px red solid';
                            const id = setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                            curTimeoutID.current = id;
                        }
                    }}
                />
            </div>                       
        </div>
    );
}

export default SelectTime