const jwt = require("jsonwebtoken");
const { Users } = require("../models/user");

module.exports = (req: any, res: any, next: any) => {
    try{
        const authorization = req.headers["x-access-token"];
        console.log(authorization, "authorization");
        if (!authorization) {
          return res.status(401).json({
            message: "you must be logged in",
          });
        }
        const token = authorization.replace("Bearer ", "");
        jwt.verify(token, process.env.JWT_SECRETKEY, (err: any, payload: any) => {
          if (err) {
            console.log(err);
            return res.status(401).json({
              message: "you must be logged in",
            });
          }
          console.log(payload," payload")
          const { _id } = payload;
          Users.findById(_id)
            .then((userData: any) => {
              req.user = userData;
              next();
            })
            .catch((err: any) => {
              console.log(err);
            });
        });
    }
    catch(err){
        res.send(400).json({
            error:`error occured ${err}`
        })
    }
};
export {};
