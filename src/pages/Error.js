import React from "react";
import { Link } from "react-router-dom";
import classes from './Error.module.css';
const Error = () => {
    return (
        <div className={classes["error-page"]}>
            <p className={classes["header"]}>Error 404</p>
            <p className={classes["error-text"]}>An error occurred during your last action. Try again</p>
            <div className={classes["error-image"]}>
                <img src='https://cdn-icons-png.flaticon.com/512/580/580185.png' alt='error'/>
            </div>
            <div className={classes["error-posts"]}>
                <Link to='/events'>Main page</Link>
            </div>
        </div>
    );
}

export default Error;