import { NowRequest, NowResponse } from '@now/node'

import Unit from '../../../models/unit.model'


export default async (req: NowRequest, res: NowResponse) => {
    try {
      
      var units = req.body.units;
      // await Unit.updateMany({_id: {'$in': ids}}, {$set: });
      await Promise.all(units.map(async (unit) => {
        if (unit["saleType"] === "Counter") {
          if (Unit["transactionType"] === "Finance") {
            await Unit.updateOne({_id: unit['frameNo']}, {$set: {
              saleDate: unit['saleDate'],
              saleType: unit['saleType'],
              transactionType: unit['transactionType'],
              financeName: unit['financeName'],
            }}, {upsert : true, setDefaultsOnInsert: true})
          }
          else {
            await Unit.updateOne({_id: unit['frameNo']}, {$set: {
              saleDate: unit['saleDate'],
              saleType: unit['saleType'],
              transactionType: unit['transactionType'],
              financeName: unit['financeName'],
            }}, {upsert : true, setDefaultsOnInsert: true})
          }
        }
        else {
          await Unit.updateOne({_id: unit['frameNo']}, {$set: {
            saleDate: unit['saleDate'],
            saleType: unit['saleType'],
            checkpoint: unit['checkpoint'],
          }}, {upsert : true, setDefaultsOnInsert: true});
        }
      }));
      res.status(200).send('success');
    } catch (error) {
      res.status(502).send('fail');
    }
}