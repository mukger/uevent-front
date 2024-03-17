import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import PostService from "../../API/PostService";
import MyInput from "../../components/UI/MyInput";
import { useFetching } from "../../hooks/useFetching";
import classes from './CompanyCreationPage.module.css';
import {getBrowserLocation} from '../../utils/geo.js';

import MyButton from "../../components/UI/MyButton";
import jwt_decode from "jwt-decode";
import DeleteContainer from "../../components/DeleteContainer/DeleteContainer";

import emailValidator from "../../helpers/validator/email";
import inputValidator from "../../helpers/validator/input";
import companyValidator from "../../helpers/validator/resultCompanyValidator";

import { Link } from "react-router-dom";
import MyLoader from "../../components/UI/MyLoader";

import MapContainer from "../../components/Navigations/MapContainer";
/*


 */

const CompanyCreationPage = () => {
    const router = useNavigate();
    const [company, setCompany] = useState({cname: '', cemail:'', company_account:'', name_place: ''});
    const [companyId, setCompanyId] = useState(null);
    const [center, setCenter] = useState({ lat: -6.745,lng: -38.523});
    const [isPatch, setIsPatch] = useState(0);
    const [modalActive, setModalActive] = useState(false);
    const [successRes, setSuccessRes] = useState(false);

    const [errorText, setErrorText] = useState('');
    const curTimeoutID = useRef(false);

    const [fetchGetCompanyInfo, isCompanyInfoLoading, errorGetCompanyInfoLoading] = useFetching(async (id) => {
        
        if(id.length === 0){
            const res = await PostService.getCompanyByUserId(localStorage.getItem('access'));
            if(res.data.company_id){
                router(`/create/company/${res.data.company_id}`);
            }

        }
        else{
            const res = await PostService.getCompanyByID(localStorage.getItem('access'), id);
            if(jwt_decode(localStorage.getItem('access')).id !== res.data.user_id){
                router('/error');
            } 
            else{
                setIsPatch(1);
                setCompanyId(res.data.company_id);
                setCompany({
                    cname: res.data.cname,
                    cemail: res.data.cemail,
                    company_account: res.data.company_account,
                    name_place: res.data.location.name_place,
                    cpicture: res.data.cpicture
                })
                
                setCenter({lat: res.data.location.latitude, lng: res.data.location.longitude})
            }
        }
    })

    const [fetchCreateCompany, isLoading, error] = useFetching(async()=>{

        if(isPatch === 1){
            
            await PostService.changeCompany(localStorage.getItem('access'), {
                cname: company.cname,
                cemail: company.cemail,
                company_account: company.company_account,
                location: {
                    name_place: company.name_place,
                    latitude: center.lat,
                    longitude: center.lng,
                }
            }, companyId);
        }
        else{
            await PostService.createCompany(localStorage.getItem('access'), {
                cname: company.cname,
                cemail: company.cemail,
                company_account: company.company_account,
                location: {
                    name_place: company.name_place,
                    latitude: center.lat,
                    longitude: center.lng,
                }
            })
        }
        setSuccessRes(true);
        setCompany({cname: '', cemail: '', company_account: '', name_place: ''})
        setTimeout(()=>{router('/events')}, 2000);
    })
    const handleSubmit = (e)=>{
        e.preventDefault();
        if(companyValidator(company, setErrorText, curTimeoutID)){
            fetchCreateCompany();
        }
    }

    useEffect(()=>{
        fetchGetCompanyInfo(window.location.pathname.slice('/create/company/'.length)); 
        if(window.location.pathname.length - '/create/company/'.length <= 0){
            getBrowserLocation().then((curLoc) => {
                setCenter(curLoc)
            })
            .catch((defaultLocation)=>{
                setCenter(defaultLocation);
            })
        } //eslint-disable-next-line
    }, [router])

    useEffect(() =>{
        if(error){
            if(error.data.message === 'Company with this name already exist'){
                setErrorText('This name is already registered. Try another one');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                curTimeoutID.current = id;
            }
            else if(error.data.message === 'Company with this email already exist'){
                setErrorText('This email is already registered. Try another one');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                curTimeoutID.current = id;
            }
            else if(error.data.message === 'Company with this account already exist'){
                setErrorText('This account is already used. Try another one');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                curTimeoutID.current = id;
            }
            else{ setTimeout(()=>{router('/error')}, 10) }  
        }
    }, [error, router]);

    useEffect(() =>{
        if(errorGetCompanyInfoLoading){
            if(errorGetCompanyInfoLoading.data.message === "This user didn't create a company"){
                
            }
            else{
                setTimeout(()=>{router('/error')}, 10);
            } 
        }
    }, [router, errorGetCompanyInfoLoading]);
    if(successRes){
        return(
            <div className={classes.companyCreationPage}>
                <p className={classes.header}>COMPANY CREATION</p>
                <div className={classes.resultText}>
                    <p className={classes.mainText}>Company successfully created.</p>
                    <p className={classes.secondText}>You will now be redirected to the main page.</p>
                </div> 
            </div>
        );
    }
    else if(isLoading || isCompanyInfoLoading){
        return(
            <div className={classes.companyCreationPage}>
                <p className={classes.header}>COMPANY CREATION</p>
                <p className={classes.loadingText}>Data is being loading. Wait...</p>
                <div className={classes.loader}>
                    <MyLoader />
                </div>
            </div>
        );
    }
    else{
        return (
            <div className={classes.companyCreationPage}>
                <p className={classes.header}>COMPANY CREATION</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="cname">Company name</label>
                    <MyInput 
                        id="cname"
                        value={company.cname} 
                        type="text"
                        placeholder="company name" 
                        onChange={e => {inputValidator(e.target, company, setCompany, setErrorText, curTimeoutID, "company name", 20, 'cname')}}
                    />
                    <label htmlFor="cemail">Company email</label>
                    <MyInput 
                        id="cemail"
                        value={company.cemail} 
                        type="text"
                        placeholder="company email" 
                        onChange={e => {emailValidator(e.target, company, setCompany, setErrorText, curTimeoutID)}}
                        
                    />
                    <label htmlFor="company_account">Company account</label>
                    <MyInput 
                        id="company_account"
                        value={company.company_account} 
                        type="text"
                        placeholder="company account" 
                        onChange={e => {inputValidator(e.target, company, setCompany, setErrorText, curTimeoutID, "company account", 50, "company_account")}}
                    />
                    <p className={classes["warning-text-container"]}>Be very careful. If you enter an incorrect account, users will not be able to purchase tickets. If you don't have an account yet, you can get instructions on how to register one  <Link to="https://www.liqpay.ua/en/authorization?return_to=%2Fen%2Fadminbusiness">here</Link></p>
                    <p className={classes["place-title"]}>Place</p>
                    <label htmlFor="name_place">name place</label>
                    <MyInput 
                        id="name_place"
                        value={company.name_place} 
                        type="text"
                        placeholder="place name" 
                        onChange={e => {inputValidator(e.target, company, setCompany, setErrorText, curTimeoutID, "place name", 60, 'name_place')}}
                    />
                    
                    <p className={classes["map-title"]}>Select place on map</p>
                    <div className={classes["map-container"]}>
                        <MapContainer isChangable={true} center={center} setCenter={setCenter}/>
                    </div>
                    {errorText && <p className={classes["error"]} >{errorText}</p>}
                    <MyButton>Submit</MyButton>
                </form>
                <div className={classes['promocode-link']}>
                    <Link to="/create/promocode">Create promocode</Link>
                </div>
                {isPatch ? 
                    <>
                        <div className={classes['delete-button-container']}>
                            <button type="button" className={classes['delete-button']} onClick={() =>{setModalActive(2)}}>Delete Company</button> 
                        </div>
                        <DeleteContainer modalActive={modalActive} setModalActive={setModalActive} type="company" id={null}/>
                    </> : <></>
                }
                
            </div>
        );
    }
}

export default CompanyCreationPage;