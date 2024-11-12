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
          const currentDocDate = new Date(doc.Fecha_scrapper)
          const existingDoc = acc[doc.Url]

          // Verifica si el documento actual es más reciente o si no hay otro con la misma URL
          if (!existingDoc || currentDocDate > new Date(existingDoc.Fecha_scrapper)) {
            acc[doc.Url] = doc
          }

          return acc
        }, {})
      )

      console.log(filteredWebsites);

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
