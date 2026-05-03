import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { createChart, IChartApi, ISeriesApi, CandlestickData, ColorType } from 'lightweight-charts';
import { useAuth } from '@/context/AuthContext';
import { supabaseDb } from '@/lib/supabaseUtils';
import {
  fetchStockPrices,
  fetchStockDetails,
  fetchStockChartData,
  searchStocks,
  formatStockPrice,
  formatMarketCap,
  StockPrice,
  StockPrices,
  StockChartData,
  POPULAR_STOCKS
} from '@/utils/stockPrices';

interface StockTradingProps {}

function StockTrading() {
  const { t } = useTranslation();
  const { user } = useAuth();
  // State management
  const [stockPrices, setStockPrices] = useState<StockPrices>({
    AAPL: 0, MSFT: 0, GOOGL: 0, AMZN: 0, TSLA: 0, NVDA: 0, META: 0, NFLX: 0
  });
  const [selectedStock, setSelectedStock] = useState<StockPrice | null>(null);
  const [stockDetails, setStockDetails] = useState<StockPrice | null>(null);
  const [chartData, setChartData] = useState<StockChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ symbol: string; name: string; }[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y'>('1D');

  // Trading state
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState('');

  // Modal alert state
  const [modalAlert, setModalAlert] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Chart refs
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  // Load initial stock prices
  useEffect(() => {
    async function loadStockPrices() {
      setLoading(true);
      try {
        const prices = await fetchStockPrices();
        setStockPrices(prices);

        // Load details for AAPL by default
        const details = await fetchStockDetails('AAPL');
        if (details) {
          setSelectedStock(details);
          setStockDetails(details);
        }
      } catch (error) {
        console.error('Failed to load stock prices:', error);
      }
      setLoading(false);
    }

    loadStockPrices();

    // Update prices every 30 seconds
    const interval = setInterval(loadStockPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load chart data when stock or timeframe changes
  useEffect(() => {
    if (selectedStock) {
      loadChartData(selectedStock.symbol, timeframe);
    }
  }, [selectedStock, timeframe]);

  // Initialize chart
  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: '#0f172a' },
          textColor: '#cbd5e1',
        },
        grid: {
          vertLines: { color: 'rgba(255,255,255,0.1)' },
          horzLines: { color: 'rgba(255,255,255,0.1)' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: 'rgba(255,255,255,0.1)',
        },
      }) as any;

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });

      chartRef.current = chart;
      candlestickSeriesRef.current = candlestickSeries;
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
      }
    };
  }, []);

  // Update chart data
  useEffect(() => {
    if (chartData && candlestickSeriesRef.current) {
      const candlestickData: CandlestickData[] = chartData.data.map(item => ({
        time: (item.timestamp / 1000) as any,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      candlestickSeriesRef.current.setData(candlestickData);

      // Fit content
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [chartData]);

  const loadChartData = async (symbol: string, tf: typeof timeframe) => {
    try {
      const data = await fetchStockChartData(symbol, tf);
      if (data) {
        setChartData(data);
      }
    } catch (error) {
      console.error('Failed to load chart data:', error);
    }
  };

  const handleStockSelect = async (symbol: string) => {
    try {
      const details = await fetchStockDetails(symbol);
      if (details) {
        setSelectedStock(details);
        setStockDetails(details);
        setSearchQuery('');
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error('Failed to load stock details:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      try {
        const results = await searchStocks(query);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search failed:', error);
      }
    } else {
      setShowSearchResults(false);
    }
  };

  const handleTrade = async () => {
    if (!selectedStock || !quantity || !user) return;

    const qty = parseFloat(quantity);
    const price = selectedStock.current_price;
    const total = qty * price;

    try {
      // Check balance for buy orders
      if (tradeType === 'buy' && total > (user.balance || 0)) {
        showAlert('error', t('alerts.insufficientBalanceTitle', { defaultValue: 'Insufficient Balance' }), t('alerts.insufficientBalanceMessage', { defaultValue: 'You do not have enough balance for this trade.' }));
        return;
      }

      // Process the trade
      let newBalance = user.balance || 0;
      if (tradeType === 'buy') {
        newBalance -= total;
      } else {
        newBalance += total;
      }

      // Update user balance and increment completed trades
      const currentCompletedTrades = user.completedTrades || 0;
      const newCompletedTrades = currentCompletedTrades + 1;

      await supabaseDb.updateUser(user.idnum || '', {
        balance: newBalance,
        completedTrades: newCompletedTrades
      });

      // Check for bonus conversion (after 5 completed trades)
      let bonusConverted = false;
      let bonusToBalance = 0;
      if (newCompletedTrades >= 5 && (user.bonus || 0) > 0) {
        bonusToBalance = user.bonus || 0;
        newBalance += bonusToBalance;

        // Convert bonus to balance and reset bonus
        await supabaseDb.updateUser(user.idnum || '', {
          balance: newBalance,
          bonus: 0
        });

        bonusConverted = true;
      }

      // User state will be updated via database refresh
      // setUser({
      //   ...user,
      //   balance: newBalance,
      //   completedTrades: newCompletedTrades,
      //   bonus: bonusConverted ? 0 : user.bonus
      // });

      // Show success message
      let successMessage = t('alerts.orderPlacedMessage', { orderType: tradeType.toUpperCase(), qty, symbol: selectedStock.symbol, price: price.toFixed(2), total: total.toFixed(2) });
      if (bonusConverted) {
        successMessage += ` ${t('alerts.bonusConverted', { defaultValue: 'Bonus of ${{bonusToBalance}} has been converted to your available balance!', bonusToBalance: bonusToBalance.toFixed(2) })}`;
      }

      showAlert('success', t('alerts.orderPlacedTitle', { defaultValue: 'Order Placed' }), successMessage);

      // Reset form
      setQuantity('');

    } catch (error) {
      console.error('Trade processing error:', error);
      showAlert('error', t('alerts.tradeFailedTitle', { defaultValue: 'Trade Failed' }), t('alerts.tradeFailedMessage', { defaultValue: 'Failed to process your trade. Please try again.' }));
    }
  };

  // Alert functions
  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setModalAlert({ show: true, type, title, message });
    setTimeout(() => setModalAlert((prev) => ({ ...prev, show: false })), 5000);
  };

  const closeAlert = () => {
    setModalAlert({ ...modalAlert, show: false });
  };

  if (loading) {
    return (
      <div className="stock-trading" style={{
        padding: window.innerWidth <= 768 ? '1rem' : '2rem',
        color: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: window.innerWidth <= 768 ? '2rem 1rem' : '2rem'
        }}>
          <i className="icofont-spinner icofont-spin" style={{
            fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem',
            color: '#f59e0b'
          }}></i>
          <p style={{
            fontSize: window.innerWidth <= 768 ? '0.875rem' : '1rem'
          }}>Loading stock market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-trading" style={{
      padding: window.innerWidth <= 768 ? '1rem' : '2rem',
      color: '#f8fafc',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ marginBottom: window.innerWidth <= 768 ? '1.5rem' : '2rem' }}>
        <h1 style={{
          color: '#f8fafc',
          fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          <i className="icofont-chart-line" style={{ marginRight: '0.5rem', color: '#f59e0b' }}></i>
          {t('pages.stockTrading.title')}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: window.innerWidth <= 768 ? '0.875rem' : '1rem' }}>
          {t('pages.stockTrading.description')}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 400px',
        gap: window.innerWidth <= 768 ? '1.5rem' : '2rem'
      }}>
        {/* Main Content */}
        <div>
          {/* Stock Search */}
          <div style={{ marginBottom: '2rem', position: 'relative' }}>
            <div style={{ display: 'flex', gap: window.innerWidth <= 768 ? '0.75rem' : '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder={window.innerWidth <= 768 ? "Search stocks..." : "Search stocks (e.g., AAPL, Apple)..."}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: window.innerWidth <= 768 ? '0.625rem 0.875rem' : '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#f8fafc',
                    fontSize: window.innerWidth <= 768 ? '0.875rem' : '0.875rem'
                  }}
                />
                {showSearchResults && searchResults.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    marginTop: '0.25rem'
                  }}>
                    {searchResults.map((stock) => (
                      <div
                        key={stock.symbol}
                        onClick={() => handleStockSelect(stock.symbol)}
                        style={{
                          padding: '0.75rem 1rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <div style={{ fontWeight: '600', color: '#f8fafc' }}>{stock.symbol}</div>
                        <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{stock.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Popular Stocks */}
            <div>
              <h3 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Popular Stocks</h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: window.innerWidth <= 768 ? '0.375rem' : '0.5rem'
              }}>
                {POPULAR_STOCKS.slice(0, 8).map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleStockSelect(stock.symbol)}
                    style={{
                      padding: window.innerWidth <= 768 ? '0.375rem 0.75rem' : '0.5rem 1rem',
                      borderRadius: '20px',
                      border: selectedStock?.symbol === stock.symbol ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                      background: selectedStock?.symbol === stock.symbol ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      fontSize: window.innerWidth <= 768 ? '0.75rem' : '0.875rem',
                      fontWeight: selectedStock?.symbol === stock.symbol ? '600' : 'normal'
                    }}
                  >
                    {stock.symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Details */}
          {stockDetails && (
            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid rgba(245,158,11,0.2)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: window.innerWidth <= 768 ? 'flex-start' : 'flex-start',
                flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
                gap: window.innerWidth <= 480 ? '1rem' : '0',
                marginBottom: '1rem'
              }}>
                <div style={{ flex: window.innerWidth <= 480 ? '1' : '1' }}>
                  <h2 style={{
                    color: '#f8fafc',
                    fontSize: window.innerWidth <= 768 ? '1.25rem' : '1.5rem',
                    fontWeight: 'bold',
                    margin: 0
                  }}>
                    {stockDetails.name} ({stockDetails.symbol})
                  </h2>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '0.5rem',
                    flexWrap: window.innerWidth <= 480 ? 'wrap' : 'nowrap'
                  }}>
                    <span style={{
                      fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem',
                      fontWeight: 'bold',
                      color: '#f8fafc'
                    }}>
                      {formatStockPrice(stockDetails.current_price)}
                    </span>
                    <span style={{
                      color: stockDetails.change >= 0 ? '#10b981' : '#ef4444',
                      fontWeight: '600',
                      fontSize: window.innerWidth <= 768 ? '1rem' : '1.125rem'
                    }}>
                      {stockDetails.change >= 0 ? '+' : ''}{formatStockPrice(stockDetails.change)}
                      ({stockDetails.change_percent >= 0 ? '+' : ''}{stockDetails.change_percent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <div style={{
                  textAlign: window.innerWidth <= 480 ? 'left' : 'right',
                  marginTop: window.innerWidth <= 480 ? '0' : '0'
                }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Volume</div>
                  <div style={{ color: '#f8fafc', fontWeight: '600' }}>{stockDetails.volume?.toLocaleString() || 'N/A'}</div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem'
              }}>
                {stockDetails.market_cap && (
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Market Cap</div>
                    <div style={{ color: '#f8fafc', fontWeight: '600' }}>{formatMarketCap(stockDetails.market_cap)}</div>
                  </div>
                )}
                {stockDetails.pe_ratio && (
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>P/E Ratio</div>
                    <div style={{ color: '#f8fafc', fontWeight: '600' }}>{stockDetails.pe_ratio.toFixed(2)}</div>
                  </div>
                )}
                {stockDetails.dividend_yield && (
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Dividend Yield</div>
                    <div style={{ color: '#f8fafc', fontWeight: '600' }}>{(stockDetails.dividend_yield * 100).toFixed(2)}%</div>
                  </div>
                )}
                {stockDetails.high_52w && (
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>52W High</div>
                    <div style={{ color: '#f8fafc', fontWeight: '600' }}>{formatStockPrice(stockDetails.high_52w)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chart */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(245,158,11,0.2)',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
              gap: window.innerWidth <= 768 ? '1rem' : '0'
            }}>
              <h3 style={{
                color: '#f8fafc',
                fontSize: window.innerWidth <= 768 ? '1.125rem' : '1.25rem',
                fontWeight: '600',
                margin: 0
              }}>
                Price Chart - {selectedStock?.symbol || 'AAPL'}
              </h3>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: window.innerWidth <= 768 ? 'wrap' : 'nowrap'
              }}>
                {(['1D', '1W', '1M', '3M', '6M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    style={{
                      padding: window.innerWidth <= 768 ? '0.4rem 0.8rem' : '0.5rem 1rem',
                      borderRadius: '6px',
                      border: timeframe === tf ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                      background: timeframe === tf ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      fontSize: window.innerWidth <= 768 ? '0.75rem' : '0.875rem',
                      fontWeight: timeframe === tf ? '600' : 'normal'
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div ref={chartContainerRef} style={{
              width: '100%',
              height: window.innerWidth <= 768 ? '300px' : '400px'
            }} />
          </div>
        </div>

        {/* Trading Panel */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '12px',
          padding: window.innerWidth <= 768 ? '1.25rem' : '1.5rem',
          border: '1px solid rgba(245,158,11,0.2)',
          height: 'fit-content',
          width: window.innerWidth <= 768 ? '100%' : '400px'
        }}>
          <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            <i className="icofont-exchange" style={{ marginRight: '0.5rem', color: '#f59e0b' }}></i>
            Trade {selectedStock?.symbol || 'AAPL'}
          </h3>

          {/* Trade Type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                onClick={() => setTradeType('buy')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: tradeType === 'buy' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                  background: tradeType === 'buy' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                  color: tradeType === 'buy' ? '#10b981' : '#f8fafc',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Buy
              </button>
              <button
                onClick={() => setTradeType('sell')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: tradeType === 'sell' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                  background: tradeType === 'sell' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                  color: tradeType === 'sell' ? '#ef4444' : '#f8fafc',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Sell
              </button>
            </div>
          </div>

          {/* Order Type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#f8fafc', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Order Type
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setOrderType('market')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: orderType === 'market' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                  background: orderType === 'market' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Market
              </button>
              <button
                onClick={() => setOrderType('limit')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: orderType === 'limit' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                  background: orderType === 'limit' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Limit
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#f8fafc', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Quantity (Shares)
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              min="1"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#f8fafc',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Limit Price */}
          {orderType === 'limit' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#f8fafc', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Limit Price ($)
              </label>
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="Enter limit price"
                min="0.01"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#f8fafc',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          )}

          {/* Order Summary */}
          {quantity && selectedStock && (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Order Summary
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#94a3b8' }}>Quantity:</span>
                <span style={{ color: '#f8fafc' }}>{parseFloat(quantity) || 0} shares</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#94a3b8' }}>Price:</span>
                <span style={{ color: '#f8fafc' }}>{formatStockPrice(selectedStock.current_price)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                <span style={{ color: '#f8fafc' }}>Total:</span>
                <span style={{ color: tradeType === 'buy' ? '#10b981' : '#ef4444' }}>
                  {formatStockPrice((parseFloat(quantity) || 0) * selectedStock.current_price)}
                </span>
              </div>
            </div>
          )}

          {/* Trade Button */}
          <button
            onClick={handleTrade}
            disabled={!quantity || !selectedStock}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '8px',
              border: 'none',
              background: tradeType === 'buy'
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: (!quantity || !selectedStock) ? 'not-allowed' : 'pointer',
              opacity: (!quantity || !selectedStock) ? 0.5 : 1
            }}
          >
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedStock?.symbol || 'Stock'}
          </button>
        </div>
      </div>

      {/* Modal Alert */}
      {modalAlert.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            background: modalAlert.type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' :
                       modalAlert.type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' :
                       modalAlert.type === 'warning' ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' :
                       'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            boxShadow: modalAlert.type === 'success' ? '0 8px 20px rgba(16,185,129,0.3)' :
                      modalAlert.type === 'error' ? '0 8px 20px rgba(239,68,68,0.3)' :
                      modalAlert.type === 'warning' ? '0 8px 20px rgba(245,158,11,0.3)' :
                      '0 8px 20px rgba(59,130,246,0.3)',
            position: 'relative'
          }}>
            <button
              onClick={closeAlert}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              ×
            </button>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              color: '#ffffff'
            }}>
              <i className={
                modalAlert.type === 'success' ? 'icofont-check-circled' :
                modalAlert.type === 'error' ? 'icofont-close-circled' :
                modalAlert.type === 'warning' ? 'icofont-warning' :
                'icofont-info-circle'
              }></i>
            </div>
            <h3 style={{
              color: '#ffffff',
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              {modalAlert.title}
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '1rem',
              lineHeight: '1.5',
              marginBottom: '1.5rem'
            }}>
              {modalAlert.message}
            </p>
            <button
              onClick={closeAlert}
              style={{
                padding: '0.75rem 2rem',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockTrading;