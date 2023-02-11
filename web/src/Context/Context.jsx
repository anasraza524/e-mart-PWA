import React, { createContext, useReducer } from 'react'
import { reducer } from './Reducer';

export const GlobalContext = createContext("Initial Value");

let data = {
  darkTheme: true,
  otpTimerRunOut:null,
  current_Otp:null,
  bageNo:0,
  cartData:null,
  user: {},
  isLogin: null,
  loadProduct:false,
  productSkeleton:false,
  // Error:"",
  // Success:"",
  baseUrl: (window.location.href.split(":")[0] === "http")
    ?
    `http://localhost:3001/api/v1` : `/api/v1`
}

export default function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, data)
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}