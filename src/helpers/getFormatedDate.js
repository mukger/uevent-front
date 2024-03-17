function getFormatedDate(date){
    return `${date.year}-${
        (date.month + 1).toString().length === 1 ? '0' + (date.month + 1) : (date.month + 1)}-${
        date.date.toString().length === 1 ? '0' + date.date : date.date} ${
        date.hours.toString().length === 1 ? '0' + date.hours : date.hours}:${
        date.minutes.toString().length === 1 ? '0' + date.minutes : date.minutes}:00.00`
}

export default getFormatedDate;