import { app } from '@main/config/app'
import { port } from '@main/config/env'

app.listen(port, () => console.log(`Server is running at port ${port}`))
