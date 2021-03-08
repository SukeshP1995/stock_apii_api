import { NowRequest, NowResponse } from '@now/node'
import Unit from '../../../models/unit.model'


export default async (req: NowRequest, res: NowResponse) => {
    try {
      var color = req.body.color;
      var _id = req.body.frameNo;
      await Unit.updateOne({_id: _id}, {$set: {color: color} });
      res.status(200).send('success');
    } catch (error) {
      res.status(502).send('fail');
    }
}