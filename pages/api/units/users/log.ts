import { NowRequest, NowResponse } from '@now/node'
import StockUser from '../../../../models/stockuser.model'

export default async (req: NowRequest, res: NowResponse) => {
  try {
    console.log(req.body);
    var number = req.body.number;
    const user = (await StockUser.find({"_id": number}))[0];
    console.log(user);
    if ((user.code == req.body.code) && !user.signed){
        await StockUser.updateOne({_id: number}, {$set: { signed: true }}, {upsert : true, setDefaultsOnInsert: true});
        user.signed = true;
        res.status(200).send(JSON.stringify(user));
    }
    else res.status(200).send(JSON.stringify("failed"));
  } catch (error) {
    res.status(502).send(error);
  }
  
}