import React from 'react';
import classes from './MyButton.module.css';
function MyButton({children, ...props}){
	return(
        <button className={classes.buttonClass} {...props} >
            {children}
        </button>
	)
}

export default MyButton;