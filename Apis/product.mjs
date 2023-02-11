import express from 'express';
import mongoose from 'mongoose';
import { productModel } from '../dbRepo/model.mjs'
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bucket from "../FirebaseAdmin/index.mjs";
import fs from 'fs';

// import multipart from 'connect-multiparty'

//  let multipartMiddleware = multipart();



const storageConfig = multer.diskStorage({
   destination: '/tmp/uploads/',
    filename: function (req, file, cb) {

    //   console.log("mul-file: ", file);
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    }
})
var uploadMiddleware = multer({ storage: storageConfig })

 const router = express.Router()


router.post('/product',
//  multipartMiddleware
 uploadMiddleware.any()
,  async (req, res) => {
   
   try {
    const token = jwt.decode(req.cookies.Token)
    // console.log("tokk",token)
    const body = req.body
    // console.log("hh",body)
    // console.log("1",req.files[0])
    // console.log("fgf",req.files.productImage.path)
    if (!body.name 
        || !body.price 
        || !body.description
        // && body.id
    //    || !body.productImage
    ) {
// console.log(body.name)
// console.log(body.description)
// console.log(body.price)



        res.status(400)
        res.send({ message: "Requird Parameter missing." })
        return;
    }

     
     const userId = new mongoose.Types.ObjectId(token._id);
console.log("userId",userId)
const countProduct = await productModel.countDocuments({owner: userId})

console.log("countPro",countProduct)

if(countProduct >= 1 ) throw new Error("Sorry, you can only add 1 product")
// for multer
// if(!req.files[0]) throw new Error("Error in creating product")

// for multi Part (in multi part no file[0])
if(!req.files[0]) throw new Error("please upload product Image")
// console.log(req.files[0].mimetype)

if(req.files[0].mimetype === "image/png"||
req.files[0].mimetype === "image/jpeg"||
req.files[0].mimetype === "image/jpg" ) console.log(" accept png, jpg, jpeg")
else{
    fs.unlink(req.files[0].path, (err) => {
        if (err) {
          console.error(err)
          return
        }
        else{
          console.log("Delete sus")
        }
      })
    throw new Error("only accept png, jpg, jpeg")
}

if(req.files[0].size >= 1000000)throw new Error("only accept 1 Mb Image")

bucket.upload(
    req.files[0].path,
    {
        destination: `tweetPictures/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
    },
    function (err, file, apiResponse) {
        if (!err) {

            file.getSignedUrl({
                action: 'read',
                expires: '03-09-2999'
            }).then((urlData, err) => {
                if (!err) {
                    // console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 
// try {
//     fs.unlink(req.files[0].path)
//     console.log("file delete")
//     //file removed
// } catch (err) {
//     console.error(err)
//  }
// const path = req.files[0].path

fs.unlink(req.files[0].path, (err) => {
  if (err) {
    console.error(err)
    return
  }
  else{
    console.log("Delete sus")
  }
})
                    console.log("first2",req.files[0])
                    productModel.create({
                        name: body.name,
                        price: body.price,
                        description: body.description,
                        productImage: urlData[0],
                        owner: new mongoose.Types.ObjectId(token._id)
                    },
                        (err, saved) => {
                            if (!err) {
                                console.log("saved: ", saved);

                                res.send({
                                    message: "Product added successfully"
                                });
                            } else {
                                console.log("err: ", err);
                                res.status(500).send({
                                    message: "server error"
                                })
                            }
                        })
                }
            })
        } else {
            console.log("err: ", err)
            res.status(500).send();
        }
    });



} catch (error) {
    
    res.status(500).send({
        message: error.message
    })
    console.error(error.message);

   }
})


router.get('/productFeed' , async(req,res)=>{
    const { page, limit = 8 } = req.query;
    try {
        const data = await productModel.find()
        .sort({"_id":-1})
        .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
   if(!data) throw new Error("Product Not Found")
      const count = await  productModel.countDocuments();
      console.log(count)
      
      res.json({
        data,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
        console.error(error.message);
    }
})

router.get('/product/:id', (req, res) => {

    const id = req.params.id;

    productModel.findOne({ _id: id }, (err, data) => {
        if (!err) {
            if (data) {
                res.send({
                    message: `get product by id: ${data._id} success`,
                    data: data
                });
            } else {
                res.status(404).send({
                    message: "product not found",
                })
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})
router.get("/products/:name", (req, res) => {
    console.log(req.params.name);

    const body = req.body
    const name = req.params.name
    productModel.find({ 
   
        name: { $regex: `${name}` }
     }, (err, data) => {
      if (!err) {
        if (data) {
          res.send({
            message: `get product by success`,
            data: data,
          });
        } else {
          res.status(404).send({
            message: "product not found",
          });
        }
      } else {
        res.status(500).send({
          message: "server error",
        });
      }
    });
  });

router.get('/products', (req, res) => {

    const userId = new mongoose.Types.ObjectId(req.body.token._id);
console.log(userId)

    productModel.find(
        { owner: userId
            // , isDeleted: false 
            },
        {},
        {
            sort: { "_id": -1 },
            limit: 100,
            skip: 0
        }
        , (err, data) => {
            if (!err) {
                res.send({
                    message: "got all products successfully",
                    data: data
                })
            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        });
})




router.delete('/product/:id',async (req, res) => {
    const id = req.params.id;
    productModel.deleteOne({ _id: id }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "Product has been deleted successfully",
                })
            } else {
                res.status(404);
                res.send({
                    message: "No Product found",                    //  with this id: " + id,
                });
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

router.put('/product/:id',async (req, res) => {

    const body = req.body;
    const id = req.params.id;

    if (
        !body.name ||
        !body.price ||
        !body.description
    ) {
        res.status(400).send(` required parameter missing. example request body:
        {
            "name": "value",
            "price": "value",
            "description": "value",
            "productImage": "value"
        }`)
        return;
    }

    try {
        let data = await productModel.findByIdAndUpdate(id,
            {
                name: body.name,
                price: body.price,
                description: body.description,
                productImage:body.productImage
            },
            { new: true }
        ).exec();

        console.log('updated: ', data);

        res.send({
            message: "product modified successfully"
        });

    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }
})

export default router