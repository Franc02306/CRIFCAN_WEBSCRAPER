'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { Alert, IconButton, InputAdornment, Snackbar } from '@mui/material'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import { Visibility, VisibilityOff } from '@mui/icons-material'

import Swal from 'sweetalert2'

import { useTheme } from '@emotion/react'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'

const initialData = {
  name: '',
  urlWeb: '',
  frequency: ''
}

const ParamsModal = ({ open, setIsModalOpen, onClose, web, mode }) => {
  const [formData, setFormData] = useState(initialData)
  const [warnMessage, setWarnMessage] = useState('')
  const [openWarnSnackbar, setOpenWarnSnackbar] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')
  const [openInfoSnackbar, setOpenInfoSnackbar] = useState(false)
  const [error, setError] = useState(null)
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditMode = mode === 'edit'

  // TEMAS
  const theme = useTheme()
  const titleColor = theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000'
  const backgroundColor = theme.palette.background.paper
  const confirmButtonColor = theme.palette.primary.main

  const resetForm = () => {
    setFormData(initialData)
  }

  const validateAndShowWarnings = () => {
    if (!formData.name) {
      setWarnMessage('El campo Nombre es obligatorio.')
      setOpenWarnSnackbar(true)

      return false
    }

    if (!formData.urlWeb) {
      setWarnMessage('El campo Url es obligatorio.')
      setOpenWarnSnackbar(true)

      return false
    }

    if (!formData.frequency) {
      setWarnMessage('El campo frecuencia es obligatorio')
    }

    return true
  }

  const handleCloseInfoSnackbar = () => {
    setOpenInfoSnackbar(false)
  }

  const handleCloseWarningSnackbar = () => {
    setOpenWarnSnackbar(false)
  }

  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar(false)
  }

  const handleSubmit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    if (!validateAndShowWarnings()) {
      setIsSubmitting(false)

      return
    }

    const payload = {
      ...formData
    }

    try {
      if (isEditMode) {
        Swal.fire({
          icon: 'success',
          html: `<span style="font-family: Arial, sans-serif; font-size: 26px; color: ${titleColor};">Fuente Web actualizado correctamente</span>`,
          confirmButtonColor: confirmButtonColor,
          confirmButtonText: 'Aceptar',
          background: backgroundColor,
          timer: 4000
        })
      } else {
        Swal.fire({
          icon: 'success',
          html: `<span style="font-family: Arial, sans-serif; font-size: 26px; color: ${titleColor};">Fuente Web creado correctamente</span>`,
          confirmButtonColor: confirmButtonColor,
          confirmButtonText: 'Aceptar',
          background: backgroundColor,
          timer: 4000
        })
      }
    } catch (error) {
      console.error('Error en la solicitud: ', error)
    }
  }

  useEffect(() => {
    if (open && isEditMode && web) {
      setFormData(web) // Carga los datos del usuario solo si el modal está abierto y es edición
    } else if (open && !isEditMode) {
      resetForm() // Limpia el formulario en modo creación
    }
  }, [open, web, isEditMode])

  const handleCloseModal = () => {
    resetForm()
    setIsModalOpen(false)
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleCloseModal()
          }
        }}
        fullWidth
        maxWidth='sm'
        PaperProps={{ style: { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={handleCloseModal} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>

        {/* TITULO SEGUN DEL MODAL EL MODO */}
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center'>
          {isEditMode ? 'Editar Fuente Web' : 'Agregar Fuente Web'}
        </DialogTitle>

        <DialogContent dividers>
          <Box component={Grid} container spacing={3}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                autoComplete='off'
                margin='dense'
                variant='outlined'
                label='Nombre'
                type='text'
                name='name'
                value={formData.name}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete='off'
                margin='dense'
                variant='outlined'
                label='Enlace'
                type='text'
                name='urlWeb'
                value={formData.urlWeb}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '5px', marginBottom: '5px' }}>
              <FormControl fullWidth>
                <InputLabel>Frecuencia</InputLabel>
                <Select
                  value={formData.frequency}
                  onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                  label='Frecuencia'
                >
                  <MenuItem value={1}>Mensual</MenuItem>
                  <MenuItem value={2}>Trimestral</MenuItem>
                  <MenuItem value={3}>Semestral</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ marginTop: 5 }}>
          <Button onClick={handleCloseModal} color='error' variant='outlined'>
            Cancelar
          </Button>
          <Button disabled={isSubmitting} color='primary' variant='contained'>
            {isSubmitting ? (isEditMode ? 'Actualizando...' : 'Creando...') : isEditMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ParamsModal
