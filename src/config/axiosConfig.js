import axios from 'axios'

if (localStorage.getItem('user'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.user).token}`

// axios.defaults.baseURL = "http://";