const {Schema, model} = require('mongoose');

const UserRoleSchema = Schema({
    role: {
        type: String,
        required: true
    },
    permissions: {
        type: [String]
    }
});

UserRoleSchema.method('toJSON', function(){
    const { __v,  ...object } = this.toObject();
    // object.uid = _id
    return object;
});

module.exports = model('UserRole', UserRoleSchema);