import axios from "axios";

const instance = axios.create({
    baseURL : "https://clr-backend.x-navi.de/jsonapi/node/",
    headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
    },
})




export default instance;