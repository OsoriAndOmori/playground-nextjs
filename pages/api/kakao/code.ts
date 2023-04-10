import {NextApiRequest, NextApiResponse} from "next";

const client_id = process.env.KAKAO_APP_CLIEND_ID || "";

export default (req: NextApiRequest, res: NextApiResponse) => {
    const params = {
        'client_id': client_id,
        'redirect_uri': "http://localhost:3000/api/kakao/login",
        'response_type': "code"
    };
    const url = "https://kauth.kakao.com/oauth/authorize"

    return res.redirect(url + "?" +new URLSearchParams(params).toString())
}

