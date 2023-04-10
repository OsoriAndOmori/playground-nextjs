// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import edgeChromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer';
import fs from 'fs'
import path from 'path'

const LOCAL_CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Buffer>
) {
    const executablePath = await edgeChromium.executablePath || LOCAL_CHROME_EXECUTABLE

    const browser = await puppeteer.launch({
        executablePath,
        args: edgeChromium.args,
        headless: true,
    })

    const page = await browser.newPage();

    console.log("구매 가능 게임 진입");
    await page.goto('https://www.betman.co.kr/main/mainPage/gamebuy/buyableGameList.do');
    await page.setViewport({width: 1300, height: 2000, isMobile: true})
    await page.waitForSelector('strong');
    await page.evaluate(() => {
        console.log("승부식 있으면 클릭후 이동");
        document.querySelectorAll("a").forEach(value => {
            if(value.getAttribute("href")!!.indexOf("gmId=G101") > 0) value.click();
        });
    });

    console.log("이동 중")

    // await page.goto('https://www.betman.co.kr/main/mainPage/gamebuy/gameSlip.do?gmId=G101&gmTs=230041');
    await page.waitForSelector('.db.fs11');          // wait for the selector to load
    console.log("구매 화면 로딩 중")
    await page.evaluate((sel) => {
        // const targetLeagues = ['A리그', 'EPL', 'J리그', 'K리그1', 'K리그2', 'MLS', '라리가', '분데스리', '세리에A', '에레디비', '여축INTL', '프리그1', 'KBO', 'MLB', 'NPB', 'KBL', 'NBA', 'KOVO남']
        const targetLeagues = ['EPL', 'K리그1', 'K리그2', '라리가', '분데스리', '세리에A', '에레디비', 'KBO', 'MLB', 'NPB', 'KBL', 'NBA', 'KOVO남', 'KOVO여']
        const escape = ["미정", "결과발표", "취소"]
        document.querySelectorAll(sel).forEach(value => {
            const validLeague = targetLeagues.includes(value.innerHTML);
            const validStatus = !escape.includes((value.closest("tr") as HTMLTableRowElement).querySelectorAll("td")[1].innerText)

            if(validLeague && validStatus) return;
            value.closest("tr")!!.remove();
        });
    }, ".db.fs11")

    console.log("evaluate finish")
    const element = await page.$('#div_gmBuySlip');        // declare a variable with an ElementHandle
    await element?.screenshot({path: `screenshot.png`}); // take screenshot element in puppeteer
    await browser.close();
    // close browser

    const filePath = path.resolve('.', 'screenshot.png')
    const imageBuffer = fs.readFileSync(filePath)

    res.setHeader('Content-Type', 'image/png')
    res.send(imageBuffer)
}