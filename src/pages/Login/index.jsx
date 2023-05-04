import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [loginData,setLoginData] =useState({
    email:'',
    password:''
  })
  const navigate =useNavigate()

  const handleLogin=(e)=>{
    const {name, value}= e.target
    setLoginData(prev=>{
      return {...prev,[name]:value}
    })
  }
  const loginHandleClicked=()=>{
    if (loginData.email === 'quokka@gmail.com' && loginData.password === 'Admin@123'){
      navigate('/members')
    }
    else{
      console.log("please enter correct email")
    }
  }
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: "20px",
          padding: "20px",
          maxWidth: "400px",
          margin: "auto",
          boxShadow: "0 0 2px 0 black",
          marginTop: "150px",
        }}
      >
        <h1 align="center">Login To Panel</h1>
        <TextField
          type="email"
          name='email'
          value={loginData.email}
          id="outlined-basic"
          label="Email"
          variant="outlined"
          onChange={(e)=>handleLogin(e)}
        />
        <TextField
        name='password'
        value={loginData.password}
          type="password"
          id="outlined-basic"
          label="Password"
          variant="outlined"
          onChange={(e)=>handleLogin(e)}

        />
        <Button variant="contained" onClick={loginHandleClicked}>Login</Button>
      </Box>
    </>
  );
};

export default Login;
