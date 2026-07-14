const mongoose = require('mongoose');

const classConfigSchema = new mongoose.Schema({
  classNumber: { type: Number, required: true, unique: true, min: 1, max: 10 },
  classCode: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^VGES-.+/.test(v); // Ensures it starts with 'VGES-'
      },
      message: props => `${props.value} is not a valid class code! Must start with 'VGES-'`
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('ClassConfig', classConfigSchema);