import { schedulerContract as abi } from './Abi.js'
import { useMoralis } from 'react-moralis'
import { useState, useEffect } from 'react'

import isEmpty from 'lodash/isEmpty'

export const SchedulerContract = () => {
  const { web3 } = useMoralis()
  const [schedulerContract, setSchedulerContract] = useState({})
  const [cycle, setCycle] = useState()
  const [timer, setTimer] = useState()

  useEffect(() => {

    if (isEmpty(schedulerContract) && !isEmpty(abi)) {
      const Contract = new web3.eth.Contract(abi, process.env.REACT_APP_SCHEDULER_CONTRACT)
      Contract.setProvider(window.ethereum)
      setSchedulerContract(Contract)

      if (!isEmpty(Contract)) {
        Contract.methods.currentCycle().call().then((currCycle) => setCycle(currCycle))
        Contract.methods.timer().call().then((time) => setTimer(time))
      }
    }

  }, [schedulerContract, web3]);

  return {
    schedulerContract,
    cycle,
    timer
  }
}
