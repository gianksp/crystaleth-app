import React from 'react'
import {
  TheContent,
  AppSidebar,
  TheHeader,
  TheFooter
} from './index'
import Banner from '../views/notifications/Banner.js'

const TheLayout = () => {
  return (
    <div className="c-app c-default-layout">
      <AppSidebar/>
      <div className="c-wrapper">
        <TheHeader/>
        <Banner />
        <TheContent/>
        <TheFooter />
      </div>
    </div>
  )
}

export default TheLayout
