import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import React,{useState} from 'react'
import uuid from 'react-uuid';

const Drawer = (props) => {
    console.log(props)
    const [membersData,setMembersData]= useState({
        id:uuid(),
        name:'',
        email:'',
        address:'',
        organization:"",
        designation:'',
        contact:''
      })

      const handleMembersData=(e)=>{
        const {name, value}= e.target
        setMembersData(prev=>{
          return {...prev,[name]:value}
        })
      }
      const addMemberToTable=async()=>{
        console.log('clicked')
        try{
    
            await axios.post('http://localhost:3004/members',membersData)
            .then((resp)=>null)
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
                  onClick={()=>null}
                >
                  Cancel
                </Button>
                <Button 
                  sx={{
                    width: "50%",
                  }}
                  variant="contained"
                  onClick={()=>addMemberToTable}
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
        <Drawer
                anchor={"right"}
                open={props.open}
                // onClose={()=>props.toggleDrawer("right", false)}
              >
                {list("right")}
              </Drawer>
    </>
  )
}

export default Drawer