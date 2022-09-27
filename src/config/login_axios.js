import axios from "axios";

const instance = axios.create({
    baseURL: "https://clr-backend.x-navi.de/",
    // baseURL : "https://clr-backend.ddns.net/",
    headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Cache-control': 'no-cache'
    },
})

export default instance;