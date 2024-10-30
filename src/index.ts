import express from 'express'
const { PORT, MONGO_URL } = process.env
const app = express()
import mongoose from 'mongoose'
import morgan from 'morgan'
import { buoysRouter } from './routes/buoys'
import { scrapeRouter } from './routes/scrape'
import { SurfForecastRouter } from './routes/surf-forecast'

app.use(express.json())
app.use(morgan('dev'))

app.use('/buoys', buoysRouter)
app.use('/scrape', scrapeRouter)
app.use('/surf-forecast', SurfForecastRouter)

mongoose
	.connect(MONGO_URL as string)
	.then(() => {
		console.log('Connected to database')
		app.listen(PORT, () => {
			console.log(`App listening on port ${PORT}`)
		})
	})
	.catch((err) => console.error(err))
