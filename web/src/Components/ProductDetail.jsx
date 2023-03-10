import React from 'react'
import { GlobalContext } from '../Context/Context';
import ProductSkeleten from './ProductSkeleten';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   listAll,
//   list,
// } from "firebase/storage";
// import { getStorage,uploadBytesResumable,

// } from "firebase/storage";
import noProductFound from '../assets/product-not-found.png'
import './productDetail.css'

import { useState, useEffect,useContext } from "react"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {
  Typography, Card, CardContent,CircularProgress,
  TextField, Button, Paper, Chip, Box, Grid,
  CardActions, CardActionArea, Divider, CardMedia,Stack
} from '@mui/material'
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {Snackbar,Alert} from '@mui/material';
import Error from '../assets/404.gif'
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));





const Home = () => {
  let { state, dispatch } = useContext(GlobalContext);
  const [loadProduct, setLoadProduct] = useState(false)
  const [prodImage, setProdImage] = useState('')
  const [ProductData, setProductData] = useState(null)
  const [prodName, setProdName] = useState('')
  const [prodPrice, setProdPrice] = useState('');
  const [prodDec, setProdDec] = useState('')
  const [storageURL, setStorageURL] = useState(''); 
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [productDataLength, setProductDataLength] = useState(null);
  const [preview, setPreview] = useState(null)
 
  const [editing, setEditing] = useState({
editingid:null,
editingName:"",
editingPrice:"",
editingDescription:"",
editingProdImage:""
  })
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnak, setOpenSnak] = useState(false);
  const handleClickMsg = () => {
    setOpenSnak(true);
  };

  const handleCloseMsg = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnak(false);
  };
  
  const [openError, setOpenError] = useState(false);
  const ClickOpenError = () => {
    setOpenError(true);
  };
  const handleCloseError = () => {
    setOpenError(false);
  };


  // const storage = getStorage();


  const getAllProducts = async () => {
    dispatch({
      type:"LOAD_SKELETON",
      payload:true
    })
    try {
      const response = await axios.get(`${state.baseUrl}/products`,{
         
        withCredentials: true,
        
     
    });
      console.log("responseProduct: ", response.data);

      setProductData(response.data.data);
     setProductDataLength(response.data.data.length)
     dispatch({
      type:"LOAD_SKELETON",
      payload:false
    })
    } catch (error) {
      if(error){
        dispatch({
          type:"LOAD_SKELETON",
          payload:false
        })
        ClickOpenError()
      }else{
      handleCloseError()
     }
      console.log("error in getting all products", error);
    }
  }
  
  useEffect(() => {

    getAllProducts()
  
  }, [loadProduct])
  

  // const fileUpload= ()=>{
  //   if (!file) return;
  //     const sotrageRef = ref(storage, `files/${file.name}`);
  //     const uploadTask = uploadBytesResumable(sotrageRef, file);
  
  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const prog = Math.round(
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //         );
  //         setProgress(prog);
  //       },
  //       (error) => console.log(error),
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //        console.log("File available at", downloadURL);
  //           setStorageURL(downloadURL)
           
  //         });
  //       }
  //     );
  // }


  // let formData = new FormData();

  //           formData.append("myFile", file);
  

  // console.log("fileInput: ", fileInput.files[0]);
  // let fileInput = document.getElementById("picture");
  let formData = new FormData();


  
//   const submitHandler = async (e) => {
//     e.preventDefault();
//     if(error || success){
//       handleClickMsg()
//     }
//     setSuccess('')
// setError('')
// console.log(file,"file")
//     try {
//       const response = await axios.post(`${state.baseUrl}/product` ,{
        
//         name:  prodName,
//         price: prodPrice,
//         description: prodDec,
//         productImage:formData,

//       },{withCredentials:true});
//       console.log(response);
//       setSuccess(response.data.message
//         )
//        e.target.reset()
//       setProdName("")
//       setProdPrice("")
//       setProdDec("")
//       // setStorageURL("")
//       setProgress(0)
    
//       setLoadProduct(!loadProduct)
  
//     } catch (err) {
//       setError(err.message
//         )
//       console.log("err post", err);
//     }
//   };






formData.append("productImage", file);
formData.append("name", prodName);
formData.append("price", prodPrice);
formData.append("description", prodDec);
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({
      type:"LOAD_SKELETON",
      payload:true
    })
    if(error || success){
      handleClickMsg()
    }
    setSuccess('')
setError('')

axios({
  method: 'post',
  url: `${state.baseUrl}/product`,
  data: formData,
  headers: { 'Content-Type': 'multipart/form-data' },
  withCredentials:true
})
  .then(res => {
      setLoadProduct(!loadProduct)
      console.log(`upload Success` + res.data);
      setSuccess(res.message
        )
      dispatch({
        type:"LOAD_SKELETON",
        payload:false
      })
      e.target.reset()
      setFile(null)
      setProgress(0)
      setPreview(null)
  })
  .catch(err => {
    dispatch({
      type:"LOAD_SKELETON",
      payload:false
    })
    
      console.log("error: ", err);
      setError(err.response.data.message)

  })
  };



