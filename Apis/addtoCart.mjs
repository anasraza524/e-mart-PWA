import express from 'express';
import mongoose from 'mongoose';
import { addtocartModel } from '../dbRepo/model.mjs'

const router = express.Router()

router.post('/addtocart', async (req, res) => {
    const body = req.body
try{   
     if (!body.name 
        || !body.price 
        || !body.description
    
    ) {

        res.status(400)
        res.send({ message: "Requird cart  Parameter missing." })
        return;
    }
    
    // console.log(body.name)
    // console.log(body.price)
    // console.log(body.description)
    // console.log('name:',body.productImage)
    const userId = new mongoose.Types.ObjectId(body.token._id);
    console.log("userId",userId)
    const countProduct = await addtocartModel.countDocuments({owner: userId})
    
    console.log("countProaaaaaaaaaaaaaa",countProduct)
    
    if(countProduct >= 5 ) throw new Error("Sorry, you can only add 5 products in cart")
    addtocartModel.create({
        id:body.id,
        name: body.name,
        price: body.price,
        owner: new mongoose.Types.ObjectId(body.token._id),
        description: body.description,
        productImage: body.productImage,
    },
        (err, saved) => {
            console.log("post Error",err)
            if (!err) {
                console.log(saved);

                res.send({
                    message: "product added successfully in Cart"
                });
            } else {
                res.status(500).send({
                    message: "server error .."
                })
            }
        })}
        catch(error){
            res.status(500).send({
                message: error.message
            })
            console.error(error.message);
        
        }

})

router.delete('/addtocart/:id', (req, res) => {
    const id = req.params.id;
    addtocartModel.deleteOne({ _id: id }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "Product has been removed successfully",
                })
            } else {
                res.status(404);
                res.send({
                    message: "No cart Product found",
                //    "  with this id: " + id,"
                });
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})
// all user without owner
// router.get('/addtocarts', (req, res) => {
//     addtocartModel.find({}, (err, data) => {
//         console.log("get Error",err)
//         if (!err) {
//             res.send({
//                 message: "got all products successfully",
//                 data: data
              
//             })  
           
//         } else {
//             res.status(500).send({
//                 message: "server error...."
//             })
//         }
//     });
// })
router.get('/addtocarts', (req, res) => {

    const userId = new mongoose.Types.ObjectId(req.body.token._id);

    addtocartModel.find(
        { owner: userId },
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
                    message: "server error...."
                })
            }
        });
})

export default router 