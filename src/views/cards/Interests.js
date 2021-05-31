import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
} from '@coreui/react'
import {
  CChart,
} from '@coreui/react-chartjs'
import { useMoralis } from "react-moralis"
import { DividendContract } from '../../contracts/DividendContract.js'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import maxBy from 'lodash/maxBy'
import moment from 'moment'

const Interests = () => {

  const { Moralis, web3, user, isAuthenticated } = useMoralis()
  const { dividendSymbol } = DividendContract()
  const {crystals, operation, message, setDividends, dividends, totalDividend, setTotalDividend} = global.context
  const [chartMax, setChartMax] = useState(100)

  useEffect(() => {
    loadInterestInfo()
  }, [dividendSymbol, user, crystals, message, operation, isAuthenticated])
  console.log(dividends)
  const loadInterestInfo = () => {

    if (!isAuthenticated)
      return

    Moralis.Cloud.run("getTokenTransfers", {contractAddress:process.env.REACT_APP_DIVIDEND_CONTRACT}).then((data) =>{
      const transactions = get(data, 'data.data.items', [])
      const txs = []
      console.log(transactions)
      transactions.forEach((tx) => {
        const txfers = get(tx, 'transfers', [])
        txfers.forEach((txfer) => {
          if (txfer.transfer_type === 'IN') {
            txfer.value = web3.utils.fromWei(txfer.delta)
            txs.push(txfer)
          }
        })
      })
      setDividends(txs)
    })

    if (dividendSymbol)
      Moralis.Cloud.run("getTokenBalances", {ticker:dividendSymbol}).then((data) =>{
        console.log("Token balances for contract "+process.env.REACT_APP_DIVIDEND_CONTRACT)
        console.log(get(data, 'data.data.items', []))
        const item = get(data, 'data.data.items', []).filter((item) => item.contract_address.toLowerCase() === process.env.REACT_APP_DIVIDEND_CONTRACT.toLowerCase())
        console.log("Match")
        console.log(item)
        if (!isEmpty(item)) {
          const itemBalance = item[0]
          setTotalDividend(web3.utils.fromWei(itemBalance.balance.toString()))
          if (!isEmpty(dividends)) {
            let max = 100
            dividends.forEach((dividend) => {
              const divVal = parseInt(dividend.value)
              if (divVal > max)
                max = divVal
            })
            setChartMax(max)
          }
        } else {
          setTotalDividend(0)
        }

      })
  }

  const chartX = dividends.map((dividend) => moment(dividend.block_signed_at).calendar())
  const chartY = dividends.map((dividend) => dividend.value)

  const getTop = () => {
    if (isEmpty(chartY))
      return 100
    let max = 100
    chartY.forEach((item) => {
      const divVal = parseInt(item)
      if (divVal > max)
        max = divVal
    })
    return max
  }

  return (
    <>
      <CCard className="info-card">
        <CCardBody>
          <blockquote className="card-bodyquote">
            <h1 className="info-card-savings">INTERESTS</h1>
            <h1 className="info-card-amount">{`$${parseFloat(totalDividend || 0).toFixed(2)}`}</h1>
          </blockquote>

          <CChart
          type="line"
          datasets={[
            {
              label: 'Dividend Projected',
              backgroundColor: 'rgba(229,150,255,0.2)',
              borderColor: 'rgba(229,150,255,0.2)',
              pointBackgroundColor: 'rgba(229,150,255,0.2)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(229,150,255,0.2)',
              tooltipLabelColor: 'rgba(229,150,255,0.2)',
              data: [0, 0, 1, 5, 10, 20, 60, 150, 160, 180, 190, 230]
            },
            {
              label: 'Dividend Received',
              backgroundColor: 'rgba(180,134,255,1)',
              borderColor: 'rgba(180,134,255,1)',
              pointBackgroundColor: 'rgba(180,134,255,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(180,134,255,1)',
              tooltipLabelColor: 'rgba(180,134,255,1)',
              data: chartY
            }
          ]}
          options={{
            aspectRatio: 2,
            tooltips: {
              enabled: true
            },
            scales: {
              yAxes: [{
              ticks: {
                min: 0,
                max: getTop(),
                stepSize: getTop()/5,
                reverse: false,
                beginAtZero: true
              }
            }]}
          }}
          labels={ chartX }
        />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Interests
