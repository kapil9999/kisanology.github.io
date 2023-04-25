const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const CropCategory = require('../models/CropCategory');

router.get('/search', async (req, res) => {
  const query = req.query.q; // Get query string from request query

  try {
    // Search for crops that match query string in plant_name field
    const crops = await Crop.find({ plant_name: { $regex: query, $options: 'i' } })
                            .select('_id plant_name image short_info').lean();

    // Search for crop categories that match query string in name field
    const categories = await CropCategory.find({ name: { $regex: query, $options: 'i' } })
                                         .select('_id name image short_info').lean();

    crops.forEach(function(crop){
        crop.name= crop.plant_name;
        if(crop.plant_name)
            delete crop.plant_name;

        crop.link="/crops"+crop._id
        
        if(!crop.image)
            crop.image=`https://images.placeholders.dev/?width=600&height=400&text=${crop.name}&bgColor=%23f7f6f6&textColor=%236d6e71&fontSize=30`
        else
            crop.image="/images/"+crop.image
    })

    categories.forEach(function(category){
        category.link="/category-info/"+category._id

        if(!category.image)
            category.image=`https://images.placeholders.dev/?width=600&height=400&text=${category.name}&bgColor=%23f7f6f6&textColor=%236d6e71&fontSize=30`
        else
            category.image="/images/"+category.image
    })
    // Combine search results and send as response
    const results = [
      ...crops,
      ...categories,
    ];

    res.render('search',{
        results
    })
} catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;