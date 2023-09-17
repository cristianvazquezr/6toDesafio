import { Router } from "express"
import userMananger from '../dao/userMananger.js'
import passport from "passport"


//isntancio la clase cartManager

const UM = new userMananger()

const sessionRouter=Router()

// //login
// sessionRouter.get('/session/login', async (req, resp)=>{
//     let {user, pass}=req.query
//     let userlogged= await UM.login(user, pass)
//     delete userlogged.password
//     if(userlogged=="invalidUser"){

//         resp.status(400).send({status:'ERROR', message:"Usuario incorrecto"})
//     }
//     else if(userlogged=="invalidPassword"){
//         resp.status(403).send({status:'ERROR', message:"Clave incorrecta"})
//     }
//     else{
//         req.session.users = userlogged
//         resp.send({status:'OK', message:"usuario y clave correctos ", datos:userlogged})
//     }
        
// })




//login con passport 

sessionRouter.get('/session/login', passport.authenticate('login'), async(req, res)=>{
    if(!req.user) return res.status(400).send({status:"error",message:"credenciales invalidas"})
    req.session.user={
        fist_name:req.user.first_name,
        last_name:req.user.last_name,
        age:req.user.age,
        email:req.user.email,
        admin:req.user.admin
    }
    delete req.user.password
    res.send({status:"success", datos:req.user})
})


//registro
// sessionRouter.post('/session/register', async (req,resp)=>{
//     let{first_name,last_name, email, age, password, admin}=req.body
//     let userRegistered=await UM.addUser(first_name,last_name, email, age, password, admin)

//     if(userRegistered=="valorVacio"){
//         resp.status(400).send({status:"error", message:"complete los campos obligatorios"})
//     }else if(userRegistered=="emailRepetido"){
//         resp.status(400).send({status:"error", message:"ya existe un usuario con ese email"})
//     } else{
//         resp.status(200).send({status:"OK", message:"se agrego correctamente"})
//     }
    
// })



//registro con passport

sessionRouter.post('/session/register',passport.authenticate('register'), async (req, res)=>{
    res.send({status:"success", message:'user registered'})
})


//logout

sessionRouter.get('/session/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
})

//restore
sessionRouter.post('/session/restore', async (req, resp)=>{
    let {user, pass}=req.query
    let userlogged= await UM.restore(user, pass)
    delete userlogged.password
    if(userlogged=="invalidUser"){

        resp.status(400).send({status:'ERROR', message:"Usuario incorrecto"})
    }
    else{
        req.session.users = userlogged
        resp.send({status:'OK', message:"Clave modificada exitosamente ", datos:userlogged})
    }
        
})



export default sessionRouter