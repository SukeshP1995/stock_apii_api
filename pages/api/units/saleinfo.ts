import { NowRequest, NowResponse } from '@now/node'
import Unit from '../../../models/unit.model'


export default async (req: NowRequest, res: NowResponse) => {
    try {
        var date: any = new String(req.query.date);

        date =  new Date(date.toString());

        var [opening, sold, closing, received, transactionTypes, checkpoints, financeNames, saleTypes, counterSold, networkSold] = await Promise.all([
            Unit.aggregate([
                {
                    $match: {
                        entryDate: {$lt: date}, 
                        $or: [
                            {saleDate: {$exists : false}},
                            {saleDate: {$gte : date}}
                        ]
                    }
                },
                {
                    $group: {
                        _id: {
                            model: '$model',
                            color: '$color'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group : {
                        _id: {
                            model: '$_id.model'
                        },
                        count: { $sum: '$count' },
                        colors: { 
                            $push : {
                                color: '$_id.color',
                                count: '$count'
                            }
                        }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        saleDate: date
                    }
                },
                {
                    $group: {
                        _id: {
                            model: '$model',
                            color: '$color'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group : {
                        _id: {
                            model: '$_id.model'
                        },
                        count: { $sum: '$count' },
                        colors: { 
                            $push : {
                                color: '$_id.color',
                                count: '$count'
                            }
                        }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        entryDate: {$lte: date}, 
                        $or: [
                            {saleDate: {$exists : false}},
                            {saleDate: {$gt: date}}
                        ]
                    }
                },
                {
                    $group: {
                        _id: {
                            model: '$model',
                            color: '$color'
                        },
                        count: { $sum: 1 },
        
                    }
                },
                {
                    $group : {
                        _id: {
                            model: '$_id.model'
                        },
                        count: { $sum: '$count' },
                        colors: { 
                            $push : {
                                color: '$_id.color',
                                count: '$count'
                            }
                        }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        entryDate: date, 
                    }
                },
                {
                    $group: {
                        _id: {
                            model: '$model',
                            color: '$color'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group : {
                        _id: {
                            model: '$_id.model'
                        },
                        count: { $sum: '$count' },
                        colors: { 
                            $push : {
                                color: '$_id.color',
                                count: '$count'
                            }
                        }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        saleDate: date, 
                        transactionType: {$nin: [null, ""],} 
                    }
                },
                {
                    $group : {
                        _id : {
                            transactionType: "$transactionType"
                        },
                        count: { $sum: 1 }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        saleDate: date, 
                        checkpoint: {$nin: [null, ""],} 
                    }
                },
                {
                    $group : {
                        _id : {
                            checkpoint: "$checkpoint"
                        },
                        count: { $sum: 1 }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        saleDate: date, 
                        financeName: {$nin: [null, ""],} 
                    }
                },
                {
                    $group : {
                        _id : {
                            financeName: "$financeName"
                        },
                        count: { $sum: 1 }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        saleDate: date, 
                    }
                },
                {
                    $group : {
                        _id : {
                            saleType: "$saleType"
                        },
                        count: { $sum: 1 }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        saleDate: date,
                        saleType: "Counter"
                    }
                },
                {
                    
                    $group: {
                        _id: {
                            model: '$model',
                            color: '$color'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group : {
                        _id: {
                            model: '$_id.model'
                        },
                        count: { $sum: '$count' },
                        colors: { 
                            $push : {
                                color: '$_id.color',
                                count: '$count'
                            }
                        }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        saleDate: date,
                        saleType: "Network"
                    }
                },
                {
                    $group: {
                        _id: {
                            checkpoint: "$checkpoint",
                            color: "$color",
                            model: "$model",
                        },
                        count : { $sum : 1 },
                    }
                }, 
                {
                    $group: {
                        _id: {
                            checkpoint: "$_id.checkpoint",
                            model: "$_id.model",
                        },
                        count : { $sum : "$count" },
                        colors: { 
                            $push : {
                                color: '$_id.color',
                                count: '$count'
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            checkpoint: "$_id.checkpoint",
                        },
                        count : { $sum : "$count" },
                        models: { 
                            $push : {
                                model: '$_id.model',
                                count: '$count',
                                colors: '$colors'
                            }
                        }
                    }
                },
            ])
        ]);

        opening = Object.assign({}, ...opening.map(ele => {
            var model = ele["_id"]["model"];
            ele["colors"] = Object.assign({}, ...ele["colors"].map(e => {
                var result = {};
                result[e["color"]] = e["count"];
                return result;
            }));
            var result = {};
            result[model] = {
                count: ele["count"],
                colors: ele["colors"]
            };
            return result;
        }));

        sold = Object.assign({}, ...sold.map(ele => {
            var model = ele["_id"]["model"];
            ele["colors"] = Object.assign({}, ...ele["colors"].map(e => {
                var result = {};
                result[e["color"]] = e["count"];
                return result;
            }));
            var result = {};
            result[model] = {
                count: ele["count"],
                colors: ele["colors"]
            };
            return result;
        }));

        closing = Object.assign({}, ...closing.map(ele => {
            var model = ele["_id"]["model"];
            ele["colors"] = Object.assign({}, ...ele["colors"].map(e => {
                var result = {};
                result[e["color"]] = e["count"];
                return result;
            }));
            var result = {};
            result[model] = {
                count: ele["count"],
                colors: ele["colors"]
            };
            return result;
        }));

        received = Object.assign({}, ...received.map(ele => {
            var model = ele["_id"]["model"];
            ele["colors"] = Object.assign({}, ...ele["colors"].map(e => {
                var result = {};
                result[e["color"]] = e["count"];
                return result;
            }));
            var result = {};
            result[model] = {
                count: ele["count"],
                colors: ele["colors"]
            };
            return result;
        }));

        var models = new Set([
            ...Object.keys(opening),
            ...Object.keys(sold),
            ...Object.keys(closing),
            ...Object.keys(received)
        ]);

        var data = {};

        data["saleInfo"] = {};

        data["saleInfo"]["daily"] = Array.from(models).map(model => {
            var res = {}
            res[model] = {
                "counts": [
                    opening[model],
                    sold[model],
                    closing[model],
                    received[model]
                ],
                "colors": Array.from(new Set([]
                    .concat(Object.keys(opening[model] ? opening[model]["colors"] : {} || {}))
                    .concat(Object.keys(sold[model] ? sold[model]["colors"] : {} || {}))
                    .concat(Object.keys(closing[model] ? closing[model]["colors"] : {} || {}))
                    .concat(Object.keys(received[model] ? received[model]["colors"] : {} || {}))))
            }
            return res;
        });

        data["saleInfo"]["daily"] = Object.assign({}, ...data["saleInfo"]["daily"]);

        data["total"] = {}
        data["total"]["daily"] = [
            await Unit.countDocuments({
                entryDate: {$lt: date}, 
                $or: [
                    {saleDate: {$exists : false}},
                    {saleDate: {$gte : date}}
                ]
            }),
            await Unit.countDocuments({
                saleDate: date
            }),
            await Unit.countDocuments({
                entryDate: {$lte: date}, 
                    $or: [
                        {saleDate: {$exists : false}},
                        {saleDate: {$gt: date}}
                    ]
            }),
            await Unit.countDocuments({
                entryDate: date, 
            })
        ];

    
        data ["total"]["monthly"] = [await Unit.countDocuments({
            saleDate: {
                $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                $lte: date
            }
        }),
        await Unit.countDocuments({
            entryDate: {
                $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                $lte: date
            }
        }),
    ];

        data["saleTypes"] = {};
        data["saleTypes"]["daily"] = Object.assign({}, ...saleTypes.map(ele => {
            const saleType = ele["_id"]["saleType"];
            var result = {};
            result[saleType] = ele["count"];
            return result;
        }));

        data["transactionTypes"] = {};
        data["transactionTypes"]["daily"] = Object.assign({}, ...transactionTypes.map(ele => {
            const saleType = ele["_id"]["transactionType"];
            var result = {};
            result[saleType] = ele["count"];
            return result;
        }));

        data["checkpoints"] = {};
        data["checkpoints"]["daily"] = Object.assign({}, ...checkpoints.map(ele => {
            const saleType = ele["_id"]["checkpoint"];
            var result = {};
            result[saleType] = ele["count"];
            return result;
        }));

        data["financeNames"] = {}
        data["financeNames"]["daily"] = Object.assign({}, ...financeNames.map(ele => {
            const saleType = ele["_id"]["financeName"];
            var result = {};
            result[saleType] = ele["count"];
            return result;
        }));

        networkSold.push({
            _id: { checkpoint: 'counter' },
            models: counterSold.map(data => ({
                model: data["_id"]["model"],
                count: data["count"],
                colors: data["colors"]
            })),
            count: await Unit.countDocuments({
                saleType: "Counter",
                saleDate: date,
            })
        });

        data["networkSold"] = {}
        data["networkSold"]["daily"] = Object.assign({}, ...networkSold.map(checkpointData => {
            checkpointData["models"] = Object.assign({}, ...checkpointData["models"].map(modelData => {
                var result = {};
                modelData["colors"] = Object.assign({}, ...modelData["colors"].map(colorData => {
                    var result = {};
                    result[colorData["color"]] = colorData["count"];
                    return result;
                }))
                result[modelData["model"]] = {
                    "count": modelData["count"],
                    "colors": modelData["colors"],
                };
                return result;
            }));
            var result = {};
            result[checkpointData["_id"]["checkpoint"]] = {
                count: checkpointData["count"],
                models: checkpointData["models"]
            };
            
            return result;
        }));

        [sold, received, transactionTypes, checkpoints, financeNames, saleTypes, counterSold, networkSold] = await Promise.all([
            Unit.aggregate([
                {
                    $match: {
                        saleDate: {
                            $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                            $lte: date
                        }
                    },
                },
                {
                    $group: {
                        _id: {
                            model: '$model',
                            color: '$color'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group : {
                        _id: {
                            model: '$_id.model'
                        },
                        count: { $sum: '$count' },
                        colors: { 
                            $push : {
                                color: '$_id.color',
                                count: '$count'
                            }
                        }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        entryDate: {
                            $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                            $lte: date
                        }, 
                    }
                },
                {
                    
                    $group: {
                        _id: {
                            model: '$model',
                            color: '$color'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group : {
                        _id: {
                            model: '$_id.model'
                        },
                        count: { $sum: '$count' },
                        colors: { 
                            $push : {
                                color: '$_id.color',
                                count: '$count'
                            }
                        }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        saleDate: {
                            $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                            $lte: date
                        }, 
                        transactionType: {$nin: [null, ""],} 
                    }
                },
                {
                    $group : {
                        _id : {
                            transactionType: "$transactionType"
                        },
                        count: { $sum: 1 }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        saleDate: {
                            $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                            $lte: date
                        }, 
                        checkpoint: {$nin: [null, ""],}
                    }
                },
                {
                    $group : {
                        _id : {
                            checkpoint: "$checkpoint"
                        },
                        count: { $sum: 1 }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        saleDate: {
                            $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                            $lte: date
                        }, 
                        financeName: {$nin: [null, ""],}
                    }
                },
                {
                    $group : {
                        _id : {
                            financeName: "$financeName"
                        },
                        count: { $sum: 1 }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        saleDate: {
                            $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                            $lte: date
                        }, 
                    }
                },
                {
                    $group : {
                        _id : {
                            saleType: "$saleType"
                        },
                        count: { $sum: 1 }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        saleDate: {
                            $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                            $lte: date
                        },
                        saleType: "Counter"
                    }
                },
                {
                    
                    $group: {
                        _id: {
                            model: '$model',
                            color: '$color'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group : {
                        _id: {
                            model: '$_id.model'
                        },
                        count: { $sum: '$count' },
                        colors: { 
                            $push : {
                                color: '$_id.color',
                                count: '$count'
                            }
                        }
                    }
                }
            ]),
            Unit.aggregate([
                {
                    $match: {
                        saleDate: {
                            $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                            $lte: date
                        },
                        saleType: "Network"
                    }
                },
                {
                    $group: {
                        _id: {
                            checkpoint: "$checkpoint",
                            color: "$color",
                            model: "$model",
                        },
                        count : { $sum : 1 },
                    }
                }, 
                {
                    $group: {
                        _id: {
                            checkpoint: "$_id.checkpoint",
                            model: "$_id.model",
                        },
                        count : { $sum : "$count" },
                        colors: { 
                            $push : {
                                color: '$_id.color',
                                count: '$count'
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            checkpoint: "$_id.checkpoint",
                        },
                        count : { $sum : "$count" },
                        models: { 
                            $push : {
                                model: '$_id.model',
                                count: '$count',
                                colors: '$colors'
                            }
                        }
                    }
                },
            ])
        ]);
        
        sold = Object.assign({}, ...sold.map(ele => {
            var model = ele["_id"]["model"];
            ele["colors"] = Object.assign({}, ...ele["colors"].map(e => {
                var result = {};
                result[e["color"]] = e["count"];
                return result;
            }));
            var result = {};
            result[model] = {
                count: ele["count"],
                colors: ele["colors"]
            };
            return result;
        }));
        
        received = Object.assign({}, ...received.map(ele => {
            var model = ele["_id"]["model"];
            ele["colors"] = Object.assign({}, ...ele["colors"].map(e => {
                var result = {};
                result[e["color"]] = e["count"];
                return result;
            }));
            var result = {};
            result[model] = {
                count: ele["count"],
                colors: ele["colors"]
            };
            return result;
        }));
            
        models = new Set([
            ...Object.keys(sold),
            ...Object.keys(received)
        ]);

        data["saleInfo"]["monthly"] = Array.from(models).map(model => {
            var result = {}
            result[model] = {
                "counts": [
                    sold[model],
                    received[model]
                ],
                "colors": Array.from(new Set([]
                    .concat(Object.keys(sold[model] ? sold[model]["colors"] : {} || {}))
                    .concat(Object.keys(received[model] ? received[model]["colors"] : {} || {}))))
            }
            return result;
        });

        data["saleInfo"]["monthly"] = Object.assign({}, ...data["saleInfo"]["monthly"]);

        data["saleTypes"]["monthly"] = Object.assign({}, ...saleTypes.map(ele => {
            const saleType = ele["_id"]["saleType"];
            var result = {};
            result[saleType] = ele["count"];
            return result;
        }));

        data["transactionTypes"]["monthly"] = Object.assign({}, ...transactionTypes.map(ele => {
            const saleType = ele["_id"]["transactionType"];
            var result = {};
            result[saleType] = ele["count"];
            return result;
        }));

        data["checkpoints"]["monthly"] = Object.assign({}, ...checkpoints.map(ele => {
            const saleType = ele["_id"]["checkpoint"];
            var result = {};
            result[saleType] = ele["count"];
            return result;
        }));

        data["financeNames"]["monthly"] = Object.assign({}, ...financeNames.map(ele => {
            const saleType = ele["_id"]["financeName"];
            var result = {};
            result[saleType] = ele["count"];
            return result;
        }));

        networkSold.push({
            _id: { checkpoint: 'counter' },
            models: counterSold.map(data => ({
                model: data["_id"]["model"],
                count: data["count"],
                colors: data["colors"]
            })),
            count: await Unit.countDocuments({
                saleType: "Counter",
                saleDate: {
                            $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                            $lte: date
                        },
            })
        });

        data["networkSold"]["monthly"] = await Object.assign({}, ...networkSold.map(checkpointData => {
            checkpointData["models"] = Object.assign({}, ...checkpointData["models"].map(modelData => {
                var result = {};
                modelData["colors"] = Object.assign({}, ...modelData["colors"].map(colorData => {
                    var result = {};
                    result[colorData["color"]] = colorData["count"];
                    return result;
                }))
                result[modelData["model"]] = {
                    "count": modelData["count"],
                    "colors": modelData["colors"],
                };
                return result;
            }));
            var result = {};
            result[checkpointData["_id"]["checkpoint"]] = {
                count: checkpointData["count"],
                models: checkpointData["models"]
            };
            return result;
        }));

        res.status(200).send(JSON.stringify(data));
    } catch (error) {
        res.status(502).send(error);
    }
  
}