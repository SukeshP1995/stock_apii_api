import { NowRequest, NowResponse } from '@now/node'
import StockUser from '../../../../models/stockuser.model'

export default async (req: NowRequest, res: NowResponse) => {
    try {
        const units = await StockUser.find({"_id": req.query.number})
        res.status(200).send(JSON.stringify(units).replace("_id", "number"));
    } catch (error) {
        res.status(502).send(error);
    }
}