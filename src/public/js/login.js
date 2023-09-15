let botonLogin = document.getElementById("botonLogin")
botonLogin.onclick = (event)=>{
    event.preventDefault()
    login()
}


async function login(){

    let user=document.getElementById('email').value
    let password=document.getElementById('password').value

    let consulta = await fetch(`http://localhost:8080/api/session/login?user=${user}&pass=${password}`,{
        method:'get',
        headers: {
            "Content-Type": "application/json",
        }
    })

    let loginUser = await consulta.json()
    console.log(loginUser)
    if(await loginUser.status=='ERROR'){
        let alerta=document.getElementById('alerta')
        alerta.innerHTML= await loginUser.message
    }else{
        let usuarioLoged=document.getElementById('usuario')
        usuarioLoged.innerHTML=await loginUser.datos.first_name
        window.location.href="/products"

    }
    
   return loginUser
}

