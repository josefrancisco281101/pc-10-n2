import { Router } from "express"
import { index, show, store, update, destroy,upload } from "../services/UsuarioServices.js";

export const userRoutes = Router()



userRoutes.get('/', index)

userRoutes.get('/:id',show)




userRoutes.post('/', upload.single('file'), store)

userRoutes.put('/:id', update)

userRoutes.delete('/:id', destroy)