import { NowRequest, NowResponse } from '@now/node'
import Unit from '../../../models/unit.model'

export default async (req: NowRequest, res: NowResponse) => {
    try {
        var saleDate = req.query.date;
        const units = await Unit.find({"saleDate": saleDate});
        console.log(JSON.stringify(units));
        res.status(200).send(JSON.stringify(units).replace(/_id/g, "frameNo"));
    } catch (error) {
        res.status(502).send(error);
    }
}