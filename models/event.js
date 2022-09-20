const {Schema, model} = require('mongoose');

const EventSchema = Schema({
    isActive: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    body:{
        type: String
    },
    image: {
        type: String,
        default: 'no-image.png'
    },
    info: {
        type: {
            category: {
                type: String
            },
            instructor: {
                type: String
            },
            initial_date: {
                type: Date
            },
            final_date: {
                type: Date
            },
            location: {
                type: String
            },
            modality: {
                type: String
            },
            link: {
                type: String
            }
            
        }
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

EventSchema.method('toJSON', function(){
    const { __v,  ...object } = this.toObject();
    // object.uid = _id
    return object;
});

module.exports = model('Event', EventSchema);