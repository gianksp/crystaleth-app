import React, {useState} from 'react'
import {
  CCard,
  CModal,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CFormText,
  CCardBody,
  CButton,
  CInputFile,
  CRow,
} from '@coreui/react'
import { useMoralis } from "react-moralis"

const UserModal = ({show, onClose}) => {

  const { Moralis, user } = useMoralis()
  const [email, setEmail] = useState(user.get('email'))
  const [username, setUsername] = useState(user.get('username'))
  const {setMessage} = global.context

  const saveModal = async () => {
    user.setUsername(username)
    user.setEmail(email)
    await user.save()
    setMessage("A welome email has been sent to you!")
    onClose()
  }

  const onModalEmailChange = (evt) => setEmail(evt.target.value)
  const onModalUsernameChange = (evt) => setUsername(evt.target.value)
  const onModalProfileImageChange = async (evt) =>  {
    const data = evt.target.files[0]
    const file = new Moralis.File(data.name, data)
    await file.saveIPFS()

    const jobApplication = new Moralis.Object('Applications')
    jobApplication.set('name', user.id)
    jobApplication.set('profileUrl', file)
    jobApplication.set('timestamp', new Date().getTime())
    await jobApplication.save()
  }

  return (
    <CModal title="Edit" show={show}>
      <CCard>
        <CCardBody>
          <CForm action="" method="post">
              <CFormGroup>
                <CLabel htmlFor="nf-username">Username</CLabel>
                <CInput
                  type="username"
                  id="nf-username"
                  name="nf-username"
                  placeholder="Select your username"
                  autoComplete="username"
                  value={username}
                  onChange={onModalUsernameChange}
                />
                <CFormText className="help-block">Please enter your username</CFormText>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="nf-email">Email</CLabel>
                <CInput
                  type="email"
                  id="nf-email"
                  name="nf-email"
                  placeholder="Enter Email.."
                  autoComplete="email"
                  value={email}
                  onChange={onModalEmailChange}
                />
                <CFormText className="help-block">Please enter your email</CFormText>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="nf-email">Profile picture</CLabel>
                <CInputFile
                  onChange={onModalProfileImageChange}
                />
                <CFormText className="help-block">Please select your profile image</CFormText>
              </CFormGroup>
            </CForm>
            <CRow>
              <CButton color="primary" size="md" className="mr-3 mb-xl-0 text-center main-action-button card-action-button" onClick={onClose}>
                CANCEL
              </CButton>
              <CButton color="primary" size="md" className="mr-3 mb-xl-0 text-center main-action-button card-action-button" onClick={saveModal}>
                SAVE
              </CButton>
            </CRow>
          </CCardBody>
      </CCard>
    </CModal>
  )
}

export default UserModal
