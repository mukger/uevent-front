import ForgotPassword from "../pages/Authentication/ForgotPassword";
import Register from "../pages//Authentication/Register";
import PasswordReset from "../pages/Authentication/PasswordReset";

import EventPage from "../pages/EventPages/EventPage";

import EventCreationPage from "../pages/CompanyPages/EventCreationPage";
import CompanyCreationPage from "../pages/CompanyPages/CompanyCreationPage";

import UserInfo from "../pages/UserPages/UserInfo";
import CompanyInfo from '../pages/CompanyPages/CompanyInfo';
import Promocode from "../pages/Promocode/Promocode";
import PromocodeCreate from "../pages/Promocode/PromocodeCreate";
import Notifications from "../pages/UserPages/Notifications";
import Tickets from "../pages/Tickets/Tickets";

export const privateRoutes = [
    {path:'/event/:event_id', element: EventPage},
    {path:'/create/events', element: EventCreationPage},
    {path:'/create/events/:id', element: EventCreationPage},
    {path:'/create/company', element: CompanyCreationPage},
    {path:'/create/company/:id', element: CompanyCreationPage},
    {path: '/company/info/:id', element: CompanyInfo},
    {path:'/userInfo/:user_login', element: UserInfo},
    {path: '/promocode', element: Promocode},
    {path: '/create/promocode', element: PromocodeCreate},
    {path: '/notifications', element: Notifications},
    {path: '/tickets', element: Tickets}
];

/*
export const adminRoutes = [
    {path:'/events/:event_id', element: EventPage},
    {path:'/events/create', element: EventCreationPage},
    {path:'/company/:company_id', element: CompanyInfo},
    {path:'/company/create', element: CompanyCreationPage},
    {path:'/users/:user_id/events', element: UserEvents},
    {path:'/users/:user_id/subscriptions', element: UserSubscriptions},
    {path:'/users/:user_id', element: UserInfo},
];*/


export const publicRoutes = [
    {path:'/event/:event_id', element: EventPage},
    {path:'/register', element: Register},
    {path:'/forgot-password', element: ForgotPassword},
    {path:'/forgot-password/:token', element: PasswordReset},
    {path: '/company/info/:id', element: CompanyInfo}
    

];