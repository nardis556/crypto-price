const axios = require('axios');
const moment = require('moment-timezone');

const API_URL = 'https://api.coingecko.com/api/v3';
const COUNT = 57;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchTop() {
    const { data } = await axios.get(`${API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: COUNT,
      },
    });
    const filteredData = data.filter((item) => !/^(usd|busd|tusd|husd|usdt|dai|pax|usdc|wbtc|weth)$/i.test(item.symbol));
    return filteredData;
  }
  
function printTop(data) {
    const table = data.map((item) => {
      const price = item.current_price.toFixed(8);
      const change = item.price_change_percentage_24h.toFixed(2);
      return {
        Symbol: item.symbol.replace(/['"]+/g, '').toUpperCase().padEnd(7, ' '),
        Price: price.padStart(16, ' '),
        Change: change.padStart(10, ' '),
      };
    });
    console.table(table);
  }

async function main() {
  const top = await fetchTop();
  printTop(top);
}

async function timeNow() {
  const now = moment().tz('America/Chicago').format('YYYY-MM-DD hh:mm:ss a');
  console.log(now);
}

async function mainLoop() {
  while (true) {
    await timeNow()
    await main();
    await sleep(60000);
  }
}

if (require.main === module) {
  mainLoop();
}
