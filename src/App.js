import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Error from './pages/Error';
import EventList from './pages/EventPages/EventList';
import { privateRoutes, publicRoutes } from './router';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { authorizeUser, unathorizeUser } from "./store/accountReducer.js";

import { useFetching } from './hooks/useFetching';
import PostService from './API/PostService';
import Login from './pages/Authentication/Login';
let isInit = false;
function startRefresh(fetchRefresh){
  fetchRefresh();
  let timerID = setInterval(fetchRefresh, 259200000);
  return timerID;
}


function App() {    
    const dispatch = useDispatch();
    const acc = useSelector(state => state.acc);
    const intervalRef = useRef();
   
    const [fetchRefresh, , refreshError] = useFetching(async () => {
        const response = await PostService.refreshToken(localStorage.getItem('refresh'));
        if(response.data && response.data.accessToken){
            localStorage.setItem('access', response.data.accessToken);
            localStorage.setItem('refresh', response.data.refreshToken);            
        }
    })
    function initializeRefresh(){
      let timerID = startRefresh(fetchRefresh);
      intervalRef.current = timerID;
    }
    const clearRefresh = useCallback(() => {
      clearInterval(intervalRef.current);
    }, []);
    useEffect(()=> {
        if(refreshError){
          
            dispatch(unathorizeUser({login:'',ava: ''}));
            localStorage.setItem('access', '');
            localStorage.setItem('refresh', '');
            window.localStorage.setItem('login', '');
            clearRefresh(intervalRef.current);
        }
    }, [refreshError, dispatch, clearRefresh]);

   
    useEffect(()=>{
      if(!isInit){
          if(localStorage.getItem('access') && localStorage.getItem('access').length > 2){
              dispatch(authorizeUser({login: localStorage.getItem('login'), ava: localStorage.ava}));
              let timerID = startRefresh(fetchRefresh);
              intervalRef.current = timerID;
          }
          else{
            dispatch(unathorizeUser({login:'',ava: ''}));
          }         
          isInit = true;
          
      }
    },[dispatch, fetchRefresh])
    return (
      <div className="App">
        <BrowserRouter>
          <Navigation clearRefresh={clearRefresh}/>
          {acc.auth ?
            <Routes>
              {privateRoutes.map(route => <Route key={route.path} path={route.path} element={<route.element clearRefresh={clearRefresh}/>} /> )}
              <Route path='/' element={<Navigate to="/events" replace/>} />
              <Route path='/events' element={<EventList clearRefresh={clearRefresh}/>} />
              <Route path='/error' element={<Error />} />
              <Route path='*' element={<Navigate to="/error" replace/>} />
            </Routes>
            :
            <Routes>
              {publicRoutes.map(route => <Route key={route.path} path={route.path} element={<route.element />} /> )}
              <Route path='/' element={<Navigate to="/events" replace/>} />
              <Route path='/events' element={<EventList />} />
              <Route path='/login' element={<Login initializeRefresh={initializeRefresh} />} />
              <Route path='/error' element={<Error />} />
              <Route path='*' element={<Navigate to="/error" replace/>} />
              
            </Routes>
          }
          <Footer />
        </BrowserRouter>
        
      </div>
    );
}

export default App;
