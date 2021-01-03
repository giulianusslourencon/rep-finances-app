export const api_url =
  process.env.NODE_ENV === 'production'
    ? 'https://repsy-api.herokuapp.com'
    : 'http://localhost:3333'
