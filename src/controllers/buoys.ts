import { Request, Response } from 'express'
import { BuoyModel } from '../models/buoy'

import { scheduledUpdate } from '../utils/buoys'

export class BuoyController {
	static async getBuoys(req: Request, res: Response) {
		try {
			const params = req.query
			const buoys = await BuoyModel.getBuoys(params)
			res.json(buoys)
		} catch (err) {
			res.status(500).json({ error: err })
		}
	}

	static async addNewBuoysToDB(req: Request, res: Response) {
		try {
			await scheduledUpdate()
			res.status(200).send('Buoy data updated successfully!')
		} catch (err) {
			res.status(500).json({ error: err })
		}
	}

	static async deleteBuoys(req: Request, res: Response) {
		try {
			const { month, day } = req.query
			const convertedMonth = Number(month)
			const convertedDay = Number(day)

			await BuoyModel.deleteBuoys({ month: convertedMonth, day: convertedDay })
			res.status(200).send('Buoy data deleted successfully!')
		} catch (err) {
			res.status(500).json({ error: err })
		}
	}
}
