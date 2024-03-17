import getNameMonth from "./getNameMonth";

export function parseDate(date){
    const parsedDate = new Date(new Date(date).getTime() + 2 * 60 * 60 * 1000);
    const curDate = Date.now();
    let diff = curDate - parsedDate.getTime();
    if(diff < 0) {
        diff = diff * -1;
        if(diff < 1000 * 60){
            return `in ${Math.floor(diff / 1000)}s`
        }
        else if(diff < 1000 * 60 * 60){
            return `in ${Math.floor(diff / 60000)}m`
        }
        else if(diff < 1000 * 60 * 60 * 24){
            const res = Math.floor(diff / 3600000);
            if(res === 1){
                return `in ${res} hour`
            }
            else {
                return `in ${res} hours`;
            }
            
        }
        else if(diff < 1000 * 60 * 60 * 24 * 365){
            return `${parsedDate.getHours()}:${(parsedDate.getMinutes() < 10 ? '0' : '') + parsedDate.getMinutes()} ${getNameMonth(parsedDate.getMonth())} ${parsedDate.getDate()}`;
        }
        else {
            return `${parsedDate.getHours()}:${(parsedDate.getMinutes() < 10 ? '0' : '') + parsedDate.getMinutes()} ${getNameMonth(parsedDate.getMonth())} ${parsedDate.getDate()}, ${parsedDate.getFullYear()} year`;
        }
    } 
    else {
        if(diff < 1000 * 60){
            return `${Math.floor(diff / 1000)}s ago`
        }
        else if(diff < 1000 * 60 * 60){
            return `${Math.floor(diff / 60000)}m ago`
        }
        else if(diff < 1000 * 60 * 60 * 24){
            const res = Math.floor(diff / 3600000);
            if(res === 1){
                return `${res} hour ago`
            }
            else {
                return `${res} hours ago`;
            }
            
        }
        else if(diff < 1000 * 60 * 60 * 24 * 365){
            return `${parsedDate.getHours()}:${(parsedDate.getMinutes() < 10 ? '0' : '') + parsedDate.getMinutes()} ${getNameMonth(parsedDate.getMonth())} ${parsedDate.getDate()}`;
        }
        else {
            return `${parsedDate.getHours()}:${(parsedDate.getMinutes() < 10 ? '0' : '') + parsedDate.getMinutes()} ${getNameMonth(parsedDate.getMonth())} ${parsedDate.getDate()}, ${parsedDate.getFullYear()} year`;
        }
    }
   
}