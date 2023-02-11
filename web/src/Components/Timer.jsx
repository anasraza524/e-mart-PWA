// import React, { useState, useEffect,useContext } from "react";
// import TimeFormat from "hh-mm-ss";
// import { GlobalContext } from '../Context/Context';
// const Timer = ({ min }) => {
//     let { state, dispatch } = useContext(GlobalContext);
//   let mainTime;
//   const secondsLeft = () => {
//     const left = Number(min) * 60;
   
//     return left;
//   };

//   const [seconds, setSeconds] = useState(secondsLeft());
//   useEffect(() => {
//     startTime();
//     return () => {
//       stopTimer();
//     };
//   });

//   const startTime = () => {
//     if (seconds && seconds > 0) {
//       mainTime = setInterval(tick, 1000);
//     }
//   };

//   const stopTimer = () => {
//     clearInterval(mainTime);
//   };

//   const tick = () => {
//     setSeconds(seconds => {
//       const updatedSeconds = seconds - 1;
//       if (updatedSeconds < 1) {
//         stopTimer();
//       }
//       return updatedSeconds;
     
//     });
//   };

//   const display = TimeFormat.fromS(seconds, "mm:ss");
//   const [m, s] = display.split(":");
// //   if(seconds === 0){
// //     dispatch({
// //       type: 'OTP_TIME_RUN_OUT',
// //       payload: 0

// //     })
// //     return;}
//     // console.log("time")
//   return (
//     <div
     
    
//     >
     

      
//         <div className="flex flex-column" style={{ paddingLeft:"40%" }}>
//           <h5>{m}:{s}</h5>
        
//         </div>
       
   
//     </div>
//   );
// };
// export default Timer;
