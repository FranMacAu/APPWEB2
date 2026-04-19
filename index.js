import e from 'express'
import express from 'express'
import { readFile, writeFile } from 'fs/promises'

const app = express()
const port = 3000

// Middleware para que Express entienda JSON en el cuerpo de las peticiones (Body)
app.use(express.json())

app.listen(port, () => {
    console.log(`Servidor levantado en puerto ${port}`)
})

// Lectura del archivo JSON (Top-level await)
// Para usar 'import' y 'await' así,
//  package.json debe tener "type": "module"
const file = await readFile('./data.json', 'utf-8')
const userData = JSON.parse(file)

const objetos = [
    {name: 'Auto', color: 'Rojo'},
    {name: 'Arbol', color: 'Verde'},
    {name: 'Rio', color: 'Azul'},
    {name: 'Casa', color: 'Amarillo'}
]

// 1. Ruta inicial de prueba
app.get('/', (req, res) => {
    res.send('Hola mundo!')
})

// 2. Ruta con PARAMS (lo que va en la URL)
app.get('/colorDe/:objeto', (req, res) => {
    const obj = req.params.objeto
    const result = objetos.find(e => e.name === obj)

    if(result){
        res.status(200).json(result)
    } else {
        // En tu captura usaste status 400 (Bad Request)
        res.status(400).json(`${obj} no se encuentra`)
    }
})

app.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const user = userData.find(u => u.id === id)

    if(user){
        res.status(200).json(user)
    } else {
        res.status(404).json(`User with id ${id} not found`)
    }
})

// 3. Ruta con BODY (usando POST)
app.post('/ColorDePost', (req, res) => {
    console.log(req.headers)
    const obj = req.body.objeto
    const result = objetos.find(e => e.name === obj)

    if(result){
        res.status(200).json(result)
    } else {
        res.status(404).json(`${obj} no se encuentra`)
    }
})

app.post('/users/salary/update/:userID', (req, res) => {
    const userID = parseInt(req.params.userID)  /// paseInt porque viene como string
    const new_salary = req.body.salary

    try {
        const index = userData.findIndex(e => e.id == userID)
        if(index != -1){
            userData[index].salary = new_salary
            writeFile('./data.json', JSON.stringify(userData, null, 2)) // null, 2 para formatear el JSON con indentación y que quede legible
            res.status(200).json('Salario actualizado')
        } else {
            res.status(404).json(`No se encontró el usuario con id ${userID}`)
        }
    }catch (error) {
        res.sendStatus(500).json('Error al actualizar el salario')
    }
}
)


app.delete('/users/delete/:userID', (req, res) => {         /// si es info sensible que no queremos ver en la url, se puede hacer a través de POST 
    const userID = parseInt(req.params.userID)

    try {
        const index = userData.findIndex(e => e.id == userID)

        if(index !== -1){
            userData.splice(index, 1) // Elimina el usuario del array
            writeFile('./data.json', JSON.stringify(userData, null, 2)) // Actualiza el archivo JSON
            res.status(200).json('Usuario eliminado')
        } else {
            res.status(404).json(`No se encontró el usuario con id ${userID}`)
        }
    } catch (error) {
        res.status(500).json('Error al eliminar el usuario')
    }
})


app.put('')