"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestResponse = exports.REST_RESPONSE_FAIL = exports.REST_RESPONSE_SUCCESS = exports.WHATSAPP_URL = void 0;
exports.WHATSAPP_URL = "https://web.whatsapp.com/";
exports.REST_RESPONSE_SUCCESS = {
    status: 200
};
exports.REST_RESPONSE_FAIL = {
    status: 422
};
class RestResponse {
    constructor() {
        this.status = 500;
    }
}
exports.RestResponse = RestResponse;
