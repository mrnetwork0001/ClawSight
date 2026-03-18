# 🦞 ClawSight (TradeSense AI)
### *Decode the Market Logic. Built for the Binance Builder Competition 2024.*

**ClawSight** is a high-fidelity, agentic trading dashboard that bridges the gap between raw market data and human intuition. Using the **OpenClaw SDK**, it "claws" history from Binance to explain exactly why your trade entry was a masterpiece—or a disaster.

![Binance Pro Glassmorphism](https://raw.githubusercontent.com/antigravity-ai/assets/main/clawsight-banner.png) *(Placeholder for your actual screenshot)*

## 🚀 The Mission
Most traders enter a trade and hope for the best. ClawSight uses **Agentic AI** to analyze the 20-minute window surrounding your entry (10m before, 10m after). It calculates real-time volatility, RSI, and price action to provide a "Senior Risk Manager" verdict on your logic.

## ✨ Features
- **⚡ Trade Explainer**: Paste any trade pair, price, and timestamp. Get a professional, witty AI analysis of the market context.
- **📊 Market Momentum Grid**: A live-pulsing heatmap of the top 12 cryptocurrencies, updated every 20 seconds via the Binance Global API.
- **🛡️ Risk Desk**: A global monitoring system for liquidity sweeps, sentiment shifts, and high-volatility alerts.
- **💎 Binance Pro Aesthetics**: A premium "Glassmorphism" UI built with Tailwind CSS v4, optimized for dark mode and high-performance trading environments.

## 🛠️ Tech Stack
- **Frontend**: React + Vite (Stable)
- **Styling**: Tailwind CSS v4 + Framer Motion (Animations)
- **Agentic Core**: OpenClaw SDK (Market Data Pipeline)
- **Backend**: Vercel Serverless Functions + Axios
- **Live Data**: Binance Global API (Data-Vision/Vision Endpoints)

## ⚙️ Installation & Setup

1. **Clone the Repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ClawSight.git
   cd ClawSight
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file or add these to Vercel:
   ```env
   BINANCE_API_KEY=your_read_only_key
   BINANCE_API_SECRET=your_secret
   OPENCLAW_GATEWAY_TOKEN=your_openclaw_token
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```

## 🌍 Deployment Note
For production on Vercel, ensure your **Function Region** is set to a non-restricted Binance location (e.g., **Frankfurt (fra1)** or **Hong Kong (hkg1)**) to avoid regional API blocks.

---
*Built with logic, humor, and high-frequency data by a true Binance Builder.* 🚀🦾
