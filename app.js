var express = require('express');
const app = express();

const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT || 5785;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const cors = require('cors')
//https://eduintern-aug.herokuapp.com
/*const mongourl = "mongodb://localhost:27017"*/
const mongourl = "mongodb+srv://first:1234@cluster0.ywotg.mongodb.net/eduaug?retryWrites=true&w=majority"
var db;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
let col_name = "first"



app.get('/', (req, res) => {
    res.send('welcome to node api 2')
})

app.get('/location/', (req, res) => {
    db.collection('location').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.get('/cuisine', (req, res) => {
    db.collection('cuisine').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})
app.get('/mealtype', (req, res) => {
    db.collection('mealType').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})
app.get('/restaurants', (req, res) => {
    db.collection('restaurants').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})
/////queryparams example/////
/*app.get('/restaurant', (req,res) =>{
    var cityId = req.query.cityId?req.query.cityId:2;
        db.collection('restaurant').find({city: cityId}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
    })
})*/
////params example////
/*app.get('/restaurant/:cityId', (req,res) =>{
    var cityId = req.params.cityId;
        db.collection('restaurant').find({city:cityId}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
    })
})*/

//List All cities
app.get('/location',(req,res) =>{
    db.collection('location').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//List all restaurants
app.get('/restaurants',(req,res) =>{
    db.collection('restaurants').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

// query example
app.get('/restaurant',(req,res) =>{
    var query = {}
    if(req.query.cityId){
        query={city:req.query.cityId}
    }else if(req.query.mealtype){
        query={"type.mealtype":req.query.mealtype}
    }
    db.collection('restaurents').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//filterapi
//(http://localhost:8210/filter/1?lcost=500&hcost=600)
app.get('/filter/:mealType',(req,res) => {
    var sort = {cost:1}
    var skip = 0;
    var limit = 1000000000000;
    if(req.query.sortkey){
        sort = {cost:req.query.sortkey}
    }
    if(req.query.skip && req.query.limit){
        skip = Number(req.query.skip);
        limit = Number(req.query.limit)
    }
    var mealType = req.params.mealType;
    var query = {"type.mealtype":mealType};
    if(req.query.cuisine && req.query.lcost && req.query.hcost){
        query={
            $and:[{cost:{$gt:Number(req.query.lcost),$lt:Number(req.query.hcost)}}],
            "Cuisine.cuisine":req.query.cuisine,
            "type.mealtype":mealType
        }
    }
    else if(req.query.cuisine){
        query = {"type.mealtype":mealType,"Cuisine.cuisine":req.query.cuisine }
       //query = {"type.mealtype":mealType,"Cuisine.cuisine":{$in:["1","5"]}}
    }
    else if(req.query.lcost && req.query.hcost){
        var lcost = Number(req.query.lcost);
        var hcost = Number(req.query.hcost);
        query={$and:[{cost:{$gt:lcost,$lt:hcost}}],"type.mealtype":mealType}
    }
    db.collection('restaurents').find(query).sort(sort).skip(skip).limit(limit).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//List all QuickSearches
app.get('/quicksearch',(req,res) =>{
    db.collection('mealType').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})



MongoClient.connect(mongourl, (err, client) => {
    if (err) console.log("Error While Connecting");
    db = client.db('eduaug');
    app.listen(port, () => {
        console.log(`listening on port no ${port}`)
    });
})