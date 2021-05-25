import React, {useState, useEffect} from 'react'
import {
  CCol,
  CRow,
  CImg,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { useMoralis } from "react-moralis"

const UserAvatar = () => {
  const { Moralis, user } = useMoralis()
  const [profileUrl, setProfileUrl] = useState('avatars/6.jpg')

  useEffect(() => {
    loadProfilePicture()
  })

  const loadProfilePicture = () => {
    const query = new Moralis.Query('Applications')
    query.equalTo('name', user.id)
    query.descending("createdAt")
    query.limit(1)
    query.find().then(function ([application]) {
      const ipfs = application.get('profileUrl').ipfs()
      setProfileUrl(ipfs)
    })
  }

  const verifiedEmail = user.attributes.emailVerified && (
    <CIcon content={freeSet.cilShieldAlt}></CIcon>
  )

  return (
    <CRow>
      <CCol className="avatar-container">
        <div className="main-avatar">
          <CImg
            src={profileUrl}
            className="c-avatar-img"
          >
          </CImg>
        </div>
      </CCol>
      <CCol className="avatar-title-container">
        <h1 className="avatar-title">{user.get('username')}</h1>
        <h3 className="avatar-subtitle">{user.get('email')} {verifiedEmail}</h3>
        <h3 className="avatar-subtitle">{user.get('ethAddress')}</h3>
      </CCol>
    </CRow>
  )
}

export default UserAvatar
