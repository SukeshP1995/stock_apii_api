import { NowRequest, NowResponse } from '@now/node'
import Service from '../../../models/service.model'

export default async (req: NowRequest, res: NowResponse) => {
  try {
    var date: any = new String(req.query.date);

    date =  new Date(date.toString())

    var opening = (await Service.aggregate([
        {
            $match: {
                _id: {
                    $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                    $lt: date
                }
            }
        },
        {
            $group: {
                _id: null,
                PUC : {"$sum": "$PUC"},
                accident : {"$sum": "$accident"},
                engine : {"$sum": "$engine"},
                free : {"$sum": "$free"},
                goodLife : {"$sum": "$goodLife"},
                joyRide : {"$sum": "$joyRide"},
                labour : {"$sum": "$labour"},
                minor : {"$sum": "$minor"},
                nitrogen : {"$sum": "$nitrogen"},
                paid : {"$sum": "$paid"},
                postWarranty : {"$sum": "$postWarranty"},
                spares : {"$sum": "$spares"},
                engineOilLtr : {"$sum": "$engineOilLtr"},
                engineOilVehicles : {"$sum": "$engineOilVehicles"},
                pending : {"$sum": "$pending"},
            }
        }
    ]));

    opening = opening.length != 0 ? opening[0] : {};
    
    delete opening["_id"];

    var today = (await Service.find({_id: date}));

    today = today.length != 0 ? today[0] : {};
    
    delete today["_id"];

    var closing = (await Service.aggregate([
        {
            $match: {
                _id: {
                    $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                    $lte: date
                }
            }
        },
        {
            $group: {
                _id: null,
                PUC : {"$sum": "$PUC"},
                accident : {"$sum": "$accident"},
                engine : {"$sum": "$engine"},
                free : {"$sum": "$free"},
                goodLife : {"$sum": "$goodLife"},
                joyRide : {"$sum": "$joyRide"},
                labour : {"$sum": "$labour"},
                minor : {"$sum": "$minor"},
                nitrogen : {"$sum": "$nitrogen"},
                paid : {"$sum": "$paid"},
                postWarranty : {"$sum": "$postWarranty"},
                spares : {"$sum": "$spares"},
                engineOilLtr : {"$sum": "$engineOilLtr"},
                engineOilVehicles : {"$sum": "$engineOilVehicles"},
                pending : {"$sum": "$pending"},
            }
        }
    ]));

    closing = closing.length != 0 ? closing[0] : {};
    
    delete closing["_id"];

    var currentMonthServices = (await Service.find({_id: {
        $gte: new Date(date.getFullYear(), date.getMonth(), 1),
        $lte: date
    }}));

    res.status(200).send(JSON.stringify({
        opening: opening,
        today: today,
        closing: closing,
        currentMonthServices: currentMonthServices
    }).replace(/_id/g, "date"));
  } catch (error) {
    res.status(502).send(error);
  }
  
}