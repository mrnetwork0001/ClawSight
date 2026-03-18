import React, { useState, useEffect } from 'react'
import { 
  Search, Zap, TrendingUp, BarChart2, ShieldAlert, CheckCircle2, 
  AlertTriangle, ArrowRight, Menu, X, Clock, Terminal, 
  Activity, Wind, DollarSign, Globe, Shield 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// --- Dynamic Components ---

const Navbar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: 'trade', label: 'Trade Explainer' },
    { id: 'pulse', label: 'Market Pulse' },
    { id: 'risk', label: 'Risk Desk' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-14 bg-binance-black/80 backdrop-blur-xl border-b border-white/5 z-50 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('trade')}>
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center p-0.5">
              <img src="/logo.png" alt="ClawSight Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold font-mono tracking-tighter text-binance-primary">ClawSight</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-binance-secondary">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn("transition-colors", activeTab === tab.id ? "text-binance-primary" : "hover:text-binance-primary")}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-binance-secondary">
          <button className="hidden sm:block text-[10px] font-bold text-binance-primary px-2 py-0.5 border border-binance-primary/30 rounded bg-binance-primary/5">
            BINANCE PRO
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-binance-primary hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-14 left-0 right-0 bg-binance-black/95 backdrop-blur-2xl border-b border-white/10 z-40 md:hidden p-6 space-y-4"
          >
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left py-3 px-4 rounded-xl font-bold text-lg transition-all",
                  activeTab === tab.id ? "bg-binance-primary/10 text-binance-primary border border-binance-primary/20" : "text-binance-secondary hover:bg-white/5"
                )}
              >
                {tab.label}
              </button>
            ))}
            <div className="pt-4 border-t border-white/5">
              <button className="w-full text-center py-2 text-xs font-bold text-binance-primary border border-binance-primary/30 rounded-lg bg-binance-primary/5">
                BINANCE PRO ACCOUNT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const MarketPulse = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPulse = async () => {
    try {
      const res = await fetch('/api/prices')
      const pulseData = await res.json()
      if (!pulseData.error) setData(pulseData)
    } catch (err) {
      console.error("Pulse Error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPulse()
    const interval = setInterval(fetchPulse, 20000) // Refresh every 20s
    return () => clearInterval(interval)
  }, [])

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-10 h-10 border-4 border-binance-primary/10 border-t-binance-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pt-6">
      {/* Top Pulse Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.slice(0, 4).map(p => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={p.symbol} 
            className="glass-card p-4 border-white/5 flex flex-col gap-1"
          >
            <div className="flex justify-between items-center text-[10px] font-bold text-binance-secondary uppercase">
              <span>{p.symbol}USDT</span>
              <span className={p.up ? "text-binance-green" : "text-binance-red"}>{p.up ? '+' : ''}{p.change}%</span>
            </div>
            <div className="text-xl font-mono font-bold tracking-tighter">${p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="text-[9px] text-white/20">VOL: {p.vol}</div>
          </motion.div>
        ))}
      </div>

      {/* Momentum Grid (Replacing the placeholder) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-binance-secondary flex items-center gap-2">
            <Activity className="w-4 h-4" /> Market Momentum Grid
          </h3>
          <span className="text-[10px] font-mono text-binance-primary/60">SOURCE: BINANCE_STREAM_HKG_1</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {data.map((p, i) => (
            <motion.div
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              key={p.symbol}
              className={cn(
                "h-24 glass-card border flex flex-col items-center justify-center gap-1 transition-all group relative overflow-hidden",
                p.up 
                  ? "border-binance-green/20 bg-binance-green/5" 
                  : "border-binance-red/20 bg-binance-red/5"
              )}
            >
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
                p.up ? "bg-binance-green" : "bg-binance-red"
              )} />
              
              <span className="text-xs font-bold z-10">{p.symbol}</span>
              <span className={cn(
                "text-[14px] font-mono font-bold z-10",
                p.up ? "text-binance-green" : "text-binance-red"
              )}>
                {p.up ? '+' : ''}{p.change}%
              </span>
              <span className="text-[9px] text-binance-secondary z-10">${p.price < 1 ? p.price.toFixed(4) : p.price.toFixed(2)}</span>
              
              {/* Pulsing indicator */}
              <div className={cn(
                "w-1 h-1 rounded-full absolute bottom-2 right-2 animate-pulse",
                p.up ? "bg-binance-green" : "bg-binance-red"
              )} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* System Note */}
      <div className="p-4 border border-white/5 bg-white/[0.02] rounded-lg text-center">
          <p className="text-[10px] text-binance-secondary italic">
            Visualizing the 24h market sentiment shift through the OpenClaw Data Pipeline. High-frequency updates enabled.
          </p>
      </div>
    </div>
  )
}

