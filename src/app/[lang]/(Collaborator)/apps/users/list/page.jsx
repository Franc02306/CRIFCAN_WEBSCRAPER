'use client'

import { useEffect, useState } from 'react'

import { CircularProgress, Box, Typography } from '@mui/material'

import { listUser } from '../../../../../../Service/userService'

import UsersListIndex from '../../../../../../views/apps/users/list/index'

const UserListApp = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getListUsers = async () => {
    try {
      setIsLoading(true)
      const response = await listUser()

      const activeUsers = response.data.filter(user => user.is_active === true)

      setUsers(activeUsers)
    } catch (error) {
      console.error('Error en la solicitud:', error)
      setError('Algo salió mal, intenta de nuevo más tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserAdded = async () => {
    await getListUsers()
  }

  useEffect(() => {
    getListUsers()
  }, [])

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column'
        }}
      >
        <Typography variant='h6' color='error'>
          {error} {/* Mostrando el mensaje de error personalizado */}
        </Typography>
      </Box>
    )
  }

  return <UsersListIndex users={users} onUserAdded={handleUserAdded} />
}

export default UserListApp
