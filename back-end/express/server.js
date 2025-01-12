const express = require("express");
const dbConnect = require("./config/db");
const cors = require("cors");
const verifyToken = require("./middlewares/verifyToken");

const server = express();
dbConnect()


server.use(express.json());
server.use(cors({
    origin : "http://localhost:5173",
    methods : ["GET","POST","PUT","DELETE"],
}));
server.use(verifyToken);

server.use("/api/notifications",require("./routes/notificationRoutes"));


server.listen(3000,() =>{
    console.log("running on port 3000");
})