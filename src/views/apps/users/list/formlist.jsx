'use client'

import { useState, useEffect, useMemo } from 'react'

import { TextField, Button, Toolbar, Box, Grid, Select, MenuItem, FormControl, InputLabel, InputAdornment, Autocomplete } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

import SearchIcon from '@mui/icons-material/Search' // Importa el icono de búsqueda

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker';
import AddUserDrawer from './AddUserDrawer'

dayjs.locale('es')

const FormList = ({ onSearch, onDateFilter, onCreate, users, handleUserAdded }) => {
  // NUEVOS FILTROS
  const [emailFilter, setEmailFilter] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [institutionFilter, setInstitutionFilter] = useState(null)
  const [institutions, setInstitutions] = useState([])
  const [countryFilter, setCountryFilter] = useState('')
  const [countries, setCountries] = useState([])

  console.log('Data de users:', users)

  // const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    onSearch(emailFilter, institutionFilter, countryFilter) // Filtrar por correo, institución y país
  }, [emailFilter, institutionFilter, countryFilter]);

  return (
    <Toolbar>
      <Box display='flex' alignItems='center' gap={2} sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {/* Filtro por correo electrónico */}
          <Grid item xs={12} md={4}>
            <TextField
              label='Buscar por Email'
              type='text'
              size='small'
              value={emailFilter}
              onChange={e => setEmailFilter(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Filtro por institución */}
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={institutions} // Opciones obtenidas desde la API
              getOptionLabel={(option) => option.name || ''} // Muestra el nombre de la institución
              value={institutionFilter}
              onChange={(event, newValue) => setInstitutionFilter(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Buscar por Institución'
                  size='small'
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: ( // Lupa al inicio del campo
                      <InputAdornment position='start' style={{ paddingLeft: '8.5px', marginRight: '-1px' }}>
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: null,
                  }}
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id} // Compara opciones por ID
              fullWidth
            />
          </Grid>

          {/* Filtro por país */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size='small'>
              <InputLabel>Buscar por País</InputLabel>
              <Select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                label='Buscar por País'
              >
                <MenuItem value=''>
                  <em>Todos los Países</em>
                </MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.description}>
                    {country.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ ml: 2 }}>
        <Button
          variant='contained'
          startIcon={<i className='tabler-plus' />}
          onClick={() => setAddUserOpen(true)}
          color='primary'
        >
          Agregar Usuario
        </Button>
      </Box>
      <AddUserDrawer
        open={addUserOpen}
        setOpen={setAddUserOpen}
        handleUserAdded={handleUserAdded}
      />
    </Toolbar>
  )
}

export default FormList
