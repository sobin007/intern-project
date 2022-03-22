var jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel');
const TokenModel = require('../Models/tokenModel');
const Misc = require('../controller/Misc')
const defaults = require('../default');
const Sentry = require("@sentry/node");


module.exports = async function (req, res, next) {
    try {
        var token = req.body.token || req.query.token || req.headers.token;
        // console.log('token: ',token)
        if (token) {
            try {
                var user = await jwt.verify(token, defaults.token);
                if (user) {
                    req.user = user;
                    var userdata = await userModel.findOne({ _id: req.user.id }, { password: 0 });
                    var tokendata = await TokenModel.findOne({ userid: req.user.id })
                    if (Misc.isnullorempty(tokendata)) {
                        res.status(200).json({
                            status: false,
                            msg: 'Please login to continue.'
                        });
                        return;
                    }
                    if (!(Misc.isnullorempty(userdata))) {
                        req.user.user = userdata;
                        next();
                    }
                    else {
                        res.status(200).json({
                            status: false,
                            msg: 'Failed to find user.'
                        });
                        return;
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        expired: true,
                        msg: 'Failed to authenticate token.'
                    });
                    return;
                }
            } catch (ex) {
                console.log(ex)
                Sentry.captureException(ex);
                res.status(200).json({
                    status: false,
                    expired: true,
                    msg: 'Your session has expired, please login again.',
                    ex: ex
                });
                return;
            }

        } else {
            res.status(200).json({
                status: false,
                expired: true,
                msg: 'No token provided.'
            });
            return;
        }

    } catch (e) {
        console.log(e)
        Sentry.captureException(e);
        res.status(500).json({
            status: false,
            expired: true,
            msg: 'Something went wrong!!!',
            e: e
        });
    }
};



//Your session has expired. Press OK to reload the page and reauthenticate.