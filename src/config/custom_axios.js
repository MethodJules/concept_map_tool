import axios from "axios";

const instance = axios.create({
    baseURL : "https://clr-backend.x-navi.de/jsonapi/node/",
    headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
    },
    // transformResponse: [function (data) {
    //     // Do whatever you want to transform the data
    //     return data;
    //   }],
})


export default instance;