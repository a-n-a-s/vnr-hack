data = json.loads(imported_data)
#in our case data = financialData.financialData from the financial store (important)
# --- STEP 2: Net Worth Calculation ---
bank_balance = sum(float(bank['balance']) for bank in data['banks'])

mf_value = sum(float(fund['units']) * float(fund['nav']) for fund in data['mutualFunds'])
stocks_value = sum(float(stock['quantity']) * float(stock['currentPrice']) for stock in data['stocks'])
loan_outstanding = sum(float(loan['outstandingAmount']) for loan in data['loans'])

net_worth = bank_balance + mf_value + stocks_value - loan_outstanding

def monte_carlo_simulation(
    initial_mf_value,
    initial_stock_value,
    loan_outstanding,
    years=10,
    n_simulations=1000,
    annual_investment=60000
):
    mf_returns = np.random.normal(loc=0.10, scale=0.05, size=(n_simulations, years))
    stock_returns = np.random.normal(loc=0.12, scale=0.08, size=(n_simulations, years))

    all_net_worth = np.zeros((n_simulations, years + 1))

    for i in range(n_simulations):
        mf = initial_mf_value
        stock = initial_stock_value
        loan = loan_outstanding

        all_net_worth[i][0] = mf + stock - loan

        for year in range(1, years + 1):
            mf = (mf + annual_investment * 0.6) * (1 + mf_returns[i][year - 1])
            stock = (stock + annual_investment * 0.4) * (1 + stock_returns[i][year - 1])
            loan = max(0, loan - 150000)  # assume yearly EMI payments

            all_net_worth[i][year] = mf + stock - loan

    return all_net_worth

results = monte_carlo_simulation(
    initial_mf_value=mf_value,
    initial_stock_value=stocks_value,
    loan_outstanding=loan_outstanding,
    years=10,
    n_simulations=1000
)


# --- STEP 3: Cash Flow Summary ---
debit_total, credit_total = 0, 0
for bank in data['banks']:
    for txn in bank['transactions']:
        amt = float(txn['amount'])
        if txn['type'] == 'debit':
            debit_total += amt
        elif txn['type'] == 'credit':
            credit_total += amt

monthly_income = credit_total / 6  # assuming 6 months data
monthly_expense = debit_total / 6
emi_total = sum(loan['monthlyEMI'] for loan in data['loans'])

savings_rate = ((monthly_income - monthly_expense) / monthly_income) * 100

# --- STEP 4: Investment Allocation ---
allocation = {
    'Mutual Funds': mf_value,
    'Stocks': stocks_value,
    'Cash': bank_balance
}

# --- STEP 5: Insurance Summary ---
life_cover = sum(ins['coverageAmount'] for ins in data['insurance'] if ins['type'] == 'life')
health_cover = sum(ins['coverageAmount'] for ins in data['insurance'] if ins['type'] == 'health')

# --- STEP 6: Loan & DTI ---
monthly_dti = emi_total / monthly_income * 100

# --- SHOW SUMMARY ---
print("---- Financial Summary ----")
print(f"💰 Net Worth: ₹{net_worth:,.2f}")
print(f"🏦 Bank Balance: ₹{bank_balance:,.2f}")
print(f"📈 Mutual Funds Value: ₹{mf_value:,.2f}")
print(f"📊 Stock Holdings Value: ₹{stocks_value:,.2f}")
print(f"💳 Loan Outstanding: ₹{loan_outstanding:,.2f}")
print(f"💵 Monthly Income: ₹{monthly_income:,.2f}")
print(f"🛍️ Monthly Expenses: ₹{monthly_expense:,.2f}")
print(f"📉 Monthly EMI: ₹{emi_total:,.2f}")
print(f"💸 Savings Rate: {savings_rate:.2f}%")
print(f"🛡️ Life Insurance: ₹{life_cover:,.0f}, Health Insurance: ₹{health_cover:,.0f}")
print(f"⚠️ DTI (Debt to Income Ratio): {monthly_dti:.2f}%")

# --- STEP 7: USER-DRIVEN SIMULATION PARAMETERS ---
years = 10
mf_growth_rate = 0.10  # user can change
stocks_growth_rate = 0.177  # user can change
additional_monthly_investment = 5000  # user can change
loan_prepayment = 0  # user can change

# --- STEP 8: Simulation Function ---
def simulate_wealth(years, mf_rate, stock_rate, monthly_invest, prepay=0):
    mf_proj = [mf_value]
    stock_proj = [stocks_value]
    net_worth_proj = [net_worth]

    mf = mf_value
    stock = stocks_value
    loan = loan_outstanding - prepay

    for i in range(1, years + 1):
        mf += (mf * mf_rate) + (monthly_invest * 12 * 0.6)
        stock += (stock * stock_rate) + (monthly_invest * 12 * 0.4)
        loan = max(0, loan - emi_total * 12)  # basic payoff

        current_nw = bank_balance + mf + stock - loan
        mf_proj.append(mf)
        stock_proj.append(stock)
        net_worth_proj.append(current_nw)

    return net_worth_proj, mf_proj, stock_proj

# --- STEP 9: Run Simulation ---
nw, mf, stk = simulate_wealth(
    years=years,
    mf_rate=mf_growth_rate,
    stock_rate=stocks_growth_rate,
    monthly_invest=additional_monthly_investment,
    prepay=loan_prepayment
)

# --- STEP 10: Plot Results ---
plt.figure(figsize=(10, 6))
plt.plot(range(years+1), nw, label='Net Worth', linewidth=2)
plt.plot(range(years+1), mf, label='Mutual Funds', linestyle='--')
plt.plot(range(years+1), stk, label='Stocks', linestyle='--')
plt.xlabel('Year')
plt.ylabel('Amount (₹)')
plt.title('Wealth Projection Over Time')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()


years = np.arange(0, 11)
percentiles = np.percentile(results, [10, 25, 50, 75, 90], axis=0)

plt.figure(figsize=(12, 6))
plt.plot(years, percentiles[2], label='Median Net Worth', color='blue', linewidth=2)
plt.fill_between(years, percentiles[0], percentiles[4], color='skyblue', alpha=0.2, label='10th–90th Percentile')
plt.fill_between(years, percentiles[1], percentiles[3], color='deepskyblue', alpha=0.3, label='25th–75th Percentile')
plt.title('Monte Carlo Simulation of Net Worth (10 Years)')
plt.xlabel('Year')
plt.ylabel('Net Worth (₹)')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()