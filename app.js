const express = require( 'express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const cropsData= require('./utils/readXlsx');
const moment= require('moment');
const dbConnect= require('./utils/dbConnect');
const Crop= require('./models/Crop');
const CropCategory= require('./models/CropCategory')
const cropForm= require('./routes/crop-form')
const categoryForm= require("./routes/category-form")
const authRoutes= require("./routes/auth")
const searchRoutes= require('./routes/search')
const bodyParser = require('body-parser');
const faqRoutes= require('./routes/faq')
const postsRoutes= require("./routes/posts")


require('dotenv').config();



const app = express();
// HANDLEBARS CONFIG
app.engine('hbs', exphbs.engine({
  defaultLayout: "main",
  extname: ".hbs",
  helpers:{
    capitalizeFirst: function(str){
      return str[0].toUpperCase()+str.slice(1);
    },
    inc: function(value){
      return parseInt(value) + 1;
    },
    keyToAttr: function(str){
      str= str.replace(/_/g, ' ');
      return str[0].toUpperCase()+str.slice(1);
    },
    formatDate: function(date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a');
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', './views');
// HANDLEBARS CONFIG


(async function(){
  await dbConnect(process.env.MONGODB_URI, process.env.MONGODB_DB);
})()

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(path.resolve(), "public")))
app.use(cropForm);
app.use(categoryForm)
app.use(authRoutes)
app.use(searchRoutes)
app.use("/faq", faqRoutes)

app.use("/posts", postsRoutes)


// MIDDLEWARES




// ROUTING
app.get( "/",(req, res)=>{
    Crop.find().lean().then(function(crops){
      res.render('index', {
        crops,
        sidebarCrops: crops.slice(0, 7) 
      })
    }).catch(function(err){
      console.log(err);
    })
})


app.get("/crops/:cropId", function(req, res){
  
  CropCategory.find({crop: req.params.cropId}).lean().then(function(categories){
    categories.forEach(function(category){
      if(category && !category.image)
        category.image=`https://images.placeholders.dev/?width=600&height=400&text=${category.name}&bgColor=%23f7f6f6&textColor=%236d6e71&fontSize=30`
      else if(category)
        category.image="/images/"+category.image
    })

    res.render('categories', {
      categories,
      cropId: req.params.cropId
    })
  }).catch(function(err){
    console.log(err);
  })
  
})

app.get("/category-info/:categoryId", function(req, res){
  CropCategory
    .findOne({ _id: req.params.categoryId})
    .select('-__v -_id -crop')
    .lean()
    .then(function(category){
      let categoryImage=""
      if(category && !category.image)
        categoryImage=`https://images.placeholders.dev/?width=600&height=400&text=${category.name}&bgColor=%23f7f6f6&textColor=%236d6e71&fontSize=30`
      else if(category){
        categoryImage="/images/"+category.image
        delete category.image;
      }

      res.render('categoryInfo', {
        category,
        categoryImage
      })
    }).catch(function(err){
      console.log(err);
    })
})

app.get('/register', function(req, res){
  res.render('register', {
    layout: false
  })
})


app.get('/login', function(req, res){
  res.render('login', {
    layout: false
  })
})


app.get('/help', function(req, res){
  res.render('help')
})




// ROUTING



app.listen((process.env.PORT || 8080), function(){
  console.log("Listening on port "+(process.env.PORT || 8080));
})
