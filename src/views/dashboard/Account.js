import React, { useEffect, useState } from 'react'
import {
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalBody,
  CLink,
  CImg,
} from '@coreui/react'

import { useMoralis } from 'react-moralis'

import UserCard from '../users/UserCard.js'
import AvailableBalance from '../cards/AvailableBalance.js'
import StakedBalance from '../cards/StakedBalance.js'
import Lottery from '../cards/Lottery'
import Interests from '../cards/Interests'

const Account = () => {
  const  { web3 } = useMoralis()
  const [isNetwork, setNetwork] = useState(false)

  useEffect(() => {

    if (web3)
      web3.setProvider(window.ethereum)
      web3.eth.net.getId().then(netId => {
        console.log(netId)
        console.log(process.env.REACT_APP_NET_ID)
        if (netId == process.env.REACT_APP_NET_ID) {
          setNetwork(true)
        }
      })

  }, [web3])


  return (
    <>

    <CRow>
      <CCol xs="12" sm="12" md="12" lg="12" xl="6" className="avatar-card-container">
        <UserCard id={0} />
      </CCol>
      <CCol xs="12" sm="12" md="12" lg="6" xl="3">
        <AvailableBalance />
      </CCol>
      <CCol xs="12" sm="12" md="12" lg="6" xl="3">
        <StakedBalance />
      </CCol>
    </CRow>

    <CRow>
      <CCol xs="12" sm="12" md="12" lg="6" xl="46" >
        <Interests />
      </CCol>
      <CCol xs="12" sm="12" md="12" lg="6" xl="6" >
        <Lottery />
      </CCol>
    </CRow>

    <CModal
      show={!isNetwork}
      closeOnBackdrop={false}
    >
      <CModalHeader>
        <CImg src="images/crystalEthLogo.png" height={50} />
      </CModalHeader>
      <CModalBody>
        Before we begin, this a test project for the Moralis hackathon. As such,
        is running on a Ethereum test network. To get started:
        <h5>1. Download metamask</h5>
        <h5>2. Open metamask and change your network to "Kovan"</h5>
        <h5>3. Make sure to fund your account with some Eth from
        <CLink className="tx-link" href={`https://faucet.kovan.network/`} target="_blank">
          Test Faucet
        </CLink></h5>
        <h5>4. Refresh the page when ready</h5>
      </CModalBody>
    </CModal>

    </>
  )
}

export default Account
