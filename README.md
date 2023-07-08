# GeoGame Automation
![geoguessr](https://github.com/slkzgm/geogame-auto-5k/assets/105301169/f37afcbf-cd27-4e79-a50b-eeb01eeb1e9c)

## Description
This is a Node.js application that uses Puppeteer to automate location identification and data fetching during GeoGame sessions. The application streamlines the gameplay and enhances understanding of Google Maps API interactions.

**⚠️ Disclaimer: Use this script at your own risk. Using automation scripts can violate the terms of service of the website, potentially resulting in penalties. Please respect the rules of the site. This script is shared for educational purposes only. It is recommended to look into the potential improvements section if you wish to use this script in a more discrete manner.**

## Setup and Usage
1. Clone this repository and install the dependencies by running `npm install` in the project directory.
2. Run the script by using the command `node index.js`. This will open a new browser instance.
3. Once the GeoGame page is open, log in with your account.
4. Start a new game.
5. Once the game has started, refresh the page. The script will automatically validate the round for you.
6. After validation, you can proceed to the next round. Repeat step 5 for each new round.

The current script will validate each round immediately after the page refresh. Make sure you refresh the page only when you're ready to validate the round.

## Potential Improvements
The following features could be implemented for further enhancement:
- **Random delay**: Introduce a random delay (with user-defined maximum value) before validation to make the usage less conspicuous and more human-like.
- **Automatic refresh**: Automate the page refresh after each validation. This would allow the user to leave the script running without any further interaction once the game has started.
- **Randomized location**: Introduce a slight random variation to the latitude and longitude values that are submitted, to avoid pinpoint accuracy every time and mimic more natural gameplay.

## Contributing
Feel free to fork the project, open issues or pull requests to suggest improvements or add new features.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
