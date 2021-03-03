const express = require('express');
const app = express();
const port = process.env.PORT||9000;
const bodyParser = require('body-parser');
const cors = require('cors');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const mongourl="mongodb+srv://amandabivera:ammu123@cluster0.g2iwr.mongodb.net/biveraphotography?retryWrites=true&w=majority";
let db;
col_name1="categories";

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//health check
app.get("/",(req,res ) => {
    res.send('Health OK');
})

//To add Categories
app.post('/addcategories',(req,res) => {
    console.log(req.file);
    db.collection(col_name1).insert(req.body,(err,result) => {
        if(err) throw err;
        res.send(result);
    })
});

//categories route
app.get('/categories',(req,res)=>{
    var condition={};
    //get category on basis of catename
    if(req.query.catename){
        condition = {catename:req.query.catename}
    }
    db.collection('categories').find(condition).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    });
});

//features route
app.get('/features',(req,res) => {
    db.collection('features').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

//work route
app.get('/works',(req,res) => {
    var condition={};
    //get work on basis of worktype & workname
    if(req.query.worktype && req.query.wname){
    condition = {$and:[{worktype:req.query.worktype},{wname:req.query.wname}]}
    }
    //get work on basis of worktype
    else if(req.query.worktype){
        condition = {worktype:req.query.worktype}
    }
   
    db.collection('works').find(condition).toArray((err,result) => {
        if(err) throw err;
        res.send(result);
    })
})

//post contact
app.post('/addcontact',(req,res) => {
    db.collection('contact').insert(req.body,(err,result) => { 
        if(err) throw err;
        res.send(result);
    })
})

//contact route
app.get('/getcontact',(req,res) => {
    db.collection('contact').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})


//connection with mongo server
MongoClient.connect(mongourl,(err,connection) => {
    if(err) console.log(err);
    db = connection.db('biveraphotography');

    app.listen(port,(err) => {
        if(err) throw err;
        console.log(`server is running on port ${port}`)
    })
})