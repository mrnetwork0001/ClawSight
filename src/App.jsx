import React, { useState } from 'react'
import { Search, Zap, TrendingUp, BarChart2, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Menu, Bell, User, Clock, Terminal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 h-14 bg-binance-black/80 backdrop-blur-xl border-b border-white/5 z-50 px-4 md:px-8 flex items-center justify-between">
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-binance-primary flex items-center justify-center">
          <Zap className="w-5 h-5 text-black fill-black" strokeWidth={3} />
        </div>
        <span className="text-xl font-bold font-mono tracking-tighter text-binance-primary">ClawSight</span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-binance-secondary">
        <a href="#" className="text-binance-text hover:text-binance-primary transition-colors">Trade Explainer</a>
        <a href="#" className="hover:text-binance-primary transition-colors">Market Pulse</a>
        <a href="#" className="hover:text-binance-primary transition-colors">Risk Desk</a>
      </div>
    </div>
    <div className="flex items-center gap-4 text-binance-secondary">
      <Bell className="w-5 h-5 cursor-pointer hover:text-binance-text" />
      <User className="w-5 h-5 cursor-pointer hover:text-binance-text" />
      <div className="h-6 w-px bg-white/10" />
      <button className="text-sm font-semibold text-binance-primary px-3 py-1 bg-binance-primary/10 rounded-md">PRO</button>
    </div>
  </nav>
)



function App() {
  const [loading, setLoading] = useState(false)
  const [tradeData, setTradeData] = useState({ pair: 'BTCUSDT', timestamp: '', entry: '' })
  const [result, setResult] = useState(null)

  const handleExplain = async (e) => {
    e.preventDefault()
    if (!tradeData.pair || !tradeData.entry || !tradeData.timestamp) {
      alert("Please fill in all trade details.")
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeData)
      })
      const analysis = await response.json()
      
      if (analysis.error) {
        alert(`Analysis Error: ${analysis.error}`)
        return
      }
      
      setResult(analysis)
    } catch (err) {
      console.error(err)
      alert("Analysis failed. Backend error.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-14 pb-12 selection:bg-binance-primary selection:text-black">
      <Navbar />
      
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-binance-primary/10 border border-binance-primary/20 text-binance-primary text-xs font-bold"
            >
              <Zap className="w-3 h-3 fill-binance-primary" /> POWERED BY OPENCLAW SDK
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Decode your <span className="pro-gradient-header">Trade Logic</span>
            </h1>
            <p className="text-binance-secondary text-lg leading-relaxed max-w-md">
              Enter your trade details to get instant feedback from our High-Frequency Risk Desk AI.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 border-white/10"
          >
            <form onSubmit={handleExplain} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-binance-secondary uppercase">Trading Pair</label>
                <div className="relative">
                  <input 
                    className="binance-input w-full pl-10" 
                    placeholder="BTCUSDT" 
                    value={tradeData.pair}
                    onChange={e => setTradeData({...tradeData, pair: e.target.value.toUpperCase()})}
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-binance-secondary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-binance-secondary uppercase">Entry Price</label>
                  <input 
                    className="binance-input w-full" 
                    placeholder="65432.10" 
                    type="number" 
                    step="any"
                    value={tradeData.entry}
                    onChange={e => setTradeData({...tradeData, entry: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-binance-secondary uppercase">Timestamp</label>
                  <div className="relative">
                    <input 
                      className="binance-input w-full pl-10" 
                      placeholder="YYYY-MM-DD HH:MM" 
                      value={tradeData.timestamp}
                      onChange={e => setTradeData({...tradeData, timestamp: e.target.value})}
                    />
                    <Clock className="absolute left-3 top-2.5 w-4 h-4 text-binance-secondary" />
                  </div>
                </div>
              </div>

              <button 
                disabled={loading}
                className="binance-btn-primary w-full flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Claw Market Context
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Right Column: Results Dashboard */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-binance-secondary uppercase tracking-widest flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Professional Insight
            </h2>
            {result && (
              <span className="text-[10px] font-mono text-binance-secondary">REQUEST_ID: CLAW-882-XJ</span>
            )}
          </div>

          <div className="flex-1 min-h-[400px]">
            <AnimatePresence mode="wait">
              {!result && !loading ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full h-full glass-card border-dashed border-white/5 flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <TrendingUp className="w-8 h-8 text-binance-secondary/40" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Awaiting Simulation</h3>
                  <p className="text-binance-secondary max-w-xs text-sm">
                    Fill in your trade details to analyze market conditions and get a professional verdict.
                  </p>
                </motion.div>
              ) : loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full glass-card flex flex-col items-center justify-center gap-4"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-binance-primary/10 border-t-binance-primary rounded-full animate-spin" />
                    <Zap className="absolute inset-0 m-auto w-6 h-6 text-binance-primary fill-binance-primary animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-binance-primary font-mono text-xs uppercase tracking-tighter">Initializing OpenClaw Skill...</p>
                    <p className="text-binance-secondary text-[10px]">Fetching OHLCV / Calculating Metrics</p>
                  </div>
                </motion.div>
              ) : (
                <InsightCard key="result" result={result} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      
      {/* Background Orbs for Glass Effect */}
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-binance-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-binance-green/5 rounded-full blur-[100px] pointer-events-none -z-10" />
    </div>
  )
}

function InsightCard({ result }) {
  if (!result || !result.metrics) return null;
  const isPositive = result.verdict === 'Perfect Entry' || result.verdict === 'Smart Accumulation' || result.verdict === 'Swimming with Whales'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Verdict Panel */}
      <div className="glass-card p-8 border-binance-primary/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <div className="px-2 py-1 rounded bg-binance-primary/10 border border-binance-primary/20 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-binance-primary animate-pulse" />
            <span className="text-[10px] font-bold text-binance-primary uppercase tracking-wider">Analysis Active</span>
          </div>
        </div>
        
        <h2 className="text-binance-secondary text-xs font-bold uppercase tracking-widest mb-2">The Verdict</h2>
        <h3 className={cn(
          "text-3xl md:text-4xl font-bold mb-4",
          isPositive ? "text-binance-green" : "text-binance-red"
        )}>{result.verdict}</h3>
        <p className="text-binance-text text-lg leading-relaxed border-l-2 border-binance-primary/50 pl-6 my-6 italic decoration-white/10">
          "{result.explanation}"
        </p>

        <div className="flex items-center gap-2 text-binance-primary text-sm font-medium pt-4">
          <Zap className="w-4 h-4 fill-binance-primary" />
          Improvement: {result.improvement}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-binance-secondary uppercase font-bold">RSI</span>
            <div className={cn(
              "p-1 rounded bg-binance-primary/10",
              result.metrics.rsi > 70 ? "text-binance-red" : "text-binance-primary"
            )}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold">{result.metrics.rsi}</div>
          <div className="text-[10px] text-binance-secondary mt-1">Relative Strength Index</div>
        </div>
        
        <div className="glass-card p-6 border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-binance-secondary uppercase font-bold">Volatility</span>
            <div className="p-1 rounded bg-binance-green/10 text-binance-green">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold">{result.metrics.volatility}%</div>
          <div className="text-[10px] text-binance-secondary mt-1">20m Standard Deviation</div>
        </div>
        
        <div className="glass-card p-6 border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-binance-secondary uppercase font-bold">Last Price</span>
            <div className="p-1 rounded bg-white/10 text-binance-secondary">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold">{result.metrics.lastPrice?.toLocaleString()}</div>
          <div className="text-[10px] text-binance-secondary mt-1">Market Snapshot</div>
        </div>
      </div>
    </motion.div>
  );
}

export default App
