import React, {useState} from 'react'
import { CCard, CCardBody, CCol, CRow} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const Miner = () => {

  const {crystals, setCrystals} = global.context

  const moused = (evt) => {

    if (crystals === evt.target.id) {
      setCrystals(0)
    } else {
      setCrystals(evt.target.id)
    }
  }

  const getSelectedCrystals = () => {
    let crystalsToRender = []
    for (let i=1; i<= 16;i++) {

      const iconToDisplay = crystals >= i ? "images/icon_crystal.svg" : "images/icon_crystal_gray.svg"
      crystalsToRender.push((<CIcon id={i} key={i} src={iconToDisplay} height={46} className="crystal-to-mine" onClick={moused} />))
    }
    return crystalsToRender
  }

  return (
    <CRow className="miner-card">
      <CCol lg={12}>
        <CCard className="no-border">
          <CCardBody>
            <CCol>
              {getSelectedCrystals()}
            </CCol>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Miner
