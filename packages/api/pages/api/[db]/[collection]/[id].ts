// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import clientPromise from "../../../../lib/mongodb";

export default (req: NextApiRequest, res: NextApiResponse) => {
    return clientPromise
        .then((client) => client.db(req.query['db'] as string).collection(req.query['collection'] as string))
        .then(collection => collection.findOne({_id: req.query['id'] as string}))
        .then(value => {
            console.log(value);
            res.status(200).json(value)
        })
        .catch((err) => console.log(err));
}