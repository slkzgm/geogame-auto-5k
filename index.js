const puppeteer = require('puppeteer')

async function run() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    try {
        page.on('response', async (response) => {
            if (response.request().method() === 'POST') {
                if (response.url() === 'https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') {
                    const responseText = await response.text();
                    const res = JSON.parse(responseText);

                    if (res && res[1] && res[1][0] && res[1][0][3] && res[1][0][3][2]) {
                        const locText = res[1][0][3][2];

                        if (locText[0] && locText[0][0]) {
                            if (locText[0] && locText[0][0] && locText[1] && locText[1][0])
                                console.log(`${locText[0][0]} - ${locText[1][0]}`);
                            else
                                console.log(locText[0][0]);
                        } else {
                            console.log('Impossible to retrieve loc text');
                            console.log(JSON.stringify(res));
                        }
                    }
                    if (res && res[1] && res[1][0] && res[1][0][5] && res[1][0][5][0] && res[1][0][5][0][1][0]) {
                        const locCoords = res[1][0][5][0][1][0];
                        const lat = locCoords[2];
                        const lng = locCoords[3];

                        console.log(lat, lng);
                        const gameToken = page.url().split('/')[4];

                        await page.evaluate(async (gameToken, lat, lng) => {
                            console.log(gameToken);
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
                            const data = await response.json();
                            return data;
                        }, gameToken, lat, lng);
                    }
                }
            }
        });
    } catch (e) {
        console.error(e);
    }

    await page.goto('https://www.geoguessr.com/');
}

run();