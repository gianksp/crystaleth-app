import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'
import { StakingContract } from '../../contracts/StakingContract.js'
import Miner from '../crystals/Miner.js'
import { useMoralis } from "react-moralis"
import isEmpty from 'lodash/isEmpty'
import LotteryTimer from './LotteryTimer.js'

const Lottery = () => {
  const { web3, user, isAuthenticated } = useMoralis()
  const { stakingContract } = StakingContract()
  const [prizePoolBalance, setPrizePoolBalance] = useState()
  const [poolStake, setPoolStake] = useState()
  const [poolParticipants, setPoolParticipants] = useState()
  const {crystals, setMessage, setOperation, operation, message} = global.context

  useEffect(() => {
    loadPrizePoolinfo()
  }, [stakingContract, user, crystals, message, operation, isAuthenticated])

  const loadPrizePoolinfo = () => {

    if (!isAuthenticated)
      return

    if (isEmpty(stakingContract) || isEmpty(user))
      return

    stakingContract.methods.totalPrizePool().call().then((balance) => setPrizePoolBalance(web3.utils.fromWei(balance)))
    stakingContract.methods.prizePoolStakeOf(user.get('ethAddress')).call().then((myStake) => setPoolStake(myStake))
    stakingContract.methods.totalPoolParticipants().call().then((participants) => setPoolParticipants(participants))
  }

  const chanceToWin = () => {
    if (poolParticipants == 0 || poolStake == 0)
      return 0

    return (poolStake * 100 / poolParticipants).toFixed(2)
  }

  const mine = () => {
    if (!isAuthenticated || crystals == 0)
      return

    setMessage("We will notify when the operation completes!")
    stakingContract.methods.prizePoolStake(crystals).send({
      from:user.get('ethAddress')
    }).then((operation) => {
      setOperation(operation.transactionHash)
    })
  }

  return (
    <>
      <CCard className="info-card">
        <CCardBody>
          <blockquote className="card-bodyquote">
            <h1 className="info-card-lottery">LOTTERY</h1>
            <div className="lottery-time-container">
              <h1 className="info-card-amount">{`$${prizePoolBalance || 0}`}</h1>
              <LotteryTimer />
            </div>
            <div>
              <h4>My crystals mined: {poolStake || 0}</h4>
              <h4>Total crystals mined: {poolParticipants || 0}</h4>
              <h4>Change to win next draw: {poolStake > 0 ? chanceToWin() : 0}%</h4>
            </div>
          </blockquote>
            <Miner></Miner>
          <CRow>
            <CButton color="primary" size="lg" className="text-center main-action-button card-action-button" onClick={mine}>
              MINE CRYSTALS
            </CButton>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Lottery
