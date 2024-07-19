import { Router } from 'express'

import { userRoutes } from './UsusarioRoutes.js'

const ApiRouter = Router()

export default function router(app) {
  app.use("/api/v1", ApiRouter)
  ApiRouter.use('/users', userRoutes)
}