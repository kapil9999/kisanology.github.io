
// subcategory.js

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    plant_name: String,
    short_info: String,
    avg_len: String,
    cultivation: String,
    diseases: String,
    fertilizer: String,
    is_it_creeper: String,
    pesticides: String,
    pre_plant_process: String,
    plantation_process: String,
    time_span: String,
    image: String
});

module.exports = mongoose.models.crop || mongoose.model('crop', categorySchema);



