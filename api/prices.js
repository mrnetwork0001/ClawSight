import axios from 'axios';

export default async function handler(req, res) {
  try {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT'];
    
    // Fetch prices and 24h ticker info from Binance
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`);
    
    const data = response.data.map(item => ({
      pair: item.symbol,
      price: parseFloat(item.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      change: parseFloat(item.priceChangePercent).toFixed(2),
      up: parseFloat(item.priceChangePercent) >= 0
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error('Price Fetch Error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch live prices' });
  }
}
