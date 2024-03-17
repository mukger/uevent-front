import React, { useMemo } from 'react';
import classes from './Pagination.module.css';
const maxVisiblePages = 3; 
const Pagination = ({ page, totalPages, setPage }) => {


    const pageNumbers = useMemo(()=>{
        const pageNumbers = [];
 
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = endPage - maxVisiblePages + 1;
            }
    
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
        }
    
        return pageNumbers;
    }, [page, totalPages]);

    let first = useMemo(()=>page > (maxVisiblePages - 1) && totalPages > maxVisiblePages, [page, totalPages]);

    let last = useMemo(()=> page < (totalPages - 1) && totalPages > maxVisiblePages, [page, totalPages]);
    return (
        <nav>
            <ul className={classes.paginationBar}>
                {first && 
                <li className={classes.first}>
                    <button className={classes.linkPage} onClick={() => setPage(1)}>1</button>
                </li>
                }
                {pageNumbers.map((pageNumber) => (
                <li className={`${classes.pageLink} ${pageNumber === page ? classes.active : ''}`} key={pageNumber}>
                    <button onClick={() => { if(page !== pageNumber) setPage(pageNumber)}} >
                        {pageNumber}
                    </button>
                </li>
                ))}

                {last && (
                <li className={classes.last}>
                    <button 
                        onClick={() => {
                            setPage(totalPages);
                        }}>
                    {totalPages}
                    </button>
                </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;