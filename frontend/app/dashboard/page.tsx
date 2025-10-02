'use client';
import Sidebar from '@/components/dashboard/Sidebar';
import Link from 'next/link'

import { CartesianGrid, Line, LineChart, XAxis, Pie, PieChart, Bar, BarChart } from "recharts"
import CountUp from "@/components/ui/CountUp"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { TrendingUp, TrendingDown, CreditCard, PiggyBank, Landmark, Shield } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import { useFinancialStore } from '@/store/financialStore';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const { financialData, loading, error, fetchFinancialData } = useFinancialStore();
  const { user } = useAuthStore();
  const router = useRouter();

  // Fetch financial data when user is available
  useEffect(() => {
    if (user && !financialData && !loading) {
      fetchFinancialData(user.id);
    }
  }, [user, financialData, loading, fetchFinancialData]);

  // Fallback data if financial data is not loaded yet
  const chartData = financialData?.financial_data?.balanceHistory || [
    { month: "Jan", desktop: 186, mobile: 80 },
    { month: "Feb", desktop: 305, mobile: 200 },
    { month: "Mar", desktop: 237, mobile: 120 },
    { month: "Apr", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "Jun", desktop: 214, mobile: 140 },
    { month: "Jul", desktop: 180, mobile: 150 },
    { month: "Aug", desktop: 195, mobile: 135 },
    { month: "Sep", desktop: 210, mobile: 160 },
    { month: "Oct", desktop: 230, mobile: 170 },
    { month: "Nov", desktop: 225, mobile: 180 },
    { month: "Dec", desktop: 240, mobile: 190 },
  ];

  // For investment data, extract from real financial data if available
  const investmentData = financialData?.financial_data?.investmentAllocation || [
    { name: "Stocks", value: 35 },
    { name: "Mutual Funds", value: 25 },
    { name: "Bonds", value: 20 },
    { name: "Real Estate", value: 15 },
    { name: "Crypto", value: 5 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(142, 76%, 36%)", // green-500
    },
    mobile: {
      label: "Mobile",
      color: "hsl(217, 91%, 60%)", // blue-500
    },
  } satisfies ChartConfig

  const investmentConfig = {
    value: {
      label: "Value",
    },
    stocks: {
      label: "Stocks",
      color: "hsl(217, 91%, 60%)", // blue-500
    },
    mutual: {
      label: "Mutual Funds",
      color: "hsl(142, 76%, 36%)", // green-500
    },
    bonds: {
      label: "Bonds",
      color: "hsl(35, 100%, 60%)", // amber-500
    },
    realEstate: {
      label: "Real Estate",
      color: "hsl(212, 100%, 45%)", // blue-600
    },
    crypto: {
      label: "Crypto",
      color: "hsl(262, 83%, 58%)", // violet-500
    },
  } satisfies ChartConfig

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your financial overview</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Balance</CardTitle>
              <Landmark className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {financialData ? (
                  <CountUp 
                    from={0} 
                    to={
                      financialData.financial_data?.netWorth !== undefined && financialData.financial_data?.netWorth !== null ?
                      financialData.financial_data.netWorth :
                      (financialData.financial_data?.banks?.reduce((total, bank) => total + (bank.balance || 0), 0) || 0)
                    } 
                    separator="," 
                    duration={0.5} 
                    currencyPrefix="₹" 
                    decimals={2}
                  />
                ) : (
                  <CountUp from={0} to={59000} separator="," duration={1.5} currencyPrefix="₹" decimals={2} />
                )}
              </div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> 2.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Credit Score</CardTitle>
              <CreditCard className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {financialData && financialData.financial_data?.creditScore?.length > 0 ? (
                  <CountUp 
                    from={0} 
                    to={financialData.financial_data.creditScore[financialData.financial_data.creditScore.length - 1]?.score || 0} 
                    duration={0.5} 
                    decimals={0}
                  />
                ) : (
                  <CountUp from={0} to={782} duration={1.5} decimals={0} />
                )}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                {financialData && financialData.financial_data?.creditScore?.length > 0 ? (
                  financialData.financial_data.creditScore[financialData.financial_data.creditScore.length - 1]?.score >= 750 ? 'Excellent' :
                  financialData.financial_data.creditScore[financialData.financial_data.creditScore.length - 1]?.score >= 650 ? 'Good' :
                  financialData.financial_data.creditScore[financialData.financial_data.creditScore.length - 1]?.score >= 550 ? 'Fair' : 'Poor'
                ) : 'Good standing'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Loans</CardTitle>
              <PiggyBank className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {financialData ? (
                  <CountUp 
                    from={0} 
                    to={
                      (financialData.financial_data?.loans?.reduce((total, loan) => total + (loan.outstandingAmount || 0), 0) || 0) +
                      (financialData.financial_data?.creditCards?.reduce((total, card) => total + (card.outstandingBalance || 0), 0) || 0)
                    } 
                    separator="," 
                    duration={0.5} 
                    currencyPrefix="₹" 
                    decimals={2}
                  />
                ) : (
                  <CountUp from={0} to={250000} separator="," duration={1.5} currencyPrefix="₹" decimals={2} />
                )}
              </div>
              <p className="text-xs text-amber-600 mt-1">
                {financialData && financialData.financial_data?.loans ? (
                  `Overall ${Math.round(financialData.financial_data.loans.reduce((repaid, loan) => 
                    repaid + (loan.principal ? ((loan.principal - (loan.outstandingAmount || 0)) / loan.principal) * 100 : 0), 0) / financialData.financial_data.loans.length || 0)}% repaid`
                ) : '75% repaid'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Investments</CardTitle>
              <Shield className="h-5 w-5 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {financialData ? (
                  <CountUp 
                    from={0} 
                    to={
                      (financialData.financial_data?.investments?.reduce((total, investment) => total + (investment.value || 0), 0) || 0) +
                      (financialData.financial_data?.mutualFunds?.reduce((total, fund) => total + (fund.value || fund.nav * fund.units || 0), 0) || 0) +
                      (financialData.financial_data?.stocks?.reduce((total, stock) => total + (stock.currentPrice * stock.quantity || 0), 0) || 0)
                    } 
                    separator="," 
                    duration={0.5} 
                    currencyPrefix="₹" 
                    decimals={2}
                  />
                ) : (
                  <CountUp from={0} to={320000} separator="," duration={1.5} currencyPrefix="₹" decimals={2} />
                )}
              </div>
              <p className="text-xs text-violet-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +5.2% YTD
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Balance Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Account Balance Trend</CardTitle>
              <CardDescription>Your balance over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80 w-full">
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Line
                    dataKey="desktop"
                    type="monotone"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="mobile"
                    type="monotone"
                    stroke="var(--color-mobile)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Investment Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Allocation</CardTitle>
              <CardDescription>Distribution across investment types</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={investmentConfig} className="mx-auto aspect-square max-h-[300px]">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={investmentData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  />
                </PieChart>
              </ChartContainer>
              <div className="flex justify-center gap-4 mt-4">
                {investmentData.map((item) => (
                  <div key={item.name} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: investmentConfig[item.name.toLowerCase() as keyof typeof investmentConfig]?.color || '#6366f1' }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bars and Financial Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Loan Repayment Progress</CardTitle>
              <CardDescription>Home loan repayment timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {financialData && financialData.financial_data?.loans && financialData.financial_data.loans.length > 0 ? (
                  financialData.financial_data.loans.map((loan, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{loan.loanType || 'Loan'}</span>
                        <span className="text-sm font-medium">
                          ₹{(loan.principal - (loan.outstandingAmount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ₹{loan.principal?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <Progress 
                        value={loan.principal ? ((loan.principal - (loan.outstandingAmount || 0)) / loan.principal) * 100 : 0} 
                        className="h-2" 
                      />
                    </div>
                  ))
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Mortgage Payment</span>
                      <span className="text-sm font-medium">₹12,500 / ₹16,666</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Credit Health Score</CardTitle>
              <CardDescription>Based on your credit behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Credit Utilization</span>
                  <span className="text-sm font-medium">22% / 30%</span>
                </div>
                <Progress value={73} className="h-2 bg-blue-200" indicatorColor="bg-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bank Accounts */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Landmark className="h-5 w-5 mr-2 text-green-600" />
                Bank Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialData && financialData.financial_data?.banks ? (
                  financialData.financial_data.banks.map((bank, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        index === 0 ? 'bg-green-50' : 
                        index === 1 ? 'bg-blue-50' : 
                        index === 2 ? 'bg-purple-50' : 'bg-amber-50'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{bank.bankName || 'Bank Account'}</p>
                        <p className="text-sm text-gray-600">
                          {bank.accountNumber ? `****${bank.accountNumber.slice(-4)}` : '****XXXX'}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ₹{typeof bank.balance === 'number' ? bank.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                          !isNaN(parseFloat(bank.balance)) ? parseFloat(bank.balance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                          bank.balance || '0.00'}
                      </p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">HDFC Bank</p>
                        <p className="text-sm text-gray-600">****1910</p>
                      </div>
                      <p className="font-semibold">₹255.28</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">ICICI Bank</p>
                        <p className="text-sm text-gray-600">****7199</p>
                      </div>
                      <p className="font-semibold">₹821.19</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium">SBI</p>
                        <p className="text-sm text-gray-600">****4122</p>
                      </div>
                      <p className="font-semibold">₹192.98</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <div>
                        <p className="font-medium">Axis Bank</p>
                        <p className="text-sm text-gray-600">****1546</p>
                      </div>
                      <p className="font-semibold">₹892.59</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Investments */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialData && (financialData.financial_data?.investments || financialData.financial_data?.mutualFunds || financialData.financial_data?.stocks) ? (
                  [
                    ...(financialData.financial_data?.investments || []),
                    ...(financialData.financial_data?.mutualFunds?.map(f => ({ ...f, investmentType: f.fundName || 'Mutual Fund' })) || []),
                    ...(financialData.financial_data?.stocks?.map(s => ({ ...s, investmentType: s.symbol || 'Stock', value: s.currentPrice * s.quantity })) || [])
                  ].slice(0, 4).map((investment, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        index === 0 ? 'bg-blue-50' : 
                        index === 1 ? 'bg-green-50' : 
                        index === 2 ? 'bg-purple-50' : 'bg-amber-50'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{investment.investmentType || investment.fundName || investment.symbol || 'Investment'}</p>
                        <p className="text-sm text-gray-600">
                          {investment.returnPercentage ? `+${investment.returnPercentage}%` : 
                           investment.performance ? `+${investment.performance}%` : 
                           investment.avgBuyPrice && investment.currentPrice ? 
                           `${(((investment.currentPrice - investment.avgBuyPrice) / investment.avgBuyPrice) * 100).toFixed(2)}%` : ''}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ₹{typeof (investment.value || (investment.nav * investment.units) || (investment.currentPrice * investment.quantity)) === 'number' ? 
                          (investment.value || (investment.nav * investment.units) || (investment.currentPrice * investment.quantity)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                          !isNaN(parseFloat(investment.value || (investment.nav * investment.units) || (investment.currentPrice * investment.quantity))) ? 
                          parseFloat(investment.value || (investment.nav * investment.units) || (investment.currentPrice * investment.quantity)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                          (investment.value || (investment.nav * investment.units) || (investment.currentPrice * investment.quantity) || '0.00')}
                      </p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Equity Fund</p>
                        <p className="text-sm text-gray-600">+12.5%</p>
                      </div>
                      <p className="font-semibold">₹125,000</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Debt Fund</p>
                        <p className="text-sm text-gray-600">+8.2%</p>
                      </div>
                      <p className="font-semibold">₹75,000</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium">ELSS Tax Saver</p>
                        <p className="text-sm text-gray-600">+15.1%</p>
                      </div>
                      <p className="font-semibold">₹85,000</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <div>
                        <p className="font-medium">Index Fund</p>
                        <p className="text-sm text-gray-600">+10.7%</p>
                      </div>
                      <p className="font-semibold">₹35,000</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Insurance */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-violet-600" />
                Insurance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialData && financialData.financial_data?.insurance ? (
                  financialData.financial_data.insurance.map((insurance, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg ${
                        index === 0 ? 'bg-violet-50' : 
                        index === 1 ? 'bg-cyan-50' : 'bg-emerald-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{insurance.policyName || 'Insurance Policy'}</p>
                          <p className="text-sm text-gray-600">{insurance.provider || 'Insurance Provider'}</p>
                        </div>
                        <p className="font-semibold">
                          ₹{typeof insurance.coverageAmount === 'number' ? insurance.coverageAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                            !isNaN(parseFloat(insurance.coverageAmount)) ? parseFloat(insurance.coverageAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                            insurance.coverageAmount || '0.00'}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Premium: ₹{typeof insurance.premium === 'number' ? insurance.premium.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                          !isNaN(parseFloat(insurance.premium)) ? parseFloat(insurance.premium).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                          insurance.premium || '0.00'}/year
                      </p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="p-3 bg-violet-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Life Shield</p>
                          <p className="text-sm text-gray-600">LIC</p>
                        </div>
                        <p className="font-semibold">₹1,000,000</p>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Premium: ₹12,000/year</p>
                    </div>
                    <div className="p-3 bg-cyan-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Health Secure</p>
                          <p className="text-sm text-gray-600">Star Health</p>
                        </div>
                        <p className="font-semibold">₹500,000</p>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Premium: ₹8,000/year</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Motor Insurance</p>
                          <p className="text-sm text-gray-600">Bajaj Allianz</p>
                        </div>
                        <p className="font-semibold">₹50,000</p>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Premium: ₹2,500/year</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;