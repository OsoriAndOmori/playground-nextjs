import {NextApiRequest, NextApiResponse} from "next";

const client_id = process.env.KAKAO_APP_CLIEND_ID || "";
const redirectUrl = process.env.KAKAO_APP_REDIRECT_URL  || "";


const code = (req: NextApiRequest, res: NextApiResponse) => {
    const params = {
        'client_id': client_id,
        'redirect_uri': redirectUrl,
        'response_type': "code"
    };
    const url = "https://kauth.kakao.com/oauth/authorize"

    return res.redirect(url + "?" +new URLSearchParams(params).toString())
};
export default code

