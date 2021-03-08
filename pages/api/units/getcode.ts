import { NowRequest, NowResponse } from '@now/node'
import { createHandyClient } from 'handy-redis';
import * as generate from 'meaningful-string';

const convert = (from, to) => str => Buffer.from(str, from).toString(to)
const utf8ToHex = convert('utf8', 'hex') 
const hexToUtf8 = convert('hex', 'utf8') 

let client = createHandyClient({
  port      : 18101,
  host      : 'redis-18101.c56.east-us.azure.cloud.redislabs.com',
  password  : 'Q1wiC9ePciwSgo1DyVcAA1r6AvzBxRU9',
});

const secret = "barry-allen";

export default async (req: NowRequest, res: NowResponse) => {
  try {
    // await client.set('inviteCode',  (parseInt((await client.get('pdiSno')), 10) + 1).toString())
    let code = (new Date()).setHours(0,0,0,0).toString();
    const encoded = utf8ToHex(code);
    console.log(encoded)
    const decoded = hexToUtf8(encoded);
    console.log(decoded)
    res.status(200).send([encoded, parseInt(decoded)]);
  } catch (error) {
    console.log(error);
    res.status(502).send(error);
  }
  
}