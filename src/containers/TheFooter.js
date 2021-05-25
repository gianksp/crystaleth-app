import React from 'react'
import { CFooter, CImg } from '@coreui/react'
import { ByMoralis } from "react-moralis";

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="http://crystaleth.finance" target="_blank" rel="noopener noreferrer">CrystalEth</a>
        <span className="ml-1">&copy; {new Date().getFullYear()} Moralis Hackathon - Technologies used</span>
      </div>
      <div className="mfs-auto">
        <CImg src='images/polygon-matic-logo.svg' className="footer-tech"  height={40} width={40} />
        <CImg src='images/chainlink-link-logo.svg' className="footer-tech"  height={40} width={40}/>
        <CImg src='images/1inch-1inch-logo.svg' className="footer-tech"  height={40} width={40}/>
        <CImg src='images/lunar-crush.png' className="footer-tech"  height={40} width={160}/>
        <CImg src='images/covalent-logo.png' className="footer-tech"  height={24} width={102}/>
        <ByMoralis width={190} variant="dark"/>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
