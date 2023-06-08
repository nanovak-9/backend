const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler( async (req, res, next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            
            //Obtener el token del encabezado de autorizacion
            token = req.headers.authorization.split(' ')[1]

            //Verificamos el token
            const decoded=jwt.verify(token, process.env.JWT_SECRET)

            //Obtenemos el user del token
            req.user = await User.findById(decoded.id).select('-password')

            //Continuamos con la ejecución del programa
            next()

        } catch (error) {
            console.log(error)
            res.status(401) 
            throw new Error('Acceso no autorizado')                                                                       
        }
    }

    if(!token){
        res.status(401) 
        throw new Error('Acceso no autorizado. No se proporcionó un token.')
    }

})

module.exports = { protect }