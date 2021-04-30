const express=require('express')
const app=express()
const bodyParser =require('body-parser')
const MongoClient=require('mongodb').MongoClient
var db;
var s;
MongoClient.connect('mongodb://localhost:27017/Generic',(err,database)=>{
    if(err) return console.log(err)
    db=database.db('Generic')
    app.listen(5000,()=>{
        console.log('Listening to port number 5000')
    })
})
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    var mysort={mid:1}
    db.collection('Medical').find().sort(mysort).toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('homepage.ejs',{data:result})
    })
})

app.get('/create',(req,res)=>{
    res.render('add.ejs')
})

app.get('/updatestock',(req,res)=>{
    res.render('update.ejs')
})

app.get('/deleteproduct',(req,res)=>{
    res.render('delete.ejs')
})

app.post('/AddData',(req,res)=>{
    const newItem={
        "mid": req.body.mid,
       "tname":req.body.tname,
       "tprice":req.body.tprice,
       "tab_per_strip":req.body.tab_per_strip,
       "stock":req.body.stock,
       "company":req.body.company
    }
    db.collection("Medical").insertOne(newItem
    ,(err,result)=>{
        if(err) return res.send(err)
        console.log(req.body.mid+" stock added")
        res.redirect('/')
    })
})
/*app.post('/AddData',(req,res)=>{
    db.collection('medicals').insertOne(req.body,(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})*/
app.post('/update',(req,res)=>{
    db.collection('Medical').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i<result.length;i++){
            if(result[i].mid==req.body.mid){
                s=result[i].stock
                break
            }
        }
        db.collection('Medical').findOneAndUpdate({mid:req.body.mid},{
            $set:{stock:parseInt(s)+parseInt(req.body.stock)}},
            (err,result)=>{
                if(err) return res.send(err)
                console.log(req.body.mid+ ' stock updated')
                res.redirect('/')
            })
    })
})

app.post('/delete',(req,res)=>{
    db.collection('Medical').findOneAndDelete({mid:req.body.id},(err,result)=>{
        if(err) return console.log(err)
        console.log(req.body.id+" stock deleted")
        res.redirect('/')
    })
})