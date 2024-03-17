import React from "react";
import classes from './OneNotification.module.css';
import { Link } from "react-router-dom";
import { parseDate } from "../../helpers/parseDate";

const OneNotification = ({notification}) => {
    return (
        <div className={classes["one-notification"]}>
            {notification.event_id ?
                <>
                    <li className={classes["event-notification"]}><Link to={`/event/${notification.event_id}`} title="Event name">{notification.event_name}</Link></li>
                    <p className={classes["title-link"]}><span>Type:</span>Event notification</p>
                </>:
                <>
                    <li className={classes["company-notification"]}><Link to={`/company/info/${notification.company_id}`} title="Company name">{notification.company_name}</Link></li>
                    <p className={classes["title-link"]}><span>Type:</span>Company notification</p>
                </>
            }    
            <p className={classes["notification-desc"]}>{notification.ndescription}</p>
            <p className={classes["notification-date"]} title="Date of notification">{parseDate(notification.notification_date)}</p>
        </div>
    );
}

export default OneNotification;