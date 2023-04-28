import axios from 'axios';
import {NextApiRequest, NextApiResponse} from "next";
import {WebClient} from '@slack/web-api'

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const SLACK_API_TOKEN = process.env.SLACK_API_TOKEN;
const X_NCP_APIGW_API_KEY_ID = process.env.X_NCP_APIGW_API_KEY_ID;
const X_NCP_APIGW_API_KEY = process.env.X_NCP_APIGW_API_KEY

const web = new WebClient(SLACK_API_TOKEN);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = 'D053U393B8D';

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
    const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving', config);
    const summary = response.data.route.traoptimal[0].summary;
    const duration = summary.duration;
    await send(`지금 당장 집으로 출발하면 일산 Sphere 에서 수명산 파크까지 ${Math.floor(duration / 1000 / 60)}분 걸립니다. 기름값은 ${summary.fuelPrice} 원 입니다.`);
    res.status(200).json(summary);
    return summary;
}

const send = async (message: any) => {
    // See: https://api.slack.com/methods/chat.postMessage
    await web.chat.postMessage({ username: '김나린김나율', channel: conversationId, text: message });
};

