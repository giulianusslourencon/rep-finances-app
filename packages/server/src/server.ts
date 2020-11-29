import express from 'express'
const port = process.env.PORT || 3333

const app = express()

app.get('/', (req, res) => {
  res.json({ message: 'Helo World' })
})

app.listen(port, () => {
  console.log(`Server listening at port ${port}`)
})
