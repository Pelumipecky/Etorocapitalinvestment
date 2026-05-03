// Cache for crypto prices to improve performance
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CryptoPriceCache {
  private cache: Map<string, CacheEntry> = new Map();

  set(key: string, data: any, ttl: number = 30000): void { // Default 30 seconds TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

const priceCache = new CryptoPriceCache();

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  image: string;
  last_updated: string;
  circulating_supply?: number;
  max_supply?: number;
  ath?: number;
  ath_change_percentage?: number;
  atl?: number;
  atl_change_percentage?: number;
}

export interface CryptoPrices {
  BTC: number;
  ETH: number;
  USDT: number;
  BNB: number;
  XRP: number;
  SOL: number;
  DOGE: number;
  ADA: number;
  [key: string]: number;
}

export interface CryptoPriceDetails {
  [key: string]: CryptoPrice;
}

// Fetch prices using multiple real-time APIs for maximum reliability
export async function fetchCryptoPrices(): Promise<CryptoPrices> {
  const cacheKey = 'crypto_prices_simple';
  const cached = priceCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const defaultPrices: CryptoPrices = { BTC: 0, ETH: 0, USDT: 1, BNB: 0, XRP: 0, SOL: 0, DOGE: 0, ADA: 0 };

  // Try Binance API first (most reliable for browser requests, no CORS issues)
  try {
    const binanceResponse = await Promise.race([
      fetch('https://api.binance.com/api/v3/ticker/price', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CypherVault-App/1.0'
        }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)) // 5 second timeout
    ]) as Response;

    if (binanceResponse.ok) {
      const binanceData = await binanceResponse.json();
      const prices: CryptoPrices = { ...defaultPrices };

      binanceData.forEach((item: { symbol: string; price: string }) => {
        const price = parseFloat(item.price);
        if (!isNaN(price) && price > 0) {
          if (item.symbol === 'BTCUSDT') prices.BTC = price;
          if (item.symbol === 'ETHUSDT') prices.ETH = price;
          if (item.symbol === 'BNBUSDT') prices.BNB = price;
          if (item.symbol === 'XRPUSDT') prices.XRP = price;
          if (item.symbol === 'SOLUSDT') prices.SOL = price;
          if (item.symbol === 'DOGEUSDT') prices.DOGE = price;
          if (item.symbol === 'ADAUSDT') prices.ADA = price;
        }
      });

      // Validate that we got at least some real prices
      const validPrices = Object.values(prices).filter(p => p > 0).length;
      if (validPrices >= 3) {
        priceCache.set(cacheKey, prices, 15000); // Cache for 15 seconds
        return prices;
      }
    }
  } catch (binanceError) {
    console.warn('⚠️ Binance API failed:', binanceError);
  }

  // Fallback to CoinGecko API (more comprehensive data) - simplified endpoint
  try {
    const response = await Promise.race([
      fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,ripple,solana,dogecoin,cardano&vs_currencies=usd',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'CypherVault-App/1.0'
          }
        }
      ),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
    ]) as Response;

    if (response.ok) {
      const data = await response.json();

      const prices = {
        BTC: data.bitcoin?.usd || 0,
        ETH: data.ethereum?.usd || 0,
        USDT: data.tether?.usd || 1,
        BNB: data.binancecoin?.usd || 0,
        XRP: data.ripple?.usd || 0,
        SOL: data.solana?.usd || 0,
        DOGE: data.dogecoin?.usd || 0,
        ADA: data.cardano?.usd || 0,
      };

      priceCache.set(cacheKey, prices, 15000);
      return prices;
    }
  } catch (error) {
    console.warn('⚠️ CoinGecko API failed:', error);
  }

  // Return cached data if available, even if expired
  const expiredCache = priceCache.get(cacheKey);
  if (expiredCache) {
    return expiredCache;
  }

  return defaultPrices;
}

