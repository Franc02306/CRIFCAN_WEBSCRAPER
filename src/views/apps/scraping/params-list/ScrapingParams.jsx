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
  Select,
  Grid,
  InputAdornment,
  TextField,
  Divider
} from '@mui/material'

import Swal from 'sweetalert2'
import { useTheme } from '@emotion/react'
import { useSession } from 'next-auth/react'

import AddIcon from '@mui/icons-material/Add'
import UpdateIcon from '@mui/icons-material/Update'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import DescriptionIcon from '@mui/icons-material/Description'

import ParamsModal from '../create/ParamsModal'

import { scrapWeb } from '../../../../Service/scraperService'

const ScrapingParams = ({ webSites }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('Tipo')
  const [selectedWeb, setSelectedWeb] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')

  const theme = useTheme()

  const { data: session } = useSession()

  console.log('sesion: ', session)

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

  const handleOpenModal = (web = null) => {
    setSelectedWeb(web)
    setModalMode(web ? 'edit' : 'create')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedWeb(null)
    setIsModalOpen(false)
    setModalMode('create')
  }

  const handleScrapSite = async site => {
    const titleColor = theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000'
    const backgroundColor = theme.palette.background.paper
    const confirmButtonColor = theme.palette.primary.main
    const cancelButtonColor = theme.palette.error.main

    const result = await Swal.fire({
      html: `<span style="font-family: Arial, sans-serif; font-size: 28px; color: ${titleColor};">¿Quieres ejecutar el scraping para esta fuente?</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, ejecutar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: cancelButtonColor,
      background: backgroundColor
    })

    if (result.isConfirmed) {
      try {
        const response = await scrapWeb({ url: site.Url })

        Swal.fire({
          icon: 'success',
          html: `<span style="font-family: Arial, sans-serif; font-size: 26px; color: ${titleColor};">Scraping completado con éxito</span>`,
          confirmButtonColor: confirmButtonColor,
          background: backgroundColor,
          timer: 4000
        })

        console.log('Respuesta de la API:', response.data)
      } catch (error) {
        console.error('Error ejecutando el scraping:', error)
        Swal.fire({
          icon: 'error',
          html: `<span style="font-family: Arial, sans-serif; font-size: 26px; color: ${titleColor};">Hubo un error ejecutando el scraping</span>`,
          confirmButtonColor: confirmButtonColor,
          background: backgroundColor
        })
      }
    }
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 3 }}>
      <Box sx={{ padding: 5 }}>
        <Grid container spacing={2} alignItems='center' sx={{ marginBottom: 2 }}>
          {/* Filtro por fuente web */}
          <Grid item xs={12} md>
            <TextField
              label='Buscar por Fuente Web'
              type='text'
              size='small'
              autoComplete='off'
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
            <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
              Agregar Fuente Web
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
            Parámetros de Scrapeo
          </Typography>
        </Grid>

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
                    active={orderBy === 'source_web'}
                    direction={orderBy === 'source_web' ? order : 'asc'}
                    onClick={() => handleRequestSort('source_web')}
                  >
                    Tipo
                  </TableSortLabel>
                </TableCell>
                <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>
                  Enlace Web
                </TableCell>
                <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>
                  Frecuencia de Scrapeo
                </TableCell>
                <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>
                  Última Fecha de Scrapeo
                </TableCell>
                <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>
                  Etiquetas
                </TableCell>
                <TableCell align='center' sx={{ color: theme.palette.primary.contrastText }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedWebSites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(site => (
                <TableRow
                  key={site.Objeto}
                  sx={{
                    '&:hover': { backgroundColor: theme.palette.action.hover }
                  }}
                >
                  <TableCell align='center'>{site.Tipo}</TableCell>
                  <TableCell align='center'>{site.Url}</TableCell>
                  <TableCell align='center'>
                    <Select sx={{ width: '80%' }}>
                      <MenuItem value='Mensual'>Mensual</MenuItem>
                      <MenuItem value='Trimestral'>Trimestral</MenuItem>
                      <MenuItem value='Semestral'>Semestral</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align='center'>{site.Fecha_scrapper}</TableCell>
                  <TableCell align='center'>{site.Etiquetas.join(', ')}</TableCell>
                  <TableCell align='center'>
                    <Tooltip title='Editar'>
                      <IconButton color='info' onClick={() => handleOpenModal(site)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Scrapear'>
                      <IconButton color='success' onClick={() => handleScrapSite(site)}>
                        <UpdateIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Registro de Actividad'>
                      <IconButton>
                        <DescriptionIcon />
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
        count={webSites.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage='Sitios por página'
      />

      <ParamsModal
        open={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onClose={handleCloseModal}
        web={selectedWeb}
        mode={modalMode}
      />
    </Paper>
  )
}

export default ScrapingParams
