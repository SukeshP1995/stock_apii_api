import { NowRequest, NowResponse } from '@now/node'
import StockUser from '../../../../models/stockuser.model'

export default async (req: NowRequest, res: NowResponse) => {
  try {

    await StockUser.deleteOne({_id: req.query.number});

    res.status(200).send("success");
  } catch (error) {
    res.status(502).send(error);
  }
  
}