import {useState, useRef} from "react";
import { Link } from "react-router-dom";
import MyLoader from "../../components/UI/MyLoader";
import MyInput from "../../components/UI/MyInput";
import MyButton from "../../components/UI/MyButton";

import classes from './ForgotPassword.module.css';

const isPostsLoading = false;
const ForgotPassword = () => {
    const [message] = useState('');
    const [dataInputed, setDataInputed] = useState({login:""});
    const [errorText, setErrorText] = useState('');
    const curTimeoutID = useRef('');

    function sendPass(e){
        e.preventDefault();
        clearTimeout(curTimeoutID.current);
        if(dataInputed.login.length < 1){
            setErrorText('Input login');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
            return;
        }
        //fetchForgotPassword();
        setDataInputed({login:''});
    }
    if(message){
        return (
            <div className={classes.forgotForm}>
            <p className={classes.header}>RESET PASSWORD</p>
            <div className={classes.resultText}>
                <p className={classes.mainText}>The password has been successfully emailed to you.</p>
                <p className={classes.secondText}>Follow the link in your email to set a new password.</p>
            </div>
            <p className={classes.lastPartName}>Have you recalled the password?</p>
            <div className={classes.lastPart}>
                <Link to="/login">Log in</Link> 
            </div>
            
        </div>
        );
    }
    else{
        return (
            <div>
                {isPostsLoading
                    ?
                    <div className={classes.forgotForm}>
                        <p className={classes.header}>RESET PASSWORD</p>
                        <p className={classes.loadingText}>Data is being sent. Wait...</p>
                        <div className={classes.loader}>
                            <MyLoader />
                        </div>
                    </div>
                    :
                    <form className={classes.forgotForm} onSubmit={sendPass}>
                        <p className={classes.header}>RESET PASSWORD</p>
                        <label htmlFor="login" className={classes.nameInput}>login:</label>
                        <MyInput 
                            id="login"
                            type="text" 
                            placeholder="login" 
                            value={dataInputed.login} 
                            onChange={e => {  
                                if(e.target.value.length > 20){
                                    clearTimeout(curTimeoutID.current);
                                    e.target.style.outline = '1px red solid';
                                    setErrorText("The maximum length of your login is 20 characters");
                                    const id = setTimeout(()=>{setErrorText('')}, 2000);
                                    curTimeoutID.current = id;
                                    setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                }
                                else if(!e.target.value.match(/[\s<>/|\\:*"'`~,]/)) {
                                    setDataInputed({...dataInputed, login: e.target.value});
                                }
                                else{
                                    clearTimeout(curTimeoutID.current);
                                    e.target.style.outline = '1px red solid';
                                    setErrorText("You cannot enter spaces for your login and these characters: \\ / | : * ' ` , ~ < > \"");
                                    const id = setTimeout(()=>{setErrorText('')}, 2000);
                                    curTimeoutID.current = id;
                                    setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                }
                            }}
                        />    
                        <MyButton type='submit'>Send</MyButton>
                        {errorText && <p className={classes.error}>{errorText}</p>} 
                        <p className={classes.lastPartName}>Have you recalled the password?</p>
                        <div className={classes.lastPart}>
                            <Link to="/login">Log in</Link>
                        </div>
                    </form>   
                }      
            </div>
        );
    }

}

export default ForgotPassword;