// Fetch detailed price data with 24h changes - Multiple APIs for maximum reliability
export async function fetchDetailedCryptoPrices(): Promise<CryptoPrice[]> {
  const cacheKey = 'crypto_prices_detailed';
  const cached = priceCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Reduced symbol map for faster loading - only top 8 cryptocurrencies
  const symbolMap: { [key: string]: { id: string; name: string; image: string } } = {
    'BTCUSDT': { id: 'bitcoin', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    'ETHUSDT': { id: 'ethereum', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    'BNBUSDT': { id: 'binancecoin', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
    'XRPUSDT': { id: 'ripple', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
    'SOLUSDT': { id: 'solana', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
    'DOGEUSDT': { id: 'dogecoin', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
    'ADAUSDT': { id: 'cardano', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
    'AVAXUSDT': { id: 'avalanche', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png' },
  };

  // Try Binance API first with timeout
  try {
    const ticker24hResponse = await Promise.race([
      fetch('https://api.binance.com/api/v3/ticker/24hr', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CipherVault-App/1.0'
        }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
    ]) as Response;

    if (ticker24hResponse.ok) {
      const ticker24h = await ticker24hResponse.json();
      const prices: CryptoPrice[] = [];

      ticker24h.forEach((item: any) => {
        const info = symbolMap[item.symbol];
        if (info && parseFloat(item.lastPrice) > 0) {
          prices.push({
            id: info.id,
            symbol: item.symbol.replace('USDT', '').replace('USDC', '').toLowerCase(),
            name: info.name,
            current_price: parseFloat(item.lastPrice),
            price_change_24h: parseFloat(item.priceChange),
            price_change_percentage_24h: parseFloat(item.priceChangePercent),
            market_cap: parseFloat(item.quoteVolume) * 100, // Approximate market cap from volume
            total_volume: parseFloat(item.quoteVolume),
            high_24h: parseFloat(item.highPrice),
            low_24h: parseFloat(item.lowPrice),
            image: info.image,
            last_updated: new Date().toISOString(),
            circulating_supply: parseFloat(item.count) || undefined,
          });
        }
      });

      // Sort by volume (approximate market cap ranking)
      prices.sort((a, b) => b.total_volume - a.total_volume);

      if (prices.length > 0) {
        priceCache.set(cacheKey, prices, 30000); // Cache for 30 seconds
        return prices;
      }
    }
  } catch (binanceError) {
    console.warn('⚠️ Binance detailed API failed:', binanceError);
  }

  // Fallback to CoinGecko API (more comprehensive data) - simplified for speed
  try {
    const response = await Promise.race([
      fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,ripple,solana,dogecoin,cardano,avalanche-2&order=market_cap_desc&per_page=8&page=1&sparkline=false&price_change_percentage=24h',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'CypherVault-App/1.0'
          }
        }
      ),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
    ]) as Response;

    if (response.ok) {
      const data = await response.json();

      const transformedData: CryptoPrice[] = data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        current_price: coin.current_price,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        market_cap: coin.market_cap,
        total_volume: coin.total_volume,
        high_24h: coin.high_24h,
        low_24h: coin.low_24h,
        image: coin.image,
        last_updated: coin.last_updated,
        circulating_supply: coin.circulating_supply,
        max_supply: coin.max_supply,
        ath: coin.ath,
        ath_change_percentage: coin.ath_change_percentage,
        atl: coin.atl,
        atl_change_percentage: coin.atl_change_percentage,
      }));

      priceCache.set(cacheKey, transformedData, 30000);
      return transformedData;
    }
  } catch (error) {
    console.warn('⚠️ CoinGecko detailed API failed:', error);
  }

  // Return cached data if available, even if expired
  const expiredCache = priceCache.get(cacheKey);
  if (expiredCache) {
    return expiredCache;
  }

  // Final fallback - return empty array
  console.error('❌ All detailed price APIs failed');
  return [];
}

// Format price with appropriate decimal places
export function formatPrice(price: number): string {
  if (price == null || isNaN(price)) {
    return '$0.00';
  }
  if (price >= 1000) {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (price >= 1) {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  } else {
    return price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 });
  }
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

// Get real-time price updates using WebSocket (for live trading data)
export function subscribeToPriceUpdates(callback: (prices: CryptoPrices) => void): () => void {
  // For browser compatibility, we'll use polling instead of WebSocket
  // In production, you could implement WebSocket connection to Binance streams
  const interval = setInterval(async () => {
    try {
      const prices = await fetchCryptoPrices();
      callback(prices);
    } catch (error) {
      console.error('Failed to fetch real-time prices:', error);
    }
  }, 10000); // Update every 10 seconds

  // Return cleanup function
  return () => clearInterval(interval);
}

// Get market overview data (global crypto statistics)
export async function fetchMarketOverview(): Promise<{
  total_market_cap: number;
  total_volume: number;
  market_cap_change_percentage_24h: number;
  active_cryptocurrencies: number;
  upcoming_icos: number;
  ongoing_icos: number;
  ended_icos: number;
}> {
  try {
    console.log('🔄 Fetching market overview from CoinGecko...');
    const response = await fetch('https://api.coingecko.com/api/v3/global', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CipherVault-App/1.0'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Market overview fetched');
      return {
        total_market_cap: data.data?.total_market_cap?.usd || 0,
        total_volume: data.data?.total_volume?.usd || 0,
        market_cap_change_percentage_24h: data.data?.market_cap_change_percentage_24h_usd || 0,
        active_cryptocurrencies: data.data?.active_cryptocurrencies || 0,
        upcoming_icos: data.data?.upcoming_icos || 0,
        ongoing_icos: data.data?.ongoing_icos || 0,
        ended_icos: data.data?.ended_icos || 0,
      };
    }
  } catch (error) {
    console.warn('⚠️ Market overview API failed:', error);
  }

  return {
    total_market_cap: 0,
    total_volume: 0,
    market_cap_change_percentage_24h: 0,
    active_cryptocurrencies: 0,
    upcoming_icos: 0,
    ongoing_icos: 0,
    ended_icos: 0,
  };
}

// Get trending cryptocurrencies
export async function fetchTrendingCryptos(): Promise<CryptoPrice[]> {
  try {
    console.log('🔄 Fetching trending cryptocurrencies...');
    const response = await fetch('https://api.coingecko.com/api/v3/search/trending', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CipherVault-App/1.0'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const trendingCoins = data.coins || [];

      // Convert to our CryptoPrice format
      const trendingPrices: CryptoPrice[] = trendingCoins.map((item: any) => ({
        id: item.item.id,
        symbol: item.item.symbol,
        name: item.item.name,
        current_price: item.item.price_btc * 50000 || 0, // Approximate BTC price
        price_change_24h: 0,
        price_change_percentage_24h: item.item.price_change_percentage_24h || 0,
        market_cap: item.item.market_cap_rank || 0,
        total_volume: 0,
        high_24h: 0,
        low_24h: 0,
        image: item.item.large,
        last_updated: new Date().toISOString(),
      }));

      console.log(`✅ Trending cryptos fetched: ${trendingPrices.length} coins`);
      return trendingPrices;
    }
  } catch (error) {
    console.warn('⚠️ Trending cryptos API failed:', error);
  }

  return [];
}

// Get symbol to id mapping for CoinGecko
export const cryptoIdMap: { [key: string]: string } = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  BNB: 'binancecoin',
  XRP: 'ripple',
  SOL: 'solana',
  DOGE: 'dogecoin',
  ADA: 'cardano',
  DOT: 'polkadot',
  AVAX: 'avalanche-2',
  LINK: 'chainlink',
  MATIC: 'polygon',
  LTC: 'litecoin',
  UNI: 'uniswap',
  TRX: 'tron',
  ATOM: 'cosmos'
};
