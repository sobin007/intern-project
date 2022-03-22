const router = require("express").Router();
const { empty } = require("statuses");
const userModel = require("../Models/userModel");
//cost router= express
const Sentry = require('@sentry/node')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const defaults = require('../default')
const TokenModel = require('../Models/tokenModel')
const auth = require('../middlewares/auth')

//check phone//
router.post('/check/phone', async (req, res) => {
    try {
        var { phonenumber } = req.body;
        if (phonenumber == null || phonenumber == undefined) {
            res.status(200).json({
                status: false,
                msg: "Phone number not provided"
            });
            return;
        }
        console.log(phonenumber)
        var data = await userModel.findOne({ mobileNumber: phonenumber, status: 'active' })
        //if (data) {
        res.status(200).json({
            status: true,
            exists: true,
            //data: data,
            msg: "User found"
        });
        return;
        //}
        // else {
        //     res.status(200).json({
        //         status: false,
        //         exists: false,
        //         msg: "User not found please register"
        //     });
        //     return;
        // }
    } catch {
        res.status(500).json({
            status: false,
            msg: "internal server error"
        });
        return;
    }
})


// new Registration //d 
router.post('/user/registration', async (req, res) => {
    try {
        var { firstname, lastname, phone, houseName, place, pincode, password } = req.body;
        if (firstname == null || firstname == undefined) {
            res.status(200).json({
                status: false,
                msg: "First Name not provided"
            });
            return;
        }
        if (lastname == null || lastname == undefined) {
            res.status(200).json({
                status: false,
                msg: "Last Name not provided"
            });
            return;
        }
        if (password == null || password == undefined) {
            res.status(200).json({
                status: false,
                msg: "Password not provided"
            });
            return;
        }
        if (phone == null || phone == undefined) {
            res.status(200).json({
                status: false,
                msg: "Phone number not provided"
            });
            return;
        }
        if (houseName == null || houseName == undefined) {
            res.status(200).json({
                status: false,
                msg: "house name not provided"
            });
            return;
        }
        if (place == null || place == undefined) {
            res.status(200).json({
                status: false,
                msg: "Place not provided"
            });
            return;
        }
        if (pincode == null || pincode == undefined) {
            res.status(200).json({
                status: false,
                msg: "Pincode not provided"
            });
            return;
        }
        var data = await userModel.findOne({ mobileNumber: phone })
        if (data != null || data != undefined) {
            res.status(200).json({
                status: false,
                msg: "Phone number already registered"
            });
            return;
        }
        var encryptedPassword = await bcrypt.hash(password, 10);
        var user = new userModel({
            firstName: firstname,
            lastName: lastname,
            houseName: houseName,
            place: place,
            pincode: pincode,
            mobileNumber: phone,
            password: encryptedPassword

        })
        await user.save()
        // token = jwt.sign({
        //     id: user._id,
        //     user: user
        // }, defaults.token, { expiresIn: 31536000 });
        // user.token = token;
        // var tok = TokenModel(
        //     {
        //         userid: user._id,
        //         role: user.role,
        //         tokenvalue: token
        //     })
        // await tok.save();
        // console.log(user)
        //user = JSON.stringify(user);
        user = JSON.parse(JSON.stringify(user))
        delete user.password;
        res.status(200).json({
            status: true,
            msg: "resgistration sucessfull",
            user: user
        })
        return;
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: false,
            msg: "internal server error"
        });
    }
})

router.get('/user/logout', auth, async (req, res) => {
    try {
        var verificationHeader = req.headers['token'];
        if (verificationHeader === undefined || verificationHeader === null || verificationHeader === '') {
            res.status(200).json({
                status: false,
                logout: false,
                msg: 'token not found'
            });
            return;
        }
        var toks = await TokenModel.findOneAndRemove({ userid: req.user.id, status: 'Active' });

        console.log("logout sucess")
        res.status(200).json(
            {
                status: true,
                msg: 'logged out',
            })

    }
    catch (e) {
        console.log(e);
        Sentry.captureException(e);
        res.status(200).json(
            {
                status: false,
                data: null
            })
    }
})

