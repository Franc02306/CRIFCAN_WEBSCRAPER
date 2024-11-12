'use client'

import { useEffect, useState } from 'react'

import { CircularProgress, Box, Typography } from '@mui/material'

import ParamsListIndex from '../../../../../../views/apps/scraping/params-list/index'

import { listScrapingUrl } from '../../../../../../Service/scraperService'

const ParamsListApp = () => {
	const [webSites, setWebSites] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)

  const fetchWebSites = async () => {
    try {
      setIsLoading(true)

      const response = await listScrapingUrl()

      const filteredWebsites = Object.values(
        response.data.documents.reduce((acc, doc) => {
          if (!acc[doc.Url] || new Date(doc.Fecha_scrapper) > new Date(acc[doc.Url].Fecha_scrapper)) {
            acc[doc.Url] = doc
          }
          
          return acc
        }, {})
      )

      setWebSites(filteredWebsites)
    } catch (error) {
      console.error('Error al obtener los sitios de scraping: ', error)
      setError('Algo salió mal, intenta de nuevo más tarde')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWebSites()
  }, [])

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
