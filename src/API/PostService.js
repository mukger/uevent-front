import axios from "axios";

import config from'../helpers/config.json';
const link  = config.server_url;


export default class PostService {
    static async login(login, password){
        let obj = {login:login, password:password}; 
        const response = await axios.post(`${link}/api/auth/login`,
        obj, 
        {
            'headers': {'Content-Type':'application/json', 'Accept':'application/json'},
            'withCredentials': true
        });
        return response;
    }

    static async register(login, password, email){
        let obj = {login:login, password:password, email:email};
        
        const response = await axios.post(`${link}/api/auth/register`,
        obj, 
        {
            'headers': {'Content-Type':'application/json', 'Accept':'application/json'},
            'withCredentials': true
        });
        return response;
    }
    static async forgotPassword(login){
        const response = await axios.post(
            `${link}/api/auth/password-reset`,
            {login: login}, 
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json'},
                'withCredentials': true
            });
        return response;
    }

    static async resetPassword(password, token, login){
        const response = await axios.post(
            `${link}/api/auth/password-reset/${token}`,
            {newpsw: password, repeatnewpsw: password, login: login},
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json'},
                'withCredentials': true
            });
        return response;
    }
    static async refreshToken(){
        const response = await axios.get(
            `${link}/api/auth/refresh`, 
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }
    static async logout(){

        const response = await axios.post(
            `${link}/api/auth/logout`, 
            {},
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json'},
                'withCredentials': true
            });

        return response;
    }
     
    static async getUserInfo(token){
        const response = await axios.get(
            `${link}/api/user`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'ngrok-skip-browser-warning':"69420", "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }
    static async changeUserInfo(token, info){
        const response = await axios.patch(
            `${link}/api/user`,
            info,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }
    static async changeAvatar(token, file){
        const formData = new FormData();

        formData.append('avatar', file);

        const response = await axios.patch(
            `${link}/api/user/avatar`,
            formData,
            {
                'headers': {'Content-Type':'multipart/form-data', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }

    static async deleteUser(token){
        const response = await axios.delete(
            `${link}/api/user`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }

    static async getEvents(token, filter){
        const response = await axios.get(
            `${link}/api/event?&sort=2&page=${filter.page ?? ''}${filter.theme ?? ''}${filter.format ?? ''}&search=${filter.search ?? ''}&future=${filter.future}`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }
   
    static async getEventByID(token, id){
        const response = await axios.get(
            `${link}/api/event/${id}`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }
    static async getEventVisitors(token, id){
        const response = await axios.get(
            `${link}/api/event/${id}/visitors`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }
    static async getEventsSimilar(token, filter, id){
 
        const response = await axios.get(
            `${link}/api/event/${id}/similar?sort=2&page=${filter.page ?? ''}&format=${filter.format}&theme=${filter.theme}`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }

    static async getEventsByCompany(token, filter, id){
 
        const response = await axios.get(
            `${link}/api/event/company/${id}/?page=${filter.page ?? ''}&sort=2`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }

    static async getEventsYourself(token){
 
        const response = await axios.get(
            `${link}/api/event/company/future`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }

    static async createEvent(token, data){

        const response = await axios.post(
            `${link}/api/event?utc=${-1 * (new Date().getTimezoneOffset() / 60)}`,
            JSON.stringify(data),
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }
    static async changeEvent(token, data, id){
        const response = await axios.patch(
            `${link}/api/event/${id}`,
            JSON.stringify(data),
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }

    static async changePicture(token, id, file){
        const formData = new FormData();

        formData.append('picture', file);

        const response = await axios.patch(
            `${link}/api/event/${id}/picture`,
            formData,
            {
                'headers': {'Content-Type':'multipart/form-data', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }
    static async deleteEvent(token, id){
        const response = await axios.delete(
            `${link}/api/event/${id}`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }
    static async callbackPay(token, foo){
        const response = await axios.post(
            `${link}/api/event/callback_pay`,
            {foo},
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }
    static async getCompanyByID(token, id){
        const response = await axios.get(
            `${link}/api/company/${id}`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }

    static async getCompanyByUserId(token){
        const response = await axios.get(
            `${link}/api/company/owner`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }
    

    static async createCompany(token, data){
        const response = await axios.post(
            `${link}/api/company`,
            JSON.stringify(data),
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }
    static async changeCompany(token, data, id){
        const response = await axios.patch(
            `${link}/api/company/${id}`,
            JSON.stringify(data),
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }

    static async deleteCompany(token){
        const response = await axios.delete(
            `${link}/api/company/`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }
    static async getSubscribeFromEvent(token, eventId){
        const response = await axios.get(
            `${link}/api/subscription/event/${eventId}`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }

    static async subscribeToEvent(token, eventId){
        const response = await axios.post(
            `${link}/api/subscription/event/${eventId}`,
            {},
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }
    static async unsubscribeFromEvent(token, eventId){
        const response = await axios.delete(
            `${link}/api/subscription/event/${eventId}`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }

    static async getSubscribeFromCompany(token, companyId){
        const response = await axios.get(
            `${link}/api/subscription/company/${companyId}`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }

    static async subscribeToCompany(token, companyId){
        const response = await axios.post(
            `${link}/api/subscription/company/${companyId}`,
            {},
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }
    static async unsubscribeFromCompany(token, companyId){
        const response = await axios.delete(
            `${link}/api/subscription/company/${companyId}`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`},
                'withCredentials': true
            });

        return response;
    }

    static async getAllNotifications(token){
        const response = await axios.get(
            `${link}/api/notification`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }

    static async getCommentsToEvent(token, eventId, page){
        const response = await axios.get(
            `${link}/api/comment/event/${eventId}?page=${page}`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }
    static async createCommentToEvent(token, eventId, data){
    
        const response = await axios.post(
            `${link}/api/comment/event/${eventId}`,
            JSON.stringify(data),
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }
    static async getCommentsToCompany(token, companyId, page){
        const response = await axios.get(
            `${link}/api/comment/company/${companyId}?page=${page}`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }
    static async createCommentToCompany(token, companyId, data){
        const response = await axios.post(
            `${link}/api/comment/event/${companyId}`,
            JSON.stringify(data),
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }
    static async changeComment(token, id, data){
        const response = await axios.patch(
            `${link}/api/comment/${id}`,
            JSON.stringify(data),
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }
    static async deleteComment(token, id){
        const response = await axios.delete(
            `${link}/api/comment/${id}`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////  PROMOCODE

    static async extendingPromocodeExpirationDate(token, data, promocodeId){
        const response = await axios.post(
            `${link}/api/promocode/extending/${promocodeId}?utc=${(-1 * new Date().getTimezoneOffset() / 60)}`,
            JSON.stringify(data),
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });
        
        return response;
    }

    static async getAllPromocodesByUser(token){
        const response = await axios.get(
            `${link}/api/promocode`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });
        
        return response;
    }

    static async getAllPromocodesByCompany(token){
        const response = await axios.get(
            `${link}/api/promocode/company`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });
        
        return response;
    }

    static async getAllPromocodesByEvent(token, eventId){
        const response = await axios.get(
            `${link}/api/promocode/used/${eventId}`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });
        
        return response;
    }

    static async deletePromocodeById(token, promocodeId) {
        const response = await axios.delete(
            `${link}/api/promocode/${promocodeId}`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });
        
        return response;
    }

    static async activatePromocode(token, data) {
        const response = await axios.post(
            `${link}/api/promocode/activate`,
            JSON.stringify(data),
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });
        
        return response;
    }

    static async createPromocode(token, data, eventId = '') {
        const response = await axios.post(
            `${link}/api/promocode?utc=${(-1 * new Date().getTimezoneOffset() / 60)}&eventId=${eventId}`,
            JSON.stringify(data),
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });
        
        return response;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////  TICKET

    static async getAllTicketsByCurrentUser(token) {
        const response = await axios.get(
            `${link}/api/ticket`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', "Authorization":`Bearer ${token}`, 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });
        
        return response;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async test(){
        const response = await axios.get(
            `${link}/api/auth/test`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'ngrok-skip-browser-warning':"69420"},
                'withCredentials': true
            });

        return response;
    }
    static async testPatch(){
        const response = await axios.patch(
            `${link}/api/auth/test`,
            {},
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json'},
                'withCredentials': true
            });

        return response;
    }
    static async testDelete(){
        const response = await axios.delete(
            `${link}/api/auth/test`,
            {
                'headers': {'Content-Type':'application/json', 'Accept':'application/json'},
                'withCredentials': true
            });

        return response;
    }
    static async getAll(limit = 10, page = 1, category= '', filter = '') {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts`, {
            params: {
                _limit: limit,
                _page: page,
                _category: category,
                _filter: filter
            }
        })
        
        return response;
    }

}