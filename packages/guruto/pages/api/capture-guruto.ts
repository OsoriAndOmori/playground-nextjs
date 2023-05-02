import type {NextApiRequest, NextApiResponse} from 'next'
import puppeteer from 'puppeteer';
import fs from 'fs'
import path from 'path'

const guruto = async function handler(req: NextApiRequest, res: NextApiResponse) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-dev-shm-usage'],
        headless: true,
    })

    const page = await browser.newPage();

    await page.goto('https://www.betman.co.kr/main/mainPage/gamebuy/buyableGameList.do');
    await page.setViewport({width: 1300, height: 2000, isMobile: true})
    await page.waitForSelector('strong');
    await page.evaluate(() => {
        console.log("승부식 있으면 클릭후 이동");
        document.querySelectorAll("a").forEach(value => {
            if (value.getAttribute("href")!!.indexOf("gmId=G101") > 0) value.click();
        });
    });


    // dataTables_empty 있으면 정상적으로 구매가능게임이 없는 것. 종료
    if(document.querySelectorAll(".dataTables_empty").length !== 0){
        console.log("구매 가능 게임 없음.")
        res.send({message: '구매 가능 게임이 없음'});
        return;
    }


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

            if (validLeague && validStatus) return;
            value.closest("tr")!!.remove();
        });
    }, ".db.fs11")

    console.log("evaluate finish")
    const element = await page.$('#div_gmBuySlip');        // declare a variable with an ElementHandle
    await element?.screenshot({path: `public/images/guruto_screenshot.png`}); // take screenshot element in puppeteer
    await browser.close();
    // close browser

    const filePath = path.resolve('.', 'public/images/guruto_screenshot.png')
    const imageBuffer = fs.readFileSync(filePath)

    res.setHeader('Content-Type', 'image/png')
    res.send(imageBuffer)
};

export default guruto