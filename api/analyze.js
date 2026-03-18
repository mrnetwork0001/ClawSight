import axios from 'axios';

// Helper: Calculate RSI
function calculateRSI(prices) {
  if (prices.length < 14) return 50;
  let gains = 0, losses = 0;
  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  const avgGain = gains / (prices.length - 1);
  const avgLoss = losses / (prices.length - 1);
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round(100 - (100 / (1 + rs)));
}

// Helper: Calculate Volatility
function calculateVolatility(prices) {
  if (prices.length < 2) return "0.00";
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  return (Math.sqrt(variance) * 100).toFixed(2);
}

export default async function handler(req, res) {
  // Prevent Vercel Caching
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { pair, entry, exit, timestamp } = req.body;
  const BINANCE_KEY = process.env.BINANCE_API_KEY;

  try {
    const tradeTs = new Date(timestamp).getTime();
    if (isNaN(tradeTs)) return res.status(400).json({ error: "Invalid Timestamp format. Try: YYYY-MM-DD HH:MM" });

    // Ensure we are fetching 10 mins around the trade
    const start = tradeTs - 600000;
    const end = tradeTs + 600000;

    const binanceUrl = `https://data-api.binance.vision/api/v3/klines?symbol=${pair}&interval=1m&startTime=${start}&endTime=${end}&limit=20`;
    
    let binanceResponse;
    try {
      binanceResponse = await axios.get(binanceUrl, {
        headers: BINANCE_KEY ? { 'X-MBX-APIKEY': BINANCE_KEY } : {},
        timeout: 8000
      });
    } catch (binanceErr) {
      return res.status(200).json({ 
        error: "Binance connection timeout. The market is moving too fast for the free API tier. Try again in 5s." 
      });
    }
    
    const klines = binanceResponse.data;
    if (!klines || klines.length === 0) {
      return res.status(200).json({ 
        error: "Market Ghost Town: No kline data found for this pair at this specific time. Binance might not have history for this range." 
      });
    }

    const closes = klines.map(k => parseFloat(k[4]));
    const highs = klines.map(k => parseFloat(k[2]));
    const lows = klines.map(k => parseFloat(k[3]));
    
    const maxHigh = Math.max(...highs);
    const minLow = Math.min(...lows);
    const lastPrice = closes[closes.length - 1];
    
    // Performance Math
    const rsi = calculateRSI(closes);
    const volatility = calculateVolatility(closes);
    const pnl = (((parseFloat(exit) - parseFloat(entry)) / parseFloat(entry)) * 100).toFixed(2);
    
    // AI AUDIT LOGIC
    let verdict, explanation, improvement;
    const exitVal = parseFloat(exit);
    
    // Top/Bottom Roast Logic
    const isTopExit = exitVal >= maxHigh * 0.995;
    const isBottomEntry = parseFloat(entry) <= minLow * 1.005;

    if (pnl > 0) {
      if (isTopExit) {
        verdict = 'Absolute Sniper';
        explanation = `Mathematically flawless. You extracted ${pnl}% profit and sold at $${exit}, which was practically the local top ($${maxHigh}).`;
        improvement = "None. High-five your monitor.";
      } else {
        verdict = 'Safe Profit';
        explanation = `You made ${pnl}% profit. Good discipline. However, the market peaked at $${maxHigh} so there was more meat on the bone.`;
        improvement = "Try using trailing stops to catch the high-volatility spikes.";
      }
    } else {
      verdict = 'Liquidity Donor';
      explanation = `Exited at ${pnl}% loss. RSI was ${rsi}. You likely panic-sold right before a potential reversal or bought into a dump.`;
      improvement = "Wait for RSI to stabilize below 30 before considering a scalp entry.";
    }

    // Special Roast for buying the top
    if (parseFloat(entry) >= maxHigh * 0.99) {
      verdict = 'FOMO Casualty';
      explanation = `Buying power was exhausted. You bought the peak at $${maxHigh}. The whales thank you for your liquidity.`;
      improvement = "Never buy when price is at a 2h High without volume confirmation.";
    }

    return res.status(200).json({
      verdict,
      explanation,
      improvement,
      metrics: { rsi, volatility, lastPrice, pnl, maxHigh, minLow }
    });

  } catch (error) {
    console.error("Audit Error:", error);
    return res.status(200).json({ error: "The Claw tripped. Ensure your Pair (e.g. BTCUSDT) and Entry prices are valid numbers." });
  }
}
