const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
    let newUser = req.body
    let user_name = newUser.user_name;
    let password = newUser.password;
    const takenUser = await User.findOne({ user_name: user_name })
    if (takenUser) {
        res.status(406).send({ message: 'Kullanıcı adı kullanılıyor' })
    } else {
        newUser.password = bcrypt.hashSync(password)
        const user = new User(newUser)
        try {
            await user.save()
            res.status(200).send({ user })
        } catch (e) {
            res.status(400).send(e)
        }
    }

})

router.post('/login', async (req, res) => {
    let user_name = req.body.user_name;
    let password = req.body.password;
    const takenUser = await User.findOne({ user_name: user_name })
    if (!takenUser) {
        res.status(406).send({ message: 'Böyle bir kullanıcı bulunamadı' })
    } else {
        bcrypt.compare(password, takenUser.password).then(isCorrect => {
            if (isCorrect) {
                //doğru

                jwt.sign({ takenUser },
                    'benimsifremdebu',
                    { expiresIn: 86400 },
                    (err, token) => {

                        if (err) return res.json(err)
                        return res.send({ message: 'Success', token: 'Bearer' + token, code: 200 })
                    })
            } else {
                return res.send({ message: 'Şifre Yanlış', code: 403 })
            }
        })

    }

})

module.exports = router