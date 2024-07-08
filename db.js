const mongoose = require('mongoose');
const url = 'mongodb+srv://admin:msR4dJhkKxhs9S7J@cluster0.3lxwknv.mongodb.net/paytmDatabase';

mongoose.connect(url).then(() => {
    console.log("DB Connected !!");
})

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
})

const User = mongoose.model('User', userSchema)

const accountSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId , ref:User , required:true},
    balance:{type : Number,required:true}
})                      

const Account  = mongoose.model('Account',accountSchema);


module.exports = {User,Account}; 