// config.js
const config = {
    apiUrl: process.env.NODE_ENV === 'production'
      ? 'https://api.example.com'
      : 'http://localhost:3000'
  }
  
  export default config;