
const private_key = process.env.REACT_APP_PRIVATE_KEY;

async function sha1(str, setSignature) { 
    const buf = Uint8Array.from(unescape(encodeURIComponent(str)), c => c.charCodeAt(0)).buffer; 
    const digest = await crypto.subtle.digest('SHA-1', buf); 
    const raw =  String.fromCharCode.apply(null, new Uint8Array(digest)); 
    setSignature(btoa(raw));
}
//ДОДАТИ eventID і user_id до jsona в desc
export function createSignString(transactionData, setSignature){
    const data = btoa(JSON.stringify(transactionData));
    const signString = private_key + data + private_key;
    sha1(signString, setSignature);
    return data;

}
//let data_obj = {eventId: event_id, userWhoSent_id:user_id}
/*
{"public_key":"sandbox_i11103808959",
"version":"3",
"action":"pay",
"amount":"3",
"currency":"UAH",
"description":base64(JSON.stringify(data_obj)),
"order_id":"100403d2001772232210", 
"server_url":"https://edd3-46-172-77-66.eu.ngrok.io/api/auth/test",
"result_url":"http://lms.khpi.ucode-connect.study/challenge_users/36600",
"split_rules":[{"public_key": "sandbox_i11103808959","amount": 3, "commission_payer": "receiver"}]
}
*/