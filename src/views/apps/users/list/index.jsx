import { useState, useEffect } from 'react'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { Divider } from '@mui/material'

import dayjs from 'dayjs'

import Tablelist from './UserList'
import FormList from './FormList'

const UserList = ({ users, handleUserAdded }) => {
  const [filteredUsers, setFilteredUsers] = useState(users)

  useEffect(() => {
    setFilteredUsers(users)
  }, [users])

  const handleSearch = (emailFilter, institutionFilter, countryFilter) => {
    // Asegúrate de que users es un array antes de aplicar el filtro
    const validUsers = Array.isArray(users) ? users : [];

    const filtered = validUsers.filter(user => {
      const matchesEmail = emailFilter ? user.email?.toLowerCase().includes(emailFilter.toLowerCase()) : true;
      const matchesInstitution = institutionFilter ? user.institution?.id === institutionFilter.id : true;
      const matchesCountry = countryFilter ? user.country?.description?.toLowerCase().includes(countryFilter.toLowerCase()) : true;

      return matchesEmail && matchesInstitution && matchesCountry;
    });

    setFilteredUsers(filtered); // Establece los usuarios filtrados en el estado
  };

  const handleCreate = () => {
    console.log('Crear nuevo registro')

    // Lógica para crear un nuevo usuario
  }

  const handleDelete = id => {
    setFilteredUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === id ? { ...user, is_active: false } : user
      )
    );
  };

  return (
    <Grid container spacing={5} alignItems='center'>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <Box p={3}>
            <FormList
              onSearch={handleSearch}
              onCreate={handleCreate}
              users={users}
              handleUserAdded={handleUserAdded}
            />
          </Box>
          <Divider />
          <Box p={3}>
            <Tablelist initialUsers={filteredUsers} onDelete={handleDelete} handleUserAdded={handleUserAdded} />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default UserList
