import { NowRequest, NowResponse } from '@now/node'
import StockUser from '../../../../models/stockuser.model'

export default async (req: NowRequest, res: NowResponse) => {
  try {
    console.log(req.body);
    var number = req.body.number;
    if (number != null) {
      const user = (await StockUser.find({"_id": number}))[0];
      console.log(user);
      if ((user.code == req.body.code)){
          res.status(200).send(user);
          return;
      }
    }
    res.status(200).send(false);
  } catch (error) {
    console.log(error)
    res.status(502).send(error);
  }
  
}