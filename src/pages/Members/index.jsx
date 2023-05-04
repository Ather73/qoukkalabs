import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { visuallyHidden } from "@mui/utils";
import {
  AppBar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import { Search } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import uuid from 'react-uuid';
import axios from "axios";
import CreateMemberDrawer from '../../components/Drawer'
import Header from "../../components/Header";




function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "address",
    numeric: true,
    disablePadding: false,
    label: "Address",
  },
  {
    id: "organization",
    numeric: true,
    disablePadding: false,
    label: "Organization",
  },
  {
    id: "designation",
    numeric: true,
    disablePadding: false,
    label: "Designation",
  },
  {
    id: "contact",
    numeric: true,
    disablePadding: false,
    label: "Contact",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const Members = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [rows, setRows] = useState([]);
  const [state, setState] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [key, setKey] = useState('')

  const handleMembersData=(e)=>{
    const {name, value}= e.target
    setSelectedRowData(prev=>{
      return {...prev,[name]:value}
    })
  }
  const editMember=async(id)=>{
    console.log('clicked')
    try{

        await axios.put(`http://localhost:3004/members/${id}`,selectedRowData)
        .then((resp)=>{
          setState(false);
          fetchAllMembers()
        })
        .catch((error)=>console.log(error))

    }catch(error){
      console.log(error)
    }
  }
  const handleStatus=async(row)=>{
    const payload = {
      ...row,
      blocked:!row.blocked
    }
    try{

        await axios.put(`http://localhost:3004/members/${row.id}`,payload)
        .then((resp)=>{
          fetchAllMembers()
        })
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
         aria-readonly
            type="text"
            id="outlined-basic"
            label="id"
            name='id'
            value={selectedRowData.id}
            variant="outlined"
            onChange={(e)=>handleMembersData(e)}
            disabled={true}
          />
          <TextField
            type="text"
            id="outlined-basic"
            label="Name"
            name='name'
            value={selectedRowData.name}
            variant="outlined"
            onChange={(e)=>handleMembersData(e)}
          />
          <TextField
            type="email"
            id="outlined-basic"
            label="Email"
            name="email"
            value={selectedRowData.email}
            variant="outlined"
            onChange={(e)=>handleMembersData(e)}


          />
          <TextField
            type="text"
            id="outlined-basic"
            label="Address"
            variant="outlined"
            name="address"
            value={selectedRowData.address}
            onChange={(e)=>handleMembersData(e)}

          />
          <TextField
            type="text"
            id="outlined-basic"
            label="Organization"
            name="organization"
            value={selectedRowData.organization}
            variant="outlined"
            onChange={(e)=>handleMembersData(e)}

          />
          <TextField
            type="text"
            id="outlined-basic"
            label="Designation"
            variant="outlined"
            name="designation"
            value={selectedRowData.designation}
            onChange={(e)=>handleMembersData(e)}

          />
          <TextField
            type="phone"
            id="outlined-basic"
            label="Contact"
            variant="outlined"
            name='contact'
            value={selectedRowData.contact}
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
              onClick={()=>editMember(selectedRowData.id)}
            >
            Edit 
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
  // add members data

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);

  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage,rows]
  );
 




const fetchAllMembers = async ()=>{
  try{
     await axios.get('http://localhost:3004/members')
      .then((resp)=>setRows(resp?.data))
      .catch((error)=>console.log(error))
  }catch(error){
    console.log(error)
  }
}
console.log(rows) 
useEffect(()=>{
  fetchAllMembers()
},[])
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/*-------------------------------- header starts -------------*/}
          <Header fetchAllMembers={fetchAllMembers}/>
        {/* -------------------------------- header ends ------------- */}
        <Box sx={{ width: "100%", flexGrow: "1", marginTop: "20px" }}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <TableContainer>
              <Toolbar
                sx={{
                  display: "flex",
                  justifyContent: "start",
                }}
              >
                <Box
                  sx={{
                    width: "400px",
                    height: "40px",

                    boxShadow: "0 0 2px 0 black",
                    position: "relative",
                    borderRadius: "6px",
                  }}
                >
                  <input
                    style={{
                      width: "354px",
                      border: "none",
                      height: "100%",
                      borderRadius: "6px",
                      padding: "0 30px 0 16px",
                    }}
                    type="text"
                    placeholder="Search ..."
                    onChange={(e)=>setKey(e.target.value)}
                  />
                  <SearchIcon
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                    }}
                  />
                </Box>
              </Toolbar>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {visibleRows.filter((f)=>f.name.includes(key)).map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.name)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.email}</TableCell>
                        <TableCell align="right">{row.address}</TableCell>
                        <TableCell align="right">{row.organization}</TableCell>
                        <TableCell align="right">{row.designation}</TableCell>
                        <TableCell align="right">{row.contact}</TableCell>
                        <TableCell align="right">
                        <Box>
                        <IconButton aria-label="delete" size="large" onClick={()=>{
                          setSelectedRowData(row);
                          setState(true)
                        }}>
                        <ModeEditIcon/>
</IconButton>
  <Button sx={{
    width:"120px"
  }} variant="contained" color={row.blocked ? 'error': 'success'} 
  onClick={()=>handleStatus(row)}
  >
    {row.blocked ? 'Unblock' : 'Block'}
</Button>
                        </Box>
                        
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[8]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
        <Drawer
                anchor={"right"}
                open={state}
                // onClose={()=>props.toggleDrawer("right", false)}
              >
                {list("right")}
              </Drawer>
      </Box>
    </>
  );
};

export default Members;
