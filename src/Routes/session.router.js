import { Router } from "express"
import userMananger from '../dao/userMananger.js'


//isntancio la clase cartManager

const UM = new userMananger()

const sessionRouter=Router()

//login
sessionRouter.get('/session/login', async (req, resp)=>{
    let {user, pass}=req.query
    let userlogged= await UM.login(user, pass)
    delete userlogged.password
    if(userlogged=="invalidUser"){

        resp.status(400).send({status:'ERROR', message:"Usuario incorrecto"})
    }
    else if(userlogged=="invalidPassword"){
        resp.status(403).send({status:'ERROR', message:"Clave incorrecta"})
    }
    else{
        req.session.users = userlogged
        resp.send({status:'OK', message:"usuario y clave correctos ", datos:userlogged})
    }
        
})

//registro
sessionRouter.post('/session/register', async (req,resp)=>{
    let{first_name,last_name, email, age, password, admin}=req.body
    let userRegistered=await UM.addUser(first_name,last_name, email, age, password, admin)

    if(userRegistered=="valorVacio"){
        resp.status(400).send({status:"error", message:"complete los campos obligatorios"})
    }else if(userRegistered=="emailRepetido"){
        resp.status(400).send({status:"error", message:"ya existe un usuario con ese email"})
    } else{
        resp.status(200).send({status:"OK", message:"se agrego correctamente"})
    }
    
})

//logout

sessionRouter.get('/session/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
})

//restore
sessionRouter.get('/session/restore', async (req, resp)=>{
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