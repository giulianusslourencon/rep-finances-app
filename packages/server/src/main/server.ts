import { app } from './config/app'
import { port } from './config/env'

app.listen(port, () => console.log(`Server is running at port ${port}`))
