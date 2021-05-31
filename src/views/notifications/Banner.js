import React from 'react'
import {
  CLink,
  CRow,
  CAlert,
} from '@coreui/react'

const Banner = () => {
  const { message, operation, setMessage, setOperation } = global.context

  const discardOnTimer = () => {
    setTimeout(() => {
      setMessage()
    }, 4000)
  }

  const closeModal = () => {
    setMessage()
    setOperation()
  }

  const infoMessage = message && !operation && (
    <CAlert color="primary" onShowChange={discardOnTimer} fade={true}>{message}</CAlert>
  )

  const operationMessage = operation && (
    <CAlert color="primary" closeButton={true} fade={true} onClick={closeModal}>
      <div>Your operation was successful, you can
        <CLink className="tx-link" href={`https://kovan.etherscan.io/tx/${operation}`} target="_blank">
          verify it here
        </CLink>
      </div>
    </CAlert>
  )

  return (
    <CRow>
      {infoMessage}
      {operationMessage}
    </CRow>
  )
}

export default Banner
