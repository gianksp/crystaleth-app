import Abi from './Abi.js'
import { useMoralis } from 'react-moralis'
import { useState, useEffect } from 'react'

import isEmpty from 'lodash/isEmpty'

export const Contract = () => {
  const { web3 } = useMoralis()
  const [contract, setContract] = useState({})
  const [symbol, setSymbol] = useState()
  const [decimals] = useState(18)

  useEffect(() => {

    if (isEmpty(contract)) {
      const Contract = new web3.eth.Contract(Abi, process.env.REACT_APP_CONTRACT)
      Contract.setProvider(window.ethereum)
      setContract(Contract)

      if (!isEmpty(Contract))
        Contract.methods.symbol().call().then((symbol) => setSymbol(symbol))
    }

  }, [contract, web3]);

  return {
    contract,
    symbol,
    decimals
  }
}
