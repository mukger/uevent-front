import React, {useEffect, useState} from "react";
import classes from './Comments.module.css';
import CommentsContent from "./Comments/CommentsContent";
import MyButton from "../UI/MyButton";
import CommentCreate from "./CommentsCreate/CommentsCreate";
import { useFetching } from "../../hooks/useFetching";
import PostService from "../../API/PostService";
import { useNavigate } from "react-router";

const LIMIT = 6;

const Comments = ({type, id}) => {
    const [modalActive, setModalActive] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [comments, setComments] = useState([]);
    const router = useNavigate();
    const [fetchCreateComment, isCreateLoading, createError] = useFetching(async (text = '', companyId = null) =>{
        if(companyId){
            await PostService.changeComment(localStorage.getItem('access'), companyId, {comment_text: text})
            setModalActive(false);
        }
        else{
            if(type === 1){
                await PostService.createCommentToEvent(localStorage.getItem('access'), id, {comment_text: text})
                setModalActive(false);
            }
            else if(type === 2){
                await PostService.createCommentToCompany(localStorage.getItem('access'), id, {comment_text: text})
                setModalActive(false);
            }
        } 
        fetchComments(1);
        setPage(1);
    });


    const [fetchComments, isCommentLoading, error] = useFetching(async (page = 1) => {
        let res = '';
        console.log(page);
        if(type === 1){
           res = await PostService.getCommentsToEvent(localStorage.getItem('access'), id, page);            
        }
        else if(type === 2){
            res = await PostService.getCommentsToCompany(localStorage.getItem('access'), id, page);
        }

        setTotalPage(Math.ceil(res.headers['x-total-count'] / LIMIT));

        if(page === 1){
            setComments(res.data);
        }
        else {
            setComments([...comments, ...res.data]);
        }        
    })

    const [fetchDeleteComment, isDeleteCommentLoading, errorDelete] = useFetching(async (id) => {
        await PostService.deleteComment(localStorage.getItem('access'), id);
        fetchComments(1);
        setPage(1);
    })

    useEffect(()=>{
        fetchComments(1);//eslint-disable-next-line
    }, []);

    useEffect(() =>{
        if(error|| errorDelete || createError){
            setTimeout(()=>{router('/error')}, 10);
        }
    }, [error, router, errorDelete, createError]);

    return (
        <div className={classes.comments}>
            {(page !== 1 || !isCommentLoading) ?
                <p className={classes['title']}>
                {comments.length > 0 ? 'Comments to this event' : 'There are currently no comments to this event:('}
                </p>:<></>
            }
            {(localStorage.getItem('access').length > 2) ?
                <>
                    <div className={classes["button-container"]}>
                    <MyButton onClick={()=>{setModalActive(true)}}>Create your comment</MyButton>
                    </div>
                    <CommentCreate 
                        modalActive={modalActive} 
                        setModalActive={setModalActive}
                        isCreateLoading={isCreateLoading}
                        fetchCreateComment={fetchCreateComment}
                    />
                </>
                :<></>
            }
            {comments.length > 0 ?
                <CommentsContent 
                    setModalActive={setModalActive}
                    comments={comments}
                    isCommentLoading={isCommentLoading}
                    isDeleteCommentLoading={isDeleteCommentLoading}
                    fetchDeleteComment={fetchDeleteComment}
                    page={page}
                    totalPage={totalPage}
                    setPage={setPage}
                    fetchComments={fetchComments}
                /> : <></>
            }
            
        </div>
    );
}

export default Comments;