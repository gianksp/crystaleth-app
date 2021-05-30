import React from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'
import {
  CChart,
} from '@coreui/react-chartjs'

import UserCard from '../users/UserCard.js'
import AvailableBalance from '../cards/AvailableBalance.js'
import StakedBalance from '../cards/StakedBalance.js'
import Lottery from '../cards/Lottery'
import Interests from '../cards/Interests'

const Account = () => {

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

    </>
  )
}

export default Account
