const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const {produceMessage} = require('./kafka');
const { v4: uuidv4 } = require('uuid');


const userSchema = new Schema({

  userId: {
    type: String,
    unique: true,
    required: true
  },       
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    unique: true,
    required: true
  },    
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String,
  }

},{ timestamps: true});



// Pre-save hook to hash password
userSchema.pre('save', async function() {

    // Hash password before saving
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        this.password =  await bcrypt.hash(this.password, salt);
    }
});


// Method to compare password
userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password,this.password);
}


// generate uuid for userId
userSchema.pre('validate', async function() {
    if (!this.userId) {
        this.userId = uuidv4();
    }
});


// Post-save hook to publish event to Kafka
userSchema.post('save', function(doc) {
    console.log('User has been saved:', doc);

    // publish event to kakfa for notification service
    produceMessage('user-created', { userId: doc.userId, email: doc.email, name: doc.name });

});


module.exports = mongoose.model('User', userSchema);