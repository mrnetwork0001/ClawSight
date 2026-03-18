import axios from 'axios';

export default async function handler(req, res) {
  try {
    const symbols = [
      'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 
      'ADAUSDT', 'XRPUSDT', 'DOTUSDT', 'DOGEUSDT',
      'AVAXUSDT', 'MATICUSDT', 'LINKUSDT', 'UNIUSDT'
    ];
    
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`);
    
    const data = response.data.map(item => ({
      symbol: item.symbol.replace('USDT', ''),
      price: parseFloat(item.lastPrice),
      change: parseFloat(item.priceChangePercent),
      up: parseFloat(item.priceChangePercent) >= 0,
      vol: (parseFloat(item.quoteVolume) / 1000000).toFixed(1) + 'M'
    }));

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch live pulse' });
  }
}
