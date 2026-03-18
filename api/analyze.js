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
    
    if (isNaN(tradeTs)) return res.status(200).json({ error: "Claw Error: Invalid Entry Timestamp." });

    const start = tradeTs - 600000;
    const end = tradeTs + 600000;
    const binanceUrl = `https://data-api.binance.vision/api/v3/klines?symbol=${pair.toUpperCase()}&interval=1m&startTime=${start}&endTime=${end}&limit=20`;
    
    // Parallel Fetching to save time
    const fetchPromises = [
      axios.get(binanceUrl, { headers: BINANCE_KEY ? { 'X-MBX-APIKEY': BINANCE_KEY } : {}, timeout: 5000 })
    ];

    const needsSecondFetch = Math.abs(exitTs - tradeTs) > 600000;
    if (needsSecondFetch) {
      const exitStart = exitTs - 600000;
      const exitEnd = exitTs + 600000;
      const exitUrl = `https://data-api.binance.vision/api/v3/klines?symbol=${pair.toUpperCase()}&interval=1m&startTime=${exitStart}&endTime=${exitEnd}&limit=20`;
      fetchPromises.push(axios.get(exitUrl, { headers: BINANCE_KEY ? { 'X-MBX-APIKEY': BINANCE_KEY } : {}, timeout: 5000 }));
    }

    const responses = await Promise.all(fetchPromises.map(p => p.catch(e => ({ error: e }))));
    
    const entryRes = responses[0];
    if (entryRes.error) return res.status(200).json({ error: "Market Scout failed. Binance is busy or the pair is invalid." });
    
    const klines = entryRes.data;
    if (!klines || klines.length === 0) return res.status(200).json({ error: `Market Ghost Town: No data for ${pair} at this time.` });

    const closes = klines.map(k => parseFloat(k[4]));
    const highs = klines.map(k => parseFloat(k[2]));
    const lows = klines.map(k => parseFloat(k[3]));
    
    let exitMaxHigh = Math.max(...highs);
    if (needsSecondFetch && responses[1] && !responses[1].error) {
      const exitKlines = responses[1].data;
      if (exitKlines && exitKlines.length > 0) {
        exitMaxHigh = Math.max(...exitKlines.map(k => parseFloat(k[2])));
      }
    }

    const maxHigh = Math.max(...highs);
    const minLow = Math.min(...lows);
    const lastPrice = closes[closes.length - 1];
    
    const entryVal = parseFloat(entry);
    const exitVal = parseFloat(exit);
    const rsi = calculateRSI(closes);
    const volatility = calculateVolatility(closes);
    const pnl = (((exitVal - entryVal) / entryVal) * 100).toFixed(2);
    const isTopExit = exitVal >= exitMaxHigh * 0.998;
    
    let verdict, explanation, improvement;
    const isGhostTrade = entryVal > maxHigh * 1.5 || entryVal < minLow * 0.5;
    const isEstimated = entryVal > maxHigh * 1.05 || entryVal < minLow * 0.95;

    if (isGhostTrade) {
      verdict = 'Ghost Trade Detected';
      explanation = `The price $${entryVal} never existed in this window. Market was between $${minLow} and $${maxHigh}.`;
      improvement = "Enter a price closer to the historical tape.";
    } else if (parseFloat(pnl) > 0) {
      const estimateNote = isEstimated ? " [Estimated] " : "";
      if (isTopExit) {
        verdict = 'Absolute Sniper';
        explanation = `${estimateNote}Flawless. You caught the bottom near $${minLow} and sold the peak.`;
        improvement = "None. High-five your monitor.";
      } else {
        verdict = 'Safe Profit';
        explanation = `${estimateNote}Good discipline. You made ${pnl}%, but we saw a peak of $${exitMaxHigh}.`;
        improvement = "Try trailing stops to catch those extra gains.";
      }
    } else {
      const estimateNote = isEstimated ? " [Estimated] " : "";
      verdict = 'Liquidity Donor';
      explanation = `${estimateNote}Panic sell detected. Exit was $${exitVal} with RSI at ${rsi}.`;
      improvement = "Wait for overbought recovery before panic selling.";
    }

    return res.status(200).json({
      verdict, explanation, improvement,
      metrics: { rsi, volatility, lastPrice, pnl, maxHigh, minLow, exitMaxHigh }
    });

  } catch (error) {
    console.error("Audit Error:", error);
    return res.status(200).json({ error: "The Claw tripped. Ensure your Pair (e.g. BTCUSDT) and Entry prices are valid numbers." });
  }
}
