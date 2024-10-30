import { Schema, model } from 'mongoose'
import { DbBuoyRecord, formatedBuoys } from '../types'

const buoySchema = new Schema({
  station: { type: String, required: true },
  fecha: String,
  datos: {
    'Periodo de Pico': Number,
    'Altura Signif del Oleaje': Number,
    'Direcc Media de Proced': Number,
    'Direcc de pico de proced': Number,
    'Periodo Medio Tm02': Number
  }
})

const Buoy = model('Buoy', buoySchema)

export class BuoyModel {
  static async getBuoys({ limit = 6, buoy = '7113' }: { limit?: number; buoy?: string }) {
    try {
      const buoys: DbBuoyRecord[] = await Buoy.find({ station: buoy })
        .sort({ fecha: -1 })
        .limit(limit)
        .select('-_id -__v')
      return buoys
    } catch (err) {
      throw new Error("Couldn't get buoys from the database")
    }
  }

  static async deleteBuoys({ month, day }: { month: number; day: number }) {
    try {
      await Buoy.deleteMany({ month, day })
    } catch (err) {
      throw new Error("Couldn't delete buoys from the database")
    }
  }

  static async getLastBuoy() {
    try {
      const lastBuoyData = await Buoy.findOne().sort({ _id: -1 }).select('-_id -__v')
      return lastBuoyData
    } catch (err) {
      throw new Error("Couldn't get last buoy data from the database")
    }
  }

  static async addBuoy(buoys: DbBuoyRecord[]) {
    try {
      const data = await Buoy.insertMany(buoys)
      return data
    } catch (err) {
      throw new Error("Couldn't add multiple buoys to the database")
    }
  }

  static async addMultipleBuoysToDB(station: string, buoys: { fecha: string; datos: formatedBuoys['datos'] }[]) {
    try {
      const bulkOps = buoys.map(({ fecha, datos }) => ({
        updateOne: {
          filter: { station, fecha },
          update: { station, fecha, datos },
          upsert: true
        }
      }))
      await Buoy.bulkWrite(bulkOps)
    } catch (err) {
      throw new Error("Couldn't add multiple buoys to the database")
    }
  }
}
