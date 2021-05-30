import { stakingContract as abi } from './Abi.js'
import { useMoralis } from 'react-moralis'
import { useState, useEffect } from 'react'

import isEmpty from 'lodash/isEmpty'

export const StakingContract = () => {
  const { web3 } = useMoralis()
  const [stakingContract, setStakingContract] = useState({})
  const [stakingSymbol, setStakingSymbol] = useState()
  const [stakingDecimals] = useState(18)

  useEffect(() => {

    if (isEmpty(stakingContract) && !isEmpty(abi)) {
      const Contract = new web3.eth.Contract(abi, process.env.REACT_APP_STAKE_CONTRACT)
      Contract.setProvider(window.ethereum)
      setStakingContract(Contract)

      if (!isEmpty(Contract)){
        Contract.methods.symbol().call().then((symbol) => setStakingSymbol(symbol))
      }
    }

  }, [stakingContract, web3]);

  return {
    stakingContract,
    stakingSymbol,
    stakingDecimals
  }
}
