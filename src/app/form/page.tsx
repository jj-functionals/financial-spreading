'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingUp, FileText, Download, Save } from 'lucide-react';

export default function FinancialSpreadingTable() {
  const [activeTab, setActiveTab] = useState('balance-sheet');

  const [data, setData] = useState({
    balanceSheet: {
      assets: {
        'Cash & Equivalents': ['', '', ''],
        'Accounts Receivable': ['', '', ''],
        'Inventory': ['', '', ''],
        'Prepaid Expenses': ['', '', ''],
        'Property & Equipment': ['', '', ''],
        'Accumulated Depreciation': ['', '', ''],
        'Intangible Assets': ['', '', ''],
      },
      liabilities: {
        'Accounts Payable': ['', '', ''],
        'Short-term Debt': ['', '', ''],
        'Current Portion LTD': ['', '', ''],
        'Long-term Debt': ['', '', ''],
        'Deferred Revenue': ['', '', ''],
      },
      equity: {
        'Common Stock': ['', '', ''],
        'Retained Earnings': ['', '', ''],
      }
    },
    incomeStatement: {
      revenue: {
        'Product Sales': ['', '', ''],
        'Service Revenue': ['', '', ''],
        'Other Income': ['', '', ''],
      },
      expenses: {
        'Cost of Goods Sold': ['', '', ''],
        'Operating Expenses': ['', '', ''],
        'Interest Expense': ['', '', ''],
        'Depreciation': ['', '', ''],
        'Income Tax': ['', '', ''],
      }
    }
  });

  const periods = ['2022', '2023', '2024'];

  const updateValue = (category: string, subcategory: string, item: string, periodIndex: number, value: string) => {
    setData(prev => {
      const categoryData = prev[category as keyof typeof prev] as any;
      const subcategoryData = categoryData[subcategory] as any;
      const itemData = subcategoryData[item] as (string | number)[];
      
      return {
        ...prev,
        [category]: {
          ...categoryData,
          [subcategory]: {
            ...subcategoryData,
            [item]: itemData.map((v, i) => 
              i === periodIndex ? (value === '' ? '' : parseFloat(value) || 0) : v
            )
          }
        }
      };
    });
  };

  const calculateTotal = (items: Record<string, string[] | number[]>) => {
    return periods.map((_, periodIndex) => 
      Object.values(items).reduce((sum, values) => {
        const value = values[periodIndex];
        const numValue = typeof value === 'string' ? (value === '' ? 0 : parseFloat(value) || 0) : (value || 0);
        return sum + numValue;
      }, 0)
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateRatios = () => {
    const totalAssets = calculateTotal(data.balanceSheet.assets);
    const totalLiabilities = calculateTotal(data.balanceSheet.liabilities);
    const totalRevenue = calculateTotal(data.incomeStatement.revenue);
    const totalExpenses = calculateTotal(data.incomeStatement.expenses);
    const netIncome = totalRevenue.map((rev, i) => rev - totalExpenses[i]);
    
    return {
      currentRatio: totalAssets.map((assets, i) => {
        const liab = totalLiabilities[i];
        return liab === 0 ? '0.00' : (assets / liab).toFixed(2);
      }),
      debtToEquity: totalLiabilities.map((liab, i) => {
        const equity = calculateTotal(data.balanceSheet.equity)[i];
        return equity === 0 ? '0.00' : (liab / equity).toFixed(2);
      }),
      profitMargin: netIncome.map((ni, i) => {
        const rev = totalRevenue[i];
        return rev === 0 ? '0.0%' : ((ni / rev) * 100).toFixed(1) + '%';
      }),
      roa: netIncome.map((ni, i) => {
        const assets = totalAssets[i];
        return assets === 0 ? '0.0%' : ((ni / assets) * 100).toFixed(1) + '%';
      }),
    };
  };

  const renderSection = (title: string, items: Record<string, string[] | number[]>, category: string, subcategory: string) => {
    const totals = calculateTotal(items);
    
    return (
      <div className="mb-8 animate-[slideUp_0.6s_ease-out]">
        <div className="text-xl font-semibold text-gray-100 mb-4 py-3 px-6 bg-gradient-to-r from-cyan-400/10 to-transparent border-l-4 border-cyan-400 rounded">
          {title}
        </div>
        {Object.entries(items).map(([item, values]) => (
          <div key={item} className="grid grid-cols-[2fr_repeat(3,1fr)] gap-4 py-3 px-6 border-b border-white/5 hover:bg-white/5 transition-colors">
            <div className="text-gray-300 text-sm flex items-center">
              {item}
            </div>
            {values.map((value, i) => (
              <input
                key={i}
                type="text"
                className="font-mono text-sm font-medium bg-white/5 border border-white/10 rounded-md px-3 py-2 text-gray-100 text-right focus:outline-none focus:border-cyan-400 focus:bg-cyan-400/5 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                value={value === '' ? '' : (value === 0 ? '0' : Number(value).toLocaleString())}
                onChange={(e) => {
                  const numValue = e.target.value.replace(/,/g, '');
                  updateValue(category, subcategory, item, i, numValue);
                }}
              />
            ))}
          </div>
        ))}
        <div className="grid grid-cols-[2fr_repeat(3,1fr)] gap-4 py-4 px-6 mt-2 bg-gradient-to-r from-purple-500/10 via-cyan-400/10 to-transparent rounded-lg border border-purple-500/20">
          <div className="font-semibold text-gray-100 text-base">
            Total {title}
          </div>
          {totals.map((total, i) => (
            <div key={i} className="font-mono text-base font-semibold text-cyan-400 text-right">
              {formatCurrency(total)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ratios = calculateRatios();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1419] p-8 text-gray-200 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(76,201,240,0.03)_0%,transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(157,78,221,0.03)_0%,transparent_50%)]" />
      </div>

      <div className="max-w-[1400px] mx-auto mb-10 relative z-10 animate-[slideDown_0.6s_ease-out]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-[0_8px_32px_rgba(76,201,240,0.3)]">
              <FileText size={28} color="#0a0e27" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Financial Spreading
              </h1>
              <p className="text-sm text-gray-400 mt-1 tracking-wide">
                Comprehensive Loan Analysis & Credit Assessment
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-200 text-sm font-medium cursor-pointer flex items-center gap-2 transition-all hover:bg-cyan-400/15 hover:border-cyan-400/30 hover:-translate-y-0.5 backdrop-blur-sm">
              <Download size={18} />
              Export
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 border-none rounded-lg text-white text-sm font-medium cursor-pointer flex items-center gap-2 transition-all hover:shadow-[0_6px_24px_rgba(76,201,240,0.4)] shadow-[0_4px_16px_rgba(76,201,240,0.3)]">
              <Save size={18} />
              Save Analysis
            </button>
          </div>
        </div>
        
        <div className="flex gap-2 border-b border-white/10 pb-2">
          <button 
            className={`px-6 py-3 rounded-md text-sm font-medium cursor-pointer transition-all relative ${
              activeTab === 'balance-sheet' 
                ? 'text-cyan-400 bg-cyan-400/10' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
            onClick={() => setActiveTab('balance-sheet')}
          >
            Balance Sheet
            {activeTab === 'balance-sheet' && (
              <span className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            )}
          </button>
          <button 
            className={`px-6 py-3 rounded-md text-sm font-medium cursor-pointer transition-all relative ${
              activeTab === 'income-statement' 
                ? 'text-cyan-400 bg-cyan-400/10' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
            onClick={() => setActiveTab('income-statement')}
          >
            Income Statement
            {activeTab === 'income-statement' && (
              <span className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            )}
          </button>
          <button 
            className={`px-6 py-3 rounded-md text-sm font-medium cursor-pointer transition-all relative ${
              activeTab === 'ratios' 
                ? 'text-cyan-400 bg-cyan-400/10' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
            onClick={() => setActiveTab('ratios')}
          >
            Financial Ratios
            {activeTab === 'ratios' && (
              <span className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            )}
          </button>
        </div>
      </div>
      
      <div className="max-w-[1400px] mx-auto bg-[rgba(18,22,36,0.6)] rounded-2xl p-8 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative z-10 animate-[fadeIn_0.8s_ease-out_0.2s_both]">
        {activeTab === 'balance-sheet' && (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[2fr_repeat(3,1fr)] gap-4 py-4 px-6 bg-cyan-400/5 rounded-lg mb-6 border border-cyan-400/10">
              <div className="text-lg font-semibold text-gray-100">Line Item</div>
              {periods.map(period => (
                <div key={period} className="text-lg font-semibold text-cyan-400 text-right">
                  FY {period}
                </div>
              ))}
            </div>
            
            {renderSection('Assets', data.balanceSheet.assets, 'balanceSheet', 'assets')}
            {renderSection('Liabilities', data.balanceSheet.liabilities, 'balanceSheet', 'liabilities')}
            {renderSection('Equity', data.balanceSheet.equity, 'balanceSheet', 'equity')}
            
            <div className="grid grid-cols-[2fr_repeat(3,1fr)] gap-4 py-4 px-6 mt-8 bg-gradient-to-r from-cyan-400/15 to-purple-500/15 rounded-lg border border-cyan-400/30">
              <div className="font-semibold text-gray-100 text-base">Net Worth</div>
              {periods.map((_, i) => {
                const totalAssets = calculateTotal(data.balanceSheet.assets)[i];
                const totalLiabilities = calculateTotal(data.balanceSheet.liabilities)[i];
                const netWorth = totalAssets - totalLiabilities;
                return (
                  <div key={i} className="font-mono text-base font-semibold text-cyan-400 text-right">
                    {formatCurrency(netWorth)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {activeTab === 'income-statement' && (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[2fr_repeat(3,1fr)] gap-4 py-4 px-6 bg-cyan-400/5 rounded-lg mb-6 border border-cyan-400/10">
              <div className="text-lg font-semibold text-gray-100">Line Item</div>
              {periods.map(period => (
                <div key={period} className="text-lg font-semibold text-cyan-400 text-right">
                  FY {period}
                </div>
              ))}
            </div>
            
            {renderSection('Revenue', data.incomeStatement.revenue, 'incomeStatement', 'revenue')}
            {renderSection('Expenses', data.incomeStatement.expenses, 'incomeStatement', 'expenses')}
            
            <div className="grid grid-cols-[2fr_repeat(3,1fr)] gap-4 py-4 px-6 mt-8 bg-gradient-to-r from-cyan-400/15 to-purple-500/15 rounded-lg border border-cyan-400/30">
              <div className="font-semibold text-gray-100 text-base">Net Income</div>
              {periods.map((_, i) => {
                const totalRevenue = calculateTotal(data.incomeStatement.revenue)[i];
                const totalExpenses = calculateTotal(data.incomeStatement.expenses)[i];
                const netIncome = totalRevenue - totalExpenses;
                return (
                  <div key={i} className="font-mono text-base font-semibold text-cyan-400 text-right">
                    {formatCurrency(netIncome)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {activeTab === 'ratios' && (
          <div className="mt-10 p-8 bg-gradient-to-br from-purple-500/10 to-cyan-400/10 rounded-xl border border-purple-500/20">
            <div className="text-2xl font-semibold text-gray-100 mb-6 flex items-center gap-3">
              <TrendingUp size={24} color="#4cc9f0" />
              Key Financial Ratios & Metrics
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[rgba(18,22,36,0.6)] p-6 rounded-lg border border-white/10">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Current Ratio</div>
                <div className="flex justify-between gap-4">
                  {ratios.currentRatio.map((ratio, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs text-gray-400 mb-1">{periods[i]}</div>
                      <div className="font-mono text-xl font-semibold text-cyan-400">{ratio}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[rgba(18,22,36,0.6)] p-6 rounded-lg border border-white/10">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Debt-to-Equity</div>
                <div className="flex justify-between gap-4">
                  {ratios.debtToEquity.map((ratio, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs text-gray-400 mb-1">{periods[i]}</div>
                      <div className="font-mono text-xl font-semibold text-cyan-400">{ratio}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[rgba(18,22,36,0.6)] p-6 rounded-lg border border-white/10">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Profit Margin</div>
                <div className="flex justify-between gap-4">
                  {ratios.profitMargin.map((ratio, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs text-gray-400 mb-1">{periods[i]}</div>
                      <div className="font-mono text-xl font-semibold text-cyan-400">{ratio}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[rgba(18,22,36,0.6)] p-6 rounded-lg border border-white/10">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Return on Assets</div>
                <div className="flex justify-between gap-4">
                  {ratios.roa.map((ratio, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs text-gray-400 mb-1">{periods[i]}</div>
                      <div className="font-mono text-xl font-semibold text-cyan-400">{ratio}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

