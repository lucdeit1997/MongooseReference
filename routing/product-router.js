const express = require('express');
const router = express.Router();
const product = require('../models/Product');
const bodyParser = require('body-parser');
const converToSlug = require('../utils/convertToSlug')
const verifyToken = require('../utils/verifyToken')
const jwt = require('../jwt')
router.use(bodyParser.urlencoded({
    extended: false
}))

router.post('/them-san-pham',verifyToken, (req, res) =>{
    jwt.verify(req.token).then(decode =>{
        if(decode.data.role !== 1)
            return res.json({
                message: 'ban ko co quyen'
            })
            const productBody = req.body;
            product.findOne({nameProduct: productBody.nameProduct }).then(result =>{
                if(result)
                    return res.json({
                        err: true,
                        message: 'NameProduct_Existed',
                    })
                    const productTemp = new product({
                        nameProduct: productBody.nameProduct,
                        slug       : converToSlug.convertToSlug(productBody.nameProduct),
                        image      : productBody.image,
                        category   : productBody.category,
                        author     : decode.data._id,
                    })
                
                    productTemp.save().then(result =>{
                        res.json({
                            error: false,
                            message: 'Them_Thanh_Cong',
                            data: result
                        })
                    })
                    .catch(err =>{
                        res.json({
                            error : true,
                            err
                        })
                    })
                 })
         })
})

router.get('/lay-san-pham-theo-id/:id', (req, res) =>{
    const  { id }  = req.params;
    product.findById(id).populate('category').populate('author').then(result =>{
        res.json({
            data: result
        })
    })
})

module.exports = router;