import dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT || '3333'

export { port }
