
const express =require('express');
const app =express();
const cors = require('cors')
require("dotenv").config();
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const mongoose = require('mongoose')
const CUSTOMER_URI = process.env.CUSTOMER_URI
const PORT = process.env.PORT



app.listen(PORT, ()=>{
    // console.log(PORT, "Customer Server Started")
})
mongoose.connect(CUSTOMER_URI)
app.get("/", (req, res)=>{
    res.send({message: "Stop fidgeting and move"})
})

const {getCustomer, customerSignIn, customerSignUp} = require("./controllers/customer.controller")

app.post("/customers/sign-up", customerSignUp)
app.post("/customers/sign-in", customerSignIn)
app.get("/customers/get-customer", getCustomer)

