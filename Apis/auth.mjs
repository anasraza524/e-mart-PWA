import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import moment from 'moment'
import express from 'express';
import { nanoid, customAlphabet } from 'nanoid'
import { userModel, productModel, OtpRecordModel } from '../dbRepo/model.mjs'
import {
    stringToHash,
    varifyHash,
} from "bcrypt-inzi"
import jwt, { verify } from 'jsonwebtoken';
import nodemailer from "nodemailer";
import cookieParser from 'cookie-parser';

const SECRET = process.env.SECRET || "topsecret";


const router = express.Router()
// router.use(cookieParser())
router.post("/signup", (req, res) => {

    let body = req.body;

    if (!body.firstName
        || !body.lastName
        || !body.email
        || !body.password
    ) {
        res.status(400).send(
            {message:"required fields missing"

        //    DetailMessage: `required fields missing, request example: 
        //         {
        //             "firstName": "John",
        //             "lastName": "Doe",
        //             "email": "abc@abc.com",
        //             "password": "12345"
        //         }`
            });
        return;
    }

    req.body.email = req.body.email.toLowerCase();

    // check if user already exist // query email user
    userModel.findOne({ email: body.email }, (err, user) => {
        if (!err) {
            console.log("user: ", user);

            if (user) { // user already exist
                console.log("user already exist: ", user);
                res.status(400).send({ message: "user already exist,, please try a different email" });
                return;

            } else { // user not already exist

                // bcrypt hash
                stringToHash(body.password).then(hashString => {

                    userModel.create({
                        firstName: body.firstName,
                        lastName: body.lastName,
                        email: body.email,
                        password: hashString
                    },
                        (err, result) => {
                            if (!err) {
                                console.log("data saved: ", result);
                                res.status(201).send({ message: "user is created" });
                            } else {
                                console.log("db error: ", err);
                                res.status(500).send({ message: "internal server error" });
                            }
                        });
                })

            }
        } else {
            console.log("db error: ", err);
            res.status(500).send({ message: "db error in query" });
            return;
        }
    })
});

// router.post("/forget_password",(req, res) => {
//     let body = req.body;
//     body.email = body.email.toLowerCase();
//     if (!body.email ) { // null check - undefined, "", 0 , false, null , NaN
//         res.status(400).send(
//             `required fields missing, request example: 
//                 {
//                     "email": "abc@abc.com"

//                 }`
//         );
//         return;
//     }

//     userModel.findOne({ email: body.email }, (err, user) => {
//         if (!err) {
//             console.log("user: ", user);

//             if (user) { // user already exist
//                 const token = jwt.sign({
//                     _id: user._id,
//                     email: user.email,
//                     iat: Math.floor(Date.now() / 1000) - 30,
//                     exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
//                 }, SECRET);

//                 console.log("token: ", token);

//                 res.cookie('Token', token, {
//                     maxAge: 900,
//                     httpOnly: true,
//                     sameSite: 'none',
//                     secure: true
//                 });

//                 // const link = `http://localhost:3001/ResetPassword`;
//                  const link = `http://localhost:3000/user/reset/${user._id}/${token}`;
//                 // const link = `http://localhost:3001/api/v1/forget_password/${user._id}/${token}`;
//                  // email sending
//           const transport = nodemailer.createTransport({
//             service: "gmail",
//             host: "smtp.gmail.com",
//             port: 465,
//             secure: true,
//             auth: {
//               user:process.env.EMAIL ,
//               pass:process.env.EMAIL_PASSWORD,
//             },
//           });
// console.log("done")
//           const mailOptions = {
//             from: process.env.EMAIL,
//             to: body.email,
//             subject: `Password Reset Request`,
//             text: `
//             <!doctype html>
//             <html lang="en-US">
//             <head>
//                 <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
//                 <title>Reset Password Email Template</title>
//                 <meta name="description" content="Reset Password Email Template.">
//                 <style type="text/css">
//                     a:hover {text-decoration: underline !important;}
//                 </style>
//             </head>
//             <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
//                 <!--100% body table-->
//                 <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
//                     style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
//                     <tr>
//                         <td>
//                             <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
//                                 align="center" cellpadding="0" cellspacing="0">

