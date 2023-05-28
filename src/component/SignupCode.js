import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const renderActionButton = (params) => {

  const handleDelete = (id) => {
    axios.delete(`/signup-code/${id}`).then(response=>{
      console.log(response)
      window.location.reload();
    })
    .catch(e=>console.log(e));
  }

  return (
      <strong>
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
      </strong>
  )
}

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'code',
    headerName: 'Signup Code',
    width: 150,
  },
  {
    field: 'isValid',
    headerName: 'Valid',
    type: 'boolean',
    editable: true,
    width: 100,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    width: 300,
  },
  {
      field: 'action',
      headerName: 'Action',
      width: 300,
      renderCell: renderActionButton,
      disableClickEventBubbling: true,
  },
];

export default function SignupCode() {
  const [list, setList] = useState([]);

  const handleCreate = () => {
    axios.post('/signup-code').then((response)=>{
      console.log(response)
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    })
  }

  useEffect(()=>{

    axios.get('/signup-code').then(response=>{
      console.log(response);
      setList(response.data.data.signupCode);
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
      <Button variant="contained" color="primary" size="small" onClick={handleCreate}>Create</Button>
    </Box>
  );
}