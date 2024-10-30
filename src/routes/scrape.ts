import Router from 'express'
import cron from 'node-cron'
import { BuoyController } from '../controllers/buoys'
import { SurfForecastController } from '../controllers/surf-forecast'
import { scheduledUpdate as scheduledUpdateBuoys } from '../utils/buoys'
import { scheduledUpdate as scheduledUpdateSurfForecast } from '../utils/surfForecast'

export const scrapeRouter = Router()

scrapeRouter.get('/buoys', BuoyController.addNewBuoysToDB)
scrapeRouter.get('/surf-forecast', SurfForecastController.fetchSurfForecast)

cron.schedule('05,35 */2 * * *', async () => {
	try {
		await scheduledUpdateBuoys()
	} catch (err) {
		console.error(err)
	}
	try {
		await scheduledUpdateSurfForecast()
	} catch (err) {
		console.error(err)
	}
})
