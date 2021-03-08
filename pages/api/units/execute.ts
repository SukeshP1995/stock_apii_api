import { NowRequest, NowResponse } from '@now/node'
import Unit from '../../../models/unit.model'

export default async (req: NowRequest, res: NowResponse) => {
    try {
        await Unit.find({transactionType: "Finance", financeName: {$ne: null}}, {financeName: 1})
            .exec((err, docs) => {
                console.log(docs)
                if (err || docs == undefined || docs.length == 0)
                    console.log('none');
                else {
                    docs.forEach((doc) => {
                        Unit.findOneAndUpdate({_id: doc._id}, 
                                                    {$set: {financeName: doc.financeName.toUpperCase()}})
                        .exec();
                    });
            }
            });   
        res.status(200).send("success");
    } catch (error) {
        res.status(502).send(error);
    }
}