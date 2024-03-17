import React, { useRef, useState, useEffect } from "react";
import classes from "./ChangePicture.module.css";
import Modal from "../Modal/Modal";
import MyButton from "../UI/MyButton";

import { useFetching } from "../../hooks/useFetching";
import PostService from "../../API/PostService";
import { useNavigate } from "react-router";

import config from '../../helpers/config.json';
import MyLoader from "../UI/MyLoader";
const server = config.server_url;

const ChangePicture = ({modalActive, setModalActive, picture, getInfo, id})=>{
    
    const router = useNavigate();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [errorPhoto, setErrorPhoto] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const curTimeoutID = useRef(0);

    const [fetchChangePicture, isLoading, error] = useFetching(async () => {      
        await PostService.changePicture(localStorage.getItem('access'), id, selectedFile);
        setModalActive(false);
            getInfo(id);

    })


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
            fetchChangePicture(selectedFile);
        }
        else{
            setErrorPhoto('No photo selected');
            const id = setTimeout(()=>{setErrorPhoto('')}, 2000);
            curTimeoutID.current = id;
        }
    }

    useEffect(() =>{
        if(error){
            setTimeout(()=>{router('/error')}, 10);
            setModalActive(false);
        }
    }, [error, router, setModalActive]);

    if(isLoading){
        return (
            <Modal modalActive={modalActive} setModalActive={setModalActive}>
                <div className={classes.changePicture}>
                    <p className={classes.header}>POSTER</p>
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
                <div className={classes.changePicture}>

                    <p className={classes["header"]}>POSTER</p>
                    <div className={classes["user-photo"]} >
                        <img src={`${server}${picture}`} alt="ava" className={classes["ava-current"]} />
                        <div className={classes["input-container"]} >
                            <input type="file" name="file" id='input-file' className={classes["input-file"]}  onChange={changeHandler} />
                            <label htmlFor="input-file" className={classes["input-file-desc"]} >
                                <span className={classes["input-file-icon"]} >
                                    <i className="fa fa-download"  aria-hidden="true"></i>
                                </span>
                                {isFilePicked
                                    ?
                                    <span className={classes["input-file-text"]} >Poster selected</span>
                                    :
                                    <span className={classes["input-file-text"]} >Select a poster</span>
                                }
                                
                            </label>
                        </div>
                        <MyButton onClick={handleSubmission}>Upload poster</MyButton>
                        {errorPhoto && <p className={classes["error"]} >{errorPhoto}</p>}
                    </div>
                </div>
            </Modal>
        );        
    }
}

export default ChangePicture;