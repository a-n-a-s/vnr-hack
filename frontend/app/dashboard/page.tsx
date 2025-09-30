'use client';
import Sidebar from '@/components/dashboard/Sidebar';
import Link from 'next/link'

import { CartesianGrid, Line, LineChart, XAxis, Pie, PieChart } from "recharts"


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


import { Progress } from "@/components/ui/progress"

const DashboardPage = () => {



  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "July", desktop: 214, mobile: 140 },
    { month: "August", desktop: 214, mobile: 140 },
    { month: "September", desktop: 214, mobile: 140 },
    { month: "October", desktop: 214, mobile: 140 },
    { month: "November", desktop: 214, mobile: 140 },
    { month: "December", desktop: 214, mobile: 140 },
  ]

  const chartData2 = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
  ]

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig


  const chartConfig2 = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "var(--chart-1)",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
    firefox: {
      label: "Firefox",
      color: "var(--chart-3)",
    },
    edge: {
      label: "Edge",
      color: "var(--chart-4)",
    },
    other: {
      label: "Other",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig
  return (
    <>
      <div className='flex flex-col p-12 gap-12 w-full max-w-full'>
        <div className='w-full text-green-800 text-4xl  font-bold'>

          Dashboard
        </div>
        {/* Overview Section */}
        <div className='flex w-full flex-col gap-6'>
          <h3 className='text-xl'>
            Overview
          </h3>
          <div>

            <span className='text-7xl font-bold'>59,000</span><span className=' text-green-700 text-lg'>.67</span>
            <p className='text-gray-500'>Total Bank Balance</p>
          </div>
          <div className='flex  items-center justify-between my-6'>
            <div>

              <span className='text-5xl font-bold'>782</span><span className=' text-green-700'>.00</span>
              <p className='text-gray-500'>Credit Score</p>
            </div>
            <div>

              <span className='text-5xl font-bold'>2,50,000</span><span className=' text-green-700'>.50</span>
              <p className='text-gray-500'>Outstanding Loans</p>
            </div>
            <div>

              <span className='text-5xl font-bold'>3,20,000</span><span className=' text-green-700'>.67</span>
              <p className='text-gray-500'>Net Investment Value</p>
            </div>
            <div>

              <span className='text-5xl font-bold'>10,00,000</span><span className=' text-green-700'>.67</span>
              <p className='text-gray-500'>Net Investment Value</p>
            </div>
          </div>
          <p className='text-gray-700 t'>Pretty Nice wealth You have got there !</p>


        </div>
        {/* Activity Sections */}
        <div className='flex w-full flex-col gap-6'>
          <h3 className='text-xl'>
            Activity
          </h3>
          {/* first one  */}
          <div className='flex items-center justify-between gap-6  '>
            <div className='h-96 w-1/2'>


              <Card className='h-full'>
                <CardHeader>
                  <CardTitle>Monthly Bank Balance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <LineChart
                      accessibilityLayer
                      data={chartData}
                      margin={{
                        left: 10,
                        right: 10,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}

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
            </div>
            <Card className='w-1/2 h-96'>
              <CardHeader>
                <CardTitle>Investment Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig2}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData2}
                      dataKey="visitors"
                      nameKey="browser"
                      innerRadius={60}
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          {/* Second one */}
          <div className='flex items-center justify-between gap-6 '>
            <div className='w-4/6 '>
              <Card>
                <CardHeader>
                  <CardTitle>Loan Repayment Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={75} className='w-full h-4' />
                </CardContent>
              </Card>
            </div>
            <div className='w-2/6 '>
              <Card>
                <CardHeader>
                  <CardTitle>Credit Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={78} className='w-full h-4' />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>


        {/* {Bank Accounts} */}
        <div className='flex flex-col  justify-between gap-6 '>
          <h3 className='text-xl'>Bank Accounts</h3>
          <div className='w-full'>
            {/*  Table containg bank name number balance last transaaction */}
            <table className='w-full table-auto'>
              <thead>
                <tr>
                  <th className='text-left'>Bank Name</th>
                  <th className='text-left'>Account Number</th>
                  <th className='text-left'>Balance</th>
                  <th className='text-left'>Last Transaction</th>
                </tr>
              </thead>
              <tbody className=''>
                <tr>
                  <td className='text-left'>Bank of America</td>
                  <td className='text-left'>1234567890</td>
                  <td className='text-left'>$10,000.00</td>
                  <td className='text-left'>2023-01-01</td>
                </tr>
                <tr>
                  <td className='text-left'>Bank of America</td>
                  <td className='text-left'>1234567890</td>
                  <td className='text-left'>$10,000.00</td>
                  <td className='text-left'>2023-01-01</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Investments */}
        <div className='flex flex-col  justify-between gap-6 '>
          <h3 className='text-xl'>Investments</h3>
          <div className='w-full'>
            {/*  Table containg bank name number balance last transaaction */}
            <table className='w-full table-auto'>
              <thead>
                <tr>
                  <th className='text-left'>Investment Name</th>
                  <th className='text-left'>Amount Invested</th>
                  <th className='text-left'>Current Value</th>
                  <th className='text-left'>Return</th>
                </tr>
              </thead>
              <tbody className=''>
                <tr>
                  <td className='text-left'>Bank of America</td>
                  <td className='text-left'>$10,000.00</td>
                  <td className='text-left'>$10,000.00</td>
                  <td className='text-left'>$0.00</td>
                </tr>
                <tr>
                  <td className='text-left'>Bank of America</td>
                  <td className='text-left'>$10,000.00</td>
                  <td className='text-left'>$10,000.00</td>
                  <td className='text-left'>$0.00</td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>

        {/* {Insurance} */}
        <div className='flex flex-col  justify-between gap-6 '>
          <h3 className='text-xl'>Insurance</h3>
          <div className='w-full'>
            {/*  Table containg bank name number balance last transaaction */}
            <table className='w-full table-auto'>
              <thead>
                <tr>
                  <th className='text-left'>Insurance Name</th>
                  <th className='text-left'>Premium</th>
                  <th className='text-left'>Expiration Date</th>
                </tr>
              </thead>
              <tbody className=''>
                <tr>
                  <td className='text-left'>Bank of America</td>
                  <td className='text-left'>$10,000.00</td>
                  <td className='text-left'>2023-01-01</td>
                </tr>
                <tr>
                  <td className='text-left'>Bank of America</td>
                  <td className='text-left'>$10,000.00</td>
                  <td className='text-left'>2023-01-01</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;