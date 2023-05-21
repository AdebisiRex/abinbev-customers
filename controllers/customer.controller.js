const customerModel = require("../models/customer.model");
const jwt = require("jsonwebtoken");

const customerSignUp = (req, res) => {
  let form = new customerModel(req.body);
  form
    .save()
    .then((result) => {
      res
        .status(200)
        .send({ status: true, message: "Account Creation Successful" });
    })
    .catch((err) => {
      res.status(401).send({
        status: false,
        error: err.message,
        message: "There was an error",
      });
    });
};

const customerSignIn = (req, res) => {
  let { email, password } = req.body;

  customerModel
    .findOne({ email: email })
    .then((customer) => {
      if (!customer) {
        res.status(403).send({
          status: false,
          message:
            "This customer is not registered, Please Register before Signin in",
        });
      } else {
        customer.validatePassword(password, (err, same) => {
          if (err) {
            res.send({
              status: false,
              message: "Validation Issues, contact developer",
            });
          } else {
            if (!same) {
              res
              .status(403)  
              .send({
                  message: "Check Password and Try Again",
                  status: false,
                })
                ;
            } else {
              let secret = process.env.JWT_SECRET;
              let token = jwt.sign({ email }, secret, { expiresIn: "2h" });
              res
              .status(200)
                .send({
                  message: "Sign in successful",
                  status: true,
                  token,
                })
                ;
            }
          }
        });
      }
    })
    .catch((err) => {
      res.status(401).send({
        status: false,
        message: "there was an error",
        error: err.message,
      });
    });
};

const getCustomer = (req, res) => {
  let secret = process.env.JWT_SECRET;
  let token = req.headers.authorization;

  jwt.verify(token, secret, (err, result) => {
    if (err) {
      res.status(403).send({
        status: false,
        message: "Session Expired, Please Signin Again",
        err: err.message
      });
  
    } else {
      let { email } = result;
      // console.log(email)
      customerModel.findOne({ email }).then((customer) => {
        if (customer) {
          // console.log(customer)
          let { firstname, lastname, email, created_date, _id } = customer;
          let newObj = { firstname, lastname, email, created_date, _id };

          let secret = process.env.JWT_SECRET;
          let customerToken = jwt.sign({ newObj }, secret);

          res.status(200).send({
            customerToken,
            message: "Customer information Fetched",
            status: true,
          });
        } else {
          res.status(404).send({ message: "User Not found", status: false });
        }
      });
    }
  });
};

module.exports = { getCustomer, customerSignIn, customerSignUp };
