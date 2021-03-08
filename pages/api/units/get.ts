import { NowRequest, NowResponse } from '@now/node'
import Unit from '../../../models/unit.model'

export default async (req: NowRequest, res: NowResponse) => {
    try {
        var rows = req.body;
        const units = await Unit.find({"_id": {"$in": rows}})
        res.status(200).send(JSON.stringify(units).replace("_id", "frameNo"));
    } catch (error) {
        res.status(502).send(error);
    }
}