import React, {useEffect, useState, useRef } from "react";
import classes from "./DeleteContainer.module.css";
import Modal from "../Modal/Modal";

import { useFetching } from "../../hooks/useFetching";
import PostService from "../../API/PostService";
import { useNavigate } from "react-router";
import MyLoader from "../UI/MyLoader";

const DeleteContainer = ({modalActive, setModalActive, type, id})=>{
    
    const router = useNavigate();
    const [errorText, setErrorText] = useState('');
    const curTimeoutID = useRef(false);

    const [fetchDelete, isLoading, error] = useFetching(async () => {      
        if(type === 'event'){
            await PostService.deleteEvent(localStorage.getItem('access'), id);
            router('/events');
            setModalActive(false);
        }
        else{
            await PostService.deleteCompany(localStorage.getItem('access'));
            router('/events');
        }
       

    })
    function handleDelete(e){
        e.preventDefault();
        fetchDelete();
    }

    useEffect(() =>{
        if(error){
            if(error.data.message === 'Internal error'){
                setErrorText(`You can't delete this company, when you had active events`);
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                curTimeoutID.current = id;
            }
            else {
                setTimeout(()=>{router('/error')}, 10);
                setModalActive(false);
            }
           
        }
    }, [error, router, setModalActive]);

    if(isLoading){
        return(
            <Modal modalActive={modalActive} setModalActive={setModalActive}>
                <div className={classes.deleteContainer}>
                    <p className={classes.header}>EXTRACTION</p>
                    <p className={classes.loadingText}>Data is being sending. Wait...</p>
                    <div className={classes.loader}>
                        <MyLoader />
                    </div>
                </div>
            </Modal>
        );
    }
    else{
    return(
            <Modal modalActive={modalActive} setModalActive={setModalActive}>
                <div className={classes.deleteContainer}>
                    <p className={classes["header"]}>EXTRACTION</p>
                    <p className={classes["main-text"]}>Are you sure you want to delete event?</p>
                    {errorText && <p className={classes["error"]} >{errorText}</p>}
                    <button className={classes["delete-profile"]} onClick={handleDelete}>Delete</button>
                </div>
                
            </Modal>
        );        
    }
}

export default DeleteContainer;