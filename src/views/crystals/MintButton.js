import React, {useState} from 'react'
import { CButton } from '@coreui/react'
import { StakingContract } from '../../contracts/StakingContract.js'
import { useMoralis } from "react-moralis"

const MintButton = () => {
  const { user } = useMoralis()
  const [isMinting, setMinting] = useState()
  const {stakingContract} = StakingContract()
  const {setOperation} = global.context

  const mint = () => {
    console.log("mint now")
    setMinting(true)
    stakingContract.methods.mint(user.get('ethAddress')).send({
      from:user.get('ethAddress')
    }).then((operation) => {
      setOperation(operation.transactionHash)
    })
  }

  return (
    <CButton className="staking-button" disabled={isMinting} onClick={mint}>Get your share of crystals!</CButton>
  )
}

export default MintButton
