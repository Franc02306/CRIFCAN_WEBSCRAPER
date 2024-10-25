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
	MenuItem,
	Select
} from '@mui/material'

import Swal from 'sweetalert2'
import { useTheme } from '@emotion/react'

import AddIcon from '@mui/icons-material/Add'
import UpdateIcon from '@mui/icons-material/Update'
import DescriptionIcon from '@mui/icons-material/Description'

const ScrapingParams = ({ webSites }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('username')
  const theme = useTheme()

  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sortedWebSites = useMemo(() => {
    return [...webSites].sort((a, b) => {
      const valueA = a[orderBy]?.toLowerCase() || ''
      const valueB = b[orderBy]?.toLowerCase() || ''

      return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    })
  }, [webSites, order, orderBy])

  const handleChangePage = (event, newPage) => setPage(newPage)

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

	return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 3, marginTop: 3 }}>
      <Toolbar sx={{ marginBottom: 2 }}>
        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
          Parámetros de Scrapeo
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant='contained' color='primary' startIcon={<AddIcon />}>
          Agregar Parámetro
        </Button>
      </Toolbar>

      <TableContainer
        sx={{
          marginTop: 2,
          borderRadius: 1.5, // Curva los bordes del contenedor
          overflow: 'hidden' // Evita que los elementos se desborden
        }}
      >
        <Table
          sx={{
            '& .MuiTableCell-root': {
              border:
                theme.palette.mode === 'light' ? '1px solid rgba(0, 0, 0, 0.35)' : '1px solid rgba(255, 255, 255, 0.18)'
            }
          }}
        >
          <TableHead style={{ backgroundColor: theme.palette.primary.main }}>
            <TableRow>
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>
                <TableSortLabel
                  active={orderBy === 'source_web'}
                  direction={orderBy === 'source_web' ? order : 'asc'}
                  onClick={() => handleRequestSort('source_web')}
                >
                  Fuente Web
                </TableSortLabel>
              </TableCell>
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>
                Frecuencia de Scraping
              </TableCell>
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>
                Última Fecha de Scraping
              </TableCell>
              <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedWebSites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(site => (
              <TableRow
                key={site.id}
                sx={{
                  '&:hover': { backgroundColor: theme.palette.action.hover }
                }}
              >
                <TableCell align='center'>{site.source_web}</TableCell>
                <TableCell align='center'>
                  <Select
                    defaultValue={site.frecuency_scrap}
                    sx={{ width: '80%' }}
                  >
                    <MenuItem value="Mensual">Mensual</MenuItem>
                    <MenuItem value="Trimestral">Trimestral</MenuItem>
                    <MenuItem value="Semestral">Semestral</MenuItem>
                  </Select>
                </TableCell>
                <TableCell align='center'>{site.last_date}</TableCell>
                <TableCell align='center'>
                  <Tooltip title='Actualizar'>
                    <IconButton color='success'>
                      <UpdateIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Registro de Actividad'>
                    <IconButton color='info'>
                      <DescriptionIcon />
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
        count={webSites.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage='Sitios por página'
      />
    </Paper>
  )
}

export default ScrapingParams
