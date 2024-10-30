import { SurfForecastModel } from '../models/surf-forecast'
import { WaveData } from '../types'
import { scheduledUpdate } from '../utils/surfForecast'
import { Request, Response } from 'express'

export class SurfForecastController {
	static async getSurfForecasts(req: Request, res: Response) {
		try {
			const params = req.query
			const forecasts = await SurfForecastModel.getSurfForecasts(params)
			res.json(forecasts)
		} catch (err) {
			console.error(err)
			res.status(500).json({ error: err })
		}
	}

	static async addNewForecasts(req: Request, res: Response) {
		try {
			await scheduledUpdate()
			res.status(200).send('Forecast data updated successfully!')
		} catch (err) {
			res.status(500).json({ error: err })
		}
	}

	static async fetchSurfForecast(req: Request, res: Response) {
		try {
			const retrieved = (await scheduledUpdate()) as unknown
			await SurfForecastModel.addMultipleForecast(retrieved as WaveData[])
			res.json({ message: 'Forecast data updated successfully!' })
		} catch (err) {
			res.status(500).json({ error: err })
		}
	}
}
