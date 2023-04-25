const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const CropCategory = require('../models/CropCategory');

// Define storage for uploaded images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(path.resolve(), 'public', 'images'));
  },
  filename: function(req, file, cb) {
    // Generate a random 20-byte filename with the original file extension
    const ext = path.extname(file.originalname);
    const filename = Math.random().toString(36).substring(2, 22) + ext;
    cb(null, filename);
  }
});

// Create instance of multer for uploading images
const upload = multer({ storage: storage });


router.get('/create-crop-category/:cropId', function(req, res){
    res.render('category-form',{
        layout: false,
        cropId: req.params.cropId
    })
})
// Route to handle form submission and image upload
router.post('/create-crop-category', upload.single('image'), async (req, res) => {
  try {
    const {
      crop,
      name,
      short_info,
      avg_length,
      is_it_creeper,
      land_preparation,
      seed_treatment,
      sowing,
      irrigation,
      fertilizer_application,
      weed_control,
      pesticides,
      diseases,
      harvesting,
    } = req.body;

    // Create new CropCategory document
    const newCropCategory = new CropCategory({
      crop,
      name,
      short_info,
      avg_length,
      is_it_creeper,
      land_preparation,
      seed_treatment,
      sowing,
      irrigation,
      fertilizer_application,
      weed_control,
      pesticides,
      diseases,
      harvesting,
      image: req.file.filename // Save filename of uploaded image in the database
    });

    // Save new CropCategory document to the database
    const savedCropCategory = await newCropCategory.save();

    res.redirect('/crops/'+crop);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating crop category');
  }
});

module.exports = router;
