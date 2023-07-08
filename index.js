const puppeteer = require('puppeteer-extra')

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const config = require('./config.json');

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// SOLO
const guessSolo = async (page, gameToken, lat, lng) => {
    try {
        if (config.solo.wait) {
            const delay = Math.floor(Math.random() * (config.solo.maxDelay - config.solo.minDelay + 1)) + config.solo.minDelay;
            await wait(delay);
        }
        page.evaluate(async (gameToken, lat, lng) => {
            try {
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
            } catch (e) {
                console.error(e);
            }
        }, gameToken, lat, lng);
        if (config.solo.auto) {
            await page.reload();
        }
    } catch (e) {
        console.error(e);
    }
}

// PARTY
async function guessLiveChallenge(page, gameToken, lat, lng) {
    try {
        await page.waitForSelector('#__next > div.in-game_root__3hGRu.in-game_backgroundDefault__UDbvo > div.in-game_content__oDaT9 > main > div.map-status_status__iAYih > div > div.map-status_inner___w5_0 > div:nth-child(2) > div.map-status_value__X_R_x');
        if (config.liveChallenge.wait) {
            const delay = Math.floor(Math.random() * (config.liveChallenge.maxDelay - config.liveChallenge.minDelay + 1)) + config.liveChallenge.minDelay;
            await wait(delay);
        }
        page.evaluate(async (gameToken, lat, lng) => {
            try {
                const roundText = document.querySelector('#__next > div.in-game_root__3hGRu.in-game_backgroundDefault__UDbvo > div.in-game_content__oDaT9 > main > div.map-status_status__iAYih > div > div.map-status_inner___w5_0 > div:nth-child(2) > div.map-status_value__X_R_x').innerText;
                const roundNumber = parseInt(roundText.split('/')[0]);
                const guess = await fetch(`https://game-server.geoguessr.com/api/live-challenge/${gameToken}/guess`, {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type": "application/json",
                        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        "x-client": "web"
                    },
                    "referrer": "https://www.geoguessr.com/",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": JSON.stringify({
                        roundNumber,
                        lat,
                        lng
                    }),
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                });

                return await guess.json();
            } catch (e) {
                console.error(e);
            }
        }, gameToken, lat, lng);
    } catch (e) {
        console.error(e);
    }
}

async function guessDuels(page, gameToken, lat, lng) {
    try {
        if (config.duels.auto) {
            await page.waitForSelector('#__next > div.in-game_root__3hGRu.in-game_backgroundDefault__UDbvo > div.in-game_content__oDaT9 > main > div > div > div.game-map_container___fYQ6 > div > div.guess-map__guess-button > button > div');
        }
        if (config.duels.auto && config.duels.wait) {
            const delay = Math.floor(Math.random() * (config.duels.maxDelay - config.duels.minDelay + 1)) + config.duels.minDelay;
            await wait(delay);
        }
        page.evaluate(async (gameToken, lat, lng) => {
            try {
                const response = await fetch(`https://game-server.geoguessr.com/api/duels/${gameToken}/pin`, {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type": "application/json",
                        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        "x-client": "web"
                    },
                    "referrer": "https://www.geoguessr.com/",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": "{\"lat\":0,\"lng\":0,\"roundNumber\":0}",
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                });
                const roundNumber = (await response.json()).currentRoundNumber;
                const guess = await fetch(`https://game-server.geoguessr.com/api/duels/${gameToken}/guess`, {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type": "application/json",
                        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        "x-client": "web"
                    },
                    "referrer": "https://www.geoguessr.com/",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": JSON.stringify({
                        roundNumber,
                        lat,
                        lng
                    }),
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                });

                return await guess.json();
            } catch (e) {
                console.error(e);
            }
        }, gameToken, lat, lng);
    } catch (e) {
        console.error(e);
    }
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
                console.log(`${lat}, ${lng}\n`);

                switch (page.url().split('/')[3]) {
                    case 'game':
                        await guessSolo(page, gameToken, lat, lng);
                        break;
                    case 'live-challenge':
                        await guessLiveChallenge(page, gameToken, lat, lng);
                        break;
                    case 'duels':
                    case 'team-duels':
                        await guessDuels(page, gameToken, lat, lng);
                        break;
                    default:
                        console.log('Cannot determine game mode');
                }
            }
        });

        await page.goto('https://www.geoguessr.com/');
    } catch (e) {
        console.error(e);
    }
}

run();