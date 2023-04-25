// subcategory.js

const mongoose = require('mongoose');

const cropCategorySchema = new mongoose.Schema({
  crop: {
    type: mongoose.Types.ObjectId,
    ref: "crop"
  },
  name: String,
  short_info: String,
  avg_length: String,
  is_it_creeper: String,
  land_preparation: String,
  seed_treatment: String,
  sowing: String,
  irrigation: String,
  fertilizer_application: String,
  weed_control: String,
  pesticides: String,
  diseases: String,
  harvesting: String,
  image: String,
});

module.exports = mongoose.model('CropCategory', cropCategorySchema);
