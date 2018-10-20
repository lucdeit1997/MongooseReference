const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { sign, verify } = require('../jwt')
const verifyToken = require('../utils/verifyToken')
const TAG_MODEL = require('../models/Tag')
const PRODUCT_MODEL = require('../models/Product')
const convertToSlug = require('../utils/convertToSlug')

router.use(bodyParser.urlencoded({
    extended: false
}))

router.post('/them-tagging', verifyToken, (req, res) =>{
    verify(req.token).then(async result => {

        if(result.data.role == 1)
        { 
            const { title, description } = req.body;
            let newTagging = new TAG_MODEL({ title, description });
            let saveTagging = await newTagging.save();
            console.log({ saveTagging })
            if (!saveTagging) return res.json({ error: true, message: 'cannot_save_record_tagging' });
            return res.json({ error: false, message: 'save_success' });
        }
        else
        {
            res.json('bạn không có quyền truy cập');
        }
    })
})


router.get('/cap-nhat-product-tag/:productID/:tagID', async(req, res) => {
    const { productID, tagID } = req.params;

    // PUSH PRODUCT ITEM INTO TAGGING
    try {
        let updateTagging = await TAG_MODEL.findByIdAndUpdate(tagID, {
            $addToSet : {
                products: productID
            }
        }, { new: true });
        if (!updateTagging) return res.json({ error: true, message: 'cannot_update_tagging' });
    
        // PUSH TAG_ID INTO PRODUCT COLLECTIONS
        let updateProduct = await PRODUCT_MODEL.findByIdAndUpdate(productID, {
            $addToSet: {
                tags: tagID
            }
        }, { new: true });
        if (!updateProduct) return res.json({ error: true, message: 'cannot_update_product' });
    
        return res.json({
            error: false,
            message: 'update_success',
            data: {
                updateTagging, updateProduct
            }
        });
    } catch (error) {
        return res.json({ error: true, message: error.message })
    }
});

router.get('/access-1/:tagID', async(req, res) => {
    const { tagID } = req.params;

    let listProductOfTag = await TAG_MODEL.findById(tagID).populate('products');
    res.json({
        error: false,
        data: listProductOfTag
    })
})

router.get('/access-2/:productID', async(req, res) => {
    const { productID } = req.params;

    let listTagOfProduct = await PRODUCT_MODEL.findById(productID).populate('tags');
    let productLength    = listTagOfProduct.tags.length;
    res.json({
        error: false,
        data: listTagOfProduct,
        productLength 
    })
});

// 123q2792322,21321jhk2321po121,123123h12u3kli123
/**
 * /cap-nhat-product-arr-tag/sadasaks21312kj/123q2792322,21321jhk2321po121,123123h12u3kli123
 * /cap-nhat-product-arr-tag?productID=sadasaks21312kj&listTagId=123q2792322,21321jhk2321po121,123123h12u3kli123
 */

router.get('/cap-nhat-product-arr-tag', async(req, res) => {
    const { productID, listTagId } = req.query;
    let clearArr = listTagId.split(',');

    // PUSH PRODUCT ITEM INTO TAGGING
    try {
        // let updateTagging = await TAG_MODEL.findByIdAndUpdate(tagID, {
        //     $addToSet : {
        //         products: productID
        //     }
        // }, { new: true });
        // if (!updateTagging) return res.json({ error: true, message: 'cannot_update_tagging' });
    
        // PUSH TAG_ID INTO PRODUCT COLLECTIONS
        let updateProduct = await PRODUCT_MODEL.findByIdAndUpdate(productID, {
            $addToSet: {
                tags : {
                    $each: clearArr
                }
            }
        }, { new: true });
        if (!updateProduct) return res.json({ error: true, message: 'cannot_update_product' });
    
        return res.json({
            error: false,
            message: 'update_success',
            data: updateProduct
        });
    } catch (error) {
        return res.json({ error: true, message: error.message })
    }
});

module.exports = router;