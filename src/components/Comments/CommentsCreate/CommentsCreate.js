import React, { useEffect, useRef, useState } from "react";
import Modal from "../../Modal/Modal";
import classes from './CommentsCreate.module.css';
import MyButton from "../../UI/MyButton";
import MyLoader from "../../UI/MyLoader";

const CommentCreate = ({modalActive, setModalActive, isCreateLoading, fetchCreateComment}) => {
    const [text, setText] = useState('');
    const [errorText, setErrorText] = useState(false);
    const curTimeoutID = useRef(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if(text.length <= 4){
            clearTimeout(curTimeoutID.current);
            setErrorText(`The comment must be longer than 4 characters`);
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
            setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
            return;
        }

        if(modalActive.commentId){
            fetchCreateComment(text, modalActive.commentId);
        }
        else{
            fetchCreateComment(text);
        }   
    }

    useEffect(()=>{
        setText(modalActive.commentId ? modalActive.text : '');
    }, [modalActive]);
    if(isCreateLoading){
        return(
            <Modal modalActive={modalActive} setModalActive={setModalActive}>
                <div className={classes.comments}>
                    <p className={classes.header}>COMMENT</p>
                    <p className={classes.loadingText}>Data is being sending. Wait...</p>
                    <div className={classes.loader}>
                        <MyLoader />
                    </div>
                </div>
            </Modal>
        );
    }
    else{
        return (
            <Modal modalActive={modalActive} setModalActive={setModalActive}>
                <div className={classes.comments}>
                    <p className={classes['header']}>COMMENT</p>
                    <form onSubmit={handleSubmit}>
                        <label className={classes["textarea-label"]} htmlFor="text-comment">Your comment</label>
                        
                        <textarea 
                            id="text-comment" 
                            placeholder="Input your comment" 
                            value={text} 
                            type="text"
                            onChange={e => {
                                if(e.target.value.length > 500){
                                    clearTimeout(curTimeoutID.current);
                                    e.target.style.outline = '1px red solid';
                                    setErrorText(`The maximum length of your comment is 500 characters`);
                                    const id = setTimeout(()=>{setErrorText('')}, 2000);
                                    curTimeoutID.current = id;
                                    setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                }
                                else {
                                    setText(e.target.value)
                                }
                                
                            }}
                        />
                        {errorText && <p className={classes["error"]} >{errorText}</p>}
                        <MyButton>asdasd</MyButton>
                    </form>
                </div>
            </Modal>
        );
    }
}

export default CommentCreate;