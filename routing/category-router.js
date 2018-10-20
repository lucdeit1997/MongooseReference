const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { sign, verify } = require('../jwt')
const verifyToken = require('../utils/verifyToken')
const category = require('../models/category')
const convertToSlug = require('../utils/convertToSlug')

router.use(bodyParser.urlencoded({
    extended: false
}))

router.post('/them-danh-muc', verifyToken, (req, res) =>{
    verify(req.token).then(result => {

        if(result.data.role == 1)
        { 
            const categoryBody = req.body;
            const categorySlug = convertToSlug.convertToSlug(categoryBody.title) 
            category.findOne({ title: categoryBody.title }).then(result =>{
                if(result)
                    return res.json({
                        error: true,
                        message: 'Category Tồn tại'
                    })
                const categoryTemp = new category({
                    title: categoryBody.title,
                    slug: categorySlug,
                    description: categoryBody.description
                })
                categoryTemp.save().then(result =>{
                    res.json({
                        error: false,
                        data: result,
                    })
                }).catch(err =>{
                    res.json({
                        err
                    })
                })
            })
        }
        else
        {
            res.json('bạn không có quyền truy cập')
        }
    })
})
module.exports = router