const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User= require('../models/userModel')


const crearUsuario = asyncHandler(async (req, res) => {
    
    //Desestructuramos el body
    const {name, email, password} = req.body

    //Validamos la info
    if(!name || !email || !password){
        res.status(400)
        throw new Error('Faltan datos.')
    }
    
    //Verificamos si existe el usuario
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('Ese email ya está registrado.')
    }

    //Generamos Sal y hash
    const salt = await bcrypt.genSalt(10)
    const hashedPassword =  await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email
        })
    }else {
        res.status(400)
        throw new Error('Datos no válidos')
    }
})

const loginUser = asyncHandler(async (req, res) => {
    
    //desestructuramos el body
    const { email, password } = req.body
    
    //buscamos el usuario
    const user = await User.findOne({ email })

    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else {
        res.status(400)
        throw new Error ('Usuario o contraseña incorrectos')
    }

})

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

const misDatos = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

module.exports = {
    crearUsuario,
    loginUser,
    misDatos
}