const {Schema, model} = require('mongoose');

const UserSchema = Schema({
    role: {
        type: Schema.Types.ObjectId,
        ref: 'UserRole',
        required: true,
        default: '63079e04d41eaef542bbfb5a'
    },
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
    profileActivated: {
        type: Boolean,
        default: false
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    }

});

UserSchema.method('toJSON', function(){
    const { __v,  ...object } = this.toObject();
    // object.uid = _id
    return object;
});

module.exports = model('User', UserSchema);