//                                 <tr>
//                                     <td>
//                                         <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
//                                             style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
//                                             <tr>
//                                                 <td style="height:40px;">&nbsp;</td>
//                                             </tr>
//                                             <tr>
//                                                 <td style="padding:0 35px;">
//                                                     <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
//                                                         requested to reset your password</h1>
//                                                     <span
//                                                         style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
//                                                     <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
//                                                         We cannot simply send you your old password. A unique link to reset your
//                                                         password has been generated for you. To reset your password, click the
//                                                         following link and follow the instructions.
//                                                     </p>
//                                                     <a href=${link}
//                                                         style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
//                                                         Password</a>
//                                                 </td>
//                                             </tr>
//                                             <tr>
//                                                 <td style="height:40px;">&nbsp;</td>
//                                             </tr>
//                                         </table>
//                                     </td>

//                             </table>
//                         </td>
//                     </tr>
//                 </table>
//                 <!--/100% body table-->
//             </body>
//             </html>`,
//                         html: `
//             <!doctype html>
//             <html lang="en-US">
//             <head>
//                 <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
//                 <title>Reset Password Email Template</title>
//                 <meta name="description" content="Reset Password Email Template.">
//                 <style type="text/css">
//                     a:hover {text-decoration: underline !important;}
//                 </style>
//             </head>
//             <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
//                 <!--100% body table-->
//                 <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
//                     style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
//                     <tr>
//                         <td>
//                             <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
//                                 align="center" cellpadding="0" cellspacing="0">

//                                 <tr>
//                                     <td>
//                                         <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
//                                             style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
//                                             <tr>
//                                                 <td style="height:40px;">&nbsp;</td>
//                                             </tr>
//                                             <tr>
//                                                 <td style="padding:0 35px;">
//                                                     <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
//                                                         requested to reset your password</h1>
//                                                     <span
//                                                         style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
//                                                     <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
//                                                         We cannot simply send you your old password. A unique link to reset your
//                                                         password has been generated for you. To reset your password, click the
//                                                         following link and follow the instructions.
//                                                     </p>
//                                                     <a href="${link}"
//                                                         style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
//                                                         Password</a>
//                                                 </td>
//                                             </tr>
//                                             <tr>
//                                                 <td style="height:40px;">&nbsp;</td>
//                                             </tr>
//                                         </table>
//                                     </td>

//                             </table>
//                         </td>
//                     </tr>
//                 </table>
//                 <!--/100% body table-->
//             </body>
//             </html>`,
//                       };
//                       console.log("done2")
//                       transport.sendMail(mailOptions, (error, info) => {
//                         console.log("error",error)
//                         console.log("info",info)
//             if (!error) {
//               return res.status(200).json({ message: "Email Sent" });
//             }else{
//                 return res.status(400).json({ message: "Error in Sending Email " });
//             }

//           });


//             }else { // user not already exist
//                 console.log("userEmail not found");
//                 res.status(401).send({ message: "Invalid Email" });
//                 return;
//             }

//         }})

//     });


// router.put("/forget_password/:id/:token",(req, res) => {
//         let body = req.body
//        console.log('1')
//         const { id, token } = req.params;
//         if(!body.password,!body._id,!body.token){
//             res.status(400).send(
//                 `required fields missing, request example: 
//                     {
//                         "password": "12345"

//                     }`
//             );
//             console.log('2')
//             if (!req?.cookies?.token) {
//                 res.status(401).send({
//                     message: "0include http-only credentials with every request"
//                 })
//                 return;
//             }
//             jwt.verify(req.cookies.token, SECRET, function (err, decodedData) {
//                 if (!err) {
//                     console.log('3')
//                     console.log("decodedData: ", decodedData);

