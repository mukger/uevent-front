import React from "react";
import classes from './OneComment.module.css';
import { parseDate } from "../../../helpers/parseDate";
import { useSelector } from "react-redux";
import MyButton from "../../UI/MyButton";

const OneComment = ({comment, setModalActive, fetchDeleteComment}) => {
    const acc = useSelector(state => state.acc);
    console.log(comment);
    const handleEdit = () =>{
        setModalActive({text: comment.comment_text, commentId: comment.comment_id});
    }
    const handleDelete = () =>{
        fetchDeleteComment(comment.comment_id);
    }
    return (
        <li className={classes['one-comment']}>
            <div>
                <div className={classes["up-container"]}>
                    <div className={classes["comment-login"]}><p title="Login of author">{comment.login}</p></div>
                    {acc.login === comment.login ?
                        
                        <div className={classes["button-container"]}>
                            <MyButton onClick={handleEdit} title="Change comment"><i className="fa fa-pencil" aria-hidden="true"></i></MyButton>
                            <MyButton onClick={handleDelete} title="Delete comment"><i className="fa fa-times" aria-hidden="true"></i></MyButton>
                        </div> 
                        : 
                        <div className={classes['button-container']}></div>
                    }
                </div>
                <div className={classes["comment-text"]}><p title="comment">{comment.comment_text}</p></div>
            </div>
            <div className={classes['bottom-container']}>
                <p className={classes['isEdited']}>{comment.is_modified === 1 ? 'edited' :''}</p>
                <p className={classes['comment-date']} title="Date of publication">{parseDate(comment.comment_date)}</p>
            </div>
            
            
        </li>
    );
}

export default OneComment;