//   const submitHandler = async (e) => {
//     e.preventDefault();
//     if(error || success){
//       handleClickMsg()
//     }
//     setSuccess('')
// setError('')
//     try {
//       const response = await axios.post(`${state.baseUrl}/product` ,{
        
//         name:  prodName,
//         price: prodPrice,
//         description: prodDec,
//         productImage:file,

//       },{withCredentials:true});
//       console.log(response);
//       setSuccess(response.data.message
//         )
//        e.target.reset()
//       setProdName("")
//       setProdPrice("")
//       setProdDec("")
//       // setStorageURL("")
//       setProgress(0)
    
//       setLoadProduct(!loadProduct)
  
//     } catch (err) {
//       setError(err.message
//         )
//       console.log("err post", err);
//     }
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     let data = {
//       name: prodName,
//       price: prodPrice,
//       description: prodDec,
//       productImage:storageURL,
//     }
//     const response = await
//       axios.post(`${state.baseUrl}/product`, data);
//     console.log(data)
//     // console.log(prodName, prodDec, prodPrice,prodImage)
//     console.log(response);
//     setLoadProduct(!loadProduct)
//   }
  
  const deleteProduct = async (id) => {
    if(error || success){
      handleClickMsg()
    }
    setSuccess('')
setError('')
    try {
      const response = await axios.delete(`${state.baseUrl}/product/${id}`,{
         
        withCredentials: true,
        
     
    })
      console.log("response: ", response.data);
      setSuccess(response.data.message)
      setLoadProduct(!loadProduct)

    } catch (error) {
      setError(error.message
        )
      console.log("error in deleting all products", error);
    }
  }
 

 const  editProduct = async(e)=> { 
  if(error || success){
    handleClickMsg()
  }
  
  e.preventDefault();
  setSuccess('')
  setError('')
    try {
      const response = await axios.put(`${state.baseUrl}/product/${editing.editingid}`,{
        name:editing.editingName,
        price:editing.editingPrice,
        description:editing.editingDescription,
        productImage:storageURL
      },{withCredentials:true})
      setSuccess(response.data.message)
      handleClose()
      setFile(null)
setStorageURL("")
setProgress(0)
e.target.reset()
      console.log("responseEdit: ", response.data);
      console.log("image",editing.editingProdImage)
      
      setEditing({
        editingId: null,
        editingName: "",
        editingPrice: "",
        editingDescription:"",
        editingProdImage:""
      })
  
      setLoadProduct(!loadProduct)

    } catch (error) {
      setError(error.message
        )
      console.log("error in Updating all products", error);
    }
  }


  return (



    <div>
   {/* update dilaog box */}
   <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
      <DialogTitle dividers="true" >
        <Typography sx={{fontSize:{xs:28}}} variant='h4'>
          Update Product
          <CloseIcon onClick={handleClose} sx={{m:1,float:"right"}} />
        </Typography>
     
      </DialogTitle>
        <DialogContent dividers>

        <form  onSubmit={editProduct}>
        <TextField
       
       sx={{ pl: 0, pr: 1,width:{lg:"800px",sm:"560px",xs:"300px"} }}
          size="medium"
          type="text" placeholder="Enter your Product name" required
          defaultValue={editing.editingName}
          onChange={(e) => {
            setEditing({
              ...editing,
              editingName: e.target.value
            })}}>
        </TextField>

        <br /><br />
        <TextField
         sx={{ pl: 0, pr: 1,width:{lg:"800px",sm:"560px",xs:"300px"} }}
          size="medium"
          type="number" placeholder="Enter your Product Price" required
          defaultValue={editing.editingPrice}
          onChange={(e) => { 
            setEditing({
              ...editing,
              editingPrice: e.target.value
            })
           }}>

        </TextField>
        <br />
        <br />
        <TextField
        
        sx={{ pl: 0, pr: 1,width:{lg:"800px",sm:"560px",xs:"300px"} }}
          size="medium"
          type="text" placeholder="Enter your product Description"
          defaultValue={editing.editingDescription}
          onChange={(e) => { 
            setEditing({
              ...editing,
              editingDescription: e.target.value
            })

           }}>

        </TextField>
      <Box sx={{display:"flex",
      border:'solid #B8B8B8 0.1px',
      ml:0,mt:3,mb:3,borderRadius:"5px",
      justifyContent:'center'}}>
         <TextField 
                sx={{pl:5,pr:5}}
                 size="small"
                type="file"  
                id='select-image'
                name='postImage'
                Value={editing.editingProdImage}
                onChange={(e) => {
                  setFile(e.currentTarget.files[0])
                }}
                style={{ display: 'none' }}>
                </TextField> 
                <Box sx={{ml:3}}>

<label htmlFor="select-image">
< AddPhotoAlternateIcon style={{ paddingLeft: "5px", fontSize: "25px", color: 'green' }} />
</label>
{/* <Button sx={{ml:2}} onClick={fileUpload}>set image</Button>  */}

<Box sx={{m:1 , position: 'relative', display: 'inline-flex' }}>
<CircularProgress variant="determinate" value={progress}  />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.white">
          {`${progress}%`}
        </Typography>
      </Box></Box></Box></Box> 

      <Button fullWidth sx={{m:0}} type="submit" variant="outlined">Update Product </Button>
        </form>
      
     
         
        </DialogContent>
        <DialogActions>
        
        </DialogActions>
      </BootstrapDialog>   


      <Stack spacing={2} sx={{ width: '100%' }}>
      
      
    
      <Snackbar open={openSnak} autoHideDuration={2000} onClose={handleCloseMsg}>
       {(error)?
       <Alert onClose={handleCloseMsg} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>:
        <Alert severity="success">{success}</Alert>
        }
        
      </Snackbar>
      {/* <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}
    </Stack>


<Box
 sx={{
  width: 300,
  height: 400,

 
}}
>
      <Typography sx={{m:2,ml:3}} variant='h4'>
Add Product
      </Typography>
      <form style={{margin:'5px'}} onSubmit={submitHandler}>
        <TextField
       
          sx={{ pl: 3, pr: 5,width:{lg:"700px",sm:"500px",xs:"330px"} }}
          size="medium"
          type="text" placeholder="Enter your Product name" required
          onChange={(e) => { setProdName(e.target.value) }}>
        </TextField>

        <br /><br />
        <TextField
         sx={{ pl: 3, pr: 5,width:{lg:"700px",sm:"500px",xs:"330px"} }}
          size="medium"
          type="number" placeholder="Enter your Product Price" required
          onChange={(e) => { setProdPrice(e.target.value) }}>

        </TextField>
        <br />
        <br />
        <TextField
        
        sx={{ pl: 3, pr: 5,width:{lg:"700px",sm:"500px",xs:"330px"} }}
          size="medium"
          type="text" placeholder="Enter your product Description"
          onChange={(e) => { setProdDec(e.target.value) }}>

        </TextField>
      <Box sx={{display:"flex",
      border:'solid #B8B8B8 0.1px',
      ml:3,mt:3,mb:3,borderRadius:"5px",
      justifyContent:'center'}}>
         <TextField 
                sx={{pl:5,pr:5}}
                 size="small"
                type="file"  
                id="picture"
            

                name='picture'
                onChange={(e) => {
                  setFile(e.currentTarget.files[0])
                  setProgress(100)
                  var url = URL.createObjectURL(e.currentTarget.files[0])

                  console.log("url: ", url);

                  setPreview(url)
                }}
                 style={{ display: 'none' }}
                >
                </TextField> 

              {  (preview)?
            <div  className='zoom'>

          
                <img  style={{margin:"5px 0px 5px 22px "}} src={preview} height="80px" width="80px" alt="" srcset="" />
                </div>:""
              }
                <Box sx={{ml:8}}>



<label  htmlFor="picture">
< AddPhotoAlternateIcon style={{ paddingLeft: "5px", fontSize: "25px", color: 'green' }} />
</label>
{/* <Button sx={{ml:2}} onClick={fileUpload}>set image</Button>  */}

<Box sx={{m:2 , position: 'relative', display: 'inline-flex' }}>
<CircularProgress variant="determinate" value={progress}  />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.white">
          {`${progress}%`}
        </Typography>
      </Box>
    </Box>
    </Box>
{/* {
(progress === '100')?<h5>Done{progress}%</h5>:<h5>loading{progress}%</h5>
}  */}

</Box> 
{(!error)?"":<p style={{paddingLeft:"35px" ,color:"red", display:"flex"}}>
  <ErrorIcon/>
 <p style={{marginLeft:"10px"}}>{error}</p></p>}
{/* {(fileUpload && !storageURL === "")?
        <Button sx={{ml:10}} type="submit" variant="outlined">Add Product </Button>
      : 
      <Button disabled sx={{ml:10}} type="submit" variant="outlined">Add Product </Button>
      } */}
      <Button sx={{ml:10}} type="submit" variant="outlined">Add Product </Button>
        </form>
      </Box>
      <br />
      <br />
      <br />
    
      <div>

        {/* error Dialog Box */}
      <BootstrapDialog
        onClose={handleCloseError}
        aria-labelledby="customized-dialog-title"
        open={openError}
        
       
      > 
      <DialogTitle dividers >
        <Typography sx={{fontSize:{xs:"26px"}}} variant='h4'>
        E-Mart Error
          <CloseIcon onClick={handleCloseError} sx={{m:1,float:"right"}} />
        </Typography>
     
      </DialogTitle>
        <DialogContent  dividers>

         
          <CardMedia
              component="img"
              loading="lazy"
                sx={{
                  height:{xs:180,sm:350,lg:400}
              ,width:{xs:250,sm:520,lg:580}
              }}
              image={Error}
              alt="No product Image"
            />
        
        </DialogContent>
        <DialogActions>

        </DialogActions>
      </BootstrapDialog>
    </div>
          
                  

      <Divider sx={{mt:8}} />
     {/* loading skeleton */}
     {(state.productSkeleton)?
     <ProductSkeleten/>:
   
      (!ProductData || productDataLength === 0)?
      <CardMedia
              component="img"
              width="200"
              loading="lazy"
                sx={{height:{xs:"600",sm:"700",lg:"850"},mixBlendMode:"color-burn"}}
              image={noProductFound}
              alt="No product Image"
            />:
      <Grid sx={{m:{xs:1,sm:5,lg:3},mb:{xs:6,sm:5,lg:7}}} container item spacing={7}>  
      {(!ProductData) ? null :
        ProductData?.map((eachProduct, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{ m:{xs:2,lg:2,sm:1},mb:"5px",  width: '100%', maxWidth:{ lg:300,xs:320,sm:300}, bgcolor: '#171723'
            ,borderRadius:"10px",color:"whitesmoke" }}>

           <Box sx={{ width: '100%', maxWidth:{ lg:300,xs:320,sm:300},
            bgcolor: '#171723',p:1,borderRadius:"10px",color:"whitesmoke"}}>
             
              
              
              <CardMedia
                component="img"
                width="200"
                loading="lazy "
                height="200"
              
                image={eachProduct.productImage}
                alt="green iguana"
              />
              <Box sx={{ my: 3, mx: 2 }}>
                <Grid container alignItems="center">
                  <Grid item xs>
                    <Typography gutterBottom variant="h4" component="div">
                    {eachProduct.name}
                      
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography gutterBottom variant="h6" component="div">
                      ${eachProduct.price}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography sx={{ opacity: 0.5}} color="whitesmoke" variant="body2">
                  {eachProduct.description}
                </Typography>
              </Box>
              <Divider variant="middle" />

              <Box sx={{
                display: "flex", justifyContent: "space-evenly",
                m: 1, p: 1
              }}>
                <Button
                onClick={()=>{
                  handleClickOpen();
                  setEditing({
                    editingid:eachProduct._id,
                    editingName:eachProduct.name,
                    editingPrice:eachProduct.price
                    ,editingDescription:eachProduct.description,
                    editingProdImage:eachProduct.productImage,
                })
                  }}
                
                color='success' variant='contained'>Edit</Button>
                <Button 
                onClick={()=>{
                  deleteProduct(eachProduct._id)
                }}
                color='error' variant='contained'>Delete</Button>
              </Box>
            </Box>

          </Paper>
        ))}
        </Grid>}
    </div>
  )
}

export default Home