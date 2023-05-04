import { AppBar, Box, Button, Drawer, IconButton, TextField, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react'
import CreateDrawer from '../Drawer'
import axios from 'axios';
import uuid from 'react-uuid';

const Header = (props) => {
    const [state, setState] = useState(false)
    const [membersData,setMembersData]= useState({
        id:uuid(),
        name:'',
        email:'',
        address:'',
        organization:"",
        designation:'',
        contact:'',
        blocked:false
      })

      const handleMembersData=(e)=>{
        const {name, value}= e.target
        setMembersData(prev=>{
          return {...prev,[name]:value}
        })
      }
      const afterAdd= () =>{
        props.fetchAllMembers();
        setState(false)
        setMembersData({
            id:uuid(),
            name:'',
            email:'',
            address:'',
            organization:"",
            designation:'',
            contact:'',
            blocked:false
          })
        console.log('afteradd')
      }
      const addMemberToTable=async()=>{
        try{
    
            await axios.post('http://localhost:3004/members',membersData)
            .then((resp)=>afterAdd())
            .catch((error)=>console.log(error))
    
        }catch(error){
          console.log(error)
        }
      }
      const list = (anchor) => (
        
        <Box sx={{ width: 400 }} role="presentation">
          {/* ---------------------------------------------- todo here  */}
          <Box
            sx={{
              padding: "16px",
            }}
          >
            <h2>Add New Member</h2>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "16px",
              }}
            >
              <TextField
                type="text"
                id="outlined-basic"
                label="Name"
                name='name'
                value={membersData.name}
                variant="outlined"
                onChange={(e)=>handleMembersData(e)}
              />
              <TextField
                type="email"
                id="outlined-basic"
                label="Email"
                name="email"
                value={membersData.email}
                variant="outlined"
                onChange={(e)=>handleMembersData(e)}
    
    
              />
              <TextField
                type="text"
                id="outlined-basic"
                label="Address"
                variant="outlined"
                name="address"
                value={membersData.address}
                onChange={(e)=>handleMembersData(e)}
    
              />
              <TextField
                type="text"
                id="outlined-basic"
                label="Organization"
                name="organization"
                value={membersData.organization}
                variant="outlined"
                onChange={(e)=>handleMembersData(e)}
    
              />
              <TextField
                type="text"
                id="outlined-basic"
                label="Designation"
                variant="outlined"
                name="designation"
                value={membersData.designation}
                onChange={(e)=>handleMembersData(e)}
    
              />
              <TextField
                type="phone"
                id="outlined-basic"
                label="Contact"
                variant="outlined"
                name='contact'
                value={membersData.contact}
                onChange={(e)=>handleMembersData(e)}
    
              />
              <Box
                sx={{
                  display: "flex",
                  columnGap: "16px",
                }}
              >
                <Button
                  sx={{
                    width: "50%",
                  }}
                  variant="outlined"
                  onClick={()=>setState(false)}
                >
                  Cancel
                </Button>
                <Button 
                  sx={{
                    width: "50%",
                  }}
                  variant="contained"
                  onClick={addMemberToTable}
                >
                  Add
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      );

  return (
    <>
                <Box sx={{ flexGrow: 1 }}>
          <AppBar
            position="static"
            sx={{
              background: "white",
            }}
          >
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              ></IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, color: "blue" }}
              >
                Members
              </Typography>
              <button
                onClick={()=>setState(true)}
                style={{
                  border: "1px solid black",
                  padding: "10px 20px",
                  backgroundColor: "#5b66f2",
                  border: "none",
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "20px",
                  fontWeight: "400",
                  cursor: "pointer",
                }}
              >
                Add Member
              </button>
              <Drawer
                anchor={"right"}
                open={state}
                onClose={()=>setState(false)}
                // onClose={()=>props.toggleDrawer("right", false)}
              >
                {list("right")}
              </Drawer>
              
            </Toolbar>
          </AppBar>
        </Box>
    </>
  )
}

export default Header