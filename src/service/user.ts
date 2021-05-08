import express = require("express");
import { TokenClass, tokenToString } from "typescript";
const router = express.Router();
const { Users } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/authorize");

router.post("/signup", (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name && !email && !password) {
      let err = new Error("All fields are mandatory");
      res.status(400).json({
        message: err.message,
      });
    }
    Users.findOne({ email }).then((userExist: any) => {
      if (userExist) {
        res.status(401).json({
          error: "User is already registered please sign in",
        });
      }
      bcrypt.hash(password, 12).then((hashPwd: string) => {
        const user = new Users({ name, email, password: hashPwd });
        user.save().then((userSaved:any) => {
            res.status(200).json({
                message:`${userSaved.name} saved successfully continue sign in`,
              });
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: `error occured ${error}`,
    });
  }
});

router.post("/login", (req,res) => {
    const {email,password} = req.body;
    if(!email && !password){
        let err = new Error("All fields are mandatory");
        res.status(400).json({
          message: err.message,
        });
    }
    Users.findOne({email})
        .then((user:any) => {
            if(!user){
                res.status(400).json({
                    message: "Invalid email Id or password",
                    });
            }
            bcrypt
                .compare(password,user.password)
                .then((doMatch:any) => {
                    if(!doMatch){
                        res.status(400).json({
                            message: "Invalid email Id or password",
                            });
                    }else{
                        const token = jwt.sign({
                            _id:user._id,
                        },
                        process.env.JWT_SECRETKEY
                        );
                        res.setHeader("X-ACCESS-TOKEN",`Bearer ${token}`);
                        res.status(200).json({
                            message:"Signin successfull"
                        })
                    }
                })
        })
        .catch((error:any) => {
            console.log(error);
            res.status(400).json({
            error: `error occured ${error}`,
            });
        })
})

router.get("/getAllUsers",requireLogin,(req,res) => {
        Users
        .find({})
        .then((data:any) => {
            res.status(200).json({
                data
            })
        })
        .catch((error:any) => {
            console.log(error);
            res.status(400).json({
            error: `error occured ${error}`,
            });
        })
})
module.exports = {router};