const RiskDesk = () => (
  <div className="space-y-6 pt-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Shield className="w-6 h-6 text-binance-primary" /> Global Risk Monitor
      </h2>
      <div className="flex gap-2">
        <div className="px-3 py-1 bg-binance-red/10 border border-binance-red/30 rounded text-[10px] font-bold text-binance-red uppercase">Extreme Volatility</div>
        <div className="px-3 py-1 bg-binance-green/10 border border-binance-green/30 rounded text-[10px] font-bold text-binance-green uppercase">Bullish Flow</div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {[
          { icon: AlertTriangle, title: 'BTC Liquidity Sweep', desc: 'Large sell-wall identified at $68,500. Expected correction in next 15m.', color: 'text-binance-yellow' },
          { icon: Zap, title: 'OpenClaw Sentiment Shift', desc: 'Social sentiment on Binance Square just flipped 70% Bullish for $SOL.', color: 'text-binance-green' },
          { icon: ShieldAlert, title: 'Network Congestion', desc: 'High gas detected on Ethereum mainnet. Consider L2 alternatives for spot.', color: 'text-binance-red' },
        ].map((alert, i) => (
          <div key={i} className="glass-card p-5 border-white/5 flex gap-4 items-start">
            <div className="p-2 rounded bg-white/5">
              <alert.icon className={cn("w-5 h-5", alert.color)} />
            </div>
            <div>
              <p className="font-bold text-sm mb-1">{alert.title}</p>
              <p className="text-xs text-binance-secondary leading-relaxed">{alert.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="glass-card p-6 bg-binance-primary/5 border-binance-primary/20">
        <h4 className="text-xs font-bold uppercase mb-4 tracking-widest text-binance-primary">System Health</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-binance-secondary">API Latency</span>
            <span className="text-binance-green font-mono">14ms</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-binance-secondary">OpenClaw Engine</span>
            <span className="text-binance-green font-mono uppercase">Optimal</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-binance-secondary">Account Tier</span>
            <span className="text-binance-primary font-bold">VIP 9</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const InsightCard = ({ result }) => {
  if (!result || !result.metrics) return null;
  const isPositive = result.verdict === 'Perfect Entry' || result.verdict === 'Smart Accumulation' || result.verdict === 'Swimming with Whales' || result.verdict === 'Safe & Calculated'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-binance-secondary uppercase font-bold">RSI</span>
            <div className={cn("p-1 rounded", result.metrics.rsi > 70 ? "text-binance-red bg-binance-red/10" : "text-binance-primary bg-binance-primary/10")}>
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

// --- Main App Component ---

function App() {
  const [activeTab, setActiveTab] = useState('trade')
  const [loading, setLoading] = useState(false)
  const [tradeData, setTradeData] = useState({ pair: '', entry: '', timestamp: '' })
  const [result, setResult] = useState(null)

  const handleExplain = async (e) => {
    e.preventDefault()
    if (!tradeData.pair || !tradeData.entry || !tradeData.timestamp) {
      alert("Please check all fields.")
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeData)
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-binance-bg text-binance-text selection:bg-binance-primary selection:text-black">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 md:px-8 pt-24 pb-12">
        <AnimatePresence mode="wait">
          {activeTab === 'trade' && (
            <motion.div 
              key="trade"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-binance-primary/10 border border-binance-primary/20 w-fit">
                    <Zap className="w-3 h-3 text-binance-primary fill-binance-primary" />
                    <span className="text-[10px] font-bold text-binance-primary uppercase tracking-wider">Powered by OpenClaw SDK</span>
                  </div>
                  <h1 className="text-5xl font-bold tracking-tight leading-tight">
                    Decode your <span className="pro-gradient-header">Trade Logic</span>
                  </h1>
                </div>

                <div className="glass-card p-6 border-white/10">
                  <form onSubmit={handleExplain} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-binance-secondary uppercase">Trading Pair</label>
                      <input 
                        className="binance-input w-full" 
                        placeholder="BTCUSDT" 
                        value={tradeData.pair}
                        onChange={e => setTradeData({...tradeData, pair: e.target.value.toUpperCase()})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-binance-secondary uppercase">Entry Price</label>
                        <input className="binance-input w-full" placeholder="65000" type="number" value={tradeData.entry} onChange={e => setTradeData({...tradeData, entry: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-binance-secondary uppercase">Timestamp</label>
                        <input className="binance-input w-full" placeholder="2024-03-15 12:00" value={tradeData.timestamp} onChange={e => setTradeData({...tradeData, timestamp: e.target.value})} />
                      </div>
                    </div>
                    <button disabled={loading} className="binance-btn-primary w-full flex items-center justify-center gap-2 group disabled:opacity-50">
                      {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : "Claw Market Context"}
                    </button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-bold text-binance-secondary uppercase tracking-widest flex items-center gap-2">
                    <BarChart2 className="w-4 h-4" /> Professional Insight
                  </h2>
                </div>
                {!result && !loading ? (
                  <div className="glass-card min-h-[400px] border-dashed border-white/5 flex flex-col items-center justify-center text-center p-12">
                    <TrendingUp className="w-12 h-12 text-binance-secondary/20 mb-6" />
                    <h3 className="text-xl font-bold mb-2 text-white">Awaiting Simulation</h3>
                    <p className="text-binance-secondary text-sm">Fill in details to analyze market conditions.</p>
                  </div>
                ) : loading ? (
                  <div className="glass-card min-h-[400px] flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 border-4 border-binance-primary/10 border-t-binance-primary rounded-full animate-spin" />
                    <p className="text-binance-primary font-mono text-xs uppercase">Initializing OpenClaw Skill...</p>
                  </div>
                ) : (
                  <InsightCard result={result} />
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'pulse' && <MarketPulse />}
          {activeTab === 'risk' && <RiskDesk />}
        </AnimatePresence>
      </main>

      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-binance-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-binance-green/5 rounded-full blur-[100px] pointer-events-none -z-10" />
    </div>
  )
}

export default App
