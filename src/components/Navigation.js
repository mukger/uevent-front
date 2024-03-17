import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from './Navigation.module.css';
import { Link, useNavigate } from "react-router-dom";

import MySearch from "./UI/MySearch";
import { useFetching } from "../hooks/useFetching";
import PostService from "../API/PostService";

import{changeFilterEvents}from "../store/filterReducer";
import { unathorizeUser } from "../store/accountReducer";
import { inputSearchData } from "../store/filterReducer";
import config from '../helpers/config.json'
const host = 'http://localhost:3000';
const server = config.server_url;
const LIMIT = 10;
const searchableLinks = [
    `${host}/events`, 
    `${host}/users/events/`,
    `${host}/users/subscriptions/`
];

const Navigation = ({clearRefresh}) => {
    const router = useNavigate();
    const acc = useSelector(state => state.acc);
    const allEvents = useSelector(state =>state.filterData);
    const [href, setHref] = useState({isSearch: false, curHref: ''});
    const dispatch = useDispatch();

    const [fetchLogout, ,logoutError] = useFetching(async ()=>{
        await PostService.logout();    
        localStorage.setItem('access', '');
        localStorage.setItem('refresh', '');
        localStorage.setItem('login', '');
        dispatch(unathorizeUser({login:'',ava: ''}));  
        clearRefresh();
        router("/login");        
    })
    const [fetchAllEvents] = useFetching(async (filteredData) => {
        
        const response = await PostService.getEvents(localStorage.getItem('access'), {page: 1, format: allEvents.category, search: filteredData, theme: allEvents.theme, future: !allEvents.future ? '': 1});
        const totalCount = response.headers['x-total-count'] ?? 100;
        dispatch(changeFilterEvents({totalPages: Math.ceil(totalCount / LIMIT),filter: filteredData, data:response.data}));
    })
    function handleLogout() {        
        fetchLogout();
    }
    function handleFiltering(e) {
        e.preventDefault();
        if(allEvents.filteredData.length > -1 ){
            fetchAllEvents(allEvents.filteredData);   
        }
    }
    
    if(window.location.href !== href.curHref){
        let isSearch = false;
        for(let i = 0; i < searchableLinks.length; i++){
            if(window.location.href.includes(searchableLinks[i])){
                isSearch = true;
                break;
            }; 
        }
        setHref({curHref: window.location.href, isSearch: isSearch});
    } 

    useEffect(() =>{
        if(logoutError){
            router('/error');
        }
    }, [logoutError, router]);
    if(acc.auth){
        let loginLink = `userInfo/${acc.login}`
        return (
            <nav className={classes.upNav}>
                <ul className={classes["navigation-container"]}>
                    <li ><Link to="/events"><img className={classes.logo} src='https://i.ibb.co/7jqPbX7/Untitled-logo-3-free-file-1-transformed.png' alt='logo'/></Link></li>
                    <li className={classes.search}> 
                        {href.isSearch &&
                                <MySearch 
                                    placeholder="Input data!" 
                                    value={allEvents.filteredData} 
                                    onChange={(e)=>{dispatch(inputSearchData(e.target.value))}} 
                                    onClickSearch={(e) => {handleFiltering(e)}}
                                />
                        }
                    </li>
                    <li className={`${classes.account} ${classes.rightPart}`}>
                        <Link to={loginLink} style={{position: 'relative'}}>
                            <p>{acc.login}</p>
                            <img src={`${server}${acc.ava}`} alt='ava' />
                        </Link>
                        <ul className={classes["dropdown-content"]}>
                            <li><Link to="/create/company">Company</Link></li>
                            <li><Link to="/promocode">Promocode</Link></li>
                            <li><Link to="/notifications">Notifications</Link></li>
                            <li><Link to="/tickets">Your tickets</Link></li>
                            <li><Link to="/login" onClick={handleLogout}>Log out</Link></li>
                        </ul>
                    </li> 
                    <li className={classes["search-double"]}> 
                        {href.isSearch &&
                                <MySearch 
                                    placeholder="Input data!" 
                                    value={allEvents.filteredData} 
                                    onChange={(e)=>{dispatch(inputSearchData(e.target.value))}} 
                                    onClickSearch={(e) => {handleFiltering(e)}}
                                />
                        }
                    </li> 
                </ul>
            </nav>
        );
    }
    else{
        return (
           <nav className={classes.upNav}>
                <ul className={classes["navigation-container"]}>
                    <li ><Link to="/events"><img className={classes.logo} src='https://i.ibb.co/7jqPbX7/Untitled-logo-3-free-file-1-transformed.png' alt='logo'/></Link></li>
                    <li className={classes.search}>
                        {href.isSearch &&
                            <MySearch placeholder="Input data!" 
                                value={allEvents.filteredData} 
                                onChange={(e)=>{dispatch(inputSearchData(e.target.value))}} 
                                onClickSearch={(e) => {handleFiltering(e)}}
                            />
                        }
                    </li>
                   
                    <li className={classes.rightPart}><Link to="/login">Log in</Link></li>
                </ul>
            </nav>
        );
    }
}

export default Navigation;