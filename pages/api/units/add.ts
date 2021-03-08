
import { NowRequest, NowResponse } from '@now/node'
import Unit from '../../../models/unit.model'

export default async (req: NowRequest, res: NowResponse) => {
  try {
    var rows = req.body;
    await Promise.all(rows.map(async (row) => {
      await Unit.updateOne({_id: row[2]}, {$set: { engineNo: row[3],
        model: row[1],
        color: row[4],
        entryDate: row[5]}}, {upsert : true, setDefaultsOnInsert: true});
    }));

    res.status(200).send('success');
  } catch (error) {
    res.status(502).send(error);
  }
  
}
