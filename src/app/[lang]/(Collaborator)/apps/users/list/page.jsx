'use client'

import { useEffect, useState } from 'react'

import { CircularProgress, Box, Typography } from '@mui/material'

import { listUser } from '../../../../../../Service/userService'

import UsersListIndex from '../../../../../../views/apps/users/list/index'

const defaultUsers = [
  { id: 1, username: 'Juan', last_name: 'Pérez', email: 'juan.perez@example.com', role: 'Administrador' },
  { id: 2, username: 'Ana', last_name: 'Gómez', email: 'ana.gomez@example.com', role: 'Usuario' },
  { id: 3, username: 'Carlos', last_name: 'López', email: 'carlos.lopez@example.com', role: 'Moderador' }
]

const UserListApp = () => {
  const [users] = useState(defaultUsers)
  const [isLoading] = useState(false) // Desactivamos la carga
  const [error] = useState(null) // No manejamos errores aquí

  // const getListUsers = async () => {
  //   try {
  //     // const response = await listUser()

  //     setUsers(response.data.results || defaultUsers) // Usa la API o datos por defecto si falla
  //   } catch (error) {
  //     console.error('Error en la solicitud:', error)
  //     setError('Algo salió mal, intenta de nuevo más tarde.')
  //     setUsers(defaultUsers) // Usa datos de ejemplo si hay error
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const handleUserAdded = async () => {
  //   await getListUsers() // Llamada a la API para obtener la lista actualizada
  // }

  // useEffect(() => {
  //   getListUsers()
  // }, [])

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

  return <UsersListIndex users={users} />
}

export default UserListApp
