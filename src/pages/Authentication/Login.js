import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import MyLoader from "../../components/UI/MyLoader";
import MyInput from "../../components/UI/MyInput";
import MyButton from "../../components/UI/MyButton";

import classes from './Login.module.css';

import { useFetching } from "../../hooks/useFetching";
import PostService from "../../API/PostService";

import { authorizeUser } from "../../store/accountReducer";

//TODELETE

/*
let start = Date.now(); // remember start time

let timer = setInterval(function() {
  // how much time passed from the start?
  let timePassed = Date.now() - start;

  if (timePassed >= 2000) {
    clearInterval(timer); // finish the animation after 2 seconds
    return;
  }

  // draw the animation at the moment timePassed
  draw(timePassed);

}, 20);

// as timePassed goes from 0 to 2000
// left gets values from 0px to 400px
function draw(timePassed) {
  train.style.left = timePassed / 5 + 'px';
}*/



const Login = (props) => {
    const router = useNavigate();
    const [dataInputed, setDataInputed] = useState({login:"", password:""});
    const [errorText, setErrorText] = useState('');
    const curTimeoutID = useRef('');
    const dispatch = useDispatch();

    const [fetchGetInfo, isAvatarLoading, errorGetInfo] = useFetching(async (login, access, refresh) => {
        const response = await PostService.getUserInfo(access);    
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        localStorage.setItem('login', login);
        localStorage.setItem('ava', response.data.avatar);

        props.initializeRefresh();
        dispatch(authorizeUser({login: login, ava: response.data.avatar}));
        setTimeout(()=>{ router('/events')}, 10)
        
            
    })

    const [fetchLogin, isPostsLoading, errorLogin] = useFetching(async (login) => {
        const response = await PostService.login(dataInputed.login, dataInputed.password);
        if(!response.data.accessToken){
            setErrorText('This password does not exist');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
        }
        else {
            fetchGetInfo(login, response.data.accessToken, response.data.refreshToken)
            localStorage.setItem('access', response.data.accessToken);
            localStorage.setItem('refresh', response.data.refreshToken);
            localStorage.setItem('login', login);
        }
            
    })
    
    useEffect(() =>{
        if(errorLogin){
            if(errorLogin.data.message === 'User with this login not found'){
                setErrorText('This login does not exist');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                curTimeoutID.current = id;
                
            }
            else if(errorLogin.data.comment !== ''){
                router('/error');
            }
        }
    }, [errorLogin, router]);
    useEffect(() =>{
        if(errorGetInfo){
            setTimeout(()=>{router('/error')}, 10);
        }
    }, [errorGetInfo, router]);

    function sendPass(e){
        clearTimeout(curTimeoutID.current);
        e.preventDefault();
        if(!dataInputed.login){
            setErrorText('Fill in the login field');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
            return;
        }
        else if(!dataInputed.password){
            setErrorText('Fill in the password field');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
            return;
        }
        fetchLogin(dataInputed.login);
        localStorage.setItem('login', dataInputed.login);
        
        setDataInputed({login:'', password:''});
        
    }


    return (
        <div>
            {isPostsLoading
                ?
                <div className={classes.loginForm}>
                    <p className={classes.header}>LOG IN</p>
                    <p className={classes.loadingText}>Data is being sent. Wait...</p>
                    <div className={classes.loader}>
                        <MyLoader />
                    </div>
                </div>
                :
                <div>
                    {isAvatarLoading
                        ?
                        <div className={classes.loginForm}>
                            <p className={classes.header}>LOG IN</p>
                            <p className={classes.loadingText}>Data is being sent. Wait...</p>
                            <div className={classes.loader}>
                                <MyLoader />
                            </div>
                        </div>
                        :
                        <form className={classes.loginForm} onSubmit={sendPass}>
                            <p className={classes.header}>LOG IN</p>
                            <label htmlFor="login" className={classes.nameInput}>login:</label>
                            <MyInput id="login" type="text" placeholder="login" value={dataInputed.login} onChange={e => setDataInputed({...dataInputed, login: e.target.value})}/>
                            <label htmlFor="password" className={classes.nameInput}>password:</label>
                            <div className={classes.myPassword}>
                                <MyInput 
                                    id="password"
                                    type="password" 
                                    placeholder="password" 
                                    value={dataInputed.password} 
                                    onChange={e => setDataInputed({...dataInputed, password: e.target.value})}
                                />
                            </div>
                            <div className={classes.forgotPassword}>
                                <Link to="/forgot-password">Forgot password?</Link>
                            </div>
                            <MyButton type='submit'>Log in</MyButton>
                            {errorText && <p className={classes.error}>{errorText}</p>}
                            <p className={classes.lastPartName}>Don't have an account?</p>
                            <div className={classes.lastPart} >
                                <Link to="/register">Sign up</Link>
                            </div>
                        </form>
                    }
                </div>
                         
            }     
        </div>
    );
}

export default Login;