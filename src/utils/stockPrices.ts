// Live Stock Price Fetcher
// Uses multiple real-time APIs for maximum reliability and data accuracy
// Primary: Alpha Vantage API (free tier available)
// Secondary: Yahoo Finance API
// Tertiary: IEX Cloud API (requires API key)

export interface StockPrice {
  symbol: string;
  name: string;
  current_price: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap?: number;
  pe_ratio?: number;
  dividend_yield?: number;
  high_52w?: number;
  low_52w?: number;
  avg_volume_10d?: number;
  last_updated: string;
}

export interface StockPrices {
  AAPL: number;
  MSFT: number;
  GOOGL: number;
  AMZN: number;
  TSLA: number;
  NVDA: number;
  META: number;
  NFLX: number;
  [key: string]: number;
}

export interface StockChartData {
  symbol: string;
  timeframe: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';
  data: {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}

// Popular stocks for trading
export const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
  { symbol: 'INTC', name: 'Intel Corporation' },
  { symbol: 'CRM', name: 'Salesforce Inc.' },
  { symbol: 'ORCL', name: 'Oracle Corporation' },
  { symbol: 'CSCO', name: 'Cisco Systems Inc.' },
  { symbol: 'IBM', name: 'International Business Machines' },
  { symbol: 'UBER', name: 'Uber Technologies Inc.' },
  { symbol: 'SPOT', name: 'Spotify Technology S.A.' }
];

// Fetch stock prices using Yahoo Finance API (primary - free and reliable)
export async function fetchStockPrices(): Promise<StockPrices> {
  const defaultPrices: StockPrices = {
    AAPL: 0, MSFT: 0, GOOGL: 0, AMZN: 0, TSLA: 0,
    NVDA: 0, META: 0, NFLX: 0
  };

  try {
    console.log('🔄 Fetching stock prices from Yahoo Finance...');

    // Yahoo Finance API doesn't have CORS issues in browser
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];
    const prices: StockPrices = { ...defaultPrices };

    // Use Yahoo Finance's quote API
    const yahooResponse = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CypherVault-App/1.0'
        }
      }
    );

    if (yahooResponse.ok) {
      const yahooData = await yahooResponse.json();
      const quotes = yahooData.quoteResponse?.result || [];

      quotes.forEach((quote: any) => {
        const price = quote.regularMarketPrice;
        if (price && price > 0) {
          prices[quote.symbol as keyof StockPrices] = price;
        }
      });

      const validPrices = Object.values(prices).filter(p => p > 0).length;
      if (validPrices >= 4) {
        console.log('✅ Yahoo Finance stock prices fetched successfully:', prices);
        return prices;
      }
    }
  } catch (yahooError) {
    console.warn('⚠️ Yahoo Finance API failed:', yahooError);
  }

  // Fallback to Alpha Vantage API (requires API key)
  try {
    console.log('🔄 Fetching stock prices from Alpha Vantage...');
    const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

    if (apiKey) {
      const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
      const prices: StockPrices = { ...defaultPrices };

      for (const symbol of symbols) {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
            {
              method: 'GET',
              headers: {
                  'Accept': 'application/json',
                  'User-Agent': 'CypherVault-App/1.0'
                }
            }
          );

          if (response.ok) {
            const data = await response.json();
            const price = parseFloat(data['Global Quote']?.['05. price'] || '0');
            if (price > 0) {
              prices[symbol as keyof StockPrices] = price;
            }
          }

          // Rate limiting - Alpha Vantage free tier allows 5 calls per minute
          await new Promise(resolve => setTimeout(resolve, 12000));
        } catch (error) {
          console.warn(`⚠️ Failed to fetch ${symbol}:`, error);
        }
      }

      const validPrices = Object.values(prices).filter(p => p > 0).length;
      if (validPrices >= 2) {
        console.log('✅ Alpha Vantage stock prices fetched:', prices);
        return prices;
      }
    }
  } catch (alphaVantageError) {
    console.warn('⚠️ Alpha Vantage API failed:', alphaVantageError);
  }

  // Final fallback - return zeros
  console.error('❌ All stock price APIs failed - returning default values');
  return defaultPrices;
}

