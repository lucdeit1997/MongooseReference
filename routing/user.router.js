const express = require('express');
const router = express.Router();
const { hash, compare } = require('bcrypt');
const bodyParser = require('body-parser');
const Users = require('../models/User');
const checkEmailExistence = require('../utils/checkExistence')
const checkPhone = require('../utils/checkPhone')
const { sign, verify } = require('../jwt')
const verifyToken = require('../utils/verifyToken')
router.use(bodyParser.urlencoded({
    extended: false
}))

router.post('/dang-ky.html', async(req, res) => {
    const userBody = req.body;
    const hashPassword = await hash(userBody.password, 8);
    const checkExist = await Users.findOne({
        $or: [
            { userName: userBody.userName },
            { email   : userBody.email    },
            { phone   : userBody.phone    }
        ]
    })
    if(checkExist)
        return res.json({
            error: true,
            message: 'Username || Email || phone => exist'
        })

    checkEmailExistence.checkExistence(userBody.email).then((result)=>{
        if(result.email == false) 
            return res.json({
                error: true,
                message: 'Email not Exist'
            })

            const checkPhoneNumber = checkPhone.checkValidatePhone(userBody.phone)
            if(!checkPhoneNumber)
                return res.json({
                    error: true,
                    message: 'Phone not Exist'
                })
            

            const UserTemp = new Users({
                fullName: userBody.fullName,
                userName: userBody.userName,
                email   : userBody.email,
                phone   : userBody.phone,
                password: hashPassword,
            })        
            UserTemp.save().then(result =>{
                res.json({
                    err: false,
                    message: 'register success',
                    data: result
                })
            }).catch(err =>{
                res.json({
                    err: true,
                    message: 'register faile',
                    data: err
                })
            })

        })
})

router.post('/dang-nhap.html', async (req, res)=>{
    const userBody = req.body;
    Users.findOne({
        $or:[
            { userName: userBody.userName, status: 1},
            { email : userBody.email , status: 1}
        ]
    }).then( async result =>{
        if(await compare(userBody.password, result.password))
        {
            const token = await sign({data: result});
             res.json({
                message: 'login success',
                data: result,
                token: token
             })
        }
        else
        {
            res.json({
                message: 'password failed',
             })
        }
    })
    .catch(errr =>{
        res.json({
            message: 'khong tim thay username || hoc chua duoc kich hoac'
        })
    })
})

router.post('/them-post', verifyToken, (req, res) =>{
    verify(req.token).then(result =>{
        if(result.data.role == -1)
            return res.json({ message: 'co quyen nhe'})
    })
})

module.exports = router;
