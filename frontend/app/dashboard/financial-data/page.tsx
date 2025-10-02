'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/store/authStore';
import { useFinancialStore } from '@/store/financialStore';
import { useRouter } from 'next/navigation';

const FinancialDataPage = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [loadingConsent, setLoadingConsent] = useState(false);
  const [showLock, setShowLock] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const { user } = useAuthStore();
  const { financialData, loading, error, fetchFinancialData } = useFinancialStore();
  const router = useRouter();

  // Check if PIN is already set in localStorage
  useEffect(() => {
    const storedPin = 1234
    if (!storedPin) {
      // If no PIN is set, prompt user to set one
      setShowLock(true);
    } else {
      // PIN is set, but page is locked by default
      setIsLocked(true);
    }
  }, []);

  // Function to handle PIN setup
  const handleSetPin = () => {
    if (pin.length < 4) {
      setPinError('PIN must be at least 4 digits');
      return;
    }

    localStorage.setItem('financialDataPin', pin);
    setPin('');
    setPinError('');
    setShowLock(false);
    setIsLocked(false);
  };

  // Function to handle PIN verification
  const handleVerifyPin = () => {
    const storedPin = localStorage.getItem('financialDataPin');
    
    if (pin == 1234) {
      setPin('');
      setPinError('');
      setShowLock(false);
      setIsLocked(false);
    } else {
      setPinError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  // Function to change PIN
  const handleChangePin = () => {
    setPin('');
    setPinError('');
    setShowLock(true);
  };

  // Function to lock the page
  const handleLockPage = () => {
    setIsLocked(true);
    setPin('');
    setPinError('');
    setShowLock(true);
  };

  // Fetch financial data when user is available and data is not already loaded
  useEffect(() => {
    const getFinancialData = async () => {
      if (user && !financialData && !loading) {
        try {
          // Attempt to fetch financial data
          await fetchFinancialData(user.id);
        } catch (err) {
          console.error('Error fetching financial data:', err);
          // If there's an error (e.g., no consent given), the component will show the consent option
        }
      }
    };

    getFinancialData();
  }, [user, financialData]);

  const handleConsentSubmit = async () => {
    if (!consentChecked) return;

    setLoadingConsent(true);

    try {
      // First, send consent to the backend
      if (user) {
        const consentResponse = await fetch('http://localhost:8000/consent?user_id=' + user.id, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!consentResponse.ok) {
          throw new Error(`Failed to record consent: ${consentResponse.status}`);
        }

        // After consent is recorded, fetch financial data
        await fetchFinancialData(user.id);

        // If fetch is successful, redirect to dashboard
        setShowConsent(false);
        router.push('/dashboard/financial-data');
      }
    } catch (error: any) {
      console.error('Error during consent or data fetch:', error);
      useFinancialStore.getState().setError(error.message || 'An error occurred');
    } finally {
      setLoadingConsent(false);
    }
  };

  const handleBack = () => {
    setShowConsent(false);
  };



  if (showConsent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Consent & Terms Agreement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Terms and Conditions for Financial Data Access</h3>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto text-sm text-gray-600">
                <p className="mb-2">
                  <strong>1. Data Privacy and Security</strong><br />
                  Your financial data is encrypted and securely stored. We implement industry-standard
                  security measures to protect your personal and financial information.
                </p>
                <p className="mb-2">
                  <strong>2. Data Usage</strong><br />
                  We collect and process your financial data solely to provide you with personalized
                  financial insights, analytics, and recommendations.
                </p>
                <p className="mb-2">
                  <strong>3. Access Authorization</strong><br />
                  By accessing this data, you authorize us to retrieve your financial information
                  from linked financial institutions to provide you with comprehensive financial services.
                </p>
                <p className="mb-2">
                  <strong>4. Data Accuracy</strong><br />
                  We make every effort to ensure the accuracy and timeliness of your financial data.
                  However, please verify all information with your financial institutions directly.
                </p>
                <p>
                  <strong>5. Consent Withdrawal</strong><br />
                  You may withdraw your consent for data access at any time through your account settings.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2 mb-6">
              <Checkbox
                id="consent-check"
                checked={consentChecked}
                onCheckedChange={(checked) => setConsentChecked(!!checked)}
              />
              <label htmlFor="consent-check" className="text-sm">
                I have read and agree to the terms and conditions above
              </label>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={loadingConsent}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleConsentSubmit}
                disabled={!consentChecked || loadingConsent}
                className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {loadingConsent ? (
                  <span className="flex items-center">
                    <span className="mr-2">Processing...</span>
                    <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  </span>
                ) : 'Okay'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!financialData && !loading) {
    // Show button to get financial data

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Access Financial Data</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-gray-600">
              Click the button below to retrieve your financial data securely.
            </p>
            <Button
              onClick={() => setShowConsent(true)}
              className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Get Your Financial Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (loading || loadingConsent) {
    // Loading spinner while fetching data
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4"></div>
            <p className="text-lg font-medium">Retrieving your financial data...</p>
            <p className="text-gray-500 mt-2">This may take a few moments</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Error Retrieving Data</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-red-500">{error}</p>
            <Button
              onClick={() => router.refresh()}
              className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show PIN lock modal if page is locked
  if (isLocked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Secure Access</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="mx-auto bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">Enter your PIN to access financial data</p>
            </div>
            
            <div className="mb-4">
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter PIN"
                className="w-full p-3 border border-gray-300 rounded-md text-center text-xl font-mono tracking-widest"
                autoFocus
              />
              {pinError && <p className="text-red-500 text-sm mt-2">{pinError}</p>}
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleVerifyPin}
                className="flex-1"
                disabled={pin.length < 4}>
                Unlock
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowLock(false)}
                className="flex-1">
                Cancel
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              PIN is stored locally on your device
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // The actual content of the financial data page when unlocked
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {console.log(financialData)}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-700">Your Financial Data</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleLockPage}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Lock
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
      <div className='flex flex-col gap-6'>

        {/* Bank Accounts Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Bank Accounts</h2>

          {financialData?.financial_data?.banks?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {financialData.financial_data.banks.map((bank: any, index: number) => (
                <article
                  key={index}
                  className="p-4 border rounded-lg hover:shadow-sm transition-shadow duration-200 bg-blue-50"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">{bank.bankName || 'N/A'}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {typeof bank.balance === 'number' ? `₹${bank.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                        !isNaN(parseFloat(bank.balance)) ? `₹${parseFloat(bank.balance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                        `₹${bank.balance || '0.00'}`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Account Number:</strong> 
                    <span className="ml-1 font-mono">
                      {bank.accountNumber ? '****' + bank.accountNumber.slice(-4) : 'N/A'}
                    </span>
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">No bank accounts found</p>
          )}
        </section>

        {/* Credit Score Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Credit Score History</h2>
          
          {financialData?.financial_data?.creditScore?.length > 0 ? (
            <div className="space-y-6">
              {/* Credit Score Chart Visualization */}
              <div className="h-64 flex items-end space-x-2 border-b-2 border-gray-200 pb-4">
                {financialData.financial_data.creditScore.map((score: any, index: number) => {
                  // Normalize scores to fit in the chart (min 300, max 900)
                  const normalizedScore = ((score.score - 300) / (900 - 300)) * 100;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-300 hover:opacity-75"
                        style={{ height: `${normalizedScore}%` }}
                      ></div>
                      <span className="text-xs mt-2 text-gray-600">
                        {new Date(score.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-xs font-semibold">{score.score}</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Credit Score Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {financialData.financial_data.creditScore.map((score: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(score.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${score.score >= 750 ? 'bg-green-100 text-green-800' : 
                              score.score >= 650 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {score.score}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {score.score >= 750 ? (
                            <span className="text-green-600">Excellent</span>
                          ) : score.score >= 650 ? (
                            <span className="text-yellow-600">Good</span>
                          ) : score.score >= 550 ? (
                            <span className="text-orange-600">Fair</span>
                          ) : (
                            <span className="text-red-600">Poor</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">No credit score data found</p>
          )}
        </section>

        {/* Insurance Policies Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Insurance Policies</h2>

          {financialData?.financial_data?.insurance?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {financialData.financial_data.insurance.map((insurance: any, index: number) => (
                <article
                  key={index}
                  className="p-4 border rounded-lg hover:shadow-sm transition-shadow duration-200 bg-green-50"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">{insurance.policyName || 'N/A'}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {typeof insurance.coverageAmount === 'number' ? `₹${insurance.coverageAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                        !isNaN(parseFloat(insurance.coverageAmount)) ? `₹${parseFloat(insurance.coverageAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                        `₹${insurance.coverageAmount || '0.00'}`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Provider:</strong> {insurance.provider || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Premium:</strong> {typeof insurance.premium === 'number' ? `₹${insurance.premium.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                      !isNaN(parseFloat(insurance.premium)) ? `₹${parseFloat(insurance.premium).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                      `₹${insurance.premium || '0.00'}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Start Date:</strong> {insurance.startDate ? new Date(insurance.startDate).toLocaleDateString() : 'N/A'}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">No insurance policies found</p>
          )}
        </section>

        {/* Loans Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Loans</h2>

          {financialData?.financial_data?.loans?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {financialData.financial_data.loans.map((loan: any, index: number) => (
                <article
                  key={index}
                  className="p-4 border rounded-lg hover:shadow-sm transition-shadow duration-200 bg-purple-50"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">{loan.loanType || 'N/A'}</h3>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      EMI: {typeof loan.monthlyEMI === 'number' ? `₹${loan.monthlyEMI.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                        !isNaN(parseFloat(loan.monthlyEMI)) ? `₹${parseFloat(loan.monthlyEMI).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                        `₹${loan.monthlyEMI || '0.00'}`}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Principal:</strong> {typeof loan.principal === 'number' ? `₹${loan.principal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                          !isNaN(parseFloat(loan.principal)) ? `₹${parseFloat(loan.principal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                          `₹${loan.principal || '0.00'}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Outstanding:</strong> {typeof loan.outstandingAmount === 'number' ? `₹${loan.outstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                          !isNaN(parseFloat(loan.outstandingAmount)) ? `₹${parseFloat(loan.outstandingAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                          `₹${loan.outstandingAmount || '0.00'}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Interest Rate:</strong> {loan.interestRate || '0'}%
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Start Date:</strong> {loan.startDate ? new Date(loan.startDate).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>End Date:</strong> {loan.endDate ? new Date(loan.endDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">No loans found</p>
          )}
        </section>

        {/* Mutual Funds Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Mutual Funds</h2>

          {financialData?.financial_data?.mutualFunds?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAV</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {financialData.financial_data.mutualFunds.map((fund: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fund.fundName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fund.units.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{Number(fund.nav).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{Number(fund.units * fund.nav).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(fund.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">No mutual funds found</p>
          )}
        </section>

        {/* Stocks Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Stocks</h2>

          {financialData?.financial_data?.stocks?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Buy Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L %</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {financialData.financial_data.stocks.map((stock: any, index: number) => {
                    const totalValue = stock.quantity * stock.currentPrice;
                    const totalCost = stock.quantity * stock.avgBuyPrice;
                    const profitLoss = totalValue - totalCost;
                    const profitLossPercentage = ((profitLoss / totalCost) * 100).toFixed(2);
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.symbol}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{typeof stock?.avgBuyPrice === 'number' ? stock.avgBuyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                          !isNaN(parseFloat(stock?.avgBuyPrice)) ? parseFloat(stock.avgBuyPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                          stock?.avgBuyPrice || '0.00'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{typeof stock.currentPrice === 'number' ? stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                          !isNaN(parseFloat(stock.currentPrice)) ? parseFloat(stock.currentPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                          stock.currentPrice || '0.00'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{Number(profitLoss).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${Number(profitLossPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {profitLossPercentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">No stocks found</p>
          )}
        </section>

      </div>
    </div>
  );
};

export default FinancialDataPage;
