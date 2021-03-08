import { NowRequest, NowResponse } from '@now/node'
import StockUser from '../../../../models/stockuser.model'
import { randomBytes } from "crypto"
import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async (req: NowRequest, res: NowResponse) => {
  await runMiddleware(req, res, cors)

  try {
    console.log(req.body);
    var code = randomBytes(8).toString('hex');
    await StockUser.updateOne({_id: req.body.phoneNo}, 
      {$set: { 
        userName: req.body.userName,
        grantAgeWise: req.body.grantAgeWise,
        grantUpload: req.body.grantUpload,
        grantEdit: req.body.grantEdit,
        grantSale: req.body.grantSale,
        code: code,
        signed: false
      }}, {upsert : true, setDefaultsOnInsert: true});
    console.log(await StockUser.find({"_id": req.body.phoneNo}))
    res.status(200).send(JSON.stringify(code));
  } catch (error) {
    res.status(502).send(error);
  }
  
}