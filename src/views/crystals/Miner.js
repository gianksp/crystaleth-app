import React, {useState} from 'react'
import { CCard, CCardBody, CCol, CRow} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const Miner = () => {

  const [minedCrystals, setMinedCrystals] = useState(0)

  const moused = (evt) => {

    if (minedCrystals === evt.target.id) {
      setMinedCrystals(0)
    } else {
      setMinedCrystals(evt.target.id)
    }

  }

  const crystals = () => {
    let crystalsToRender = []
    for (let i=1; i<= 16;i++) {

      const iconToDisplay = minedCrystals >= i ? "images/crystal_on.png" : "images/crystal_off.png"
      crystalsToRender.push((<CIcon id={i} key={i} src={iconToDisplay} className="crystal-to-mine" onClick={moused} />))
    }
    return crystalsToRender
  }

  return (
    <CRow className="miner-card">
      <CCol lg={12}>
        <CCard className="no-border">
          <CCardBody>
            <CCol>
              {crystals()}
            </CCol>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Miner
