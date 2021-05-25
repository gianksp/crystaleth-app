import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'
import {
  CChart,
} from '@coreui/react-chartjs'

import Miner from '../crystals/Miner.js'
import UserCard from '../users/UserCard.js'
import AvailableBalance from '../cards/AvailableBalance.js'
import StakedBalance from '../cards/StakedBalance.js'

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
      <CCard className="info-card">
      <CCardBody>
        <blockquote className="card-bodyquote">
          <h1 className="info-card-savings">INTERESTS</h1>
          <h1 className="info-card-amount">$136,00</h1>
        </blockquote>

        <CChart
        type="line"
        datasets={[
          {
            label: 'Projected',
            backgroundColor: 'rgba(229,150,255,0.2)',
            borderColor: 'rgba(229,150,255,0.2)',
            pointBackgroundColor: 'rgba(229,150,255,0.2)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(229,150,255,0.2)',
            tooltipLabelColor: 'rgba(229,150,255,0.2)',
            data: [0, 0, 1, 5, 10, 20, 60, 150, 160, 180, 190, 230]
          },
          {
            label: 'Realized',
            backgroundColor: 'rgba(180,134,255,1)',
            borderColor: 'rgba(180,134,255,1)',
            pointBackgroundColor: 'rgba(180,134,255,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(180,134,255,1)',
            tooltipLabelColor: 'rgba(180,134,255,1)',
            data: [0, 0, 1, 5, 10, 20, 60]
          }
        ]}
        options={{
          aspectRatio: 2,
          tooltips: {
            enabled: true
          },
          scales: {
            yAxes: [{
            ticks: {
              min: 0,
              max: 230,
              stepSize: 100,
              reverse: false,
              beginAtZero: true
            }
          }]}
        }}
        labels={[
          'January', 'February', 'March', 'April',
          'May', 'June', 'July', 'August', 'September', 'Ocober', 'November', 'December'
        ]}
      />

      </CCardBody>
    </CCard>
      </CCol>
      <CCol xs="12" sm="12" md="12" lg="6" xl="6" >
      <CCard className="info-card">
      <CCardBody>
        <blockquote className="card-bodyquote">
          <h1 className="info-card-lottery">LOTTERY</h1>
          <div className="lottery-time-container">
            <h1 className="info-card-amount">$15.749,00</h1>
            <CCol>
              <h4 className="lottery-time">TODAY</h4>
              <h4 className="lottery-timer"> 0d 00h 15m 34s </h4>
            </CCol>

          </div>
        </blockquote>
          <Miner></Miner>
        <CRow>
          <CButton color="primary" size="lg" className="text-center main-action-button card-action-button">
            MINE CRYSTALS
          </CButton>
        </CRow>
      </CCardBody>
    </CCard>
      </CCol>
    </CRow>

    </>
  )
}

export default Account
