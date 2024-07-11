const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required'
    }),
    year: z.number({
        invalid_type_error: 'Year must be a number',
        required_error: 'Movie year is required'
    }).int().min(1900).max(2025),
    director: z.string({
        invalid_type_error: 'Director must be a string',
        required_error: 'Movie director is required'
    }),
    duration: z.number({
        invalid_type_error: 'Duration must be a number',
        required_error: 'Movie duration is required'
    }).int().positive(),
    rate: z.number({
        invalid_type_error: 'Rate must be a number',
    }).min(0).max(10).default(5),
    poster: z.string().url({
        message: 'Poster must be a valid URL',
        required_error: 'Movie poster is required'
    }),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
        {
            required_error: 'Movie genre is required',
            invalid_type_error: 'Movie genre must be an array of enum Genre'
        }
    )
})

function validateMovie (input) {
    return movieSchema.safeParse(input)
}

function validatePartialMovie (input) {
    return movieSchema.partial().safeParse(input)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}