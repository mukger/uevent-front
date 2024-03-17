export default function eventValidator(event, date, isDatePicked, setErrorText, curTimeoutID, isPatch, publicationDate, isPublicationDatePicked, isPublicationDate){
    console.log(date);
    console.log()
    
    if(event.event_name.length < 4){
        setErrorText('Enter a name of your event with more than 4 characters');
        const id = setTimeout(()=>{setErrorText('')}, 2000);
        curTimeoutID.current = id;
        return false;
    }
    else if(event.edescription.length < 8){
        setErrorText('Enter a description of your event with more than 8 characters');
        const id = setTimeout(()=>{setErrorText('')}, 2000);
        curTimeoutID.current = id;
        return false;
    }
    else if(event.ticket_price.length <= 0){
        setErrorText('Enter price of ticket');
        const id = setTimeout(()=>{setErrorText('')}, 2000);
        curTimeoutID.current = id;
        return false;
    }
    else if(event.ticket_limit.length <= 0){
        setErrorText('Enter limit of tickets');
        const id = setTimeout(()=>{setErrorText('')}, 2000);
        curTimeoutID.current = id;
        return false;
    }
    else if(event.name_place.length <= 0){
        setErrorText('Enter name of your place');
        const id = setTimeout(()=>{setErrorText('')}, 2000);
        curTimeoutID.current = id;
        return false;
    }
    else if(!isPatch){
        if(!isDatePicked){
            setErrorText('You must choose date of event');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
            return false;
        }
        else if(new Date(date.year, date.month, date.date, date.hours, date.minutes).getTime() - new Date().getTime() <= 0){
            setErrorText('You cannot create event in past');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            curTimeoutID.current = id;
            return false;
        }
        else if(isPublicationDate){
            if(!isPublicationDatePicked){
                setErrorText('You must choose date of publication event');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                curTimeoutID.current = id;
                return false;
            }
            else if(new Date(publicationDate.year, publicationDate.month, publicationDate.date, publicationDate.hours, publicationDate.minutes).getTime() - new Date().getTime() <= 0){
                setErrorText('You cannot publish your event in past');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                curTimeoutID.current = id;
                return false;
            }
            else if(new Date(date.year, date.month, date.date, date.hours, date.minutes).getTime() -
            new Date(publicationDate.year, publicationDate.month, publicationDate.date, publicationDate.hours, publicationDate.minutes).getTime() <= 0){
                setErrorText('You cannot publish your event after its implementationin past');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                curTimeoutID.current = id;
                return false;
            }
            else{
                return true;
            }
        }
        else{
            return true;
        }
    }
    else{
        return true;
    }
}