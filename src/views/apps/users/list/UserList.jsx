'use client'

import React, { useState, useEffect, useMemo } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TablePagination,
  Toolbar,
  Box,
  TableSortLabel,
  Button,
  Tooltip,
  Grid,
  TextField,
  InputAdornment,
  Divider
} from '@mui/material'

import { useTheme } from '@emotion/react'
import Swal from 'sweetalert2'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'

import UserModal from '../create/UserModal'
import { getLocalizedUrl } from '@/utils/i18n'

import { deleteUser } from '../../../../Service/userService'

const UserList = ({ users, onUserAdded }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('username')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [emailFilter, setEmailFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [modalMode, setModalMode] = useState('create')

  const theme = useTheme()

  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const filteredUsers = useMemo(() => {
    return users.filter(
      user =>
        user.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
        user.system_role_description.toLowerCase().includes(roleFilter.toLowerCase())
    )
  }, [users, emailFilter, roleFilter])

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const valueA = a[orderBy]?.toLowerCase() || ''
      const valueB = b[orderBy]?.toLowerCase() || ''

      return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    })
  }, [filteredUsers, order, orderBy])

  const handleChangePage = (event, newPage) => setPage(newPage)

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenModal = (user = null) => {
    setSelectedUser(user)
    setModalMode(user ? 'edit' : 'create')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
    setIsModalOpen(false)
    setModalMode('create')
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 3 }}>
      <Box sx={{ padding: 5 }}>
        <Grid container spacing={2} alignItems='center' sx={{ marginBottom: 2 }}>
          {/* Filtro por correo electrónico */}
          <Grid item xs={12} md>
            <TextField
              label='Buscar por Email'
              type='text'
              size='small'
              value={emailFilter}
              onChange={e => setEmailFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              style={{ marginRight: '5px', width: '300px' }}
            />
          </Grid>

          {/* Filtro por Rol */}
          <Grid item xs={12} md>
            <TextField
              label='Buscar por Rol'
              type='text'
              size='small'
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              style={{ marginRight: '5px', width: '300px' }}
            />
          </Grid>

          <Grid item xs={12} md='auto'>
            <Button 
              variant='contained' 
              color='primary' 
              startIcon={<AddIcon />} 
              onClick={() => handleOpenModal()}
            >
              Agregar Usuario
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ padding: '0' }}>
        <Divider sx={{ width: '100%' }} />
      </Box>

      <Box sx={{ padding: 5 }}>
        <Grid container spacing={2} alignItems='center' sx={{ marginBottom: 2 }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold', marginLeft: '12px', marginBottom: '10px' }}>
            Lista de Usuarios
          </Typography>
        </Grid>

        <TableContainer
          component={Paper}
          sx={{
            marginTop: 2,
            overflow: 'hidden' // Para que la tabla no sobresalga del borde curvo
          }}
        >
          <Table
            sx={{
              '& .MuiTableCell-root': {
                border:
                  theme.palette.mode === 'light'
                    ? '1px solid rgba(0, 0, 0, 0.35)'
                    : '1px solid rgba(255, 255, 255, 0.18)',
                fontSize: '0.9rem'
              }
            }}
          >
            <TableHead style={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>
                  <TableSortLabel
                    active={orderBy === 'username'}
                    direction={orderBy === 'username' ? order : 'asc'}
                    onClick={() => handleRequestSort('username')}
                  >
                    Nombres
                  </TableSortLabel>
                </TableCell>
                <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>
                  Apellidos
                </TableCell>
                <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>
                  Correo Electrónico
                </TableCell>
                <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>
                  Rol
                </TableCell>
                <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                <TableRow
                  key={user.id}
                  sx={{
                    '&:hover': { backgroundColor: theme.palette.action.hover }
                  }}
                >
                  <TableCell align='center'>{user.username}</TableCell>
                  <TableCell align='center'>{user.last_name}</TableCell>
                  <TableCell align='center'>{user.email}</TableCell>
                  <TableCell align='center'>{user.system_role_description}</TableCell>
                  <TableCell align='center'>
                    <Tooltip title='Ver Usuario'>
                      <IconButton>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Editar Usuario'>
                      <IconButton color='info' onClick={() => handleOpenModal(user)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Eliminar Usuario'>
                      <IconButton color='error'>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage='Usuarios por página'
      />

      <UserModal
        open={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onClose={handleCloseModal}
        onUserAdded={onUserAdded}
        user={selectedUser}
        mode={modalMode}
      />
    </Paper>
  )
}

export default UserList
