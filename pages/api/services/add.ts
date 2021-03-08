import { NowRequest, NowResponse } from '@now/node'
import Service from '../../../models/service.model'

export default async (req: NowRequest, res: NowResponse) => {
  try {
    var data = req.body;
    const entryDate = data["entryDate"];
    delete data["entryDate"];

    await Service.updateOne({_id: entryDate}, {$set: data}, {upsert : true});

    res.status(200).send('success');
  } catch (error) {
    res.status(502).send(error);
  }
  
}