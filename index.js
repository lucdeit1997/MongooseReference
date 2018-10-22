const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routerUser = require('./routing/user.router');
const routerCategory = require('./routing/category-router')
const roterProduct = require('./routing/product-router')
const routerTagging = require('./routing/tagging.router')
const bodyParser = require('body-parser');
const ejs = require('ejs');

app.use(bodyParser.urlencoded({
    extended: false
}))

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/nguoi-dung',routerUser );
app.use('/danh-muc', routerCategory);
app.use('/san-pham', roterProduct);
app.use('/tag', routerTagging);


const uri = 'mongodb://localhost:27017/MongooseReference'
mongoose.connect(uri, { useNewUrlParser: true })
const port = process.env.port || 3000;
mongoose.connection.once('open', ()=>{
    app.listen(port, ()=>{
        console.log('server start port:',`${port}`)
    })
})
