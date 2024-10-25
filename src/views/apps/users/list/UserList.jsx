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
  Tooltip
} from '@mui/material'

import { useTheme } from '@emotion/react'
import Swal from 'sweetalert2'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import UserModal from '../create/UserModal'
import { getLocalizedUrl } from '@/utils/i18n'

import { deleteUser } from '../../../../Service/userService'

const UserList = ({  }) => {
	const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('username')
  const theme = useTheme()

	// Datos de ejemplo para la tabla
  const users = [
    { id: 1, username: 'Juan', last_name: 'Pérez', email: 'juan.perez@example.com', role: 'Administrador' },
    { id: 2, username: 'Ana', last_name: 'Gómez', email: 'ana.gomez@example.com', role: 'Usuario' },
    { id: 3, username: 'Carlos', last_name: 'López', email: 'carlos.lopez@example.com', role: 'Moderador' },
  ]

	const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

	const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const valueA = a[orderBy]?.toLowerCase() || ''
      const valueB = b[orderBy]?.toLowerCase() || ''

      if (valueA < valueB) return order === 'asc' ? -1 : 1
      if (valueA > valueB) return order === 'asc' ? 1 : -1

      return 0
    })
  }, [users, order, orderBy])

	const handleChangePage = (event, newPage) => setPage(newPage)

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

	return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Toolbar>
        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
          Lista de Usuarios
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant='contained' color='primary'>
          Agregar Usuario
        </Button>
      </Toolbar>

      <TableContainer component={Paper}>
        <Table
          sx={{
            '& .MuiTableCell-root': {
              border:
                theme.palette.mode === 'light'
                  ? '1px solid rgba(0, 0, 0, 0.35)'
                  : '1px solid rgba(255, 255, 255, 0.12)',
            },
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
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>Apellidos</TableCell>
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>Correo</TableCell>
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>Rol</TableCell>
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  '&:hover': { backgroundColor: theme.palette.action.hover },
                }}
              >
                <TableCell align='center'>{user.username}</TableCell>
                <TableCell align='center'>{user.last_name}</TableCell>
                <TableCell align='center'>{user.email}</TableCell>
                <TableCell align='center'>{user.role}</TableCell>
                <TableCell align='center'>
                  <Tooltip title='Ver Usuario'>
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Editar Usuario'>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Eliminar Usuario'>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage='Usuarios por página'
      />
    </Paper>
  )
}

export default UserList
