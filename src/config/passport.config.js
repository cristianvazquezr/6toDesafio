import passport from "passport";
import local from "passport-local";
import { userModel } from "../dao/models/user.model.js";
import { createHash } from "../utils.js";
import { isValidPassword } from "../utils.js";
import userMananger from "../dao/userMananger.js";

let UM = new userMananger()

const localStrategy=local.Strategy;
const initiliazePassport=()=>{

    passport.use('register',new localStrategy(
        {passReqToCallback:true,usernameField:"email"},async (req,username,password,done)=>{
            let{first_name,last_name, email, age, admin}=req.body
            try{
                let user=await userModel.findOne({email:username})
                if(user){
                    console.log("ya existe el usuario")
                    let alerta=document.getElementById('alerta')
                    alerta.innerHTML= "Usuario ya registrado, pruebe otro email"
                    return done(null, {message:"usuario registrado"})
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

      
    passport.use('login', new localStrategy(
        {usernameField:'email'}, async (username, password, done)=>{
        try{
            const user = await userModel.findOne({email:username})
            if(!user){
                console.log('el usuario elegido no existe')
                return done(null, false)
            }
            if(!isValidPassword(user,password)) return done (null, false);
            return done(null, user)
        }catch(err){
            return done(err);
        }
    }))

    passport.serializeUser((user, done)=>{
        done(null,user._id)
    })
    
    
    passport.deserializeUser(async (id,done)=>{
        let user = await userModel.findById(id);
        done(null,user)
    })
    
}




export default initiliazePassport;