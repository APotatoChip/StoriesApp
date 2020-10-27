const mongooose = require('mongoose');

const UserSchema = new mongooose.Schema({
googleId:{
    type:String,
    required:true
},
displayName:{
    type:String,

},
firstName:{
    type:String,
    
},
lastName:{
    type:String,
    
},
image:{
    type:String
},
createdAt:{
type:Date,
default:Date.now
}
});

module.exports = mongooose.model('User',UserSchema);