'use client'

import { useMemo, useState } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import { Divider, IconButton, TableSortLabel } from '@mui/material'
import { useTheme } from '@emotion/react'
import Swal from 'sweetalert2'

import AddUserDrawer from './AddUserDrawer'
import { getLocalizedUrl } from '@/utils/i18n'

import { deleteUser } from '../../../../service/userService'

const Tablelist = ({ initialUsers, onDelete, handleUserAdded }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('username');

  const { lang: locale } = useParams()
  const theme = useTheme()

  const columns = useMemo(
    () => [
      { id: 'name', label: 'Nombres' },
      { id: 'apellidos', label: 'Apellidos' },
      { id: 'email', label: 'Email' },
      { id: 'identification', label: 'Identificación', width: 130 },
      { id: 'numero_identification', label: 'Número Identificación', width: 130 },
      { id: 'institution', label: 'Institución', width: 130 },
      { id: 'country', label: 'Nacionalidad', width: 130 },
      { id: 'status', label: 'Estados', width: 130 },
      { id: 'Fecha de Creacion', label: 'Fecha de Creación', width: 130 },
      { id: 'Acciones', label: 'Acciones', width: 130 }
    ],
    []
  )

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';

    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const sortedUsers = useMemo(() => {
    return [...initialUsers]
      .filter(user => user.is_active)
      .sort((a, b) => {
        const valueA = a[orderBy]?.toLowerCase() || '';
        const valueB = b[orderBy]?.toLowerCase() || '';

        if (valueA < valueB) return order === 'asc' ? -1 : 1;
        if (valueA > valueB) return order === 'asc' ? 1 : -1;

        return 0;
      });
  }, [initialUsers, order, orderBy]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const paginatedData = useMemo(() => {
    return sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedUsers, page, rowsPerPage]);

  const showAlertDeleteQuestion = async id => {
    const titleColor = theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000'
    const backgroundColor = theme.palette.background.paper
    const confirmButtonColor = theme.palette.primary.main
    const cancelButtonColor = theme.palette.error.main

    const result = await Swal.fire({
      html: `<span style="font-family: Arial, sans-serif; font-size: 28px; color: ${titleColor};">¿Está seguro que desea eliminar este usuario?</span>`,
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: cancelButtonColor,
      background: backgroundColor
    })

    if (result.isConfirmed) {
      await deleteProduct(id)
    }
  }

  const deleteProduct = async id => {
    if (id != null) {
      try {
        await deleteUser(id)
        onDelete(id) // Llamar al callback onDelete después de eliminar el usuario
        const titleColor = theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000'

        Swal.fire({
          icon: 'success',
          html: `<span style="font-family: Arial, sans-serif; font-size: 28px; color: ${titleColor};">Usuario eliminado</span>`,
          confirmButtonColor: theme.palette.primary.main,
          background: theme.palette.background.paper,
        });
      } catch (err) {
        console.log(err.message)
      }
    }
  }

  const handleEditClick = user => {
    setSelectedUser(user)
    setEditUserOpen(true)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Toolbar>
        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
          Lista de Usuarios
        </Typography>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table
          sx={{
            '& .MuiTableCell-root': {
              border: theme.palette.mode === 'light'
                ? '1px solid rgba(0, 0, 0, 0.35)'  // Borde negro translúcido en tema claro
                : '1px solid rgba(255, 255, 255, 0.12)',  // Borde blanco translúcido en tema oscuro
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
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>Email</TableCell>
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>Identificación</TableCell>
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>Número de Identificación</TableCell>
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>Institución</TableCell>
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>País</TableCell>
              {/* <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>Estados</TableCell> */}
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>Fecha de Creación</TableCell>
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {initialUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  <Typography>No hay usuarios existentes</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map(user => (
                <TableRow
                  key={user.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover, // Usar el color de hover del tema
                    },
                    backgroundColor: theme.palette.background.paper, // Fondo según el tema
                  }}
                >
                  <TableCell>{user.username || 'Sin Nombres'}</TableCell>
                  <TableCell>{user.last_name || 'Sin Apellidos'}</TableCell>
                  <TableCell>{user.email || 'Sin Email'}</TableCell>
                  <TableCell>{user.identification_type?.description || 'Sin Identificación'}</TableCell>
                  <TableCell>{user.number_identification || 'Sin Número de Identificación'}</TableCell>
                  <TableCell>{user.institution?.name || 'Sin Institución'}</TableCell>
                  <TableCell>{user.country?.description || 'Sin País'}</TableCell>
                  {/* <TableCell>
                    <Chip
                      label={user.is_active ? 'Activo' : 'Inactivo'}
                      color={user.is_active ? 'success' : 'error'}
                    />
                  </TableCell> */}
                  <TableCell>
                    <Typography variant='body2'>{new Date(user.date_joined).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      <IconButton>
                        <Link href={getLocalizedUrl(`apps/users/list/view/${user.id}`, locale)} className='flex'>
                          <i className='tabler-eye text-[22px] text-textSecondary' />
                        </Link>
                      </IconButton>
                      <IconButton onClick={() => handleEditClick(user)}>
                        <i className='tabler-pencil text-[22px] text-textSecondary' />
                      </IconButton>
                      <IconButton onClick={() => showAlertDeleteQuestion(user.id)}>
                        <i className='tabler-trash text-[22px] text-textSecondary' />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          variant='outlined'
          component='div'
          count={initialUsers.filter(user => user.is_active).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Usuarios por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        />
        <AddUserDrawer
          usuario={selectedUser}
          open={editUserOpen}
          setOpen={setEditUserOpen}
          mode='edit'
          id={selectedUser ? selectedUser.id : null}
          handleUserAdded={handleUserAdded}
        />
      </Toolbar>
    </Paper>
  )
}

export default Tablelist