//                     const nowDate = new Date().getTime() / 1000;

//                     if (decodedData.exp < nowDate) {

//                         res.status(401);
//                         res.cookie('Token', '', {
//                             maxAge: 1,
//                             httpOnly: true,
//                             sameSite: 'none',
//                             secure: true


//                         });
//                         res.send({ message: "token expired" })

//                     } else {

//                         console.log("token approved");

//                         req.body.token = decodedData
//                         const isUser =  userModel.findById(id);
//                         stringToHash(body.password).then(hashString => {

//                             userModel.findByIdAndUpdate(body._id,{

//                                 password: hashString
//                             },
//                                 (err, result) => {
//                                     if (!err) {
//                                         console.log("data saved: ", result);
//                                         res.status(201).send({ message: "Password Changed Successfully" });
//                                     } else {
//                                         console.log("db error: ", err);
//                                         res.status(400).send({ message: "Link has been Expired" });
//                                     }
//                                 });
//                         })
//                     }
//                 } else {
//                     res.status(401).send("invalid token")
//                 }
//             });


//             // const isSuccess =  authModel.findByIdAndUpdate(isUser._id, {
//             //     $set: {
//             //       password: hashedPass,
//             //     },
//             //   });
//             // return;
//         }



//         }



//         )
// router.put("/forget_password/:id/:token",(req, res) => {
//     let body = req.body
//    console.log('1')
//     const { _id, token } = req.params;
//     if(!body.password,!_id,!token){
//         res.status(400).send(
//             `required fields missing, request example: `


//         );
//         return;}

//         try {
//             stringToHash(body.password).then(hashString => {


//             let data =  userModel.findByIdAndUpdate(_id,
//                 {
//                     password: hashString
//                 },
//                 { new: true }
//             ).exec();

//             console.log('updated: ', data);

//             res.send({
//                 message: "product modified successfully"
//             });

//         })} catch (error) {
//             res.status(500).send({
//                 message: "server error"
//             })
//         }

//     }

//     )
router.post("/login", (req, res) => {

    let body = req.body;
    body.email = body.email.toLowerCase();

    if (!body.email || !body.password) { // null check - undefined, "", 0 , false, null , NaN
        res.status(400).send(
            {message:"required fields missing"}
            // `required fields missing, request example: 
            //     {
            //         "email": "abc@abc.com",
            //         "password": "12345"
            //     }`
        );
        return;
    }

    // check if user exist
    userModel.findOne(
        { email: body.email },
        "firstName lastName email password",
        (err, data) => {
            if (!err) {
                console.log("data: ", data);

                if (data) { // user found
                    varifyHash(body.password, data.password).then(isMatched => {

                        console.log("isMatched: ", isMatched);

                        if (isMatched) {

                            const token = jwt.sign({
                                _id: data._id,
                                email: data.email,
                                iat: Math.floor(Date.now() / 1000) - 30,
                                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                            }, SECRET);

                            console.log("token: ", token);

                            res.cookie('Token', token, {
                                maxAge: 86_400_000,
                                httpOnly: true,
                                sameSite: 'none',
                                secure: true
                            });

                            res.send({
                                message: "login successful",
                                profile: {
                                    email: data.email,
                                    firstName: data.firstName,
                                    lastName: data.lastName,

                                    _id: data._id
                                }
                            });
                            return;
                        } else {
                            console.log("password did not match");
                            res.status(401).send({ message: "Incorrect email or password" });
                            return;
                        }
                    })

                } else { // user not already exist
                    console.log("user not found");
                    res.status(401).send({ message: "Incorrect email or password" });
                    return;
                }
            } else {
                console.log("db error: ", err);
                res.status(500).send({ message: "login failed, please try later" });
                return;
            }
        })
})
router.post("/logout", (req, res) => {

    res.cookie('Token', '', {
        maxAge: 0,
        httpOnly: true,
        sameSite: 'none',
        secure: true
    });

    res.send({ message: "Logout successful" });
})

