import {useState, useRef} from "react";
import { Link } from "react-router-dom";
import MyLoader from "../../components/UI/MyLoader";
import MyInput from "../../components/UI/MyInput";
import MyButton from "../../components/UI/MyButton";
import classes from './PasswordReset.module.css';

const isPostsLoading = false;

const PasswordReset = () => {
    const [dataInputed, setDataInputed] = useState({password:""});
    const [errorText, setErrorText] = useState('');
    const curTimeoutID = useRef();

   
    function handleSendPass(e){
        e.preventDefault();
        clearInterval(curTimeoutID.current);
        if(dataInputed.password.length < 8){
            setErrorText('Enter a password longer than 8 characters');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
            return;
        }

        setDataInputed({password:''});
    }
    if(errorText === 'success'){
        return (
            <div className={classes.resetForm}>
                <p className={classes.header}>RESET PASSWORD</p>
                <div className={classes.resultText}>
                    <p className={classes.mainText}>Password changed successfully.</p>
                    <p className={classes.secondText}>Now you will automatically go to the account login page. Enter there your login and new password</p>
                </div>
            </div>
        );
    }
    else{
        return (
            <>
                {isPostsLoading
                    ?
                    <div className={classes.resetForm}>
                    <p className={classes.header}>RESET PASSWORD</p>
                    <p className={classes.loadingText}>Data is being sent. Wait...</p>
                    <div className={classes.loader}>
                        <MyLoader />
                    </div>
                </div>
                    :
                    <form className={classes.resetForm} onSubmit={handleSendPass}>
                        <p className={classes.header}>RESET PASSWORD</p>
                        <label htmlFor="password" className={classes.nameInput}>new password:</label>
                        <div className={classes.password}>
                            <MyInput 
                                id="password"
                                type="password" 
                                placeholder="password" 
                                value={dataInputed.password} 
                                onChange={e => {
                                    if(e.target.value.length > 32){
                                        clearTimeout(curTimeoutID.current);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("The maximum length of your password is 32 characters");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        curTimeoutID.current = id;
                                        setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                    }
                                    else {
                                        setDataInputed({...dataInputed, password: e.target.value});
                                    }
                                }}
                            />    
                        </div>
                        <MyButton type='submit'>Send</MyButton>
                        {errorText && <p className={classes.error}>{errorText}</p>}
                        <p className={classes.lastPartName}>Got an error? Try sending again</p>
                        <div className={classes.lastPart} >
                            <Link to="/forgot-password">Input login again</Link> 
                        </div>        
                    </form>   
                }
            </>
        );
    }
}

export default PasswordReset;