const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const customerSchema = mongoose.Schema({
    firstname: {type:String, required:true},
    lastname: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    created_date: {type:Date, default: Date.now()}
});

let saltround = 5;
customerSchema.pre("save", function (next) {
  bcrypt.hash(this.password, saltround, (err, result) => {
    if (err) {
      return
    } else {
      this.password = result;
      next();
    }
  });
});

customerSchema.methods.validatePassword = function(password,callback){
    console.log(password)
    bcrypt.compare(password,this.password, (err,same)=>{
        if(!err){
            console.log(err)

            callback(err,same)
        }else{
            console.log("Tire")
            next()
        }
    })
}

const customerModel = mongoose.model("customer_details", customerSchema )

module.exports= customerModel;