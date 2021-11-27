var express = require('express');
const app = express();
const bodyParser=require('body-parser');
const dotenv=require('dotenv')
dotenv.config()
const port =process.env.PORT|| 5785;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const cors=require('cors')
/*https://eduintern-aug.herokuapp.com*/
/*const mongourl = "mongodb://localhost:27017"8*/
const mongourl="mongodb+srv://first:1234@cluster0.ywotg.mongodb.net/eduaug?retryWrites=true&w=majority"
var db;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors())
let col_name = "first"



app.get('/', (req, res) => {
    res.send('welcome to node api 2')
})

app.get('/location/',(req,res) =>{
           db.collection('location').find().toArray((err,result)=>{
        if(err) throw err;
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
app.get('/restaurant', (req,res) =>{
        db.collection('restaurant').find().toArray((err,result)=>{
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

   //list all Quicksearches
app.get('/quicksearch',(req,res) =>{
    db.collection('mealType').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

// restaurant Details
app.get('/details/:id',(req,res) => {
    var id = req.params.id
    db.collection('restaurents').find({_id:id}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

// place order 
app.post('/placeOrder',(req,res) => {
    console.log(req.body);
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send("Order Placed")
    })
})

//filterapi
app.get('/filter/:mealType',(req,res)=>{
    var mealType = req.params.mealType;
    var query = {"Type:mealtype":mealType};
    if(req.query.cuisine){
        query={"Type:mealtype.mealtype":mealType,"cuisine.cuisine":req.query.cuisine}
    }
    db.collection('restaurant').find(query).toArray.toArray((err, result) => {
        if(err)throw err;
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