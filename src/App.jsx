import React, { useState, useEffect } from 'react'
import { 
  Search, Zap, TrendingUp, BarChart2, ShieldAlert, CheckCircle2, 
  AlertTriangle, ArrowRight, Menu, X, Clock, Terminal, 
  Activity, Wind, DollarSign, Globe, Shield 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import * as htmlToImage from 'html-to-image'
import download from 'downloadjs'
import { useRef } from 'react'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// --- Dynamic Components ---

const LandingPage = ({ onLaunch }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Animated Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="fixed top-1/4 -left-20 w-96 h-96 bg-binance-primary/20 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -50, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="fixed bottom-1/4 -right-20 w-[500px] h-[500px] bg-binance-green/10 rounded-full blur-[150px] pointer-events-none" 
      />

      {/* Hero Section */}
      <div className="max-w-6xl w-full text-center space-y-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-24 h-24 rounded-3xl overflow-hidden glass-card border-binance-primary/30 p-2 shadow-2xl">
            <img src="/logo.png" alt="ClawSight Logo" className="w-full h-full object-contain" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <ShieldAlert className="w-4 h-4 text-binance-primary animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-binance-secondary">Stop Guessing. Audit Your Performance.</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9]">
            Audit Your <span className="pro-gradient-header">PnL</span><br/>
            Roast Your <span className="text-white/40 italic font-mono">Bias.</span>
          </h1>
          <p className="text-xl md:text-2xl text-binance-secondary max-w-2xl leading-relaxed">
            Did you buy the bottom or just supply the exit liquidity? ClawSight uses agentic AI to audit your trades against mathematical market reality.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <button 
            onClick={onLaunch}
            className="binance-btn-primary px-12 py-5 text-xl font-bold flex items-center gap-3 group"
          >
            Launch Terminal
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
          </button>
        </motion.div>

        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-24 text-left">
          {[
            { 
              icon: Zap, 
              title: "AI Performance Audit", 
              desc: "Immediate feedback on your entry/exit vs the local 20m high and low targets.",
              color: "text-binance-primary"
            },
            { 
              icon: Search, 
              title: "Top/Bottom Detector", 
              desc: "Mathematically prove if you caught the peak or provided the floor liquidity.",
              color: "text-binance-green"
            },
            { 
              icon: ShieldAlert, 
              title: "Contextual Roast", 
              desc: "Our AI doesn't just show data; it judges your logic against RSI and Volatility.",
              color: "text-binance-red"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 border-white/5 space-y-4 hover:border-white/20 transition-all cursor-default group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className={cn("w-6 h-6", feature.color)} />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-binance-secondary leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Branding */}
      <Footer />
    </div>
  )
}

const NotificationToast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl glass-card border flex items-center gap-4 shadow-2xl min-w-[320px] backdrop-blur-3xl",
        type === 'error' ? "border-binance-red/30 bg-binance-red/10" : "border-binance-primary/30 bg-binance-primary/10"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center",
        type === 'error' ? "bg-binance-red/20" : "bg-binance-primary/20"
      )}>
        {type === 'error' ? <AlertTriangle className="w-6 h-6 text-binance-red" /> : <ShieldAlert className="w-6 h-6 text-binance-primary" />}
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">
          {type === 'error' ? 'System Alert' : 'Notification'}
        </p>
        <p className="text-sm text-binance-secondary font-medium leading-tight">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
        <X className="w-4 h-4 text-binance-secondary" />
      </button>
    </motion.div>
  );
};

const FlippableMetricCard = ({ title, value, subtext, icon: Icon, explanation, iconColor }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="h-[140px] perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d"
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden glass-card p-6 border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-binance-secondary uppercase font-bold">{title}</span>
            <div className={cn("p-1 rounded bg-white/5", iconColor)}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-mono font-bold">{value}</div>
            <div className="text-[10px] text-binance-secondary mt-1">{subtext}</div>
          </div>
          <div className="absolute bottom-2 right-4 opacity-0 group-hover:opacity-40 transition-opacity text-[8px] uppercase tracking-tighter">Click to learn</div>
        </div>

        {/* Back Side */}
        <div 
          style={{ transform: 'rotateY(180deg)' }}
          className="absolute inset-0 backface-hidden glass-card p-6 border-binance-primary/20 bg-binance-primary/5 flex flex-col justify-center items-center text-center"
        >
          <p className="text-[11px] leading-relaxed text-binance-text italic">
            {explanation}
          </p>
          <div className="mt-2 text-[8px] font-bold text-binance-primary uppercase tracking-widest">Return to Data</div>
        </div>
      </motion.div>
    </div>
  );
};

