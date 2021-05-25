import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'


const Transactions = () => {
  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              Historical Transactions
            </CCardHeader>
            <CCardBody>

              <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                <thead className="thead-light">
                  <tr>
                    <th>Details</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div>-10 USDT</div>
                      <div className="small text-muted">
                        <span>Withdraw</span>
                      </div>
                    </td>
                    <td>
                      <div className="clearfix">
                        <div className="float-left">
                          <span>Pending</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span>10 sec ago</span>
                    </td>
                  </tr>

                  <tr>
                  <td>
                    <div>+1550 USDT</div>
                    <div className="small text-muted">
                      <span>Prize Pool Winner!</span>
                    </div>
                  </td>
                  <td>
                    <div className="clearfix">
                      <div className="float-left">
                        <span>Completed</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span>3 days ago</span>
                  </td>
                </tr>

                <tr>
                <td>
                  <div>+25 USDT</div>
                  <div className="small text-muted">
                    <span>Accrued Interest</span>
                  </div>
                </td>
                <td>
                  <div className="clearfix">
                    <div className="float-left">
                      <span>Completed</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span>1 days ago</span>
                </td>
              </tr>

              <tr>
              <td>
                <div>+25 USDT</div>
                <div className="small text-muted">
                  <span>Accrued Interest</span>
                </div>
              </td>
              <td>
                <div className="clearfix">
                  <div className="float-left">
                    <span>Completed</span>
                  </div>
                </div>
              </td>
              <td>
                <span>2 days ago</span>
              </td>
            </tr>

            <tr>
            <td>
              <div>+25 USDT</div>
              <div className="small text-muted">
                <span>Accrued Interest</span>
              </div>
            </td>
            <td>
              <div className="clearfix">
                <div className="float-left">
                  <span>Completed</span>
                </div>
              </div>
            </td>
            <td>
              <span>3 days ago</span>
            </td>
          </tr>

              <tr>
              <td>
                <div>+1550 USDT</div>
                <div className="small text-muted">
                  <span>Deposit</span>
                </div>
              </td>
              <td>
                <div className="clearfix">
                  <div className="float-left">
                    <span>Completed</span>
                  </div>
                </div>
              </td>
              <td>
                <span>4 days ago</span>
              </td>
            </tr>


                </tbody>
              </table>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Transactions