// Fetch detailed stock data
export async function fetchStockDetails(symbol: string): Promise<StockPrice | null> {
  try {
    console.log(`🔄 Fetching detailed data for ${symbol}...`);

    const response = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CypherVault-App/1.0'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      const quote = data.quoteResponse?.result?.[0];

      if (quote) {
        return {
          symbol: quote.symbol,
          name: quote.longName || quote.shortName || symbol,
          current_price: quote.regularMarketPrice || 0,
          change: quote.regularMarketChange || 0,
          change_percent: quote.regularMarketChangePercent || 0,
          volume: quote.regularMarketVolume || 0,
          market_cap: quote.marketCap,
          pe_ratio: quote.trailingPE,
          dividend_yield: quote.dividendYield,
          high_52w: quote.fiftyTwoWeekHigh,
          low_52w: quote.fiftyTwoWeekLow,
          avg_volume_10d: quote.averageDailyVolume10Day,
          last_updated: new Date().toISOString(),
        };
      }
    }
  } catch (error) {
    console.warn(`⚠️ Failed to fetch ${symbol} details:`, error);
  }

  return null;
}

// Fetch stock chart data for technical analysis
export async function fetchStockChartData(
  symbol: string,
  timeframe: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y' = '1D'
): Promise<StockChartData | null> {
  try {
    console.log(`🔄 Fetching chart data for ${symbol} (${timeframe})...`);

    // Map timeframe to Yahoo Finance period
    const periodMap = {
      '1D': '1d',
      '1W': '5d',
      '1M': '1mo',
      '3M': '3mo',
      '6M': '6mo',
      '1Y': '1y',
      '5Y': '5y'
    };

    const intervalMap = {
      '1D': '5m',
      '1W': '1h',
      '1M': '1d',
      '3M': '1d',
      '6M': '1wk',
      '1Y': '1wk',
      '5Y': '1mo'
    };

    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${Math.floor(Date.now() / 1000) - 31536000}&period2=${Math.floor(Date.now() / 1000)}&interval=${intervalMap[timeframe]}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CypherVault-App/1.0'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      const chart = data.chart?.result?.[0];

      if (chart) {
        const timestamps = chart.timestamp || [];
        const quotes = chart.indicators?.quote?.[0] || {};

        const chartData = timestamps.map((timestamp: number, index: number) => ({
          timestamp: timestamp * 1000, // Convert to milliseconds
          open: quotes.open?.[index] || 0,
          high: quotes.high?.[index] || 0,
          low: quotes.low?.[index] || 0,
          close: quotes.close?.[index] || 0,
          volume: quotes.volume?.[index] || 0,
        })).filter((item: any) => item.close > 0);

        return {
          symbol,
          timeframe,
          data: chartData
        };
      }
    }
  } catch (error) {
    console.warn(`⚠️ Failed to fetch chart data for ${symbol}:`, error);
  }

  return null;
}

// Search for stocks by symbol or name
export async function searchStocks(query: string): Promise<{ symbol: string; name: string; }[]> {
  try {
    console.log(`🔄 Searching stocks for "${query}"...`);

    const response = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CypherVault-App/1.0'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      const quotes = data.quotes || [];

      return quotes
        .filter((quote: any) => quote.symbol && quote.shortname)
        .map((quote: any) => ({
          symbol: quote.symbol,
          name: quote.shortname
        }));
    }
  } catch (error) {
    console.warn('⚠️ Stock search failed:', error);
  }

  return [];
}

// Format stock price with appropriate decimal places
export function formatStockPrice(price: number): string {
  if (price == null || isNaN(price)) {
    return '$0.00';
  }
  return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Format market cap
export function formatMarketCap(marketCap: number): string {
  if (marketCap == null || isNaN(marketCap)) {
    return '$0';
  }
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  }
  return `$${marketCap.toLocaleString()}`;
}