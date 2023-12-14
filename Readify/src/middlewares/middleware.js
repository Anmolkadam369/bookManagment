const userModel = require("../Models/userModel");
const BookModel = require("../Models/bookModel");
const jwt = require("jsonwebtoken");
const aws= require("aws-sdk")
const bookModel = require("../Models/bookModel");



const authentication = async (req, res, next) => {

    try {
        let token = req.headers["x-api-key"]
        if (token == undefined) {
            return res.status(401).send({ status: false, msg: "autentication token missing" })
        }
        jwt.verify(token, "project4", function (err, decodedToken) {
            if (err) {
                return res.status(400).send({ status: false, msg: err.message })
            } else {
                req.userId = decodedToken.userId;
                return next()
            }
        })
    }
    catch (error) { return res.status(500).send({ status: false, error: error.message }) }
}

const authorization = async (req, res, next) => {

    try {
        let userId = req.userId;
        let data = req.body;
        if (userId != data.userId) return res.status(403).send({ status: false, message: "Unauthorized" });
        next()
    }
    catch (error) { return res.status(500).send({ status: false, error: error.message }) }
}










module.exports = { authentication, authorization }