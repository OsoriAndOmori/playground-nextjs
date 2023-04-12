import axios from 'axios';
import {NextApiRequest, NextApiResponse} from "next";

const X_NCP_APIGW_API_KEY_ID = process.env.X_NCP_APIGW_API_KEY_ID;
const X_NCP_APIGW_API_KEY = process.env.X_NCP_APIGW_API_KEY

export default (req: NextApiRequest, res: NextApiResponse) => {
    const config = {
        headers: {
            'X-NCP-APIGW-API-KEY-ID': X_NCP_APIGW_API_KEY_ID,
            'X-NCP-APIGW-API-KEY': X_NCP_APIGW_API_KEY
        },
        params: {
            'start': req.query['start'],
            'goal': req.query['goal']
        }
    };

    return axios.get('https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving', config)
        .then(response => {
            console.log(response.data);
            res.status(200).json(response.data);
            return response.data;
        })
        .catch(error => {
            console.error(error);
        });
}

