import axios from "axios";
//custom axios for easy change of server adress
const instance = axios.create({


    //produktiv version
    baseURL: "https://authenticate.sse.uni-hildesheim.de/",
    //testversion
    //baseURL: "http://147.172.178.30:8080/",
})


export default instance;