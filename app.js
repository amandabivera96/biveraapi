const express = require('express');
const app = express();
const port = process.env.PORT||9000;
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const path = require('path');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const mongourl="mongodb+srv://amandabivera:ammu123@cluster0.g2iwr.mongodb.net/biveraphotography?retryWrites=true&w=majority";
let db;
col_name1="categories";
col_name2="wedding";
col_name3="engagement";

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination:'./upload/images',
    filename: (req,file,cb) =>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage
})

//health check
app.get("/",(req,res ) => {
    res.send('Health OK');
})

app.use('/cateimg',express.static('upload/images'))

//To add Categories
app.post('/addcategories',upload.single('cateimg'),(req,res) => {
    console.log(req.file);
    db.collection(col_name1).insert(req.body,(err,result) => {
        if(err) throw err;
        res.json({
            success:1,
            cateimg_url:`http://biveraapi.herokuapp.com/cateimg/${req.file.filename}`
        })
    })
});

//categories route
app.get('/categories',(req,res)=>{
    db.collection('categories').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    });
});

//connection with mongo server
MongoClient.connect(mongourl,(err,connection) => {
    if(err) console.log(err);
    db = connection.db('biveraphotography');

    app.listen(port,(err) => {
        if(err) throw err;
        console.log(`server is running on port ${port}`)
    })
})