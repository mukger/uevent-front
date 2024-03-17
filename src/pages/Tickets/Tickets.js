import classes from './Tickets.module.css';

import { useEffect, useState } from "react";
import { useFetching } from "../../hooks/useFetching";

import Ticket from '../../components/Ticket/Ticket';

import PostService from "../../API/PostService";
import { useNavigate } from 'react-router';

const Tickets = () => {
    const router = useNavigate();
    const [tickets, setTickets] = useState([]);

    const [fetchTickets, isTicketsLoading, ticketError] = useFetching(async () => {
        const response = await PostService.getAllTicketsByCurrentUser(localStorage.getItem('access'));
        setTickets(response.data);
    });

    useEffect(()=>{
        fetchTickets();//eslint-disable-next-line
    }, []);

    useEffect(()=>{
        if(ticketError){
            router('/error');
        }
    }, [ticketError, router]);
    if(isTicketsLoading){
        return(
            <div>loader</div>
        )
    }
    else{
        return (
            <div className={classes.ticket}>
                {tickets.length > 0 ?
                    <p className={classes['title-ticket']}>Purchased tickets</p>
                    :<p className={classes['no-tickets']}>You have not bought a ticket for any of the events</p>
                }
                <ul>
                    {tickets.map(ticket => <Ticket ticket={ticket} key={ticket.ticket_id} />)}
                </ul>
            </div>
        );
    }
    
}

export default Tickets;
