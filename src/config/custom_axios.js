import axios from "axios";

const instance = axios.create({
    baseURL: "https://clr-backend.x-navi.de/jsonapi/node/",
    // baseURL : "https://clr-backend.ddns.net/jsonapi/node/",
    headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Cache-control': 'no-cache'
        // 'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
    },
})







export default instance;