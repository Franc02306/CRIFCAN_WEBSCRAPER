import API from './axios.config'

// SERVICIO POST SCRAPER
export const scrapWeb = data => {
  return API.post('/api/v1/scrape-url/', data)
}

// http://127.0.0.1:8000/api/v1/scrape-url/