import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useFetching } from "../../hooks/useFetching.js";
import PostService from "../../API/PostService.js";

import MyInput from "../../components/UI/MyInput.js";
import MyButton from "../../components/UI/MyButton.js";
import MyLoader from "../../components/UI/MyLoader.js";

import classes from './Register.module.css';
import checkEmail from "../../helpers/checkEmail.js";

const Register = () => {
    const router = useNavigate();
    const [dataInputed, setDataInputed] = useState({login:'', password:'',passwordConfirmation:'', email:''});
    const [error, setError] = useState('');
    const curTimeoutID = useRef();

    const [fetchRegister, isPostsLoading, postError] = useFetching(async () => {// eslint-disable-next-line
        await PostService.register(dataInputed.login, dataInputed.password, dataInputed.email);
        setError("success");
        setTimeout(() =>{
            router('/login');
        }, 3000);

    })

    useEffect(() =>{
        if(postError){
            if(postError.data.message === "User with this login already exist"){
                setError('This login already exists. Try another one');
                const id = setTimeout(()=>{setError('')}, 2000);
                curTimeoutID.current = id;
            }
            else if(postError.data.message === "User with this email already exist"){
                setError('This email already exists. Try another one');
                const id = setTimeout(()=>{setError('')}, 2000);
                curTimeoutID.current = id;
            }
            else {
                router('/error');
            }
        }
    }, [postError, router]);

    function handleSendPass(e){
        clearTimeout(curTimeoutID.current);
        e.preventDefault();
        if(dataInputed.login.length < 4){
            setError('Enter a login with more than 4 characters');
            const id = setTimeout(()=>{setError('')}, 2000);
            curTimeoutID.current = id;
        }
        else if(dataInputed.password !== dataInputed.passwordConfirmation){
            setError('Passwords do not match');
            const id = setTimeout(()=>{setError('')}, 2000);
            curTimeoutID.current = id;
        }
        else if(dataInputed.password.length < 8){
            setError('Enter a password longer than 8 characters');
            const id = setTimeout(()=>{setError('')}, 2000);
            curTimeoutID.current = id;
        }
        else if(!checkEmail(dataInputed.email)){
            setError('Enter an existing address');
            const id = setTimeout(()=>{setError('')}, 2000);
            curTimeoutID.current = id;
        }
        else {
            fetchRegister(); 
            setDataInputed({login:'', password:'',passwordConfirmation:'', email:''});
        }       
    }
    return (
        
        <div>
            {isPostsLoading
                ?
                <div className={classes.registerForm}>
                    <p className={classes.header}>SIGN UP</p>
                    <p className={classes.loadingText}>Data is being sent. Wait...</p>
                    <div className={classes.loader}>
                        <MyLoader />
                    </div>
                </div>
                :
                <div>
                    {error === 'success' 
                        ?
                        <div className={classes.registerForm}>
                            <p className={classes.header}>SIGN UP</p>
                            <div className={classes.resultText}>
                                <p className={classes.mainText}>Account successfully registered.</p>
                                <p className={classes.secondText}>You can now log in to your account.</p>
                            </div> 
                        </div>
                        :
                        <form className={classes.registerForm} onSubmit={handleSendPass}>
                            <p className={classes.header}>SIGN UP</p>
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
                                        setError("The maximum length of your login is 20 characters");
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        curTimeoutID.current = id;
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                    else if(!e.target.value.match(/[\s<>/|:*"'`~,\\]/)) {
                                        setDataInputed({...dataInputed, login: e.target.value});
                                    }
                                    else{
                                        clearTimeout(curTimeoutID.current);
                                        e.target.style.outline = '1px red solid';
                                        setError(`You cannot enter spaces for your login and these characters: \\ / | : * ' , ~ < > "`);
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        curTimeoutID.current = id;
                                        setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                    }
                                }}
                            />
                            <label htmlFor="password" className={classes.nameInput}>password:</label>
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
                                            setError("The maximum length of your password is 32 characters");
                                            const id = setTimeout(()=>{setError('')}, 2000);
                                            curTimeoutID.current = id;
                                            setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                        }
                                        else {
                                            setDataInputed({...dataInputed, password: e.target.value});
                                        }
                                    }}
                                />
                            </div>
                            <label htmlFor="confirmPassword" className={classes.nameInput}>password confirmation:</label>
                            <div className={classes.password}>
                                <MyInput 
                                    id='confirmPassword'
                                    type="password"
                                    placeholder="confirm password" 
                                    value={dataInputed.passwordConfirmation} 
                                    onChange={e => { 
                                        if(e.target.value.length > 32){
                                            clearTimeout(curTimeoutID.current);
                                            e.target.style.outline = '1px red solid';
                                            setError("The maximum length of your password is 32 characters");
                                            const id = setTimeout(()=>{setError('')}, 2000);
                                            curTimeoutID.current = id;
                                            setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                        }
                                        else {
                                            setDataInputed({...dataInputed, passwordConfirmation: e.target.value});
                                        }
                                        
                                    }}
                                />
                            </div>
                            <label htmlFor="email" className={classes.nameInput}>email:</label>
                            <MyInput 
                                id="email"
                                type="text" 
                                placeholder="email" 
                                value={dataInputed.email} 
                                onChange={e => { 
                                    if(!e.target.value.match(/[^a-z_\-.@0-9]/)) {
                                        setDataInputed({...dataInputed, email: e.target.value})
                                    }
                                    else{
                                        clearTimeout(curTimeoutID.current);
                                        e.target.style.outline = '1px red solid';
                                        setError("Allowed characters for email input: a-z, 0-9, _, -, .");
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        curTimeoutID.current = id;
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                }}
                            />
                            <MyButton type='submit'>Sign up</MyButton>
                            {error && <p className={classes.error}>{error}</p>}       
                            <p className={classes.lastPartName}>You already have an account?</p>
                            <div className={classes.lastPart}>
                                <Link to="/login">Log in</Link>
                            </div>
                            
                        </form>   
                    }
                   
                </div>
            }

            
        </div>
    );
}

export default Register;