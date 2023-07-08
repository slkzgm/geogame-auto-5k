const puppeteer = require('puppeteer-extra')

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const sendAnswer = async (page, gameToken, lat, lng) => {
    return page.evaluate(async (gameToken, lat, lng) => {
        const response = await fetch(`https://www.geoguessr.com/api/v3/games/${gameToken}`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en,fr;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-client": "web"
            },
            "referrer": `https://www.geoguessr.com/game/${gameToken}`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify({
                token: gameToken,
                lat: lat,
                lng: lng,
                timeout: false
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        return await response.json();
    }, gameToken, lat, lng);
}

async function run() {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        page.on('response', async (response) => {
            const url = 'https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata';
            if (response.request().method() !== 'POST' || response.url() !== url) {
                return;
            }

            const responseText = await response.text();
            const res = JSON.parse(responseText);
            const locText = res?.[1]?.[0]?.[3]?.[2];
            const locCoords = res?.[1]?.[0]?.[5]?.[0]?.[1]?.[0];
            const gameToken = page.url().split('/')[4];

            if (locText) {
                const locationName = locText[0]?.[0] || 'Unknown';
                const locationDetails = locText[1]?.[0] || '';
                console.log(`${locationName} - ${locationDetails}`);
            } else {
                console.log('Impossible to retrieve loc text');
                console.log(JSON.stringify(res));
            }

            if (locCoords) {
                const lat = locCoords[2];
                const lng = locCoords[3];
                console.log(lat, lng);

                await sendAnswer(page, gameToken, lat, lng);
            }
        });

        await page.goto('https://www.geoguessr.com/');
    } catch (e) {
        console.error(e);
    }
}

run();