/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect} from 'react'
import {Outlet, Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import { getBackground } from '../../constructor/helpers/dynamicStyles'

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100%'
    }
    return () => {
      if (root) {
        root.style.height = 'auto'
      }
    }
  }, [])

  return (
    <div className='auth-layout d-flex flex-column flex-lg-row flex-column-fluid h-100' style={{backgroundImage: `url(${toAbsoluteUrl(`/media/crm/backgrounds/${getBackground()}`)})`}}>
      {/* begin::Body */}
      <div className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1'>
        {/* begin::Form */}
        <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
          {/* begin::Wrapper */}
          <div className='auth_formContainer w-lg-500px p-12'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export {AuthLayout}
