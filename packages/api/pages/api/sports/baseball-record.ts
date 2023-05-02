import axios from 'axios';
import * as XLSX from "xlsx";
import {NextApiRequest, NextApiResponse} from "next";
import path from "path";
import * as fs from "fs";


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const date = req.query.date as string
    const response = await axios.get('https://m.sports.naver.com/schedule/ajax/list?category=kbaseball&date=' + defaultIfEmptyYYYYMMdd(date));
    const scheduleIds = response.data.scheduleMap
        .find(schedulebox => schedulebox.categoryId === 'kbo').scheduleList
        .map(schedule => schedule.gameId);

    console.log('scheduleIds', scheduleIds);

    const fetch = await Promise.all(scheduleIds.map(gameId => axios.get(`https://api-gw.sports.naver.com/schedule/games/${gameId}/record`)))
    const results = fetch.map(res => res.data.result.recordData).filter(result => !(result === null || result.pitchersBoxscore === undefined || result.battersBoxscore === undefined));
    console.log('results', results);

    const wb = XLSX.utils.book_new();
    for (let i = 0; i < results.length; i++) {
        const ws = XLSX.utils.json_to_sheet([...results[i].pitchersBoxscore.away, ...results[i].pitchersBoxscore.home]);
        const ws2 = XLSX.utils.json_to_sheet([...results[i].battersBoxscore.away, ...results[i].battersBoxscore.home]);
        XLSX.utils.book_append_sheet(wb, ws, getName(results[i].gameInfo) + " 투");
        XLSX.utils.book_append_sheet(wb, ws2, getName(results[i].gameInfo) + " 타");
    }
    XLSX.writeFile(wb, `./public/kbo-${date}.xlsx`);


    // await fs.writeFileSync("./public/manifest.xlsx", excel, "binary");
    const filePath = path.join(process.cwd(), `./public/kbo-${date}.xlsx`);
    const manifestBuffer = fs.createReadStream(filePath);

    await new Promise(function (resolve) {
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=kbo-${date}.xlsx`
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        // res.setHeader("Content-Length", `${manifestBuffer.size}`);
        manifestBuffer.pipe(res);
        manifestBuffer.on("end", resolve);
    });
}

const defaultIfEmptyYYYYMMdd = (defaultYYYYMMDD: string) => {
    if (defaultYYYYMMDD !== undefined) {
        return defaultYYYYMMDD
    }
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (1 + date.getMonth())).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return year + month + day;
}

const getName = (gameInfo: any): string => {
    return gameInfo.aName + 'vs' + gameInfo.hName;
}