router.post("/forget_password", async (req, res) => {
    try {
        let body = req.body
        body.email = body.email.toLowerCase()
        if (!body.email) {
            res.send({
                message: `required parameter is messing. ex : {"email":""abc@.com}`
            })
            return;
        }

        const user = await userModel.findOne(
            { email: body.email },
            "firstName lastName email _id")

        if (!user) throw new Error("user not Found")
        const nanoid = customAlphabet('1234567890', 5)
        const OTP = nanoid()
        console.log("OTP: ", OTP)

      const newHashOtp = await stringToHash(OTP);
      console.log("HashOtp",newHashOtp)
        OtpRecordModel.create({
           otp:newHashOtp,
            // otp: OTP,
            email: body.email
        })


        const transport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: body.email,
            subject: `Password Reset Request from E-mart`,
            text: `
    <!doctype html>
    <html lang="en-US">
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Reset Password Email Template</title>
        <meta name="description" content="Reset Password Email Template.">
        <style type="text/css">
            a:hover {text-decoration: underline !important;}
        </style>
    </head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                    <td style="padding:0 35px;">
                                    <h1 style="color: #37a6da; font-weight:500; margin:0;font-size:35px;font-family:'Rubik',sans-serif;">
                                                E-Mart</h1>
                                                <br>
                                    <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                    ${user.firstName}! you have requested to reset your E-Mart password</h1>
                                    <span
                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                        We cannot simply send you your old password. A unique link to reset your
                                        password has been generated for you. To reset your password, check the
                                        following OTP and follow the instructions.
                                    </p>
                                    <h3 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Your OTP
                                    OTP</h3>
                                    <h4 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                    ${OTP}</h4>

                                </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                       
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>
    </html>`,
            html: `
    <!doctype html>
    <html lang="en-US">
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Reset Password Email Template</title>
        <meta name="description" content="Reset Password Email Template.">
        <style type="text/css">
            a:hover {text-decoration: underline !important;}
        </style>
    </head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                       
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                        <h1 style="color: #37a6da; font-weight:500; margin:0;font-size:35px;font-family:'Rubik',sans-serif;">
                                                E-Mart</h1>
                                                <br>
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                ${user.firstName}! you have requested to reset your E-Mart password</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                We cannot simply send you your old password. A unique link to reset your
                                                password has been generated for you. To reset your password, check the
                                                following OTP and follow the instructions.
                                            </p>
                                            <h3 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Your OTP
                                            is </h3>
                                            <h4 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                            ${OTP}</h4>

                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                       
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>
    </html>`,
        };
        transport.sendMail(mailOptions, (error, info) => {
            console.log("error", error)
            console.log("info", info)
            if (!error) {
                const token2 = jwt.sign({
                    // _id: user._id,
                    email: user.email,
                    // otp: OTP,
                    iat: Math.floor(Date.now() / 1000) - 30,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                }, SECRET);
                console.log("token2", user.email, user._id,)
                console.log("token2: ", token2);

                res.cookie('token2', token2, {
                    maxAge: 86_400_000,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                });



                res.status(200);
                res.send({
                    message: "OTP sent success",
                });

                return;
            } else {
                return res.status(400).json({ message: "Error in Sending Email " });
            }

        });


    }
    catch (error) {
        console.log("Forget_Password_error: ", error);
        res.status(500).send({
            message: error.message
        })
    }
}
)


