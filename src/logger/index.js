import customLogger from "./customLogger";

let logger = null;
if (process.env.NODE_ENV !== 'production') {
    logger = customLogger();
}

export default logger;