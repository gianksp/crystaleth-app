import { dividendContract as abi } from './Abi.js'
import { useMoralis } from 'react-moralis'
import { useState, useEffect } from 'react'

import isEmpty from 'lodash/isEmpty'

export const DividendContract = () => {
  const { web3 } = useMoralis()
  const [dividendContract, setDividendContract] = useState({})
  const [dividendSymbol, setDividendSymbol] = useState()
  const [dividendDecimals] = useState(18)

  useEffect(() => {

    if (isEmpty(dividendContract) && !isEmpty(abi)) {
      const Contract = new web3.eth.Contract(abi, process.env.REACT_APP_DIVIDEND_CONTRACT)
      Contract.setProvider(window.ethereum)
      setDividendContract(Contract)

      if (!isEmpty(Contract)) {
        Contract.methods.symbol().call().then((symbol) => setDividendSymbol(symbol))
      }
    }

  }, [dividendContract, web3]);

  return {
    dividendContract,
    dividendSymbol,
    dividendDecimals
  }
}
