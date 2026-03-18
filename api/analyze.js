import axios from 'axios';

// Helper: Calculate RSI (Relative Strength Index)
function calculateRSI(prices) {
  if (prices.length < 14) return 50; // Not enough data for accurate RSI
  
  let gains = 0;
  let losses = 0;

  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  const avgGain = gains / (prices.length - 1);
  const avgLoss = losses / (prices.length - 1);
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round(100 - (100 / (1 + rs)));
}

// Helper: Calculate Volatility (Standard Deviation of % returns)
function calculateVolatility(prices) {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  // Annualized volatility (approx for 1m klines across 20m)
  return (stdDev * 100).toFixed(2); 
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { pair, entry, timestamp } = req.body;
  const BINANCE_KEY = process.env.BINANCE_API_KEY;

  try {
    const tradeTs = new Date(timestamp).getTime();
    if (isNaN(tradeTs)) {
      return res.status(400).json({ error: `Invalid Timestamp format: "${timestamp}". Use YYYY-MM-DD HH:MM` });
    }

    const start = tradeTs - 600000;
    const end = tradeTs + 600000;

    // 1. Fetch Binance Data (using the more resilient vision endpoint)
    const binanceUrl = `https://data-api.binance.vision/api/v3/klines?symbol=${pair}&interval=1m&startTime=${start}&endTime=${end}&limit=20`;
    
    let binanceResponse;
    try {
      binanceResponse = await axios.get(binanceUrl, {
        headers: BINANCE_KEY ? { 'X-MBX-APIKEY': BINANCE_KEY } : {},
        timeout: 5000
      });
    } catch (binanceErr) {
      const msg = binanceErr.response?.data?.msg || binanceErr.message;
      return res.status(502).json({ error: `Binance API Error: ${msg}. Check your Trading Pair and Keys.` });
    }
    
    const klines = binanceResponse.data;
    const closes = klines.map(k => parseFloat(k[4]));
    const lastPrice = closes[closes.length - 1];

    // 2. REAL MATH: RSI & Volatility
    const rsi = calculateRSI(closes);
    const volatility = calculateVolatility(closes);

    // 3. AI Brain: Senior Risk Manager (Witty & Professional)
    let verdict, explanation, improvement;
    
    if (rsi > 70) {
      verdict = 'Greedy Peak Picker';
      explanation = `The RSI was screaming ${rsi} (Overbought). You entered ${pair} right as the whales were preparing to dump.`;
      improvement = "Wait for an RSI reset below 40 before FOMOing into top-tier liquidity sweeps.";
    } else if (rsi < 30) {
      verdict = 'Smart Accumulation';
      explanation = `Incredible timing. RSI was bottomed out at ${rsi}. You effectively "bought the fear" when everyone else was selling.`;
      improvement = "Maintain your target. This is a high-probability reversal zone.";
    } else {
      verdict = 'Safe & Calculated';
      explanation = `Balanced entry. RSI is neutral at ${rsi} and volatility is stable at ${volatility}%. You aren't chasing ghosts.`;
      improvement = "Watch the 15m volume profile to ensure the trend has legs.";
    }

    // Special case for massive profit
    if (lastPrice > entry * 1.05) {
      verdict = 'Swimming with Whales';
      explanation = `You are currently up over 5% in just minutes. This entry at ${entry} was mathematically flawless.`;
    }

    return res.status(200).json({
      verdict,
      explanation,
      improvement,
      metrics: { rsi, volatility, lastPrice }
    });

  } catch (error) {
    console.error('ClawSight Backend Error:', error.message);
    return res.status(500).json({ error: 'The Claw failed to reach Binance. Check your API Keys.' });
  }
}
