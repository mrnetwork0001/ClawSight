import axios from 'axios';

/**
 * ClawSight Market Service (Premium OpenClaw Skill)
 * Fetches klines 10m before and 10m after the provided [timestamp].
 */
export const fetchMarketContext = async (pair, timestamp, entryPrice) => {
  try {
    const tradeTs = new Date(timestamp).getTime();
    if (isNaN(tradeTs)) throw new Error('Invalid Timestamp Format');

    // 1. Define the 20-minute window (10m before, 10m after)
    const startTime = tradeTs - (10 * 60 * 1000);
    const endTime = tradeTs + (10 * 60 * 1000);

    // 2. Fetch Klines (1m interval) via Binance API (public endpoint for this demo/MVP)
    const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1m&startTime=${startTime}&endTime=${endTime}&limit=20`;
    const response = await axios.get(url);
    const klines = response.data;

    // 3. Process into OHLCV format
    const processedKlines = klines.map(k => ({
      time: k[0],
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5])
    }));

    // 4. Calculate Key Metrics
    const rsi = calculateRSI(processedKlines.map(k => k.close));
    const volatility = calculateVolatility(processedKlines.map(k => k.close));
    const currentPrice = processedKlines.length > 0 ? processedKlines[processedKlines.length - 1].close : entryPrice;

    return {
      ohlcv: processedKlines,
      metrics: {
        rsi,
        volatility: parseFloat(volatility.toFixed(2)),
        lastPrice: currentPrice,
        range: { start: new Date(startTime).toLocaleTimeString(), end: new Date(endTime).toLocaleTimeString() }
      }
    };
  } catch (error) {
    console.error('OpenClaw Fetch Error:', error);
    // Return mock data for demo if API fails or pair is invalid
    return getMockMarketData(pair, entryPrice);
  }
};

// --- Calculations ---

const calculateRSI = (closes) => {
  if (closes.length < 2) return 50;
  // Simplified RSI for demonstration purposes
  const up = closes.filter((c, i) => i > 0 && c > closes[i-1]).length;
  const down = closes.length - (up + 1);
  const rsi = (up / (up + down || 1)) * 100;
  return Math.round(rsi);
};

const calculateVolatility = (closes) => {
  if (closes.length < 2) return 0.5;
  const priceRange = Math.max(...closes) - Math.min(...closes);
  const avgPrice = closes.reduce((a, b) => a + b, 0) / closes.length;
  return (priceRange / avgPrice) * 100;
};

const getMockMarketData = (pair, entryPrice) => {
  return {
    ohlcv: [],
    metrics: {
      rsi: Math.floor(Math.random() * 50) + 25, 
      volatility: (Math.random() * 8).toFixed(2),
      lastPrice: entryPrice * (1 + (Math.random() * 0.01 - 0.005)),
      range: { start: "10:00:00", end: "10:20:00" }
    }
  };
};
