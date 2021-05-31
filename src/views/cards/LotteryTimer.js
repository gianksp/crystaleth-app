import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'
import { SchedulerContract } from '../../contracts/SchedulerContract.js'
import { useMoralis } from "react-moralis"
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'

const Lottery = () => {
  const { cycle, timer } = SchedulerContract()
  const [targetDateTime, setTargetDateTime] = useState()
  const [timerStarted, setTimerStarted] = useState()

  useEffect(() => {
    if (timerStarted || isEmpty(cycle) || isEmpty(timer))
      return

    setTimerStarted(true)
    setInterval(() => {
      const totalDiff = cycle*timer
      const target = moment().add(totalDiff, 'seconds').endOf('hour')
      setTargetDateTime(target)
    }, 1000)
  }, [cycle, timer])

  const displayTimer = () => {
    if (isEmpty(targetDateTime))
      return

    const diffTime = moment(targetDateTime).diff(moment())
    const duration = moment.duration(diffTime, 'milliseconds')
    return `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`
  }

  const displayDrawDay = () => {
    return moment(targetDateTime).isSame(moment(), 'day') ? 'TODAY' : 'TOMORROW'
  }

  return (
    <>
      <CCol>
        <h4 className="lottery-time">{displayDrawDay()}</h4>
        <h3 className="lottery-timer">{displayTimer()}</h3>
      </CCol>
    </>
  )
}

export default Lottery
