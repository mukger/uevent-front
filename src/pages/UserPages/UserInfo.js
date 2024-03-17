import React, { useState, useEffect, useRef } from "react";
import classes from './UserInfo.module.css';
import { useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router";

import { useFetching } from "../../hooks/useFetching";

import PostService from "../../API/PostService";
import checkEmail from "../../helpers/checkEmail";
import { authorizeUser, unathorizeUser } from "../../store/accountReducer";

import MyLoader from "../../components/UI/MyLoader";
import MyButton from "../../components/UI/MyButton";
import MyInput from "../../components/UI/MyInput";
import jwt_decode from "jwt-decode";

import config from '../../helpers/config.json';
import { Link } from "react-router-dom";
const server = config.server_url;

const UserInfo = ({clearRefresh}) => {
    const router = useNavigate();
    const dispatch = useDispatch();
    
    const [info, setInfo] = useState({});
    
    const [errorText, setErrorText] = useState('');
    const [errorPhoto, setErrorPhoto] = useState('');
    const curTimeoutID = useRef(false);

    
    const [successRes, setSuccessRes] = useState(false);
    
    const [deleteProfile, setDeleteProfile] = useState(false);

    const [selectedFile, setSelectedFile] = useState('');
	const [isFilePicked, setIsFilePicked] = useState(false);

    const acc = useSelector(state => state.acc);

    const [fetchUserInfo, isPostsLoading, userError] = useFetching(async () => {
        
        const response = await PostService.getUserInfo(localStorage.getItem('access'));

        if(window.location.pathname !== `/userInfo/${localStorage.getItem('login')}`){
            router(`/userInfo/${localStorage.getItem('login')}`);
        }

        if(response.data.avatar !== acc.ava){
            dispatch(authorizeUser({login: response.data.login, ava: response.data.avatar}));
            localStorage.setItem('ava', response.data.avatar);
        }

        setInfo(response.data);
        //setInfo(response.data[0]);
    })

    const [fetchChangeUser, isChangeLoading, changeUserError] = useFetching(async () => {
        await PostService.changeUserInfo(localStorage.getItem('access'), info);
        localStorage.setItem('login', info.login);
        dispatch(authorizeUser({login: info.login, ava: info.avatar}));
        setSuccessRes(true);
        setTimeout(()=>{
            router(`/events`)
        }, 3000);
    })

    const [fetchDeleteUser, , deleteUserError] = useFetching(async () => {
        await PostService.deleteUser(localStorage.getItem('access'));
        localStorage.setItem('login', '');
        localStorage.setItem('access', '');
        localStorage.setItem('refresh', '');
        localStorage.setItem('ava', '');
        clearRefresh();
        dispatch(unathorizeUser({login:'',ava: ''}));  
        setTimeout(()=>{
            router(`/login`)
        },50)
    })

    const [fetchChangeAva, isChangeAvaLoading, errorAvaChange] = useFetching(async () => {
        await PostService.changeAvatar(localStorage.getItem('access'), selectedFile);
        fetchUserInfo();
    })

    useEffect(() =>{
        fetchUserInfo();// eslint-disable-next-line
    }, []);

    useEffect(()=>{
        if(userError){
            localStorage.setItem('access', '');
            localStorage.setItem('refresh', '');
            localStorage.setItem('login', '');
            localStorage.setItem('ava', '');
            clearRefresh();
            dispatch(unathorizeUser({login:'',ava: ''}));  
            setTimeout(()=>{
                router(`/login`)
            },50)
        }

    }, [userError, router, clearRefresh, dispatch])
    

    useEffect(()=>{
        if(changeUserError){
            
            if(changeUserError.data.message === "User with this email already exist"){
                setErrorText('This email is already registered. Try another one');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                curTimeoutID.current = id;
            }
            else if(changeUserError.data.message === 'User with this login already exist'){
                setErrorText('This login already exists. Try another one');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                curTimeoutID.current = id;
            }
            else {
                setTimeout(()=>{router(`/error`)},50)
            }
        }
        if(deleteUserError || errorAvaChange) {
            setTimeout(()=>{router(`/error`)},50)
        }
    },[changeUserError, deleteUserError, errorAvaChange, router]);

    function changeData(e){
        e.preventDefault();
        clearInterval(curTimeoutID.current);
        if(info.login.length < 4){
            setErrorText('Enter a login that is longer than 4 characters');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
        }
        else if(!checkEmail(info.email)){
            setErrorText('Enter an existing email');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
        }
        else {
            fetchChangeUser();
        }       
        
    }

    function deleteYourAccount(e){
        e.preventDefault();
        setDeleteProfile(true);
    }

    function changeHandler(e){
        clearTimeout(curTimeoutID.current);
        e.preventDefault();
        if(e.target.files[0].type.indexOf('image') === -1){
            setIsFilePicked(false);
            setErrorPhoto('Invalid file type');
            const id = setTimeout(()=>{setErrorPhoto('')}, 2000);
            curTimeoutID.current = id;
        }
        else{
            setSelectedFile(e.target.files[0]);
            setIsFilePicked(true);

        }
    }
    function handleSubmission(e){
        e.preventDefault();
        if(isFilePicked){
            fetchChangeAva();
        }
        else{
            setErrorPhoto('No photo selected');
            const id = setTimeout(()=>{setErrorPhoto('')}, 2000);
            curTimeoutID.current = id;
        }
    }

    if(isPostsLoading || isChangeAvaLoading || isChangeLoading){
        return (
            <div>
                <div className={classes["user-info"]} >
                    <p className={classes["header"]} >Account change</p>
                    <p className={classes["loading-text"]} >Data is being sent or downloaded. Wait...</p>
                    <div className={classes["loader"]} >
                        <MyLoader />
                    </div>
                </div>
            </div>
        );
    }
    else if(deleteProfile){
        return (
            <div>
                <div className={classes["user-info"]} >
                    <p className={classes["header"]} >Account change</p>
                    <p className={classes["deleting-text"]} >Are you sure you want to delete the account?</p>
                    <div className={classes["buttons-delete"]} >
                        <button className={classes['stay']} onClick={e=>{e.preventDefault(); setDeleteProfile(false)}}>Go back</button>
                        <button className={classes["delete-profile"]} onClick={e=>{e.preventDefault(); fetchDeleteUser();}}>Delete account</button>
                    </div>
                </div>
            </div>
        );
    }
    else{
        return (
            <div>
                {successRes 
                    ?
                    <div className={classes["user-info"]} >
                        <p className={classes["header"]} >Account change</p>
                        <div className={classes["result-text"]} >
                            <p className={classes["main-text"]} >Account details have been successfully changed.</p>
                            <p className={classes["second-text"]} >You will now be redirected to the main page.</p>
                        </div> 
                    </div>
                    :
                    <div className={classes["user-info"]} >
                        <p className={classes["header"]} >Account change</p>
                        <p className={classes["user-info-title"]} >Change profile photo</p>
                        <div className={classes["user-photo"]} >
                            <img src={`${server}${info.avatar}`} alt="ava" className={classes["ava-current"]} />
                            <div className={classes["input-container"]} >
                                <input type="file" name="file" id='input-file' className={classes["input-file"]}  onChange={changeHandler} />
                                <label htmlFor="input-file" className={classes["input-file-desc"]} >
                                    <span className={classes["input-file-icon"]} >
                                        <i className="fa fa-download"  aria-hidden="true"></i>
                                    </span>
                                    {isFilePicked
                                        ?
                                        <span className={classes["input-file-text"]} >Avatar selected</span>
                                        :
                                        <span className={classes["input-file-text"]} >Select an avatar</span>
                                    }
                                    
                                </label>
                            </div>
                            <MyButton onClick={handleSubmission}>Upload an avatar</MyButton>
                            
                        </div>
                        {errorPhoto && <p className={classes["error"]} >{errorPhoto}</p>}
                        <p className={classes["user-info-title"]} >Changing account data</p>
                        <div className={classes["user-data"]} >
                            <p className={classes["user-info-name"]} >login:</p>
                            <MyInput 
                                type="text"
                                placeholder="login" 
                                value={info.login} 
                                onChange={e => {                                    
                                    if(e.target.value.length > 20){
                                        clearTimeout(curTimeoutID.current);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("The maximum length of your login is 20 characters");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        curTimeoutID.current = id;
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                    else if(!e.target.value.match(/[\s<>/|\\?:*"'`~,]/)) {
                                        setInfo({...info, login: e.target.value});
                                    }
                                    else{
                                        clearTimeout(curTimeoutID.current);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("You cannot enter spaces for your login and these characters: \\ / | ? : * ' ` , ~ < > \"");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        curTimeoutID.current = id;
                                        setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                    }
                                }}
                            /> 
                            <p className={classes["user-info-name"]} >email:</p>
                            <MyInput 
                                type="text"
                                placeholder="email" 
                                value={info.email} 
                                onChange={e => { 
                                    if(!e.target.value.match(/[^a-z_\-.@0-9]/)) {
                                        setInfo({...info, email: e.target.value})
                                    }
                                    else{
                                        clearTimeout(curTimeoutID.current);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("Allowed characters for email input: a-z, 0-9, _, -, .");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        curTimeoutID.current = id;
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                }}
                            /> 
                            {errorText && <p className={classes["error"]} >{errorText}</p>}
                            <MyButton onClick={changeData}>Change</MyButton>
                        </div>
                        
                        {jwt_decode(localStorage.getItem('access')).user_role === 'admin'?
                            <div className={classes["admin-link"]}>
                                <Link to={`http://localhost:3001/myadmin/?access=${localStorage.getItem('access')}`}>Go into admin panel</Link>

                            </div>:<></>
                        }
                        
                        <div className={classes["delete-button-container"]} >
                            <button onClick={deleteYourAccount}>Delete account</button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default UserInfo;