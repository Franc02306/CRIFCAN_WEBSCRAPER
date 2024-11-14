'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { Alert, IconButton, InputAdornment, Snackbar, Typography } from '@mui/material'

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

import { useTheme } from '@emotion/react'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'

const ViewUrlModal = ({ url, open, onClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth='md'
      open={open}
      PaperProps={{ style: { overflow: 'visible' } }}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
    >
      <DialogCloseButton onClick={onClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle sx={{ fontSize: '23px' }}>Enlace Web Completo</DialogTitle>

      <DialogContent dividers>
        <Box
          component={Grid}
          container
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center', // Centrado vertical
						alignItems: 'center',
            height: '20vh' // ESTO AYUDA A POSICIONAR VERTICALMENTE CENTRALMENTE
          }}
        >
					<Typography sx={{ fontSize: '17px', wordBreak: 'break-all' }}>{url}</Typography>
				</Box>
      </DialogContent>

        {/* BOTÓN CANCELAR */}
        <DialogActions sx={{ marginTop: 5 }}>
          <Button onClick={onClose} color='error' variant='outlined'>
            Cancelar
          </Button>
        </DialogActions>
    </Dialog>
  )
}

export default ViewUrlModal
