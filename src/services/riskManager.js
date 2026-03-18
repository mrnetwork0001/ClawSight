/**
 * ClawSight AI Brain - Senior Risk Manager (Witty & Professional)
 * Analyzes trade context with a personality designed for high-stakes demos.
 */
export const analyzeTrade = async (tradeData, marketContext) => {
  const { pair, entry } = tradeData;
  const { metrics } = marketContext;

  // The prompt used for the underlying LLM logic (for documentation/architecture)
  const systemPrompt = `
  Role: Witty Senior Risk Manager (Professional but Sharp).
  Vibe: You've seen a thousand 'moon bois' lose their collateral. You are unimpressed but helpful.
  Specific Instruction: Use punchy, 1-2 sentence explanations. If they bought at a bad spot, be slightly savage.
  
  Examples: 
  - "You tried to catch a falling knife, but forgot the handle."
  - "Chasing green candles is a hobby, not a strategy."
  - "Entry was clean. You're swimming with the whales for once."
  `;

  // --- Personality Logic for Demo ---
  
  let verdict, explanation, improvement;

  if (metrics.rsi > 75) {
    verdict = 'Chasing Green Candles';
    explanation = `You tried to catch a meteor with your bare hands. Entering ${pair} at ${entry} with an RSI of ${metrics.rsi} is essentially donating to the market makers.`;
    improvement = 'Wait for the 15m consolidation. Chasing wicks is how accounts get deleted.';
  } else if (metrics.rsi > 65 && metrics.volatility > 4) {
    verdict = 'Falling Knife (Handleless)';
    explanation = 'You tried to catch a falling knife, but forgot the handle. Momentum was clearly fading while volatility was screaming "exit."';
    improvement = 'Check for high-volume bearish divergence before clicking buy next time.';
  } else if (metrics.rsi < 30) {
    verdict = 'Swimming with Whales';
    explanation = `Clean accumulation. You entered the bloodbath while others were fleeing. RSI at ${metrics.rsi} shows real fear—and real opportunity.`;
    improvement = 'Scale out at the first major resistance level. Don\'t get greedy.';
  } else if (metrics.volatility > 6) {
    verdict = 'Gambler\'s Paradox';
    explanation = `The volatility is at ${metrics.volatility}%. You're not trading, you're spinning a roulette wheel with ${pair}.`;
    improvement = 'Reduce position size by 50% in high VIX environments.';
  } else {
    verdict = 'Professional Entry';
    explanation = 'Calculated and calm. You entered during a period of stability when the noise was low. This is how the 1% trades.';
    improvement = 'Maintain your trailing stop loss and let the trend work for you.';
  }

  return {
    verdict,
    explanation,
    improvement,
    metrics
  };
};
