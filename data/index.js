const { faker } = require('@faker-js/faker');
const fs = require('fs');

// --- Helper: Calculate EMI ---
function calculateEMI(principal, rate, years) {
  const monthlyRate = rate / 12 / 100;
  const months = years * 12;
  return Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1));
}

// --- 1. Bank Accounts ---
function generateBankData() {
  const banks = ['HDFC', 'ICICI', 'SBI', 'Axis'];
  const bankAccounts = [];

  banks.forEach(bank => {
    let balance = faker.number.float({ min: 5000, max: 100000, precision: 0.01 });
    const transactions = [];

    for (let i = 0; i < 60; i++) {
      const isCredit = faker.datatype.boolean({ probability: 0.3 });
      const amount = faker.number.float({ min: 500, max: isCredit ? 50000 : 10000, precision: 0.01 });
      const date = faker.date.past({ years: 1 });

      balance += isCredit ? amount : -amount;

      transactions.push({
        date,
        type: isCredit ? 'credit' : 'debit',
        amount: amount.toFixed(2),
        description: isCredit
          ? faker.helpers.arrayElement(['Salary Credit', 'Refund', 'Bonus', 'Transfer from Wallet'])
          : faker.helpers.arrayElement(['Grocery', 'Online Shopping', 'Electricity Bill', 'Dining', 'Rent', 'Travel'])
      });
    }

    bankAccounts.push({
      bankName: bank,
      accountNumber: faker.finance.accountNumber(10),
      balance: balance.toFixed(2),
      transactions: transactions.sort((a, b) => new Date(a.date) - new Date(b.date))
    });
  });

  return bankAccounts;
}

// --- 2. Credit Score ---
function generateCreditScoreData() {
  const scores = [];
  let baseScore = faker.number.int({ min: 700, max: 800 });

  for (let i = 0; i < 12; i++) {
    const change = faker.number.int({ min: -10, max: 10 });
    baseScore = Math.min(850, Math.max(650, baseScore + change));

    scores.push({
      date: faker.date.past({ years: 1 }),
      score: baseScore
    });
  }

  return scores.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// --- 3. Loan Data ---
function generateLoanData() {
  const principal = 1200000;
  const interestRate = 7.25;
  const startDate = faker.date.past({ years: 1 });
  const endDate = faker.date.future({ years: 10 });
  const monthlyEMI = calculateEMI(principal, interestRate, 10);
  const paidMonths = faker.number.int({ min: 6, max: 24 });
  const totalPaid = paidMonths * monthlyEMI;
  const outstandingAmount = principal - totalPaid * 0.7; // Approximate

  return [{
    loanType: 'Home Loan',
    principal,
    interestRate,
    startDate,
    endDate,
    monthlyEMI,
    outstandingAmount: Math.round(outstandingAmount)
  }];
}

// --- 4. Mutual Fund Data ---
function generateMutualFundData() {
  const funds = [];

  for (let i = 0; i < 8; i++) {
    const units = faker.number.float({ min: 10, max: 150, precision: 0.01 });
    const nav = faker.number.float({ min: 50, max: 250, precision: 0.01 });
    const fundName = faker.company.name() + ' Growth Fund';

    funds.push({
      fundName,
      units,
      nav,
      date: faker.date.recent({ days: 30 })
    });
  }

  return funds;
}

// --- 5. Stock Holdings ---
function generateStockData() {
  const symbols = ['TCS', 'INFY', 'RELIANCE', 'HDFCBANK', 'LT', 'ITC'];
  return symbols.map(symbol => {
    const quantity = faker.number.int({ min: 5, max: 100 });
    const avgBuyPrice = faker.number.float({ min: 800, max: 3000, precision: 0.01 });
    const currentPrice = avgBuyPrice * faker.number.float({ min: 0.8, max: 1.4, precision: 0.01 });

    return {
      symbol,
      quantity,
      avgBuyPrice: avgBuyPrice.toFixed(2),
      currentPrice: currentPrice.toFixed(2),
      date: faker.date.recent({ days: 45 })
    };
  });
}

// --- 6. Insurance Policies ---
function generateInsuranceData() {
  return [
    {
      policyName: 'Life Shield',
      provider: 'LIC',
      premium: 15000,
      coverageAmount: 1000000,
      startDate: faker.date.past({ years: 2 }),
      endDate: faker.date.future({ years: 18 }),
      type: 'life'
    },
    {
      policyName: 'Health Secure',
      provider: 'Star Health',
      premium: 10000,
      coverageAmount: 700000,
      startDate: faker.date.past({ years: 1 }),
      endDate: faker.date.future({ years: 1 }),
      type: 'health'
    }
  ];
}

// --- FINAL: Full Dataset ---
function generateFinancialData() {
  return {
    banks: generateBankData(),
    creditScore: generateCreditScoreData(),
    loans: generateLoanData(),
    mutualFunds: generateMutualFundData(),
    stocks: generateStockData(),
    insurance: generateInsuranceData()
  };
}

// --- SAVE TO FILE ---
const financialData = generateFinancialData();
fs.writeFileSync('realistic_financial_data.json', JSON.stringify(financialData, null, 2));
console.log('✅ Realistic financial data generated successfully!');
