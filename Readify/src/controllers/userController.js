const userModel = require("../Models/userModel");
const BookModel = require("../Models/bookModel");
const jwt = require("jsonwebtoken")
const validator = require('validator');
const { isValidPassword, isValidEmail, isValidName, isValidPhone } = require('../Validators/validatte');



//_______________________________________________________createUser________________________________________________________________________________________


const createUser = async (req, res) => {
    try {
        let userData = req.body
        if (Object.keys(userData).length == 0) return res.status(400).send({ status: false, message: "please enter some data in order to create..." })
        let { title, name, phone, email, password, address } = userData

        if (!title) return res.status(400).send({ status: false, message: "Title is required" })
        const validateTitle = ["Mr", "Mrs", "Miss"]
        if (!validateTitle.includes(title)) return res.status(400).send({ status: false, message: `Title can only contain ${validateTitle}` })

        if (name != undefined && (typeof (name) != "string")) {
            return res.status(400).send({ status: false, message: "plese enter valid name" })
        }
        if (!name || name.trim() == "") return res.status(400).send({ status: false, message: "name is required" })

        //if (!isValidName(name.trim())) return res.status(400).send({ status: false, message: "Please enter valid name" })

        if (phone != undefined && (typeof (phone) != "string")) {
            return res.status(400).send({ status: false, message: "plese enter valid phone number" })
        }

        if (!phone || (typeof (phone) == "string" && phone.trim() == "")) return res.status(400).send({ status: false, message: "Please enter phone number " })
        //if (!isValidPhone(phone.trim())) return res.status(400).send({ status: false, message: "Please enter valid phone number" })
        let isPhoneExist = await userModel.findOne({ phone: phone.trim() })
        if (isPhoneExist) return res.status(400).send({ status: false, message: "phone number already exist " })

        if (email != undefined && (typeof (email) != "string")) {
            return res.status(400).send({ status: false, message: "plese enter valid email" })
        }

        if (!email || email.trim() == "") return res.status(400).send({ status: false, message: "Please provide email" })
        if (!validator.isEmail(email.trim())) return res.status(400).send({ status: false, message: "Please provide valid email" })
        //if (isValidEmail(email.trim()) == false) return res.status(400).send({ status: false, message: "Please provide valid email" })
        let isEmailExist = await userModel.findOne({ email: email.trim() })
        if (isEmailExist) return res.status(400).send({ status: false, message: "email already exist " })

        if (password != undefined && (typeof (password) != "string")) {
            return res.status(400).send({ status: false, message: "plese enter valid password" })
        }

        if (!password || password.trim() == "") return res.status(400).send({ status: false, message: "please enter password" })
        
     if (!isValidPassword(password.trim())) return res.status(400).send({ status: false, message: "Password should contain Uppercase,Lowercase,Numbers,Special Characters,Minimum length should be 8 and maximun should be 15" })
        if (address) {
             if(typeof(address)!="object") return res.status(400).send({ status: false, message: "address should be an object" })

            let { street, city, pincode } = address
            if (street != undefined &&  typeof (street) != "string" && street.trim() == "") return res.status(400).send({ status: false, message: "please enter valid street name" })
            if (city != undefined && typeof (city) != "string" && city.trim() == "") return res.status(400).send({ status: false, message: "please enter valid city" })
            if (pincode != undefined &&  typeof (pincode) != "string"&&validator.isNumeric(pincode) && pincode.trim() == "") return res.status(400).send({ status: false, message: "please enter valid pincode" })
            //if(!/^[0-9]{6}$/.test(pincode)) return res.status(400).send({ status: false, message: "please enter valid pincode" })
        }
        userData.name = name.trim()
        userData.title = title.trim()
        userData.phone = phone.trim()
        userData.email = email.trim()
        userData.password = password.trim()
        let userDetails = await userModel.create(userData)
        res.status(201).send({ status: true, message: "success", data: userDetails })
    }

    catch (error) { res.status(500).send({ status: false, error: error.message }) }
}


//_______________________________________________________UserLongin________________________________________________________________________________________


const userLogin = async (req, res) => {
    try {
        let userData = req.body;
       // if (Object.keys(userData).length == 0) return res.status(400).send({ status: false, message: "please enter some data..." })
       // if (Object.keys(userData).length > 2) return res.status(400).send({ status: false, message: "enter only Email and Password" })
        let { email, password } = userData;



       // if (email!=undefined && typeof (email) == "string" ) return res.status(400).send({ status: false, message: "Please provide email" })
        if (!email ) return res.status(400).send({ status: false, message: "Please provide email" })
       //if (!validator.isEmail(email.trim())) return res.status(400).send({ status: false, message: "Please provide valid email" })
       // if (isValidEmail(email.trim()) == false) return res.status(400).send({ status: false, message: "Please provide valid email" })

        //if (password !=undefined && typeof (password) == "string" ) return res.status(400).send({ status: false, message: "please enter password" })
        if (!password ) return res.status(400).send({ status: false, message: "please enter password" })
      // if (!isValidPassword(password.trim())) return res.status(400).send({ status: false, message: "Please provide valid password" })

        let isUserExist = await userModel.findOne({ email: email, password: password})
        if (!isUserExist) return res.status(401).send({ status: false, message: "user Not found" }) //401 instead 404

        let token = jwt.sign({ userId: isUserExist._id, exp: (Math.floor(Date.now() / 1000)) + 84600 }, "project4");
        // console.log("date", Date.now())
        // const date = new Date();
       // console.log(`Token Generated at:- ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);

        res.setHeader("x-api-key", token);
      return  res.status(200).send({ status: true, message: 'Success', data: token })

    }
    catch (error) { 
        res.status(500).send({ status: false, error: error.message }) }
}

module.exports = { createUser, userLogin }