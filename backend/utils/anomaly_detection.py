import pandas as pd
from sklearn.ensemble import IsolationForest
from scipy.stats import zscore
import json
from typing import List, Dict, Any

def detect_anomalies(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Detect anomalies in transaction data using Z-score and Isolation Forest methods.
    
    Args:
        data: Financial data containing banks and their transactions
        
    Returns:
        List of anomalies with details
    """
    imported_data = '''
{
  "banks": [
    {
      "bankName": "HDFC",
      "accountNumber": "5058270585",
      "balance": "383353.02",
      "transactions": [
        {
          "date": "2024-10-07T05:15:55.217Z",
          "type": "debit",
          "amount": "9988.48",
          "description": "Online Shopping"
        },
        {
          "date": "2024-10-08T14:42:09.982Z",
          "type": "debit",
          "amount": "4657.19",
          "description": "Online Shopping"
        },
        {
          "date": "2024-10-09T20:37:16.634Z",
          "type": "debit",
          "amount": "5018.29",
          "description": "Rent"
        },
        {
          "date": "2024-10-31T22:23:07.937Z",
          "type": "debit",
          "amount": "8051.09",
          "description": "Electricity Bill"
        },
        {
          "date": "2024-11-01T17:27:31.181Z",
          "type": "debit",
          "amount": "6829.00",
          "description": "Rent"
        },
        {
          "date": "2024-11-12T02:16:05.886Z",
          "type": "debit",
          "amount": "2431.06",
          "description": "Online Shopping"
        },
        {
          "date": "2024-11-13T11:51:34.925Z",
          "type": "debit",
          "amount": "4276.91",
          "description": "Online Shopping"
        },
        {
          "date": "2024-11-22T21:16:37.384Z",
          "type": "debit",
          "amount": "996.26",
          "description": "Dining"
        },
        {
          "date": "2024-11-23T19:10:02.168Z",
          "type": "debit",
          "amount": "592.12",
          "description": "Grocery"
        },
        {
          "date": "2024-11-26T07:10:29.127Z",
          "type": "debit",
          "amount": "4893.17",
          "description": "Electricity Bill"
        },
        {
          "date": "2024-12-03T10:47:15.023Z",
          "type": "credit",
          "amount": "11855.64",
          "description": "Bonus"
        },
        {
          "date": "2024-12-03T19:48:48.086Z",
          "type": "credit",
          "amount": "49463.90",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2024-12-06T02:00:50.066Z",
          "type": "debit",
          "amount": "665.79",
          "description": "Travel"
        },
        {
          "date": "2024-12-14T14:04:27.064Z",
          "type": "debit",
          "amount": "5414.21",
          "description": "Electricity Bill"
        },
        {
          "date": "2024-12-18T21:04:53.770Z",
          "type": "debit",
          "amount": "1972.79",
          "description": "Electricity Bill"
        },
        {
          "date": "2024-12-21T21:29:46.002Z",
          "type": "credit",
          "amount": "42025.12",
          "description": "Refund"
        },
        {
          "date": "2024-12-31T03:44:04.968Z",
          "type": "debit",
          "amount": "669.36",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-01-01T07:19:12.276Z",
          "type": "debit",
          "amount": "2833.54",
          "description": "Dining"
        },
        {
          "date": "2025-01-01T07:19:12.276Z",
          "type": "debit",
          "amount": "50000.54",
          "description": "Dining"
        },
        {
          "date": "2025-01-06T04:06:14.640Z",
          "type": "debit",
          "amount": "785.83",
          "description": "Online Shopping"
        },
        {
          "date": "2025-01-09T08:12:59.363Z",
          "type": "debit",
          "amount": "6676.86",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-01-16T05:58:03.962Z",
          "type": "debit",
          "amount": "2022.67",
          "description": "Travel"
        },
        {
          "date": "2025-02-03T15:17:52.746Z",
          "type": "debit",
          "amount": "9275.16",
          "description": "Rent"
        },
        {
          "date": "2025-02-09T16:41:47.044Z",
          "type": "credit",
          "amount": "31065.43",
          "description": "Salary Credit"
        },
        {
          "date": "2025-02-12T09:42:47.800Z",
          "type": "credit",
          "amount": "7264.30",
          "description": "Salary Credit"
        },
        {
          "date": "2025-02-13T21:12:07.183Z",
          "type": "credit",
          "amount": "34774.95",
          "description": "Bonus"
        },
        {
          "date": "2025-02-22T07:33:28.890Z",
          "type": "debit",
          "amount": "9016.30",
          "description": "Dining"
        },
        {
          "date": "2025-03-19T10:26:01.690Z",
          "type": "debit",
          "amount": "7413.76",
          "description": "Rent"
        },
        {
          "date": "2025-03-28T13:17:41.731Z",
          "type": "credit",
          "amount": "2868.76",
          "description": "Bonus"
        },
        {
          "date": "2025-03-28T14:05:37.473Z",
          "type": "debit",
          "amount": "4494.90",
          "description": "Dining"
        },
        {
          "date": "2025-03-31T02:08:44.836Z",
          "type": "credit",
          "amount": "24049.34",
          "description": "Salary Credit"
        },
        {
          "date": "2025-04-17T17:45:44.912Z",
          "type": "credit",
          "amount": "11631.00",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-05-08T10:40:03.880Z",
          "type": "credit",
          "amount": "32674.00",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-05-15T17:39:46.357Z",
          "type": "debit",
          "amount": "7254.86",
          "description": "Travel"
        },
        {
          "date": "2025-05-18T05:13:52.192Z",
          "type": "credit",
          "amount": "24876.19",
          "description": "Salary Credit"
        },
        {
          "date": "2025-05-26T11:13:45.674Z",
          "type": "debit",
          "amount": "5544.37",
          "description": "Dining"
        },
        {
          "date": "2025-06-04T18:56:29.874Z",
          "type": "debit",
          "amount": "2243.11",
          "description": "Dining"
        },
        {
          "date": "2025-06-19T14:52:12.221Z",
          "type": "debit",
          "amount": "5963.89",
          "description": "Online Shopping"
        },
        {
          "date": "2025-06-21T07:34:18.478Z",
          "type": "credit",
          "amount": "2013.95",
          "description": "Refund"
        },
        {
          "date": "2025-06-22T01:06:56.231Z",
          "type": "credit",
          "amount": "10571.77",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-07-02T11:59:21.426Z",
          "type": "debit",
          "amount": "3486.66",
          "description": "Online Shopping"
        },
        {
          "date": "2025-07-04T19:22:31.892Z",
          "type": "debit",
          "amount": "4126.36",
          "description": "Grocery"
        },
        {
          "date": "2025-07-04T23:36:40.737Z",
          "type": "credit",
          "amount": "49484.85",
          "description": "Salary Credit"
        },
        {
          "date": "2025-07-22T14:10:35.768Z",
          "type": "debit",
          "amount": "905.66",
          "description": "Online Shopping"
        },
        {
          "date": "2025-07-30T16:59:34.028Z",
          "type": "debit",
          "amount": "7379.51",
          "description": "Rent"
        },
        {
          "date": "2025-07-31T19:35:19.435Z",
          "type": "credit",
          "amount": "44065.68",
          "description": "Salary Credit"
        },
        {
          "date": "2025-08-03T06:32:54.306Z",
          "type": "debit",
          "amount": "8413.10",
          "description": "Grocery"
        },
        {
          "date": "2025-08-06T00:24:47.314Z",
          "type": "credit",
          "amount": "17202.14",
          "description": "Bonus"
        },
        {
          "date": "2025-08-08T21:35:31.226Z",
          "type": "debit",
          "amount": "1543.26",
          "description": "Travel"
        },
        {
          "date": "2025-08-17T05:49:00.418Z",
          "type": "debit",
          "amount": "1416.43",
          "description": "Rent"
        },
        {
          "date": "2025-08-18T22:19:46.361Z",
          "type": "debit",
          "amount": "2142.61",
          "description": "Grocery"
        },
        {
          "date": "2025-08-19T00:26:34.662Z",
          "type": "credit",
          "amount": "13740.40",
          "description": "Bonus"
        },
        {
          "date": "2025-08-19T02:36:43.480Z",
          "type": "debit",
          "amount": "7428.10",
          "description": "Online Shopping"
        },
        {
          "date": "2025-08-21T20:45:10.746Z",
          "type": "debit",
          "amount": "8810.54",
          "description": "Rent"
        },
        {
          "date": "2025-08-30T02:14:24.938Z",
          "type": "debit",
          "amount": "4002.60",
          "description": "Online Shopping"
        },
        {
          "date": "2025-09-07T01:18:15.386Z",
          "type": "debit",
          "amount": "870.94",
          "description": "Grocery"
        },
        {
          "date": "2025-09-07T05:14:51.587Z",
          "type": "credit",
          "amount": "35786.20",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-09-11T14:22:15.254Z",
          "type": "debit",
          "amount": "8711.94",
          "description": "Travel"
        },
        {
          "date": "2025-09-14T15:45:08.760Z",
          "type": "debit",
          "amount": "1999.34",
          "description": "Grocery"
        },
        {
          "date": "2025-09-18T05:56:40.797Z",
          "type": "credit",
          "amount": "1465.46",
          "description": "Salary Credit"
        },
        {
          "date": "2025-09-24T04:28:21.650Z",
          "type": "credit",
          "amount": "42431.52",
          "description": "Salary Credit"
        }
      ]
    },
    {
      "bankName": "ICICI",
      "accountNumber": "0209467112",
      "balance": "41834.84",
      "transactions": [
        {
          "date": "2024-10-02T22:27:54.045Z",
          "type": "debit",
          "amount": "6883.32",
          "description": "Dining"
        },
        {
          "date": "2024-10-08T10:33:38.041Z",
          "type": "debit",
          "amount": "8059.59",
          "description": "Travel"
        },
        {
          "date": "2024-10-08T21:29:45.265Z",
          "type": "debit",
          "amount": "8603.83",
          "description": "Grocery"
        },
        {
          "date": "2024-10-13T17:18:20.414Z",
          "type": "debit",
          "amount": "5872.11",
          "description": "Grocery"
        },
        {
          "date": "2024-10-15T09:17:55.856Z",
          "type": "debit",
          "amount": "6275.72",
          "description": "Online Shopping"
        },
        {
          "date": "2024-10-17T06:07:40.385Z",
          "type": "debit",
          "amount": "9216.08",
          "description": "Grocery"
        },
        {
          "date": "2024-10-18T21:08:58.367Z",
          "type": "credit",
          "amount": "24036.52",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2024-11-03T11:21:34.319Z",
          "type": "credit",
          "amount": "24777.21",
          "description": "Bonus"
        },
        {
          "date": "2024-11-12T09:15:20.499Z",
          "type": "debit",
          "amount": "1177.64",
          "description": "Travel"
        },
        {
          "date": "2024-11-14T20:23:01.191Z",
          "type": "debit",
          "amount": "4013.78",
          "description": "Rent"
        },
        {
          "date": "2024-11-15T00:10:42.564Z",
          "type": "debit",
          "amount": "5558.95",
          "description": "Travel"
        },
        {
          "date": "2024-11-16T09:26:35.495Z",
          "type": "credit",
          "amount": "31572.55",
          "description": "Refund"
        },
        {
          "date": "2024-11-27T16:27:46.529Z",
          "type": "debit",
          "amount": "6132.53",
          "description": "Rent"
        },
        {
          "date": "2024-12-06T02:09:37.189Z",
          "type": "debit",
          "amount": "3794.11",
          "description": "Travel"
        },
        {
          "date": "2024-12-19T12:08:15.437Z",
          "type": "debit",
          "amount": "4544.90",
          "description": "Travel"
        },
        {
          "date": "2025-01-08T12:52:41.175Z",
          "type": "credit",
          "amount": "12031.71",
          "description": "Refund"
        },
        {
          "date": "2025-01-13T23:03:43.227Z",
          "type": "debit",
          "amount": "3620.64",
          "description": "Dining"
        },
        {
          "date": "2025-01-16T10:57:07.160Z",
          "type": "debit",
          "amount": "1237.71",
          "description": "Online Shopping"
        },
        {
          "date": "2025-01-18T09:47:32.781Z",
          "type": "debit",
          "amount": "9668.98",
          "description": "Grocery"
        },
        {
          "date": "2025-01-23T19:21:29.855Z",
          "type": "debit",
          "amount": "830.95",
          "description": "Dining"
        },
        {
          "date": "2025-02-02T15:05:40.870Z",
          "type": "debit",
          "amount": "2715.21",
          "description": "Rent"
        },
        {
          "date": "2025-02-23T10:15:36.810Z",
          "type": "credit",
          "amount": "1613.81",
          "description": "Refund"
        },
        {
          "date": "2025-03-01T08:45:33.694Z",
          "type": "debit",
          "amount": "8002.89",
          "description": "Grocery"
        },
        {
          "date": "2025-03-02T01:12:45.315Z",
          "type": "debit",
          "amount": "8157.80",
          "description": "Grocery"
        },
        {
          "date": "2025-03-08T21:37:06.017Z",
          "type": "debit",
          "amount": "4209.96",
          "description": "Grocery"
        },
        {
          "date": "2025-03-11T15:19:28.752Z",
          "type": "debit",
          "amount": "4976.63",
          "description": "Rent"
        },
        {
          "date": "2025-03-13T18:43:06.248Z",
          "type": "debit",
          "amount": "9335.29",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-03-20T08:45:52.050Z",
          "type": "debit",
          "amount": "9826.87",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-03-21T14:20:56.336Z",
          "type": "debit",
          "amount": "9497.57",
          "description": "Travel"
        },
        {
          "date": "2025-03-26T11:28:10.635Z",
          "type": "debit",
          "amount": "6093.05",
          "description": "Online Shopping"
        },
        {
          "date": "2025-04-13T01:30:49.760Z",
          "type": "debit",
          "amount": "7630.62",
          "description": "Online Shopping"
        },
        {
          "date": "2025-04-29T10:05:05.787Z",
          "type": "debit",
          "amount": "8075.81",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-05-01T13:06:22.634Z",
          "type": "credit",
          "amount": "33962.82",
          "description": "Bonus"
        },
        {
          "date": "2025-05-12T11:30:40.023Z",
          "type": "debit",
          "amount": "9851.72",
          "description": "Grocery"
        },
        {
          "date": "2025-06-07T01:52:39.851Z",
          "type": "debit",
          "amount": "4094.78",
          "description": "Rent"
        },
        {
          "date": "2025-06-07T05:12:02.274Z",
          "type": "debit",
          "amount": "2434.87",
          "description": "Online Shopping"
        },
        {
          "date": "2025-06-26T21:23:19.501Z",
          "type": "credit",
          "amount": "16638.65",
          "description": "Refund"
        },
        {
          "date": "2025-07-07T08:29:23.406Z",
          "type": "debit",
          "amount": "5374.62",
          "description": "Travel"
        },
        {
          "date": "2025-07-13T08:12:19.582Z",
          "type": "debit",
          "amount": "1746.31",
          "description": "Online Shopping"
        },
        {
          "date": "2025-07-14T03:18:36.020Z",
          "type": "debit",
          "amount": "5346.87",
          "description": "Rent"
        },
        {
          "date": "2025-07-19T15:11:45.132Z",
          "type": "debit",
          "amount": "4148.61",
          "description": "Dining"
        },
        {
          "date": "2025-07-20T10:04:39.549Z",
          "type": "debit",
          "amount": "8847.20",
          "description": "Rent"
        },
        {
          "date": "2025-07-28T18:09:37.015Z",
          "type": "debit",
          "amount": "3115.21",
          "description": "Dining"
        },
        {
          "date": "2025-08-05T01:15:20.007Z",
          "type": "credit",
          "amount": "31934.64",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-08-13T19:36:09.139Z",
          "type": "debit",
          "amount": "5601.18",
          "description": "Travel"
        },
        {
          "date": "2025-08-15T07:29:36.846Z",
          "type": "debit",
          "amount": "1461.52",
          "description": "Dining"
        },
        {
          "date": "2025-08-19T15:29:43.704Z",
          "type": "debit",
          "amount": "4469.26",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-08-19T16:13:42.753Z",
          "type": "debit",
          "amount": "6754.83",
          "description": "Rent"
        },
        {
          "date": "2025-08-25T00:36:56.351Z",
          "type": "debit",
          "amount": "4825.46",
          "description": "Online Shopping"
        },
        {
          "date": "2025-09-01T08:47:26.550Z",
          "type": "credit",
          "amount": "49015.82",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-09-04T17:41:27.641Z",
          "type": "debit",
          "amount": "2599.10",
          "description": "Rent"
        },
        {
          "date": "2025-09-05T09:41:40.316Z",
          "type": "debit",
          "amount": "7037.95",
          "description": "Rent"
        },
        {
          "date": "2025-09-06T03:51:21.863Z",
          "type": "credit",
          "amount": "26568.59",
          "description": "Bonus"
        },
        {
          "date": "2025-09-09T14:00:56.688Z",
          "type": "debit",
          "amount": "6486.08",
          "description": "Travel"
        },
        {
          "date": "2025-09-09T16:54:12.551Z",
          "type": "debit",
          "amount": "2098.13",
          "description": "Grocery"
        },
        {
          "date": "2025-09-13T09:00:48.601Z",
          "type": "debit",
          "amount": "3876.41",
          "description": "Grocery"
        },
        {
          "date": "2025-09-14T02:17:11.210Z",
          "type": "debit",
          "amount": "1312.87",
          "description": "Rent"
        },
        {
          "date": "2025-09-15T04:48:05.857Z",
          "type": "debit",
          "amount": "1630.00",
          "description": "Online Shopping"
        },
        {
          "date": "2025-09-17T08:03:04.721Z",
          "type": "debit",
          "amount": "7244.13",
          "description": "Dining"
        },
        {
          "date": "2025-09-27T20:39:08.350Z",
          "type": "credit",
          "amount": "22466.70",
          "description": "Salary Credit"
        }
      ]
    },
    {
      "bankName": "SBI",
      "accountNumber": "6512158206",
      "balance": "475624.35",
      "transactions": [
        {
          "date": "2024-10-13T15:19:08.898Z",
          "type": "credit",
          "amount": "41702.70",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2024-10-16T18:04:23.773Z",
          "type": "debit",
          "amount": "4767.98",
          "description": "Dining"
        },
        {
          "date": "2024-10-30T11:06:16.242Z",
          "type": "debit",
          "amount": "4162.56",
          "description": "Travel"
        },
        {
          "date": "2024-11-02T11:33:00.976Z",
          "type": "credit",
          "amount": "34490.39",
          "description": "Bonus"
        },
        {
          "date": "2024-11-02T23:18:00.088Z",
          "type": "debit",
          "amount": "3121.04",
          "description": "Grocery"
        },
        {
          "date": "2024-11-09T04:46:53.440Z",
          "type": "credit",
          "amount": "24285.03",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2024-11-27T12:59:24.860Z",
          "type": "credit",
          "amount": "49999.27",
          "description": "Refund"
        },
        {
          "date": "2024-11-28T04:30:40.688Z",
          "type": "debit",
          "amount": "1250.11",
          "description": "Grocery"
        },
        {
          "date": "2024-12-04T12:55:17.076Z",
          "type": "debit",
          "amount": "8584.84",
          "description": "Travel"
        },
        {
          "date": "2024-12-14T02:50:46.271Z",
          "type": "credit",
          "amount": "12635.44",
          "description": "Refund"
        },
        {
          "date": "2024-12-15T03:01:41.952Z",
          "type": "debit",
          "amount": "6303.46",
          "description": "Electricity Bill"
        },
        {
          "date": "2024-12-17T13:58:27.902Z",
          "type": "debit",
          "amount": "9459.98",
          "description": "Electricity Bill"
        },
        {
          "date": "2024-12-20T06:15:34.383Z",
          "type": "debit",
          "amount": "743.46",
          "description": "Dining"
        },
        {
          "date": "2024-12-23T18:13:19.029Z",
          "type": "debit",
          "amount": "2080.23",
          "description": "Online Shopping"
        },
        {
          "date": "2025-01-12T08:55:25.199Z",
          "type": "credit",
          "amount": "49785.23",
          "description": "Salary Credit"
        },
        {
          "date": "2025-01-21T10:49:56.940Z",
          "type": "credit",
          "amount": "45266.71",
          "description": "Refund"
        },
        {
          "date": "2025-01-25T12:40:58.112Z",
          "type": "debit",
          "amount": "3739.26",
          "description": "Online Shopping"
        },
        {
          "date": "2025-01-25T13:24:49.220Z",
          "type": "debit",
          "amount": "7709.05",
          "description": "Rent"
        },
        {
          "date": "2025-01-27T00:48:14.691Z",
          "type": "debit",
          "amount": "9152.58",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-01-29T18:02:11.556Z",
          "type": "debit",
          "amount": "4852.01",
          "description": "Rent"
        },
        {
          "date": "2025-01-31T18:49:24.865Z",
          "type": "credit",
          "amount": "44196.33",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-02-19T04:30:52.349Z",
          "type": "credit",
          "amount": "39024.48",
          "description": "Refund"
        },
        {
          "date": "2025-03-01T14:35:02.276Z",
          "type": "credit",
          "amount": "9353.78",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-03-02T00:35:55.651Z",
          "type": "debit",
          "amount": "7487.31",
          "description": "Rent"
        },
        {
          "date": "2025-03-03T23:25:03.425Z",
          "type": "debit",
          "amount": "9411.41",
          "description": "Rent"
        },
        {
          "date": "2025-03-04T04:17:51.860Z",
          "type": "credit",
          "amount": "35767.31",
          "description": "Salary Credit"
        },
        {
          "date": "2025-03-04T06:58:25.945Z",
          "type": "credit",
          "amount": "32594.00",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-03-08T04:16:08.140Z",
          "type": "debit",
          "amount": "2050.71",
          "description": "Dining"
        },
        {
          "date": "2025-03-23T11:32:03.591Z",
          "type": "credit",
          "amount": "15507.58",
          "description": "Salary Credit"
        },
        {
          "date": "2025-03-26T01:09:37.278Z",
          "type": "debit",
          "amount": "5215.79",
          "description": "Travel"
        },
        {
          "date": "2025-03-28T12:13:56.191Z",
          "type": "debit",
          "amount": "892.63",
          "description": "Dining"
        },
        {
          "date": "2025-04-06T07:08:00.409Z",
          "type": "debit",
          "amount": "3930.39",
          "description": "Travel"
        },
        {
          "date": "2025-04-20T01:02:13.981Z",
          "type": "debit",
          "amount": "9345.21",
          "description": "Online Shopping"
        },
        {
          "date": "2025-04-21T06:36:55.526Z",
          "type": "debit",
          "amount": "8846.65",
          "description": "Grocery"
        },
        {
          "date": "2025-05-01T20:44:16.171Z",
          "type": "debit",
          "amount": "8011.45",
          "description": "Online Shopping"
        },
        {
          "date": "2025-05-05T11:50:12.948Z",
          "type": "debit",
          "amount": "9345.38",
          "description": "Online Shopping"
        },
        {
          "date": "2025-05-09T06:36:37.803Z",
          "type": "credit",
          "amount": "1199.99",
          "description": "Salary Credit"
        },
        {
          "date": "2025-05-09T12:02:16.573Z",
          "type": "debit",
          "amount": "9797.39",
          "description": "Grocery"
        },
        {
          "date": "2025-06-01T09:38:21.921Z",
          "type": "debit",
          "amount": "8137.67",
          "description": "Online Shopping"
        },
        {
          "date": "2025-06-09T02:02:25.661Z",
          "type": "credit",
          "amount": "48384.13",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-06-10T09:04:48.589Z",
          "type": "credit",
          "amount": "3773.69",
          "description": "Bonus"
        },
        {
          "date": "2025-06-11T18:40:21.640Z",
          "type": "debit",
          "amount": "1366.51",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-06-14T14:56:43.084Z",
          "type": "debit",
          "amount": "6606.52",
          "description": "Dining"
        },
        {
          "date": "2025-06-17T07:30:15.631Z",
          "type": "credit",
          "amount": "9057.31",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-06-29T09:50:07.308Z",
          "type": "credit",
          "amount": "16304.58",
          "description": "Salary Credit"
        },
        {
          "date": "2025-07-08T12:22:25.771Z",
          "type": "debit",
          "amount": "3317.56",
          "description": "Travel"
        },
        {
          "date": "2025-07-24T15:00:05.725Z",
          "type": "debit",
          "amount": "9849.39",
          "description": "Grocery"
        },
        {
          "date": "2025-07-27T19:03:13.612Z",
          "type": "debit",
          "amount": "6352.77",
          "description": "Dining"
        },
        {
          "date": "2025-08-12T22:20:05.917Z",
          "type": "credit",
          "amount": "2265.14",
          "description": "Bonus"
        },
        {
          "date": "2025-08-14T01:31:34.343Z",
          "type": "credit",
          "amount": "48778.33",
          "description": "Refund"
        },
        {
          "date": "2025-08-19T11:44:04.164Z",
          "type": "credit",
          "amount": "48419.88",
          "description": "Refund"
        },
        {
          "date": "2025-08-20T03:42:17.555Z",
          "type": "debit",
          "amount": "9223.28",
          "description": "Online Shopping"
        },
        {
          "date": "2025-08-22T02:10:12.871Z",
          "type": "credit",
          "amount": "21670.25",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-08-22T14:06:59.967Z",
          "type": "debit",
          "amount": "6209.44",
          "description": "Rent"
        },
        {
          "date": "2025-09-13T19:45:12.910Z",
          "type": "credit",
          "amount": "18768.74",
          "description": "Salary Credit"
        },
        {
          "date": "2025-09-23T11:44:27.065Z",
          "type": "debit",
          "amount": "4099.12",
          "description": "Rent"
        },
        {
          "date": "2025-09-23T16:55:30.904Z",
          "type": "debit",
          "amount": "887.35",
          "description": "Rent"
        },
        {
          "date": "2025-09-29T14:03:08.317Z",
          "type": "debit",
          "amount": "8820.50",
          "description": "Dining"
        },
        {
          "date": "2025-09-30T12:30:33.754Z",
          "type": "debit",
          "amount": "4531.47",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-10-01T04:35:41.586Z",
          "type": "debit",
          "amount": "8546.80",
          "description": "Grocery"
        }
      ]
    },
    {
      "bankName": "Axis",
      "accountNumber": "9793012850",
      "balance": "276553.10",
      "transactions": [
        {
          "date": "2024-10-03T05:44:11.317Z",
          "type": "debit",
          "amount": "2179.21",
          "description": "Electricity Bill"
        },
        {
          "date": "2024-10-03T08:35:37.029Z",
          "type": "debit",
          "amount": "849.37",
          "description": "Rent"
        },
        {
          "date": "2024-10-21T21:00:03.558Z",
          "type": "credit",
          "amount": "36735.58",
          "description": "Refund"
        },
        {
          "date": "2024-10-28T16:36:44.855Z",
          "type": "debit",
          "amount": "7975.37",
          "description": "Travel"
        },
        {
          "date": "2024-11-01T19:21:48.940Z",
          "type": "debit",
          "amount": "5287.28",
          "description": "Grocery"
        },
        {
          "date": "2024-11-06T17:30:43.889Z",
          "type": "credit",
          "amount": "23938.65",
          "description": "Refund"
        },
        {
          "date": "2024-11-09T07:54:31.160Z",
          "type": "debit",
          "amount": "1253.07",
          "description": "Dining"
        },
        {
          "date": "2024-11-14T02:56:08.867Z",
          "type": "debit",
          "amount": "3079.03",
          "description": "Online Shopping"
        },
        {
          "date": "2024-11-26T09:41:39.451Z",
          "type": "debit",
          "amount": "6511.90",
          "description": "Dining"
        },
        {
          "date": "2024-11-30T01:50:32.217Z",
          "type": "credit",
          "amount": "11085.99",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2024-12-28T08:01:14.579Z",
          "type": "credit",
          "amount": "5795.48",
          "description": "Bonus"
        },
        {
          "date": "2024-12-30T12:18:19.064Z",
          "type": "debit",
          "amount": "7164.11",
          "description": "Grocery"
        },
        {
          "date": "2025-01-03T21:57:03.225Z",
          "type": "credit",
          "amount": "16662.24",
          "description": "Bonus"
        },
        {
          "date": "2025-01-07T04:13:49.570Z",
          "type": "debit",
          "amount": "7055.86",
          "description": "Grocery"
        },
        {
          "date": "2025-01-08T10:05:45.641Z",
          "type": "debit",
          "amount": "1569.09",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-01-11T10:24:53.885Z",
          "type": "debit",
          "amount": "7657.58",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-01-19T06:06:33.551Z",
          "type": "debit",
          "amount": "4878.27",
          "description": "Rent"
        },
        {
          "date": "2025-01-21T12:22:11.671Z",
          "type": "debit",
          "amount": "8806.31",
          "description": "Travel"
        },
        {
          "date": "2025-01-23T07:57:19.582Z",
          "type": "debit",
          "amount": "7556.95",
          "description": "Online Shopping"
        },
        {
          "date": "2025-01-29T16:23:10.472Z",
          "type": "debit",
          "amount": "7768.48",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-02-07T10:23:58.842Z",
          "type": "debit",
          "amount": "7094.85",
          "description": "Grocery"
        },
        {
          "date": "2025-02-16T07:00:02.824Z",
          "type": "debit",
          "amount": "6789.95",
          "description": "Dining"
        },
        {
          "date": "2025-02-17T02:44:15.413Z",
          "type": "credit",
          "amount": "42479.29",
          "description": "Bonus"
        },
        {
          "date": "2025-02-17T19:40:31.570Z",
          "type": "debit",
          "amount": "5229.89",
          "description": "Rent"
        },
        {
          "date": "2025-02-17T22:16:08.991Z",
          "type": "debit",
          "amount": "2025.09",
          "description": "Grocery"
        },
        {
          "date": "2025-02-25T00:22:24.738Z",
          "type": "debit",
          "amount": "5971.85",
          "description": "Grocery"
        },
        {
          "date": "2025-03-04T15:44:07.491Z",
          "type": "debit",
          "amount": "9770.28",
          "description": "Travel"
        },
        {
          "date": "2025-03-23T10:48:48.845Z",
          "type": "credit",
          "amount": "22860.23",
          "description": "Refund"
        },
        {
          "date": "2025-04-04T12:32:27.776Z",
          "type": "credit",
          "amount": "24760.12",
          "description": "Refund"
        },
        {
          "date": "2025-04-11T14:58:33.374Z",
          "type": "debit",
          "amount": "1593.87",
          "description": "Dining"
        },
        {
          "date": "2025-04-12T07:47:23.850Z",
          "type": "debit",
          "amount": "5438.24",
          "description": "Dining"
        },
        {
          "date": "2025-04-16T05:31:49.430Z",
          "type": "credit",
          "amount": "38345.22",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-04-28T19:11:20.484Z",
          "type": "debit",
          "amount": "2426.27",
          "description": "Grocery"
        },
        {
          "date": "2025-05-05T20:51:04.064Z",
          "type": "credit",
          "amount": "33338.96",
          "description": "Salary Credit"
        },
        {
          "date": "2025-05-07T12:06:32.618Z",
          "type": "debit",
          "amount": "9685.94",
          "description": "Rent"
        },
        {
          "date": "2025-05-12T10:29:26.188Z",
          "type": "debit",
          "amount": "4586.56",
          "description": "Dining"
        },
        {
          "date": "2025-05-28T19:05:03.003Z",
          "type": "debit",
          "amount": "4766.42",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-05-31T02:10:37.603Z",
          "type": "debit",
          "amount": "2756.67",
          "description": "Rent"
        },
        {
          "date": "2025-06-17T08:25:47.316Z",
          "type": "credit",
          "amount": "16696.69",
          "description": "Salary Credit"
        },
        {
          "date": "2025-06-22T12:15:09.502Z",
          "type": "debit",
          "amount": "9493.40",
          "description": "Rent"
        },
        {
          "date": "2025-06-23T02:14:56.811Z",
          "type": "debit",
          "amount": "7083.01",
          "description": "Travel"
        },
        {
          "date": "2025-06-24T22:55:26.684Z",
          "type": "debit",
          "amount": "7459.86",
          "description": "Travel"
        },
        {
          "date": "2025-06-27T04:39:30.272Z",
          "type": "debit",
          "amount": "7889.92",
          "description": "Travel"
        },
        {
          "date": "2025-07-02T23:15:49.061Z",
          "type": "credit",
          "amount": "29379.81",
          "description": "Refund"
        },
        {
          "date": "2025-07-05T22:24:26.887Z",
          "type": "credit",
          "amount": "18442.17",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-07-10T09:21:07.264Z",
          "type": "debit",
          "amount": "6460.96",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-07-16T22:28:08.092Z",
          "type": "credit",
          "amount": "23516.02",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-07-31T18:04:36.622Z",
          "type": "debit",
          "amount": "8688.25",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-08-07T07:59:22.916Z",
          "type": "debit",
          "amount": "1911.81",
          "description": "Online Shopping"
        },
        {
          "date": "2025-08-09T20:02:38.205Z",
          "type": "credit",
          "amount": "3887.47",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-08-12T14:26:41.918Z",
          "type": "debit",
          "amount": "6775.58",
          "description": "Dining"
        },
        {
          "date": "2025-08-13T19:47:56.360Z",
          "type": "credit",
          "amount": "40784.24",
          "description": "Salary Credit"
        },
        {
          "date": "2025-08-29T11:51:04.781Z",
          "type": "debit",
          "amount": "9053.82",
          "description": "Grocery"
        },
        {
          "date": "2025-09-09T20:30:21.289Z",
          "type": "debit",
          "amount": "6921.45",
          "description": "Travel"
        },
        {
          "date": "2025-09-10T02:56:21.494Z",
          "type": "credit",
          "amount": "21399.35",
          "description": "Salary Credit"
        },
        {
          "date": "2025-09-11T10:53:39.772Z",
          "type": "credit",
          "amount": "23749.72",
          "description": "Transfer from Wallet"
        },
        {
          "date": "2025-09-13T06:25:03.215Z",
          "type": "debit",
          "amount": "1950.44",
          "description": "Rent"
        },
        {
          "date": "2025-09-13T20:44:38.812Z",
          "type": "credit",
          "amount": "28172.25",
          "description": "Refund"
        },
        {
          "date": "2025-09-17T03:57:35.052Z",
          "type": "debit",
          "amount": "3145.37",
          "description": "Electricity Bill"
        },
        {
          "date": "2025-09-30T10:50:00.470Z",
          "type": "debit",
          "amount": "3790.00",
          "description": "Rent"
        }
      ]
    }
  ],
  "creditScore": [
    {
      "date": "2024-11-07T13:42:25.376Z",
      "score": 708
    },
    {
      "date": "2024-12-05T01:27:56.709Z",
      "score": 693
    },
    {
      "date": "2024-12-16T17:03:00.555Z",
      "score": 720
    },
    {
      "date": "2024-12-23T09:20:06.165Z",
      "score": 710
    },
    {
      "date": "2025-02-23T09:40:43.526Z",
      "score": 695
    },
    {
      "date": "2025-03-02T15:12:43.141Z",
      "score": 711
    },
    {
      "date": "2025-03-21T15:58:25.290Z",
      "score": 704
    },
    {
      "date": "2025-04-15T21:03:55.643Z",
      "score": 683
    },
    {
      "date": "2025-06-10T08:38:36.573Z",
      "score": 710
    },
    {
      "date": "2025-07-12T14:35:55.690Z",
      "score": 707
    },
    {
      "date": "2025-07-22T05:11:42.775Z",
      "score": 689
    },
    {
      "date": "2025-08-03T02:24:53.674Z",
      "score": 704
    }
  ],
  "loans": [
    {
      "loanType": "Home Loan",
      "principal": 1200000,
      "interestRate": 7.25,
      "startDate": "2025-03-26T01:50:35.258Z",
      "endDate": "2032-12-25T14:33:28.097Z",
      "monthlyEMI": 14088,
      "outstandingAmount": 1091522
    }
  ],
  "mutualFunds": [
    {
      "fundName": "Murray, Beahan and Braun Growth Fund",
      "units": 35.72035729185444,
      "nav": 228.54774758683303,
      "date": "2025-10-01T09:17:16.654Z"
    },
    {
      "fundName": "Fadel - Quigley Growth Fund",
      "units": 71.25083613913985,
      "nav": 91.1189454334187,
      "date": "2025-09-21T10:11:59.315Z"
    },
    {
      "fundName": "Frami - Hane Growth Fund",
      "units": 51.29585988548609,
      "nav": 110.01848277879,
      "date": "2025-09-05T06:03:59.301Z"
    },
    {
      "fundName": "Wunsch and Sons Growth Fund",
      "units": 11.205352829768028,
      "nav": 203.08756118381476,
      "date": "2025-09-16T23:24:08.580Z"
    },
    {
      "fundName": "Stark, Mayert and Pollich Growth Fund",
      "units": 114.17841241810267,
      "nav": 247.9746387745389,
      "date": "2025-09-30T01:31:13.748Z"
    },
    {
      "fundName": "Pouros Group Growth Fund",
      "units": 95.75009685508554,
      "nav": 125.28904963234085,
      "date": "2025-09-28T01:36:42.857Z"
    },
    {
      "fundName": "Schoen, Lebsack and Hansen Growth Fund",
      "units": 127.84815728428896,
      "nav": 71.18246753132844,
      "date": "2025-09-10T18:38:40.910Z"
    },
    {
      "fundName": "Baumbach, Roberts and Reichert Growth Fund",
      "units": 128.52589889230384,
      "nav": 203.4212941120265,
      "date": "2025-09-28T02:03:20.041Z"
    }
  ],
  "stocks": [
    {
      "symbol": "TCS",
      "quantity": 83,
      "avgBuyPrice": "1259.81",
      "currentPrice": "1738.17",
      "date": "2025-09-26T10:21:08.761Z"
    },
    {
      "symbol": "INFY",
      "quantity": 85,
      "avgBuyPrice": "1222.92",
      "currentPrice": "999.46",
      "date": "2025-09-17T22:16:10.485Z"
    },
    {
      "symbol": "RELIANCE",
      "quantity": 75,
      "avgBuyPrice": "1784.58",
      "currentPrice": "1470.93",
      "date": "2025-08-22T00:17:36.989Z"
    },
    {
      "symbol": "HDFCBANK",
      "quantity": 63,
      "avgBuyPrice": "2341.67",
      "currentPrice": "1984.11",
      "date": "2025-10-01T09:13:10.513Z"
    },
    {
      "symbol": "LT",
      "quantity": 19,
      "avgBuyPrice": "949.75",
      "currentPrice": "789.93",
      "date": "2025-09-09T04:33:04.786Z"
    },
    {
      "symbol": "ITC",
      "quantity": 96,
      "avgBuyPrice": "2323.13",
      "currentPrice": "2788.01",
      "date": "2025-09-20T15:46:52.651Z"
    }
  ],
  "insurance": [
    {
      "policyName": "Life Shield",
      "provider": "LIC",
      "premium": 15000,
      "coverageAmount": 1000000,
      "startDate": "2023-10-20T05:33:51.105Z",
      "endDate": "2027-07-30T19:58:09.932Z",
      "type": "life"
    },
    {
      "policyName": "Health Secure",
      "provider": "Star Health",
      "premium": 10000,
      "coverageAmount": 700000,
      "startDate": "2024-12-15T05:20:55.534Z",
      "endDate": "2025-12-19T09:05:28.586Z",
      "type": "health"
    }
  ]
}
'''
    data = json.loads(imported_data)
    transactions = []
    # Process all transactions from all banks
    for bank in data['banks']:
        if not isinstance(bank, dict) or 'transactions' not in bank:
            continue  # Skip if bank doesn't have required structure
        
        for txn in bank['transactions']:
            try:
                # Convert amount to float and date to datetime
                txn['amount'] = float(txn['amount'])
                txn['date'] = pd.to_datetime(txn['date'])
                txn['type'] = txn['type'].lower()
                txn['bank'] = bank['bankName']
                transactions.append(txn)
            except Exception as e:
                # Skip malformed transactions
                continue

    # Convert to DataFrame
    df = pd.DataFrame(transactions)
    
    if df.empty:
        return []
    
    # Filter for debit transactions only (as anomalies are typically high-value debits)
    debits = df[df['type'] == 'debit'].copy()
    
    if debits.empty:
        return []
    
    # Step 1: Z-score anomaly detection
    debits['zscore'] = zscore(debits['amount'])
    debits['zscore_anomaly'] = debits['zscore'].abs() > 1.5  # Using 3 instead of 25 for more sensitivity
    
    # Step 2: Isolation Forest anomaly detection
    iso_forest = IsolationForest(contamination=0.1, random_state=42)  # Adjusted contamination
    debits['iso_anomaly'] = iso_forest.fit_predict(debits[['amount']])
    debits['iso_anomaly'] = debits['iso_anomaly'] == -1
    
    # Step 3: Combine both methods
    debits['is_anomaly'] = debits['zscore_anomaly'] & debits['iso_anomaly']
    
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
    
    if anomalies.empty:
        return []
    
    # Format anomalies as list of dictionaries
    anomaly_list = []
    for _, row in anomalies.iterrows():
        anomaly = {
            'date': row['date'].isoformat(),
            'amount': row['amount'],
            'description': row['description'],
            'bank': row['bank'],
            'reason': row['reason'],
            'zscore': float(row['zscore']) if not pd.isna(row['zscore']) else None
        }
        anomaly_list.append(anomaly)
    
    # Sort by amount in descending order
    anomaly_list.sort(key=lambda x: x['amount'], reverse=True)
    
    return anomaly_list