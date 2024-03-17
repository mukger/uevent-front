import React, { useEffect, useState } from "react";
import classes from './Notifications.module.css';
import { useFetching } from "../../hooks/useFetching";
import PostService from "../../API/PostService";
import { useNavigate } from "react-router";
import OneNotification from "../../components/OneNotification/OneNotification";
import MyLoader2 from "../../components/UI/MyLoader2";

const Notifications = () => {
    const router = useNavigate();
    const [notifications, setNotifications] = useState([]); 
    const [fetchNotifications, isLoading, error] = useFetching(async ()=>{
        const res = await PostService.getAllNotifications(localStorage.getItem('access'));
        setNotifications(res.data);
    })

    useEffect(() =>{
        fetchNotifications();//eslint-disable-next-line
    }, []); 
    useEffect(() =>{
        if(error){
            setTimeout(()=>{router('/error')}, 10);
        }
    }, [error, router]);

    if(isLoading){
        return (
            <div className={classes["loader-component"]}>
                <p>Wait, information is being loaded...</p>
                <div>
                    <MyLoader2 />
                </div>
            </div>
        )
    }
    else{
        return (
            <div className={classes.notifications}>
                {notifications.length > 0 ?
                    <>
                        <p className={classes["notifications-title"]}>Your notifications</p>
                        <ul>
                            {notifications.map((not)=> <OneNotification key={not.notification_id} notification={not} />)}
                        </ul>   
                    </>
                    :
                    <>
                        <p className={classes["no-notifications"]}>You currently have no notifications</p>
                    </>
                }
                
            </div>
        );
    }
   
}

export default Notifications;