import pandas as pd
from sklearn.ensemble import IsolationForest
from scipy.stats import zscore
import json

# where data is the json file 

transactions = []
for bank in data['banks']:
    for txn in bank['transactions']:
        try:
            txn['amount'] = float(txn['amount'])
            txn['date'] = pd.to_datetime(txn['date'])
            txn['type'] = txn['type'].lower()
            txn['bank'] = bank['bankName']
            transactions.append(txn)
        except Exception as e:
            continue  # Skip malformed transactions

df = pd.DataFrame(transactions)

# Filter for debit transactions only
debits = df[df['type'] == 'debit'].copy()

# Step 2: Z-score anomaly detection
debits['zscore'] = zscore(debits['amount'])
debits['zscore_anomaly'] = debits['zscore'].abs() > 25

# Step 3: Isolation Forest anomaly detection
iso_forest = IsolationForest(contamination=0.05, random_state=42)
debits['iso_anomaly'] = iso_forest.fit_predict(debits[['amount']])
debits['iso_anomaly'] = debits['iso_anomaly'] == -1

# Combine both methods
debits['is_anomaly'] = debits['zscore_anomaly'] | debits['iso_anomaly']

# Step 4: Add reason for anomaly
def detect_reason(row):
    reasons = []
    if row['zscore_anomaly']:
        reasons.append("Unusual transaction amount (Z-score)")
    if row['iso_anomaly']:
        reasons.append("Unusual pattern detected (Isolation Forest)")
    return "; ".join(reasons)

debits['reason'] = debits.apply(detect_reason, axis=1)

# Step 5: Format output
anomalies = debits[debits['is_anomaly']]
anomaly_output = anomalies[['date', 'amount', 'description', 'bank', 'reason']]
anomaly_output = anomaly_output.sort_values(by='amount', ascending=False)

# Print top 10 anomalies
print(anomaly_output.head(5))