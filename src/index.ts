import express =  require("express");
import cors from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";
const {router} = require("./service/user")

dotenv.config();

const app: express.Application = express();
const mongoose = require("mongoose");
const PORT:number = parseInt(process.env.PORT as string,10) || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api",router);

mongoose.connect('mongodb+srv://gans:h2STyFxD904o4gp5@cluster0.psmkd.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
},function(err:any) {
    if(err){
        console.log("System could not connect to mongodb server...");
    }else{
        console.log("System connected to mongodb server.");
    }
})

app.listen(PORT,() => console.log("Server Running"));