import axios from "axios";

const instance = axios.create({
    baseURL : "https://clr-backend.x-navi.de/",
    headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    },
})

export default instance;