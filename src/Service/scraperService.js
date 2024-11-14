import API from './axios.config'

// SERVICIO GET
export const listUrls = () => {
  return API.get('/api/v1/urls/')
};

export const getUrlByParam = () => {
  return API.get('')
};


// SERVICIO POST
export const scrapUrl = (url) => {
  return API.post('/api/v1/scrape-url/', url)
};

export const addUrl = (body) => {
  return API.post('/api/v1/urls/')
};


// SERVICIO PUT
export const updateUrl = (id, body) => {
  return API.put(`/api/v1/urls/${id}`, body)
};


// http://127.0.0.1:8000/api/v1/scrape-url/