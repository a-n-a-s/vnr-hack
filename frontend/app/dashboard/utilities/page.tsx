'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinancialStore } from '@/store/financialStore';
import { useAuthStore } from '@/store/authStore';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Shield,
  CreditCard,
  Landmark,
  DollarSign,
  BarChart3,
  RotateCcw
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { FinancialSummaryCard, AnomalyDetectionCard, MetricDisplay } from '@/components/financial';

const UtilitiesPage = () => {
  const { financialData, loading, error, fetchFinancialData } = useFinancialStore();
  const { user } = useAuthStore();
  const [simulationParams, setSimulationParams] = useState({
    years: 10,
    mfGrowthRate: 0.10,
    stocksGrowthRate: 0.12,
    additionalMonthlyInvestment: 5000,
    loanPrepayment: 0
  });
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('simulation');
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // For step-by-step flow
  const [anomalyData, setAnomalyData] = useState<any>(null);
  const [isAnomalyDetectionRunning, setIsAnomalyDetectionRunning] = useState(false);
  const [anomalyError, setAnomalyError] = useState<string | null>(null);

  // Fetch financial data when user is available
  useEffect(() => {
    if (user && !financialData && !loading) {
      fetchFinancialData(user.id);
    }
  }, [user, financialData, loading, fetchFinancialData]);

  // Calculate financial metrics when data is available
  useEffect(() => {
    if (financialData) {
      calculateSimulations();
    }
  }, [financialData, simulationParams]);

  const calculateSimulations = () => {
    if (!financialData?.financial_data) return;

    setIsCalculating(true);
    
    // Use setTimeout to allow UI to update before calculations
    setTimeout(() => {
      const data = financialData.financial_data;

      // Step 1: Net Worth Calculation
      const bankBalance = data.banks?.reduce((sum, bank) => 
        sum + (typeof bank.balance === 'number' ? bank.balance : 
              !isNaN(parseFloat(bank.balance)) ? parseFloat(bank.balance) : 0), 0) || 0;

      const mfValue = data.mutualFunds?.reduce((sum, fund) => 
        sum + (typeof fund.nav === 'number' && typeof fund.units === 'number' ? 
              fund.nav * fund.units : 
              !isNaN(parseFloat(fund.nav)) && !isNaN(parseFloat(fund.units)) ? 
              parseFloat(fund.nav) * parseFloat(fund.units) : 0), 0) || 0;

      const stocksValue = data.stocks?.reduce((sum, stock) => 
        sum + (typeof stock.quantity === 'number' && typeof stock.currentPrice === 'number' ? 
              stock.quantity * stock.currentPrice : 
              !isNaN(parseFloat(stock.quantity)) && !isNaN(parseFloat(stock.currentPrice)) ? 
              parseFloat(stock.quantity) * parseFloat(stock.currentPrice) : 0), 0) || 0;

      const loanOutstanding = data.loans?.reduce((sum, loan) => 
        sum + (typeof loan.outstandingAmount === 'number' ? loan.outstandingAmount : 
              !isNaN(parseFloat(loan.outstandingAmount)) ? parseFloat(loan.outstandingAmount) : 0), 0) || 0;

      const netWorth = bankBalance + mfValue + stocksValue - loanOutstanding;

      // Step 2: Cash Flow Summary
      let debitTotal = 0, creditTotal = 0;
      data.banks?.forEach(bank => {
        bank.transactions?.forEach(txn => {
          const amt = typeof txn.amount === 'number' ? txn.amount : 
                     !isNaN(parseFloat(txn.amount)) ? parseFloat(txn.amount) : 0;
          if (txn.type === 'debit') {
            debitTotal += amt;
          } else if (txn.type === 'credit') {
            creditTotal += amt;
          }
        });
      });

      const monthlyIncome = creditTotal / 6;  // assuming 6 months data
      const monthlyExpense = debitTotal / 6;
      const emiTotal = data.loans?.reduce((sum, loan) => 
        sum + (typeof loan.monthlyEMI === 'number' ? loan.monthlyEMI : 
              !isNaN(parseFloat(loan.monthlyEMI)) ? parseFloat(loan.monthlyEMI) : 0), 0) || 0;

      const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100 : 0;

      // Step 3: Investment Allocation
      const allocation = {
        'Mutual Funds': mfValue,
        'Stocks': stocksValue,
        'Cash': bankBalance
      };

      // Step 4: Insurance Summary
      const lifeCover = data.insurance?.reduce((sum, ins) => 
        ins.type === 'life' ? 
        sum + (typeof ins.coverageAmount === 'number' ? ins.coverageAmount : 
              !isNaN(parseFloat(ins.coverageAmount)) ? parseFloat(ins.coverageAmount) : 0) : 
        sum, 0) || 0;

      const healthCover = data.insurance?.reduce((sum, ins) => 
        ins.type === 'health' ? 
        sum + (typeof ins.coverageAmount === 'number' ? ins.coverageAmount : 
              !isNaN(parseFloat(ins.coverageAmount)) ? parseFloat(ins.coverageAmount) : 0) : 
        sum, 0) || 0;

      // Step 5: Loan & DTI
      const monthlyDTI = monthlyIncome > 0 ? (emiTotal / monthlyIncome) * 100 : 0;

      // Step 6: Simulation Function
      const simulateWealth = (years: number, mfRate: number, stockRate: number, monthlyInvest: number, prepay: number) => {
        const mfProj = [mfValue];
        const stockProj = [stocksValue];
        const netWorthProj = [netWorth];

        let mf = mfValue;
        let stock = stocksValue;
        let loan = loanOutstanding - prepay;

        for (let i = 1; i <= years; i++) {
          mf += (mf * mfRate) + (monthlyInvest * 12 * 0.6);
          stock += (stock * stockRate) + (monthlyInvest * 12 * 0.4);
          loan = Math.max(0, loan - emiTotal * 12);  // basic payoff

          const currentNW = bankBalance + mf + stock - loan;
          mfProj.push(mf);
          stockProj.push(stock);
          netWorthProj.push(currentNW);
        }

        return { netWorthProj, mfProj, stockProj };
      };

      // Step 7: Run Simulation
      const { netWorthProj, mfProj, stockProj } = simulateWealth(
        simulationParams.years,
        simulationParams.mfGrowthRate,
        simulationParams.stocksGrowthRate,
        simulationParams.additionalMonthlyInvestment,
        simulationParams.loanPrepayment
      );

      setSimulationResults({
        netWorth,
        bankBalance,
        mfValue,
        stocksValue,
        loanOutstanding,
        monthlyIncome,
        monthlyExpense,
        emiTotal,
        savingsRate,
        monthlyDTI,
        lifeCover,
        healthCover,
        allocation,
        projection: {
          years: Array.from({ length: simulationParams.years + 1 }, (_, i) => i),
          netWorth: netWorthProj,
          mf: mfProj,
          stock: stockProj
        }
      });
      
      setIsCalculating(false);
    }, 300); // Small delay to allow UI to update
  };

  const runAnomalyDetection = async () => {
    setIsAnomalyDetectionRunning(true);
    setAnomalyError(null);
    
    try {
      // Call backend anomaly detection API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/anomalies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Anomaly detection failed: ${response.status} ${response.statusText}`);
      }

      const anomalyResults = await response.json();
      setAnomalyData(anomalyResults);
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      setAnomalyError(error instanceof Error ? error.message : 'An error occurred during anomaly detection');
    } finally {
      setIsAnomalyDetectionRunning(false);
    }
  };

  const handleParamChange = (field: string, value: number) => {
    setSimulationParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetToDefaults = () => {
    setSimulationParams({
      years: 10,
      mfGrowthRate: 0.10,
      stocksGrowthRate: 0.12,
      additionalMonthlyInvestment: 5000,
      loanPrepayment: 0
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900">Financial Utilities</h1>
          <p className="text-gray-600 mt-2">Advanced financial analysis and projections</p>
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mt-6">
            <button
              className={`py-3 px-6 font-medium text-sm rounded-t-lg ${
                activeTab === 'simulation' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('simulation')}
            >
              📊 Financial Simulation
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm rounded-t-lg ${
                activeTab === 'anomaly' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('anomaly')}
            >
              🔍 Anomaly Detection
            </button>
          </div>
        </motion.div>
        
        {/* Conditional Rendering Based on Active Tab */}
        {activeTab === 'simulation' ? (
          <>
            {/* Rest of simulation content remains unchanged */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`mb-12 ${currentStep !== 1 ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-3">1️⃣</div>
                <h2 className="text-3xl font-bold text-gray-800">Current Financial Status</h2>
                <button 
                  className={`ml-auto px-4 py-2 text-base rounded-lg ${
                    currentStep === 1 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setCurrentStep(1)}
                >
                  {currentStep === 1 ? 'Current' : 'View'}
                </button>
              </div>
              
              {simulationResults && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <MetricDisplay
                      title="Net Worth"
                      icon={DollarSign}
                      value={simulationResults.netWorth}
                      borderColor="border-blue-500"
                      iconColor="text-blue-500"
                    />
                    
                    <MetricDisplay
                      title="Bank Balance"
                      icon={Landmark}
                      value={simulationResults.bankBalance}
                      borderColor="border-green-500"
                      iconColor="text-green-500"
                    />
                    
                    <MetricDisplay
                      title="Mutual Funds Value"
                      icon={BarChart3}
                      value={simulationResults.mfValue}
                      borderColor="border-purple-500"
                      iconColor="text-purple-500"
                    />
                    
                    <MetricDisplay
                      title="Stock Holdings Value"
                      icon={TrendingUp}
                      value={simulationResults.stocksValue}
                      borderColor="border-indigo-500"
                      iconColor="text-indigo-500"
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <MetricDisplay
                      title="Loan Outstanding"
                      icon={CreditCard}
                      value={simulationResults.loanOutstanding}
                      borderColor="border-red-500"
                      iconColor="text-red-500"
                    />
                    
                    <MetricDisplay
                      title="Monthly Income"
                      icon={TrendingUp}
                      value={simulationResults.monthlyIncome}
                      borderColor="border-yellow-500"
                      iconColor="text-yellow-600"
                    />
                    
                    <MetricDisplay
                      title="Monthly Expenses"
                      icon={TrendingDown}
                      value={simulationResults.monthlyExpense}
                      borderColor="border-amber-500"
                      iconColor="text-amber-600"
                    />
                    
                    <MetricDisplay
                      title="Monthly EMI"
                      icon={CreditCard}
                      value={simulationResults.emiTotal}
                      borderColor="border-orange-500"
                      iconColor="text-orange-500"
                    />
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* Step 2: Run Monte Carlo (initial forecast) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`mb-12 ${currentStep !== 2 ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-3">2️⃣</div>
                <h2 className="text-3xl font-bold text-gray-800">Initial Forecast (Monte Carlo)</h2>
                <button 
                  className={`ml-auto px-4 py-2 text-base rounded-lg ${
                    currentStep === 2 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setCurrentStep(2)}
                >
                  {currentStep === 2 ? 'Current' : 'View'}
                </button>
              </div>
              
              {isCalculating && (
                <div className="text-center py-8 bg-white rounded-xl shadow-sm">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                  <p className="text-lg text-gray-600 mt-4">Running Monte Carlo simulation...</p>
                </div>
              )}
              
              {simulationResults && !isCalculating && (
                <Card className="mb-8 p-6">
                  <CardHeader>
                    <CardTitle className="text-2xl">Monte Carlo Simulation Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{
                      netWorth: { label: 'Net Worth', color: 'hsl(222, 70%, 50%)' },
                      mf: { label: 'Mutual Funds', color: 'hsl(217, 91%, 60%)' },
                      stock: { label: 'Stocks', color: 'hsl(142, 76%, 36%)' }
                    }} className="h-96 w-full mb-8">
                      <LineChart
                        data={simulationResults.projection.years.map((year, index) => ({
                          year,
                          netWorth: simulationResults.projection.netWorth[index],
                          mf: simulationResults.projection.mf[index],
                          stock: simulationResults.projection.stock[index]
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="year"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <YAxis 
                          tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <ChartTooltip 
                          cursor={false} 
                          content={<ChartTooltipContent 
                            formatter={(value, name) => [
                              `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                              name === 'netWorth' ? 'Net Worth' : 
                              name === 'mf' ? 'Mutual Funds' : 
                              name === 'stock' ? 'Stocks' : name
                            ]}
                          />} 
                        />
                        <Line
                          dataKey="netWorth"
                          type="monotone"
                          stroke="var(--color-netWorth)"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          dataKey="mf"
                          type="monotone"
                          stroke="var(--color-mf)"
                          strokeWidth={2}
                          strokeDasharray="3 3"
                          dot={false}
                        />
                        <Line
                          dataKey="stock"
                          type="monotone"
                          stroke="var(--color-stock)"
                          strokeWidth={2}
                          strokeDasharray="3 3"
                          dot={false}
                        />
                      </LineChart>
                    </ChartContainer>
                    
                    <div className="p-6 bg-gray-50 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Projection Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <p className="text-gray-600 mb-1">Initial Net Worth</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{simulationResults.netWorth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <p className="text-gray-600 mb-1">Projected in {simulationParams.years} years</p>
                          <p className="text-lg font-semibold text-green-600">
                            ₹{simulationResults.projection.netWorth[simulationResults.projection.netWorth.length - 1].toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <p className="text-gray-600 mb-1">Growth Rate</p>
                          <p className="text-lg font-semibold text-blue-600">
                            {Math.round(
                              ((simulationResults.projection.netWorth[simulationResults.projection.netWorth.length - 1] - simulationResults.netWorth) / 
                              simulationResults.netWorth) * 100
                            )}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
            
            {/* Step 3: Let user change params (form/sliders) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`mb-12 ${currentStep !== 3 ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-3">3️⃣</div>
                <h2 className="text-3xl font-bold text-gray-800">Adjust Parameters</h2>
                <button 
                  className={`ml-auto px-4 py-2 text-base rounded-lg ${
                    currentStep === 3 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setCurrentStep(3)}
                >
                  {currentStep === 3 ? 'Current' : 'View'}
                </button>
              </div>
              
              <Card className="p-6">
                <CardHeader className="flex flex-row items-center justify-between pb-6">
                  <CardTitle className="text-2xl">Simulation Parameters</CardTitle>
                  <button 
                    onClick={resetToDefaults}
                    className="p-3 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="h-5 w-5 text-gray-600" />
                  </button>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <label className="block text-base font-medium text-gray-700 flex justify-between items-center">
                      <span>Years: {simulationParams.years}</span>
                      <span className="text-blue-600 text-lg">{simulationParams.years} years</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={simulationParams.years}
                      onChange={(e) => handleParamChange('years', parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-base font-medium text-gray-700 flex justify-between items-center">
                      <span>MF Growth Rate</span>
                      <span className="text-blue-600 text-lg">{(simulationParams.mfGrowthRate * 100).toFixed(1)}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="0.5"
                      value={simulationParams.mfGrowthRate * 100}
                      onChange={(e) => handleParamChange('mfGrowthRate', parseFloat(e.target.value) / 100)}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-base font-medium text-gray-700 flex justify-between items-center">
                      <span>Stock Growth Rate</span>
                      <span className="text-green-600 text-lg">{(simulationParams.stocksGrowthRate * 100).toFixed(1)}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="0.5"
                      value={simulationParams.stocksGrowthRate * 100}
                      onChange={(e) => handleParamChange('stocksGrowthRate', parseFloat(e.target.value) / 100)}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-base font-medium text-gray-700 flex justify-between items-center">
                      <span>Monthly Investment</span>
                      <span className="text-amber-600 text-lg">₹{simulationParams.additionalMonthlyInvestment.toLocaleString('en-IN')}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={simulationParams.additionalMonthlyInvestment}
                      onChange={(e) => handleParamChange('additionalMonthlyInvestment', parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Step 4: Run custom deterministic simulation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`mb-12 ${currentStep !== 4 ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-3">4️⃣</div>
                <h2 className="text-3xl font-bold text-gray-800">Custom Deterministic Simulation</h2>
                <button 
                  className={`ml-auto px-4 py-2 text-base rounded-lg ${
                    currentStep === 4 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setCurrentStep(4)}
                >
                  {currentStep === 4 ? 'Current' : 'View'}
                </button>
              </div>
              
              <button 
                onClick={() => calculateSimulations()}
                disabled={isCalculating}
                className="w-full py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors mb-8 text-lg font-medium shadow-sm"
              >
                {isCalculating ? 'Running Simulations...' : 'Run Custom Simulation'}
              </button>
              
              {isCalculating && (
                <div className="text-center py-8 bg-white rounded-xl shadow-sm">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                  <p className="text-lg text-gray-600 mt-4">Running custom deterministic simulation...</p>
                </div>
              )}
              
              {simulationResults && !isCalculating && (
                <Card className="mb-8 p-6">
                  <CardHeader>
                    <CardTitle className="text-2xl">Custom Simulation Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{
                      netWorth: { label: 'Net Worth', color: 'hsl(222, 70%, 50%)' },
                      mf: { label: 'Mutual Funds', color: 'hsl(217, 91%, 60%)' },
                      stock: { label: 'Stocks', color: 'hsl(142, 76%, 36%)' }
                    }} className="h-96 w-full mb-8">
                      <LineChart
                        data={simulationResults.projection.years.map((year, index) => ({
                          year,
                          netWorth: simulationResults.projection.netWorth[index],
                          mf: simulationResults.projection.mf[index],
                          stock: simulationResults.projection.stock[index]
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="year"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <YAxis 
                          tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <ChartTooltip 
                          cursor={false} 
                          content={<ChartTooltipContent 
                            formatter={(value, name) => [
                              `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                              name === 'netWorth' ? 'Net Worth' : 
                              name === 'mf' ? 'Mutual Funds' : 
                              name === 'stock' ? 'Stocks' : name
                            ]}
                          />} 
                        />
                        <Line
                          dataKey="netWorth"
                          type="monotone"
                          stroke="var(--color-netWorth)"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          dataKey="mf"
                          type="monotone"
                          stroke="var(--color-mf)"
                          strokeWidth={2}
                          strokeDasharray="3 3"
                          dot={false}
                        />
                        <Line
                          dataKey="stock"
                          type="monotone"
                          stroke="var(--color-stock)"
                          strokeWidth={2}
                          strokeDasharray="3 3"
                          dot={false}
                        />
                      </LineChart>
                    </ChartContainer>
                    
                    <div className="p-6 bg-gray-50 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Custom Projection Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <p className="text-gray-600 mb-1">Initial Net Worth</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{simulationResults.netWorth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <p className="text-gray-600 mb-1">Projected in {simulationParams.years} years</p>
                          <p className="text-lg font-semibold text-green-600">
                            ₹{simulationResults.projection.netWorth[simulationResults.projection.netWorth.length - 1].toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <p className="text-gray-600 mb-1">Growth Rate</p>
                          <p className="text-lg font-semibold text-blue-600">
                            {Math.round(
                              ((simulationResults.projection.netWorth[simulationResults.projection.netWorth.length - 1] - simulationResults.netWorth) / 
                              simulationResults.netWorth) * 100
                            )}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
            
            {/* Step 5: Compare & visualize outcomes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={`mb-12 ${currentStep !== 5 ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-3">5️⃣</div>
                <h2 className="text-3xl font-bold text-gray-800">Compare & Visualize Outcomes</h2>
                <button 
                  className={`ml-auto px-4 py-2 text-base rounded-lg ${
                    currentStep === 5 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setCurrentStep(5)}
                >
                  {currentStep === 5 ? 'Current' : 'View'}
                </button>
              </div>
              
              {simulationResults && (
                <div className="space-y-8">
                  <Card className="p-8">
                    <CardHeader>
                      <CardTitle className="text-2xl">Financial Comparison & Visualization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <FinancialSummaryCard
                          title="💰 Net Worth Comparison"
                          icon={DollarSign}
                          currentValue={simulationResults.netWorth}
                          projectedValue={simulationResults.projection.netWorth[simulationResults.projection.netWorth.length - 1]}
                          growthPercentage={((simulationResults.projection.netWorth[simulationResults.projection.netWorth.length - 1] - simulationResults.netWorth) / simulationResults.netWorth * 100)}
                          borderColor="border-blue-500"
                          iconColor="text-blue-500"
                        />
                        
                        <FinancialSummaryCard
                          title="🏦 Bank Balance"
                          icon={Landmark}
                          currentValue={simulationResults.bankBalance}
                          projectedValue={simulationResults.bankBalance}
                          borderColor="border-green-500"
                          iconColor="text-green-500"
                        />
                        
                        <FinancialSummaryCard
                          title="📈 Mutual Funds Value"
                          icon={BarChart3}
                          currentValue={simulationResults.mfValue}
                          projectedValue={simulationResults.projection.mf[simulationResults.projection.mf.length - 1]}
                          growthPercentage={(((simulationResults.projection.mf[simulationResults.projection.mf.length - 1] - simulationResults.mfValue) / simulationResults.mfValue) * 100)}
                          borderColor="border-purple-500"
                          iconColor="text-purple-500"
                        />
                        
                        <FinancialSummaryCard
                          title="📊 Stock Holdings Value"
                          icon={TrendingUp}
                          currentValue={simulationResults.stocksValue}
                          projectedValue={simulationResults.projection.stock[simulationResults.projection.stock.length - 1]}
                          growthPercentage={(((simulationResults.projection.stock[simulationResults.projection.stock.length - 1] - simulationResults.stocksValue) / simulationResults.stocksValue) * 100)}
                          borderColor="border-indigo-500"
                          iconColor="text-indigo-500"
                        />
                        
                        <FinancialSummaryCard
                          title="💳 Loan Outstanding"
                          icon={CreditCard}
                          currentValue={simulationResults.loanOutstanding}
                          projectedValue={Math.max(0, simulationResults.loanOutstanding - (simulationResults.emiTotal * 12 * simulationParams.years))}
                          borderColor="border-red-500"
                          iconColor="text-red-500"
                        />
                        
                        <FinancialSummaryCard
                          title="💵 Monthly Income"
                          icon={TrendingUp}
                          currentValue={simulationResults.monthlyIncome}
                          borderColor="border-yellow-500"
                          iconColor="text-yellow-600"
                        />
                        
                        <FinancialSummaryCard
                          title="🛍️ Monthly Expenses"
                          icon={TrendingDown}
                          currentValue={simulationResults.monthlyExpense}
                          borderColor="border-amber-500"
                          iconColor="text-amber-600"
                        />
                        
                        <FinancialSummaryCard
                          title="📉 Monthly EMI"
                          icon={CreditCard}
                          currentValue={simulationResults.emiTotal}
                          borderColor="border-orange-500"
                          iconColor="text-orange-500"
                        />
                        
                        <FinancialSummaryCard
                          title="💸 Savings Rate"
                          icon={PiggyBank}
                          currentValue={simulationResults.savingsRate}
                          formatCurrency={false}
                          formatPercentage={true}
                          borderColor="border-pink-500"
                          iconColor="text-pink-500"
                        />
                        
                        <FinancialSummaryCard
                          title="🛡️ Insurance Coverage"
                          icon={Shield}
                          currentValue={simulationResults.lifeCover}
                          projectedValue={simulationResults.healthCover}
                          formatCurrency={false}
                          borderColor="border-cyan-500"
                          iconColor="text-cyan-500"
                        />
                        
                        <FinancialSummaryCard
                          title="⚠️ DTI (Debt to Income Ratio)"
                          icon={CreditCard}
                          currentValue={simulationResults.monthlyDTI}
                          formatCurrency={false}
                          formatPercentage={true}
                          borderColor="border-violet-500"
                          iconColor="text-violet-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
            
            {/* Step Navigation */}
            <div className="flex justify-center space-x-6 mt-12">
              {[1, 2, 3, 4, 5].map((step) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step)}
                  className={`px-6 py-3 rounded-xl text-lg font-medium shadow-sm ${
                    currentStep === step 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Step {step}
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Anomaly Detection Section */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🔍 Anomaly Detection</h2>
              <p className="text-gray-600 mb-8">Detect unusual patterns and outliers in your financial data</p>
              
              {anomalyError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">Error: {anomalyError}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transaction Anomalies Card */}
                <Card className="p-6 border-l-4 border-red-500">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 text-red-500 mr-2" />
                      Transaction Anomalies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">Unusual transactions detected in your accounts</p>
                      <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-lg font-semibold text-red-700">
                          {anomalyData ? anomalyData.count : 0}
                        </p>
                        <p className="text-xs text-red-600">anomalies found</p>
                      </div>
                      <button 
                        className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        onClick={() => {
                          if (anomalyData && anomalyData.anomalies && anomalyData.anomalies.length > 0) {
                            setActiveTab('anomaly-details');
                          } else {
                            alert('No anomalies to display');
                          }
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Spending Pattern Anomalies Card */}
                <Card className="p-6 border-l-4 border-yellow-500">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-yellow-500 mr-2" />
                      Spending Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">Irregular spending behaviors identified</p>
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-lg font-semibold text-yellow-700">
                          {anomalyData ? anomalyData.count : 0}
                        </p>
                        <p className="text-xs text-yellow-600">anomalies found</p>
                      </div>
                      <button 
                        className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                        onClick={() => {
                          if (anomalyData && anomalyData.anomalies && anomalyData.anomalies.length > 0) {
                            setActiveTab('anomaly-details');
                          } else {
                            alert('No anomalies to display');
                          }
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Account Balance Anomalies Card */}
                <Card className="p-6 border-l-4 border-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Landmark className="h-5 w-5 text-blue-500 mr-2" />
                      Account Irregularities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">Unexpected account balance changes</p>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-lg font-semibold text-blue-700">
                          {anomalyData ? anomalyData.count : 0}
                        </p>
                        <p className="text-xs text-blue-600">anomalies found</p>
                      </div>
                      <button 
                        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                        onClick={() => {
                          if (anomalyData && anomalyData.anomalies && anomalyData.anomalies.length > 0) {
                            setActiveTab('anomaly-details');
                          } else {
                            alert('No anomalies to display');
                          }
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Anomaly Detection Visualization */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Anomaly Trends Over Time</h3>
                <div className="bg-gray-50 rounded-xl p-8 h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                      <BarChart3 className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="text-gray-600 mb-2">No anomaly data available</p>
                    <p className="text-sm text-gray-500">Run anomaly detection to see trends</p>
                    <button 
                      onClick={runAnomalyDetection}
                      disabled={isAnomalyDetectionRunning}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm disabled:opacity-50"
                    >
                      {isAnomalyDetectionRunning ? 'Detecting Anomalies...' : 'Run Anomaly Detection'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Anomaly Details Section */}
              {anomalyData && anomalyData.anomalies && anomalyData.anomalies.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Detected Anomalies</h3>
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-12 bg-gray-100 text-gray-700 font-semibold p-4 border-b">
                      <div className="col-span-3">Date</div>
                      <div className="col-span-2">Bank</div>
                      <div className="col-span-2">Amount</div>
                      <div className="col-span-3">Description</div>
                      <div className="col-span-2">Reason</div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {anomalyData.anomalies.map((anomaly: any, index: number) => (
                        <div 
                          key={index} 
                          className={`grid grid-cols-12 p-4 border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                        >
                          <div className="col-span-3 font-medium text-gray-900">
                            {new Date(anomaly.date).toLocaleDateString()}
                          </div>
                          <div className="col-span-2 text-gray-600">{anomaly.bank}</div>
                          <div className="col-span-2 font-semibold text-red-600">
                            ₹{Number(anomaly.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="col-span-3 text-gray-600">{anomaly.description}</div>
                          <div className="col-span-2">
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                              {anomaly.reason}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Explanation Section */}
              <div className="mt-12 bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">About Anomaly Detection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">What We Detect</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Unusually large transactions</li>
                      <li>• Unexpected spending patterns</li>
                      <li>• Account balance irregularities</li>
                      <li>• Recurring payment anomalies</li>
                      <li>• Geographic transaction outliers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">How It Works</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Machine learning algorithms analyze your data</li>
                      <li>• Statistical models identify outliers</li>
                      <li>• Pattern recognition detects anomalies</li>
                      <li>• Continuous monitoring for threats</li>
                      <li>• Real-time alerts for suspicious activity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
      </div>
    </div>
  );
};

export default UtilitiesPage;