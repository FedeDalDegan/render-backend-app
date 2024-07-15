import { fileURLToPath } from "url"
import { dirname } from "path"

const __fileName = fileURLToPath(import.meta.url) // Devuelve la direccion en la que se encuentra el archivo (E:\CODE\CoderHouse\clases-backend\Clase 07 Express avanzado\src)

export const __dirname = dirname(__fileName)