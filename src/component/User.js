import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const renderActionButton = (params) => {

  const handleDelete = (id) => {
    axios.delete(`/user/${id}`).then(response=>{
      console.log(response)
      window.location.reload();
    })
    .catch(e=>console.log(e));
  }

  return (
      <strong>
          { params.row.role !== "admin" &&
          <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                  const id = params.row.id;
                  handleDelete(id);
              }}
          >
              Delete
          </Button>
          }
      </strong>
  )
}

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'username',
    headerName: 'Username',
    width: 300,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 80,
  },
  {
    field: 'signup_code',
    headerName: 'Sign Up Code',
    width: 150,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    width: 200,
  },
  {
      field: 'action',
      headerName: 'Action',
      width: 300,
      renderCell: renderActionButton,
      disableClickEventBubbling: true,
  },
];

export default function User() {
  const [list, setList] = useState([]);

  const handleCreate = () => {
    axios.get('/user').then((response)=>{
      console.log(response)
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    })
  }
  
  useEffect(()=>{

    axios.get('/user').then(response=>{
      console.log(response);
      setList(response.data.data.users);
    })
    .catch(error=>console.log(error));

  },[]);

  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <DataGrid
        rows={list}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}