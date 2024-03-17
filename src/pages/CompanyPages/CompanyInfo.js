import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router";

import { useFetching } from "../../hooks/useFetching";
import PostService from "../../API/PostService";
import classes from './CompanyInfo.module.css';
import { parseDate } from "../../helpers/parseDate";

import MapContainer from "../../components/Navigations/MapContainer";
import SimilarEvents from "../../components/SimilarEvents/SimilarEvents";

import MyLoader2 from "../../components/UI/MyLoader2";
import MyButton from "../../components/UI/MyButton";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
const CompanyInfo = () => {
    const [company, setCompany] = useState();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const router = useNavigate();
    const acc = useSelector(state => state.acc);

    const [fetchPost, isPostLoading, postError] =useFetching(async(id)=>{
        const response = await PostService.getCompanyByID(localStorage.getItem('access'), id);
 
        if(localStorage.getItem('access') && localStorage.getItem('access').length > 2 && jwt_decode(localStorage.getItem('access')).id !== response.data.user_id){
            fetchGetSubscribeEvent(response.data.company_id);
        }
        setCompany(response.data);
        window.scrollTo(0, 0);
        

    })

    const [fetchGetSubscribeEvent, isEventGetSubscribeLoading, eventGetSubscribeError] =useFetching(async(id)=>{
        const response = await PostService.getSubscribeFromCompany(localStorage.getItem('access'), id);
        if(response.data.user_id){
            setIsSubscribed(true);
        }
        else{
            setIsSubscribed(false);
        }
    })
    const [fetchSubscribeEvent, , eventSubscribeError] = useFetching(async()=>{
        if(isSubscribed){
            setIsSubscribed(isSubscribed => !isSubscribed);
            await PostService.unsubscribeFromCompany(localStorage.getItem('access'), company.company_id);
            
            
        }
        else {
            setIsSubscribed(isSubscribed => !isSubscribed);
            await PostService.subscribeToCompany(localStorage.getItem('access'), company.company_id);
            
        }
        
        
    })

    useEffect(()=>{
        fetchPost(window.location.pathname.slice(window.location.pathname.indexOf('company/info') + 12));//eslint-disable-next-line
    }, []);
    useEffect(() =>{
        if(postError || eventGetSubscribeError || eventSubscribeError){

            setTimeout(()=>{router('/error')}, 10);
        }
    }, [postError, eventGetSubscribeError, eventSubscribeError, router]);
    

    if(isPostLoading || isEventGetSubscribeLoading){
        return (
            <div className={classes["loader-component"]}>
                <p>Wait, information is being loaded...</p>
                <div>
                    <MyLoader2 />
                </div>
            </div>
        )
    }
    else{
        return (
            company ? 
                <div className={classes.companyInfo}>
                    <div className={classes["company-info-container"]}>
                        <p className={classes['main-title']}>Information about company</p>
                        <div className={classes["date"]}><p title="date of creating company"><span>Was registered in:</span>{parseDate(company.create_date)}</p></div> 
                        <div className={classes['center-container']}>
                            <div className={classes["left-part"]}>
                                <div className={classes["cname"]}><p title="company name">{company.cname}</p></div>
                                <div className={classes["email"]}>
                                    <p><span>email:</span> {company.cemail}</p>
                                </div>
                                {acc.auth && jwt_decode(localStorage.getItem('access')).id !== company.user_id ?
                                    <MyButton onClick={()=>{fetchSubscribeEvent()}}>{isSubscribed? "Unsubscribe from this company's notifications": "Subscribe to this company's notifications"}</MyButton>
                                    :<></>
                                }
                                
                            </div>
                            <div className={classes["place-container"]}>
                                <p className={classes['place-title']}>Place of company:</p>
                                <div className={classes.mapContainer}>

                                    <p className={classes["name-place"]} title="name of place">{company.location.name_place}</p>
                                    <div className={classes["map"]}>
                                    <MapContainer isChangable={false} center={{lat: company.location.latitude, lng: company.location.longitude}} setCenter={()=>{}}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes['company-posts']}>
                        <SimilarEvents id={company.company_id} format={''} theme={''} handleChangeId={fetchPost} isCompany={1} type={2}/>
                    </div>
                </div>
            :<></>
        );
    }
}
export default CompanyInfo;