router.post('/user/login', async (req, res) => {
    try {
        var { phone, password } = req.body;
        //console.log(req.body)
        if (!((phone) && (password))) {
            res.status(400).send("All input is required");
            return;
        }
        var user = await userModel.findOne({ mobileNumber: phone, status: 'active' })
        if (!(user)) {
            res.status(200).json({
                status: false,
                msg: "user not found"
            });
            return;
        }
        //console.log(user)
        var rslt = await bcrypt.compare(password, user.password)
        if (rslt) {
            token = jwt.sign({
                id: user._id,
                user: user,
                role: user.role,
            }, defaults.token, { expiresIn: 31536000 });
            user.token = token;
            var tok = TokenModel(
                {
                    userid: user._id,
                    role: user.role,
                    tokenvalue: token
                })
            await tok.save();
            //user = JSON.stringify(user);
            user = JSON.parse(JSON.stringify(user))
            delete user.password;
            res.status(200).json({
                status: true,
                token: token,
                data: user,
                msg: "user login sucess"
            });
            return;
        }
        else {
            res.status(200).json({
                status: false,
                msg: "invalid password"
            });
            console.log("Invalid Credentials or user not found")
            return;
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: false,
            msg: "internal server error"
        });
    }
})

//view all users
router.get('/view/all/user', async (req, res) => {
    try {
        var data = await userModel.find({ status: 'active' })
        res.status(200).json({
            status: true,
            msg: "users found",
            data: data
        })

    } catch (err) {
        console.log(err)
        Sentry.captureException(err);
        res.status(500).json({
            status: false,
            msg: "internal server error"
        });
    }
})

router.post('/view/user', async (req, res) => {
    try {
        var { id } = req.body

        if (id == null || id == undefined) {
            res.status(200).json({
                status: false,
                msg: "Id not provided"
            });
            return;
        }
        var data = await userModel.findOne({ _id: id, status: 'active' })
        if (data == null || data == undefined) {
            res.status(200).json({
                status: false,
                msg: "User not found"
            });
            return;
        }
        res.status(200).json({
            status: true,
            msg: "users found",
            data: data
        })
    } catch (err) {
        console.log(err)
        Sentry.captureException(err);
        res.status(500).json({
            status: false,
            msg: "internal server error"
        });
    }
})


router.post('/edit/user', async (req, res) => {
    try {
        var { id, firstName, lastName, houseName, place, pincode } = req.body

        if (id == null || id == undefined) {
            res.status(200).json({
                status: false,
                msg: "Id not provided"
            });
            return;
        }
        var data = await userModel.findOne({ _id: id, status: 'active' })
        if (data == null || data == undefined) {
            res.status(200).json({
                status: false,
                msg: "User not found"
            });
            return;
        }
        if (firstName != null || firstName != undefined) {
            data.firstName = firstName
        }
        if (lastName != null || lastName != undefined) {
            data.lastName = lastName
        }
        if (houseName != null || houseName != undefined) {
            data.houseName = houseName
        }
        if (place != null || place != undefined) {
            data.place = place
        }
        if (pincode != null || pincode != undefined) {
            data.pincode = pincode
        }
        await data.save()
        // data = JSON.parse(JSON.stringify(data))
        // delete data.password;
        res.status(200).json({
            status: true,
            msg: "Profile updated",
            data: data
        })
    } catch (err) {
        console.log(err)
        Sentry.captureException(err);
        res.status(500).json({
            status: false,
            msg: "internal server error"
        });
    }
})



router.post('/user/profile', async (req, res) => {
    try {
        var { id } = req.body

        if (id == null || id == undefined) {
            res.status(200).json({
                status: false,
                msg: "Id not provided"
            });
            return;
        }
        var data = await userModel.findOne({ _id: id, status: 'active' })
        if (data == null || data == undefined) {
            res.status(200).json({
                status: false,
                msg: "User not found"
            });
            return;
        }
        res.status(200).json({
            status: true,
            msg: "users found",
            data: data
        })
    } catch (err) {
        console.log(err)
        Sentry.captureException(err);
        res.status(500).json({
            status: false,
            msg: "internal server error"
        });
    }
})


router.post('/date/format/check', async (req, res) => {
    try {
        var { date } = req.body
        var eventDate = new Date(date);

        var currentdate = new Date();
        var eventtime = eventDate.getTime()
        var cueenttime = currentdate.getTime()
        if (cueenttime > eventtime) {
            console, log(1)
            return;
        }
        console.log(2)
    } catch (err) {
        console.log(err)
        Sentry.captureException(err);
        res.status(500).json({
            status: false,
            msg: "internal server error"
        });
    }
})



module.exports = router;