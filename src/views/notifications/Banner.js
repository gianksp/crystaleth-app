import React from 'react'
import {
  CLink,
  CRow,
  CAlert,
} from '@coreui/react'

const Banner = () => {
  const { message, operation, setMessage } = global.context

  const discardOnTimer = () => {
    setTimeout(() => {
      setMessage()
    }, 4000)
  }

  const closeModal = () => {
    setMessage()
  }

  const infoMessage = message && !operation && (
    <CAlert color="primary" onShowChange={discardOnTimer} fade={true}>{message}</CAlert>
  )

  const operationMessage = operation && (
    <CAlert color="primary" closeButton={true} fade={true} onClick={closeModal}>
      <div>Your operation was successful, you can
        <CLink className="tx-link" href={`https://explorer-mumbai.maticvigil.com/tx/${operation}/token-transfers`} target="_blank">
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