router.post("/request_otp", async (req,res)=>{
    try {
       
        const body = req.body;
       
    //   const email = req.body.token2.email
        
    if(!body.otp){
        res.status(400).send(
            `required fields missing, request example: n
            {
             
                "otp": "12345",
              
            }`
        );
        return;
    }
    console.log("Email",req.cookies.token2)
 const tokenVerify = jwt.verify(req.cookies.token2, SECRET)
    
    console.log(tokenVerify.email,"a")
    const nowDate = new Date().getTime() / 1000;

    const otpRecord = await OtpRecordModel.findOne(
                            {
                                email: tokenVerify.email,
                            }
                        )
                            .sort({ _id: -1 })
                            .exec()
        
                            if (!otpRecord) throw new Error("Invalid Opt")
                            if (otpRecord.isUsed) throw new Error("Invalid OTP")
                    
                           
                    
                            console.log("otpRecord: ", otpRecord);
                            console.log("otpRecord: ", moment(otpRecord.createdOn));
                    
                            const now = moment();
                            const optCreatedTime = moment(otpRecord.createdOn);
                            const diffInMinutes = now.diff(optCreatedTime, "minutes")
                    
                            console.log("diffInMinutes: ", diffInMinutes);
                            if (diffInMinutes >= 3) throw new Error("Invalid Otp")
                    
                    
                    
                            const isMatched = await varifyHash(body.otp, otpRecord.otp)
                            if (!isMatched) throw new Error("Invalid OTP")
                             await otpRecord.update({ isUsed: true }).exec();
                        // if(body.otp !==  decodedData.otp) throw new Error("Invalid OTP")
        
                        
                        // success
                            res.send({
                                message: "OTP is Matched",
                            });

//     function (err, decodedData) {
//         if (!err) {

//             console.log("decodedData: ", decodedData);

//             const nowDate = new Date().getTime() / 1000;

//             if (decodedData.exp < nowDate) {

//                 res.status(401);
//                 res.cookie('token2', '', {
//                     maxAge: 1,
//                     httpOnly: true,
//                     sameSite: 'none',
//                     secure: true
                    
                    
//                 });
//                 res.send({ message: "OTP has been expired" })

//             } else {

//                 console.log("OTP has been  approved");

//                 req.body.token2 = decodedData
//                 console.log("decodedData.email",decodedData.email)
//                 const otpRecord =  OtpRecordModel.findOne(
//                     {
//                         email: decodedData.email,
//                     }
//                 )
//                     .sort({ _id: -1 })
//                     .exec()

//                 console.log("OtpRecord",otpRecord)
//                 if(!otpRecord) throw new Error("OTP Not Found")
//                 if(otpRecord.isUsed) throw new Error("Invalid OTP")
//                 console.log("current",body.otp)
//                  console.log("dbRecord",otpRecord.otp)

//                  otpRecord.update({ isUsed: true }).exec();

//                  const now = moment();
// const otpCurrentTme = moment(otpRecord.createdOn)
// const diffOtptime = now.diff(otpCurrentTme,"minutes")
// console.log("diff",diffOtptime)
// if(diffOtptime >= 3 ) throw new Error("Invalid OTP")
//                  const isMatched =  varifyHash(body.otp, otpRecord.otp)
//                  if(!isMatched) throw new Error("Invalid Otp")
//                 // if(body.otp !==  decodedData.otp) throw new Error("Invalid OTP")

                
//                 // success
//                     res.send({
//                         message: "OTP is Matched",
//                     });
//             }
//         } else {
//             res.status(401).send("invalid Otp")
//         }
//     });

    
    
    
    //  const isMatched = await varifyHash(body.otp, OtpRecord.otp)
     
    //        console.log("Matched",isMatched)
    //  if (!isMatched) throw new Error("Invalid OTP")
            
               
           
    // success
    
    } catch (error) {
        console.log("Otp_error: ", error);
        res.status(500).send({
            message: error.message
        })
    }
    })

router.post("/reset_password", async (req, res) => {
    try {
        let body = req.body
        
if(!body.password) throw new Error("New Password Not Found")
        const newPasswordHash = await stringToHash(body.password);
        const tokenVerify = jwt.verify(req.cookies.token2, SECRET)
        console.log(tokenVerify)
        const passwordChange = await userModel.findOneAndUpdate(
             {email:tokenVerify.email},
            { password: newPasswordHash }).exec()

        if (!passwordChange) throw new Error("Error in password")
        // success
        res.send({
            message: "password changed success",
        });
        return;
    } catch (error) {

    }

})
export default router