const Footer = () => (
  <div className="py-8 z-10 flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-all">
    <span className="text-sm font-mono tracking-widest uppercase">
      Built by <a href="https://x.com/encrypt_wizard" target="_blank" rel="noopener noreferrer" className="text-binance-primary hover:underline font-bold">MrNetwork</a>
    </span>
  </div>
)

const Navbar = ({ activeTab, setActiveTab, onGoLanding }) => {
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
          <div className="flex items-center gap-2 cursor-pointer" onClick={onGoLanding}>
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

const RiskDesk = () => {
  const [alerts, setAlerts] = useState([]);
  const [latency, setLatency] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalRisk = async () => {
      const start = performance.now();
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT"]');
        const data = await res.json();
        const end = performance.now();
        setLatency(Math.round(end - start));

        const newAlerts = data.map(ticker => {
          const change = parseFloat(ticker.priceChangePercent);
          if (change <= -5) {
            return {
              icon: AlertTriangle,
              title: `${ticker.symbol} Liquidity Sweep`,
              desc: `Aggressive selling detected. ${ticker.symbol} dropped ${change}% in 24h. Potential floor hunt in progress.`,
              color: 'text-binance-red',
              type: 'critical'
            };
          }
          if (Math.abs(change) >= 8) {
             return {
              icon: Zap,
              title: `${ticker.symbol} Volatility Spike`,
              desc: `Extreme movement of ${change}% detected. Market makers are widening the spread. Tread carefully.`,
              color: 'text-binance-yellow',
              type: 'warning'
            };
          }
          return null;
        }).filter(Boolean);

        // Fallback if market is boring
        if (newAlerts.length === 0) {
          newAlerts.push({
            icon: ShieldAlert,
            title: 'Low Global Risk',
            desc: 'Top pairs are exhibiting stable volatility. No aggressive liquidity sweeps detected in the last cycle.',
            color: 'text-binance-green',
            type: 'safe'
          });
        }

        setAlerts(newAlerts);
      } catch (err) {
        console.error("Risk Monitor Failure:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalRisk();
    const interval = setInterval(fetchGlobalRisk, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-binance-primary" /> Global Risk Monitor
        </h2>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-binance-red/10 border border-binance-red/30 rounded text-[10px] font-bold text-binance-red uppercase">Live Scanner</div>
          <div className="px-3 py-1 bg-binance-green/10 border border-binance-green/30 rounded text-[10px] font-bold text-binance-green uppercase">Market Radar</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="glass-card p-12 flex flex-col items-center justify-center gap-4">
               <div className="w-8 h-8 border-2 border-binance-primary/30 border-t-binance-primary rounded-full animate-spin" />
               <p className="text-xs font-mono text-binance-primary uppercase">Scanning Liquidity Pools...</p>
            </div>
          ) : (
            alerts.map((alert, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-5 border-white/5 flex gap-4 items-start"
              >
                <div className="p-2 rounded bg-white/5">
                  <alert.icon className={cn("w-5 h-5", alert.color)} />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1">{alert.title}</p>
                  <p className="text-xs text-binance-secondary leading-relaxed">{alert.desc}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
        <div className="glass-card p-6 bg-binance-primary/5 border-binance-primary/20">
          <h4 className="text-xs font-bold uppercase mb-4 tracking-widest text-binance-primary">System Health</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-binance-secondary">API Latency</span>
              <span className={cn("font-mono font-bold", latency < 200 ? "text-binance-green" : "text-binance-yellow")}>
                {latency > 0 ? `${latency}ms` : 'Calculating...'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-binance-secondary">Market Sentiment</span>
              <span className="text-binance-green font-mono uppercase">Bullish Flow</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-binance-secondary">Scanner State</span>
              <span className="text-binance-primary font-bold uppercase">Optimal</span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[10px] text-binance-secondary leading-relaxed italic">
              *Real-time intelligence fetched directly from Binance Global Liquidity nodes. Data refreshes every 30s.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const InsightCard = ({ result, pair }) => {
  if (!result || !result.metrics) return null;
  const cardRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const isPositive = result.verdict === 'Perfect Entry' || result.verdict === 'Smart Accumulation' || result.verdict === 'Swimming with Whales' || result.verdict === 'Safe & Calculated'

  const handleExport = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#0b0e11'
      });
      download(dataUrl, `ClawSight_Audit_${pair}_${Date.now()}.png`);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-end -mb-2">
        <button 
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-binance-primary/10 border border-binance-primary/30 text-binance-primary text-xs font-bold hover:bg-binance-primary hover:text-black transition-all disabled:opacity-50"
        >
          {exporting ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Activity className="w-3 h-3" />}
          {exporting ? 'Processing...' : 'Export PnL Card'}
        </button>
      </div>

      <div ref={cardRef} className="glass-card p-8 border-binance-primary/20 relative overflow-hidden group bg-[#0b0e11]">
        {/* Card Watermark/Logo */}
        <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12 group-hover:opacity-[0.05] transition-opacity pointer-events-none">
          <img src="/logo.png" alt="" className="w-64 h-64" />
        </div>

        <div className="absolute top-0 right-0 p-4">
          <div className="px-2 py-1 rounded bg-binance-primary/10 border border-binance-primary/20 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-binance-primary animate-pulse" />
            <span className="text-[10px] font-bold text-binance-primary uppercase tracking-wider">Verified Audit</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl overflow-hidden glass-card border-binance-primary/30 p-1.5">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h4 className="text-xl font-black tracking-tighter text-white">{pair} <span className="text-binance-secondary font-medium text-xs ml-1">AUDIT</span></h4>
            {result.timestamp && (
              <p className="text-[10px] text-white/50 font-mono uppercase tracking-tighter mt-0.5">
                {new Date(result.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} 
                <span className="mx-1 text-binance-primary">→</span>
                {new Date(result.exitTimestamp || Date.now()).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
            <p className="text-[9px] text-binance-secondary font-mono uppercase tracking-[0.2em] mt-1">Generated by ClawSight Intelligence</p>
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
        
        {/* PnL Overlay */}
        {result.metrics.pnl && (
          <div className={cn(
            "mt-6 px-4 py-3 rounded-xl border flex items-center justify-between",
            parseFloat(result.metrics.pnl) >= 0 
              ? "bg-binance-green/10 border-binance-green/30" 
              : "bg-binance-red/10 border-binance-red/30"
          )}>
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", parseFloat(result.metrics.pnl) >= 0 ? "bg-binance-green" : "bg-binance-red")} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-binance-secondary">Realized PnL</span>
            </div>
            <span className={cn("text-xl font-mono font-bold", parseFloat(result.metrics.pnl) >= 0 ? "text-binance-green" : "text-binance-red")}>
              {parseFloat(result.metrics.pnl) >= 0 ? '+' : ''}{result.metrics.pnl}%
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FlippableMetricCard 
          title="RSI"
          value={result.metrics.rsi}
          subtext="Relative Strength Index"
          icon={TrendingUp}
          iconColor={result.metrics.rsi > 70 ? "text-binance-red" : "text-binance-primary"}
          explanation="Measures 'speed' of price moves. >70 is Overbought (danger zone), <30 is Oversold (potential bounce). Your logic depends on this reset."
        />
        
        <FlippableMetricCard 
          title="Volatility"
          value={`${result.metrics.volatility}%`}
          subtext="20m Standard Deviation"
          icon={Activity}
          iconColor="text-binance-green"
          explanation="Measures market 'turbulence'. High volatility means massive opportunity but requires tighter stops to avoid being 'Clawed' by the noise."
        />
        
        <FlippableMetricCard 
          title="High/Low"
          value={`$${result.metrics.maxHigh?.toLocaleString()}`}
          subtext={`Min: $${result.metrics.minLow?.toLocaleString()}`}
          icon={Search}
          iconColor="text-binance-yellow"
          explanation="The local range during your trade session. The closer your exit was to the High ($${result.metrics.maxHigh}), the better your trade timing."
        />

        <FlippableMetricCard 
          title="Last Price"
          value={result.metrics.lastPrice?.toLocaleString()}
          subtext="Market Snapshot"
          icon={Clock}
          explanation="The post-trade reality. Comparing this to your entry vs the 'Claw' verdict proves whether the market validated your analytical path."
        />
      </div>
    </motion.div>
  );
}

// --- Main App Component ---

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [activeTab, setActiveTab] = useState('trade')
  const [loading, setLoading] = useState(false)
  const [tradeData, setTradeData] = useState({ pair: '', entry: '', exit: '', timestamp: '', exitTimestamp: '' })
  const [result, setResult] = useState(null)
  
  // --- Toast State ---
  const [toast, setToast] = useState(null)
  
  // --- Autocomplete State ---
  const [allSymbols, setAllSymbols] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await fetch('/api/symbols')
        const data = await res.json()
        if (Array.isArray(data)) setAllSymbols(data)
      } catch (err) {
        console.error("Symbols fetch skip:", err)
      }
    }
    fetchSymbols()
  }, [])

  const handlePairInput = (val) => {
    const search = val.toUpperCase()
    setTradeData({ ...tradeData, pair: search })

    if (search.length > 0) {
      const filtered = allSymbols
        .filter(s => s.startsWith(search))
        .slice(0, 5) // Top 5 matches
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectPair = (p) => {
    setTradeData({ ...tradeData, pair: p })
    setShowSuggestions(false)
  }

  const handleExplain = async (e) => {
    if (e) e.preventDefault()
    if (!tradeData.pair || !tradeData.entry || !tradeData.exit) {
      setToast({ message: "Claw Requirement: Pair, Entry, and Exit prices are mandatory." })
      return
    }
    
    setLoading(true)
    try {
      // Use current time if timestamp is empty
      const finalTimestamp = tradeData.timestamp.trim() || new Date().toISOString()
      const finalExitTimestamp = tradeData.exitTimestamp.trim() || new Date().toISOString()
      
      const response = await fetch(`/api/analyze?cb=${Date.now()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tradeData, timestamp: finalTimestamp, exitTimestamp: finalExitTimestamp })
      })
      
      const text = await response.text()
      try {
        const data = JSON.parse(text)
        if (data.error) throw new Error(data.error)
        setResult(data)
      } catch (e) {
        if (text.includes("504") || text.includes("Gateway Timeout")) {
          throw new Error("Vercel Gateway Timeout: Binance is taking too long to respond. Try a different pair or shorter timeframe.")
        }
        throw new Error(e.message || "The Claw encountered a data glitch. Try once more in 5s.")
      }
    } catch (err) {
      setToast({ message: err.message })
    } finally {
      setLoading(false)
    }
  }

  if (showLanding) {
    return <LandingPage onLaunch={() => setShowLanding(false)} />
  }

  return (
    <div className="min-h-screen bg-binance-bg text-binance-text selection:bg-binance-primary selection:text-black">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onGoLanding={() => setShowLanding(true)}
      />
      
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
                    <div className="space-y-2 relative">
                      <label className="text-xs font-bold text-binance-secondary uppercase tracking-widest">Trading Pair</label>
                      <div className="relative group/input">
                        <input 
                          className="binance-input w-full pl-10" 
                          placeholder="e.g. BTCUSDT" 
                          autoComplete="off"
                          value={tradeData.pair}
                          onChange={e => handlePairInput(e.target.value)}
                          onFocus={() => tradeData.pair && setShowSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-binance-secondary group-focus-within/input:text-binance-primary transition-colors" />
                      </div>

                      {/* Autocomplete Dropdown */}
                      <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute left-0 right-0 top-full mt-2 z-[60] bg-[#0b0e11] border border-white/10 overflow-hidden shadow-2xl rounded-xl"
                          >
                            {suggestions.map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => selectPair(p)}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-white hover:bg-white/5 hover:text-binance-primary transition-all flex items-center justify-between border-b border-white/5 last:border-0"
                              >
                                <span>{p}</span>
                                <div className="px-1.5 py-0.5 rounded bg-binance-primary/10 text-[9px] text-binance-primary uppercase">Active</div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-binance-secondary uppercase">Entry Price</label>
                        <input className="binance-input w-full" placeholder="65000" type="number" value={tradeData.entry} onChange={e => setTradeData({...tradeData, entry: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-binance-secondary uppercase">Exit Price</label>
                        <input className="binance-input w-full border-binance-green/20" placeholder="68000" type="number" value={tradeData.exit} onChange={e => setTradeData({...tradeData, exit: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-binance-secondary uppercase">Entry Date/Time (Optional)</label>
                        <input 
                          type="datetime-local"
                          className="binance-input w-full text-xs [color-scheme:dark]" 
                          value={tradeData.timestamp} 
                          onChange={e => setTradeData({...tradeData, timestamp: e.target.value})} 
                        />
                        <p className="text-[9px] text-binance-secondary/60 leading-tight italic">*Momentum scan.</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-binance-secondary uppercase">Exit Date/Time (Optional)</label>
                        <input 
                          type="datetime-local"
                          className="binance-input w-full text-xs [color-scheme:dark]" 
                          value={tradeData.exitTimestamp} 
                          onChange={e => setTradeData({...tradeData, exitTimestamp: e.target.value})} 
                        />
                        <p className="text-[9px] text-binance-secondary/60 leading-tight italic">*Liquidity scan.</p>
                      </div>
                    </div>
                    <button disabled={loading} className="binance-btn-primary w-full flex items-center justify-center gap-2 group disabled:opacity-50">
                      {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : "Initiate Audit"}
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
                  <InsightCard result={result} pair={tradeData.pair} />
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'pulse' && <MarketPulse />}
          {activeTab === 'risk' && <RiskDesk />}
        </AnimatePresence>
      </main>

      <Footer />

      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-binance-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-binance-green/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Global Notifications */}
      <AnimatePresence>
        {toast && (
          <NotificationToast 
            message={toast.message} 
            type={toast.type || 'error'} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
