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

  const { pair, entry, exit, timestamp, exitTimestamp } = req.body;
  const BINANCE_KEY = process.env.BINANCE_API_KEY;

  try {
    const tradeTs = new Date(timestamp).getTime();
    const exitTs = exitTimestamp ? new Date(exitTimestamp).getTime() : Date.now();
    
    if (isNaN(tradeTs)) return res.status(400).json({ error: "Invalid Entry Timestamp." });

    // Fetch Entry Context
    const start = tradeTs - 600000;
    const end = tradeTs + 600000;
    const binanceUrl = `https://data-api.binance.vision/api/v3/klines?symbol=${pair}&interval=1m&startTime=${start}&endTime=${end}&limit=20`;
    
    const entryResponse = await axios.get(binanceUrl, {
      headers: BINANCE_KEY ? { 'X-MBX-APIKEY': BINANCE_KEY } : {},
      timeout: 8000
    });
    
    const klines = entryResponse.data;
    if (!klines || klines.length === 0) return res.status(200).json({ error: "Market Ghost Town at Entry: No kline data found." });

    const closes = klines.map(k => parseFloat(k[4]));
    const highs = klines.map(k => parseFloat(k[2]));
    const lows = klines.map(k => parseFloat(k[3]));
    
    // Fetch Exit Context if it's a different moment
    let exitMaxHigh = Math.max(...highs);
    if (Math.abs(exitTs - tradeTs) > 600000) {
      const exitStart = exitTs - 600000;
      const exitEnd = exitTs + 600000;
      const exitUrl = `https://data-api.binance.vision/api/v3/klines?symbol=${pair}&interval=1m&startTime=${exitStart}&endTime=${exitEnd}&limit=20`;
      
      try {
        const exitResponse = await axios.get(exitUrl, { headers: BINANCE_KEY ? { 'X-MBX-APIKEY': BINANCE_KEY } : {}, timeout: 5000 });
        const exitKlines = exitResponse.data;
        if (exitKlines && exitKlines.length > 0) {
          exitMaxHigh = Math.max(...exitKlines.map(k => parseFloat(k[2])));
        }
      } catch (e) {
        console.log("Exit Fetch Skip: Using entry context for exit roast.");
      }
    }

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
    const entryVal = parseFloat(entry);
    
    // Truth Filter: Verify if prices actually existed in those windows
    const entryDeviation = Math.abs((entryVal - (maxHigh + minLow) / 2) / ((maxHigh + minLow) / 2)) * 100;
    const exitDeviation = Math.abs((exitVal - exitMaxHigh) / exitMaxHigh) * 100;
    
    const isImpossibleEntry = entryVal > maxHigh * 1.02 || entryVal < minLow * 0.98;
    const isImpossibleExit = exitVal > exitMaxHigh * 1.02;

    if (isImpossibleEntry) {
      verdict = 'Impossible Entry';
      explanation = `Your entry price ($${entryVal}) never existed in the 20m window around your timestamp ($${minLow} - $${maxHigh}). You are auditing a Ghost Trade.`;
      improvement = "Ensure your entry price matches the actual exchange tape for that minute.";
    } else if (pnl > 0) {
      if (isTopExit) {
        verdict = 'Absolute Sniper';
        explanation = `Mathematically flawless. You caught the bottom near $${minLow} and extracted ${pnl}% profit, selling at the absolute exit peak of $${exitVal}.`;
        improvement = "None. Consider scaling this logic across more pairs.";
      } else {
        verdict = 'Safe Profit';
        explanation = `You made ${pnl}% profit. Good discipline. However, you left money on the table; the market peak during your exit window was $${exitMaxHigh}.`;
        improvement = "Use trailing stops to ride the trend longer.";
      }
    } else {
      verdict = 'Liquidity Donor';
      explanation = `Exited at ${pnl}% loss. RSI at entry was ${rsi}. You likely panic-sold or provided the exit liquidity for a whale.`;
      improvement = "Wait for RSI stabilization below 40 before entering into a downtrend.";
    }

    // Special Roast for buying the very top (if it was a real price)
    if (!isImpossibleEntry && entryVal >= maxHigh * 0.999) {
      verdict = 'FOMO Casualty';
      explanation = `You bought the absolute local ceiling of $${maxHigh}. The whales were waiting for exactly this type of retail liquidity.`;
      improvement = "Never buy the first green candle after a parabolic move.";
    }

    return res.status(200).json({
      verdict,
      explanation,
      improvement,
      metrics: { rsi, volatility, lastPrice, pnl, maxHigh, minLow, exitMaxHigh }
    });

  } catch (error) {
    console.error("Audit Error:", error);
    return res.status(200).json({ error: "The Claw tripped. Ensure your Pair (e.g. BTCUSDT) and Entry prices are valid numbers." });
  }
}
