import React from 'react'
import axios from 'axios';
import { useState, useEffect,useContext } from "react"
import {Snackbar,Alert} from '@mui/material';
import {
  Stack,Divider,Paper,Box,Button,Grid,CardMedia,Typography
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
import Cart2 from '../assets/cart.gif'
import shop from '../assets/ecom-cart.gif'
import Cart from '../assets/cool-loading-animated.gif'
import { GlobalContext } from '../Context/Context';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));





const AddToProduct = ({setLoadCart,loadCart}) => {
  let { state, dispatch } = useContext(GlobalContext);
  const [addtoCartData, setaddtoCartData] = useState(null)
  const [loadProduct, setLoadProduct] = useState(false)
  const [open, setOpen] = useState(false);
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

console.log(state.cartData,"state.cartData")
// const getAllCart = () => { 
//   try {
//     setaddtoCartData(state.cartData)
//   console.log(state.cartData,"state.cartData")
//   } catch (error) {
//     console.log(error,"cartError")
//   }
  


//  }
//  useEffect(() => {

   

//      getAllCart()
   
//  }, [loadCart]);

// if(state.cartData){
//   handleClose() 
// }else{
//   handleClickOpen()
// }

useEffect(() => {
  if(state.bageNo === 0){
    handleClickOpen()
  }else{
    handleClose()
 }
}, [loadCart])

  const deleteCartProduct = async (id) => {
    if(error || success){
      handleClickMsg()
    } 
    setSuccess('')
setError('')
    try {
      const response = await axios.delete(`${state.baseUrl}/addtocart/${id}`,{
         
        withCredentials: true,
        
     
    })
      console.log("response: ", response.data);
      setSuccess(response.data.message)
      setLoadCart(!loadCart)

    } catch (error) {
      setError(error.message)
      console.log("error in getting all products", error);
    }
  }
  return (
    <div>
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



         <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
      <DialogTitle dividers="true" >
        <Typography sx={{fontSize:{xs:"28px"}}} variant='h4'>
          E-Mart
          <CloseIcon onClick={handleClose} sx={{m:1,float:"right"}} />
        </Typography>
     
      </DialogTitle>
        <DialogContent dividers>

          <Typography sx={{fontSize:{xs:"16px"}}} variant='h6' gutterBottom>
            There is no product in cart please add to cart first..... 
          </Typography>
          <Typography sx={{fontSize:{xs:"16px"}}} variant='h6'>
            Thank you...
          </Typography>
          <CardMedia
              component="img"
              width="150"
              loading="lazy"
                sx={{height:{xs:100,sm:200,lg:250},mt:1}}
              image={shop}
              alt="No product Image"
            />
          {/* <ShoppingCartIcon sx={{fontSize:"120px", float:"center",color:"green",ml:15}}/> */}
        </DialogContent>
        <DialogActions>
          <Link 
          sx={{fontSize:"20px" , textDecoration:"none"}}
          to="/">
          <Button sx={{fontSize:"20px"}} autoFocus onClick={handleClose}>
            Ok
          </Button>
          </Link>
        </DialogActions>
      </BootstrapDialog>   
      
      {(state.bageNo === 0 )?
      <CardMedia
              component="img"
              width="100px"
              loading="lazy"
                sx={{height:{xs:"450px",sm:"500px",lg:"550px"},mt:{xs:"80px"},backgroundSize:'cover'}}
              image={Cart2}
              alt="No product Image"
            />:  
      <Grid sx={{m:{xs:1,sm:2,lg:3},mb:{xs:6,sm:5,lg:7}}} container item spacing={6}>
    {(!state.cartData) ? null :
  state.cartData?.map((eachProduct, index) => ( 
     <Paper
     
     key={index}
       elevation={4}
       sx={{ m:{xs:2,lg:2,sm:1},mb:"5px",  width: '100%', maxWidth:{ lg:300,xs:320,sm:300}, bgcolor: '#171723'
       ,borderRadius:"10px",color:"whitesmoke" }}>

      <Box sx={{ width: '100%', maxWidth:{ lg:300,xs:320,sm:300},
       bgcolor: '#171723',p:1,borderRadius:"10px",color:"whitesmoke"}}>
        
         
       <CancelIcon

onClick={() => {
  deleteCartProduct(eachProduct?._id)
}}
     
       sx={{m:1,float:"right"}}/>
          <CardMedia
           component="img"
           loading="lazy"
           width="200"
           height="200"
           // image='https://www.shutterstock.com/image-vector/sunscreen-product-banner-ads-on-260nw-1509241181.jpg'
            image={eachProduct?.productImage}
           alt="green iguana"
         />
         <Box sx={{ my: 3, mx: 2 }}>
           <Grid container alignItems="center">
             <Grid item xs>
               <Typography gutterBottom variant="h4" component="div">
                 {eachProduct.name}
                 {/* sdsd */}
               </Typography>
             </Grid>
             <Grid item>
               <Typography gutterBottom variant="h6" component="div">
                 ${eachProduct?.price}
                 {/* sdfsdf */}
               </Typography>
             </Grid>
           </Grid>
           <Typography sx={{ opacity: 0.5}} color="whitesmoke" variant="body2">
             {/* dsdsdsd */}
             {eachProduct?.description}
           </Typography>
           
         </Box>
         <Divider variant="middle" />

         <Box sx={{
           display: "flex", justifyContent: "space-evenly",
           m: 1, p: 1
         }}>
           {/* <Button
           //  onClick={AddTheProduct}
           onClick={() => {
             getAProduct(eachProduct.id)
           }}
            color='success' variant='contained'>Add to cart</Button> */}
           <Button fullWidth color='success' variant='contained'>Order Now</Button>
         </Box>
       </Box>

     </Paper>
           
           ))
         } 
    
     </Grid>}</div>
  )
}

export default AddToProduct;