import axios from 'axios';

export default async function handler(req, res) {
  try {
    // Fetch exchange info to get all active symbols
    const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
    
    // Filter for USDT pairs specifically for this demo to keep it clean
    const symbols = response.data.symbols
      .filter(s => s.status === 'TRADING' && s.quoteAsset === 'USDT')
      .map(s => s.symbol);

    // Cache the response for 24 hours (Vercel edge caching)
    res.setHeader('Cache-Control', 's-maxage=86400');
    return res.status(200).json(symbols);
  } catch (error) {
    console.error('Symbols Fetch Error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch symbols' });
  }
}
