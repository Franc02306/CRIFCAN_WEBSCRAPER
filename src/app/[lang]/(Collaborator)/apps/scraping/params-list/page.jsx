'use client'

import { useEffect, useState } from 'react'

import { CircularProgress, Box, Typography } from '@mui/material'

import ParamsListIndex from '../../../../../../views/apps/scraping/params-list/index'

const defaultWebSites = [
	{ id: 1, source_web: 'FAO', frecuency_scrap: 'Mensual', last_date: '01/01/2024' },
	{ id: 2, source_web: 'EPPO', frecuency_scrap: 'Trimestral', last_date: '01/01/2024' },
	{ id: 3, source_web: 'CABI', frecuency_scrap: 'Semestral', last_date: '01/01/2024' }
]

const ParamsListApp = () => {
	const [webSites] = useState(defaultWebSites)
	const [isLoading] = useState(false)
	const [error] = useState(null)

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

	return <ParamsListIndex webSites={webSites} />
}

export default ParamsListApp
