import axios, {AxiosRequestConfig} from 'axios';
import {NextApiRequest, NextApiResponse} from "next";

const client_id = process.env.KAKAO_APP_CLIEND_ID  || "";
const redirectUrl = process.env.KAKAO_APP_REDIRECT_URL  || "";

const login = (req: NextApiRequest, res: NextApiResponse) => {
    console.log("code", req.query['code']);

    const config = {
        header: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        params: {
            'grant_type': "authorization_code",
            'client_id': client_id,
            'redirect_uri': redirectUrl,
            'code': req.query['code']
        },
    };

    const url = "https://kauth.kakao.com/oauth/token";

    return axios.get(url, config)
        .then(response => {
            console.log("access_token_response", response.data);

            const headers  = {
                'Content-Type': "application/x-www-form-urlencoded",
                'Authorization': "Bearer " + response.data["access_token"]
            }

            const queryParams = {
                template_object: "{\n" +
                    "        \"object_type\": \"text\",\n" +
                    "        \"text\": \"텍스트 영역입니다. 최대 200자 표시 가능합니다.\",\n" +
                    "        \"link\": {\n" +
                    "            \"web_url\": \"https://developers.kakao.com\",\n" +
                    "            \"mobile_web_url\": \"https://developers.kakao.com\"\n" +
                    "        },\n" +
                    "        \"button_title\": \"바로 확인\"\n" +
                    "    }"
            }

            axios.post("https://kapi.kakao.com/v2/api/talk/memo/default/send", {}, { headers, params: queryParams })
                .then(response2 => res.status(200).json(response2.data))
                .catch(err => res.send(err))
        })
        .catch(error => {
            console.error(error);
        });
};

export default login

