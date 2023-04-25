const xlsx = require("node-xlsx");
const path = require("path");
const Crop= require('../models/Crop');
const CropCategory= require("../models/CropCategory")


const dataFiles=[
    "crops_info.xlsx",
    "category_info.xlsx"
] 

let cropsData=[]
let categoriesData=[]

dataFiles.forEach(function(fileName, index){
    let dataArray;
    if(index==0)
        dataArray=cropsData
    else
        dataArray= categoriesData
    const sheets = xlsx
                .parse(
                    path
                        .join(
                            path
                            .resolve(),  
                            "data" , 
                            fileName
                        )
                );
    
    const keys=sheets[0].data[0].map(k=> k.toLowerCase());
    
    sheets[0].data.slice(1).forEach(function(row){
        if(!row.length)
            return;

        //64034c117a7b57f9573e7e1a

        const obj=arraysToObj(keys, row);
        
        if(index==1)
            obj['crop']='64034c117a7b57f9573e7e1a';
        dataArray.push(obj)
    })
})


// CropCategory.insertMany(categoriesData).then( function( results){
//     console.log(results);
// })


// CropCategory.find().select('-__v').lean().then(function(crops){
    
//     //console.log(JSON.stringify(crops, null , 4))
// })




function arraysToObj(keys, values){
    let obj={}
    values.forEach(function(value, index){
        
        if (typeof value === 'string' || value instanceof String)
            value= value.trim();

        let key=keys[index].replace(/ /g, '_');
        if(key=="sub_category")
            return;
        obj[key]= value;
    })
    return obj;
}

module.exports= cropsData