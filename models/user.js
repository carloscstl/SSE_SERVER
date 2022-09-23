const {Schema, model} = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'no-image.jpg' 
    },
    role:{
        type:String,
        default:"user",
        enum:["admin","user"]
    },
    permissions:{
        type:[String],
        required:true
    }
});

UserSchema.method('toJSON', function(){
    const { __v,  ...object } = this.toObject();
    // object.uid = _id
    return object;
});

module.exports = model('User', UserSchema);