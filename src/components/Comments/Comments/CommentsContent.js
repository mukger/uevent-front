import React, { useRef } from "react";
import classes from './CommentsContent.module.css';
import OneComment from "../OneComment/OneComment";
import MyLoader2 from "../../UI/MyLoader2";
import { useObserver } from "../../../hooks/useObserver";

const CommentsContent = ({setModalActive,  comments, isCommentLoading, isDeleteCommentLoading, fetchDeleteComment, page, totalPage, setPage, fetchComments}) => {

    const lastElement = useRef();

    useObserver(lastElement, page < totalPage, isCommentLoading, comments.length, comments, () => {
        fetchComments(page + 1);
        setPage(page + 1);
    })

    if(isDeleteCommentLoading || (isCommentLoading && page === 1)){
        return(
            <div className={classes["loader-container"]}>
                <MyLoader2 />
            </div>
        )
    }
    return (
        <div className={classes["comments-list"]}>
            {comments.length > 0 ?
                <div>
                    <ul>
                        {comments.map((comment)=> 
                            <OneComment 
                                comment={comment} 
                                key={comment.comment_id}
                                setModalActive={setModalActive}
                                fetchDeleteComment={fetchDeleteComment}
                            />)
                        }
                    </ul>
                    {isCommentLoading
                        ?<>
                            <div className={classes["loader-container"]}>
                                <MyLoader2 />
                            </div>
                        
                        </>
                        :<></>
                        
                    }
                </div>:<></>
            }
            <div ref={lastElement} />
        </div>
    );
}

export default CommentsContent;






