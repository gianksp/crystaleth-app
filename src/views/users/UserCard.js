import React, {useState} from 'react'
import {
  CCol,
  CRow,
  CCard,
  CImg,
  CButton,
} from '@coreui/react'
import { useMoralis } from "react-moralis"
import UserModal from "./UserModal.js"
import UserAvatar from "./UserAvatar.js"

const UserCard = () => {

  const { authenticate, isAuthenticated, logout } = useMoralis()
  const [showModal, setShowModal] = useState()

  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  const authenticatedUser = (
    <CRow className="avatar-card">
      <UserAvatar />
      <CButton onClick={openModal} className="edit-name-button">Edit</CButton>
      <CButton onClick={logout} className="edit-name-button logout-button">Logout</CButton>
      <UserModal
        show={showModal}
        onClose={closeModal}
      />
    </CRow>
  )

  const unauthenticatedUser = (
    <CCard className="authenticate-card" onClick={authenticate}>
      <CRow className="authenticate-banner">
        <CCol className="avatar-container">
            <CImg src='images/metamask.svg' className="metamask-login" />
        </CCol>
        <CCol>
          <h1 className="authenticate-title">Sign in with Metamask</h1>
        </CCol>
      </CRow>
    </CCard>
  )

  return isAuthenticated ? authenticatedUser : unauthenticatedUser
}

export default UserCard
