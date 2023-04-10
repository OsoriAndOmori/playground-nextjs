import path from "path";
import fs from "fs";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Buffer>
) {
    const filePath = path.resolve('.', 'screenshot.png')
    const imageBuffer = fs.readFileSync(filePath)

    res.setHeader('Content-Type', 'image/png')
    res.send(imageBuffer);
}