import React, {useState, useEffect} from 'react'
import { CCard, CCardBody, CButton, CRow, CInput, CModal } from '@coreui/react'
import { useMoralis } from "react-moralis"
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { StakingContract } from '../../contracts/StakingContract.js'
import MintButton from '../crystals/MintButton.js'

const AvailableBalance = () => {

  const { Moralis, web3, user, isAuthenticated } = useMoralis()
  const { stakingContract, stakingSymbol }  = StakingContract()
  const [showModal, setShowModal] = useState()
  const [stakeValue, setStakeValue] = useState(0)
  const {message, setMessage, operation, setOperation, available, setAvailable, staked, crystals} = global.context

  const setMaxStakeValue = () => {
    setStakeValue(available)
  }

  useEffect(() => {
    loadUnstakedBalances()
  }, [message, operation, isAuthenticated, available, crystals, staked])

  useEffect(() => {
    loadUnstakedBalances()
  }, [])

  const toggleModal = () => setShowModal(!showModal)

  const loadUnstakedBalances = async () => {
    if (!isAuthenticated)
      return
    Moralis.Cloud.run("getTokenBalances", {ticker:stakingSymbol}).then((data) =>{
      const item = get(data, 'data.data.items', []).filter((item) => item.contract_address.toLowerCase() === process.env.REACT_APP_STAKE_CONTRACT.toLowerCase())
      console.log(item)
      if (!isEmpty(item)) {
        const itemBalance = item[0]
        setAvailable(web3.utils.fromWei(itemBalance.balance.toString()))
      } else {
        setAvailable(0)
      }

    })
  }

  const createStake = () => {
    setShowModal(false)
    setMessage("We will notify when the operation completes!")
    stakingContract.methods.createStake(web3.utils.toWei(stakeValue.toString())).send({
      from:user.get('ethAddress')
    }).then((operation) => {
      setOperation(operation.transactionHash)
    })
  }

  const onStakingValueChange = (evt) => setStakeValue(evt.target.value)

  const hasBalance = () => available > 0

  const stakingModal = (
    <CModal
      title="Modal title"
      onClose={toggleModal}
      show={showModal}>
      <CCard>
        <CCardBody>
          <CRow className="card-item">
            <h3 className="title">Amount to stake for yield</h3>
          </CRow>
          <CRow className="staking-card-body">
            <CButton onClick={setMaxStakeValue}>{`Balance: ${available}`}</CButton>
            <CInput type="number" id="amount" value={stakeValue} onChange={onStakingValueChange} placeholder="Your amount to stake for rewards" required />
          </CRow>
          <CRow>
            <CButton color="primary" size="md" className="mr-3 mb-xl-0 text-center main-action-button card-action-button" onClick={toggleModal}>
              CANCEL
            </CButton>
            <CButton color="primary" size="md" className="mr-3 mb-xl-0 text-center main-action-button card-action-button" onClick={createStake}>
              STAKE
            </CButton>
          </CRow>
        </CCardBody>
      </CCard>
    </CModal>
  )

  const mintButton = () => {
    return !hasCrystals() && (<MintButton />)
  }

  const stakeButton = () => {
    return hasCrystals() && (<CButton className="staking-button" disabled={!hasBalance()} onClick={toggleModal}>Stake</CButton>)
  }

  const hasCrystals = () => {
    return staked > 0 || available > 0
  }

  const contentCard = isAuthenticated && (
    <CCard className="text-white text-right balance-widget balance-widget-item separated-card">
      <CCardBody>
        <blockquote className="card-bodyquote">
          <h5>Available Balance to Stake</h5>
          <h3>{stakingSymbol && `${stakingSymbol}`}{AvailableBalance && ` ${available}`}</h3>
          { mintButton() }
          { stakeButton() }
        </blockquote>
      </CCardBody>
      {showModal && stakingModal}
    </CCard>
  )

  const emptyCard = (
    <CCard className="text-white text-right empty-widget balance-widget-item separated-card">
      <CCardBody>
        <blockquote>
          <h5> Buy and stake {stakingSymbol} to earn daily USDT dividends from the liquidity pools!</h5>
        </blockquote>
      </CCardBody>
    </CCard>
  )

  return isAuthenticated ? contentCard : emptyCard
}

export default AvailableBalance
