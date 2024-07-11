const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.status(200).send('Hello from the server')
})

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => console.log(`Listening at port ${PORT}`))