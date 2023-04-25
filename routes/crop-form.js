const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const Crop = require('../models/crop');

// Set up multer storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.resolve(), 'public', 'images'))
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(20, (err, buf) => {
      if (err) throw err;
      const filename = buf.toString('hex') + path.extname(file.originalname);
      cb(null, filename);
    });
  }
});

const upload = multer({ storage: storage });

// Route to show the form
router.get('/crop-form', (req, res) => {
  res.render('crop-form',{
    layout: false
  });
});

// Route to handle form submission
router.post('/crop-form', upload.single('image'), (req, res) => {
  const crop = new Crop({
    crop: req.body.crop,
    plant_name: req.body.plant_name,
    short_info: req.body.short_info,
    avg_len: req.body.avg_len,
    cultivation: req.body.cultivation,
    diseases: req.body.diseases,
    fertilizer: req.body.fertilizer,
    is_it_creeper: req.body.is_it_creeper,
    pesticides: req.body.pesticides,
    pre_plant_process: req.body.pre_plant_process,
    plantation_process: req.body.plantation_process,
    time_span: req.body.time_span,
    image: req.file.filename
  });

  crop.save()
    .then(result => {
      res.redirect('/crops/'+result._id);
    })
    .catch(err => {
      console.log(err);
    });
});


module.exports = router;
