import React from 'react'
import {
  CCard,
  CCardBody,
} from '@coreui/react'
import {
  CChart,
} from '@coreui/react-chartjs'


const Interests = () => {

  return (
    <>
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
    </>
  )
}

export default Interests
