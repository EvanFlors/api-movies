const express = require('express')
const crypto = require('node:crypto')

const movies = require('../movies.json')
const { validateMovie, validatePartialMovie } = require('../schemas/movies')

const app = express()

app.get('/', (req, res) => {
    const htmlResponse = `
        <html>
            <head>
                <title>Movies API Rest</title>
            </head>
            <body>
                <h1>Backend working</h1>
            </body>
        </html>
    `
    res.send(htmlResponse)
})

app.get('/movies', (req, res) => {

    const { genre } = req.query
    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }

    res.json(movies)
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found' })

})

app.delete('/movies/:id', (req, res) => {

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted' })
})

app.post('/movies', (req, res) => {   
    const result = validateMovie(req.body)

    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }

    movies.push(newMovie)

    return res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
    
    const result = validatePartialMovie(req.body)

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data 
    }

    return res.json(updateMovie)
})

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => console.log(`Listening at port ${PORT}`))