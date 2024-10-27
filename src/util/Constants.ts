export const WHATSAPP_URL = "https://web.whatsapp.com/";
export const MSG_USER = "{username}";

export const REST_RESPONSE_SUCCESS : RestResponse = {
    status : 200
}
export const REST_RESPONSE_FAIL : RestResponse = {
    status : 422
}

export class RestResponse {
    status : number = 500;
    msg ?: string;
}