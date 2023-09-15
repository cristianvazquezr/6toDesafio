import passport from "passport";
import local from "passport-local";
import { userModel } from "../dao/models/user.model.js";
import { createHash } from "../utils.js";
import { isValidPassword } from "../utils.js";

const localStrategy=local.Strategy;
const initiliazePassport=()=>{

    passport.use('register',new localStrategy(
        {passReqToCallback:true,usernameField:"email"},async (req,username,password,done)=>{
            const {first_name,last_name, email, age, admin}=req.body
            try{
                let user=await userModel.findOne({email:username})
                if(user){
                    console.log("ya existe el usuario")
                    return done(null, false)
                }
                const newUser={
                    first_name,
                    last_name,
                    email,
                    age,
                    password:createHash(password),
                    admin,
                }
                let result=await userModel.create(newUser)
                return done(null,result)
            }catch (error){
                return done("error al obtener el usuario: " + error)
            }
        }
    ))
        
}

export default initiliazePassport;