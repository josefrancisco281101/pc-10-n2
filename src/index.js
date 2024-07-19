import express from "express"
import { PORT } from "../config.js";
import routes from './router/index.js'

const app = express()

app.use(express.json())

routes(app)

app.listen(PORT, () => { console.log(`Host: http://localhost:${PORT}`)})