// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email                     : String,
        password_confirmation     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// generating a hash
userSchema.methods.generateHash = function(password_confirmation) {
    return bcrypt.hashSync(password_confirmation, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password_confirmation) {
    return bcrypt.compareSync(password_confirmation, this.local.password_confirmation);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
