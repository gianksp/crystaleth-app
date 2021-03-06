import React, {useState, useEffect} from 'react'
import { CCard, CCardBody, CButton, CModal, CRow, CInput } from '@coreui/react'
import { useMoralis } from "react-moralis"
import isEmpty from 'lodash/isEmpty'
import { StakingContract } from '../../contracts/StakingContract.js'

const StakedBalance = () => {
  const { web3, user, isAuthenticated } = useMoralis()
  const { stakingContract, stakingSymbol }  = StakingContract()
  const [showModal, setShowModal] = useState()
  const [stakeValue, setStakeValue] = useState(0)
  const {setMessage, setOperation, staked, setStaked} = global.context

  const setMaxStakeValue = () => {
    setStakeValue(staked)
  }

  useEffect(() => {
    loadStakedBalance()
  })

  const toggleModal = () => setShowModal(!showModal)

  const loadStakedBalance = () => {
    if (isEmpty(stakingContract) || isEmpty(user))
      return
      stakingContract.methods.stakeOf(user.get('ethAddress')).call({
      from:user.get('ethAddress')
    }).then((staked) => setStaked(web3.utils.fromWei(staked)))
  }

  const removeStake = () => {
    setShowModal(false)
    setMessage("We will notify when the operation completes!")
    stakingContract.methods.removeStake(web3.utils.toWei(stakeValue)).send({
      from:user.get('ethAddress')
    }).then((operation) => {
      setOperation(operation.transactionHash)
    })
  }

  const hasBalance = () => staked > 0
  const onStakingValueChange = (evt) => setStakeValue(evt.target.value)

  const stakingModal = (
    <CModal
      title="Modal title"
      onClose={toggleModal}
      show={showModal}>
      <CCard>
          <CCardBody>
            <CRow className="card-item">
            <h3 className="title">Amount to remove from yield farming</h3>
          </CRow>
          <CRow className="staking-card-body">
            <CButton onClick={setMaxStakeValue}>{`Balance: ${staked}`}</CButton>
            <CInput type="number" id="amount" value={stakeValue} onChange={onStakingValueChange} placeholder="Your amount to stake for rewards" required />
          </CRow>
          <CRow>
            <CButton color="primary" size="md" className="mr-3 mb-xl-0 text-center main-action-button card-action-button" onClick={toggleModal}>
              CANCEL
            </CButton>
            <CButton color="primary" size="md" className="mr-3 mb-xl-0 text-center main-action-button card-action-button" onClick={removeStake}>
              UNSTAKE
            </CButton>
          </CRow>
        </CCardBody>
      </CCard>
    </CModal>
  )

  const contentCard = (
    <CCard className="text-white text-right balance-widget balance-widget-item separated-card">
      <CCardBody>
        <blockquote className="card-bodyquote">
          <h5>Staked Balance</h5>
          <h3>{stakingSymbol && `${stakingSymbol}`} {staked ? ` ${staked}`: ' 0'}</h3>
          <CButton className="staking-button" disabled={!hasBalance()} onClick={toggleModal}>Unstake</CButton>
        </blockquote>
      </CCardBody>
      {showModal && stakingModal}
    </CCard>
  )


  const emptyCard = (
    <CCard className="text-white text-right empty-widget balance-widget-item separated-card">
      <CCardBody>
        <blockquote className="card-bodyquote">
          <h5>Staking makes you eligible to win weekly prizes in USDT from the prizepool</h5>
        </blockquote>
      </CCardBody>
    </CCard>
  )

  return isAuthenticated ? contentCard : emptyCard
}

export default StakedBalance
