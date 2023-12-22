/* eslint-disable react/jsx-no-target-blank */
import {useEffect} from 'react'
import {ILayout, useLayout} from '../../core'
import { getProjectName } from '../../../../app/constructor/helpers/dynamicStyles'
import { getApiUrl } from '../../../../app/api'
import { useIntl } from 'react-intl'

const Footer = () => {
  const intl = useIntl()
  const {config} = useLayout()
  useEffect(() => {
    updateDOM(config)
  }, [config])
  return (
    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexGrow: 1, padding: "0 30px"}}>
      <div className='text-dark order-2 order-md-1'>
        <span className='text-muted fw-semibold me-1'>
          {new Date().getFullYear().toString()}&copy;
        </span>
        <a
          href="#"
          className='text-gray-800 text-hover-primary'
        >
          {getProjectName()}
        </a>
      </div>

      <ul className='menu menu-gray-600 menu-hover-primary fw-semibold order-1'>
        <li className='menu-item'>
          <a href={`${getApiUrl()}/uploads/rules.pdf`} target='_blank' className='menu-link px-2'>
          {intl.formatMessage({id: "FOOTER.RULES"})}
          </a>
        </li>

        <li className='menu-item'>
          <a href={`${getApiUrl()}/uploads/policy.pdf`} target='_blank' className='menu-link px-2'>
          {intl.formatMessage({id: "FOOTER.PRIVACY"})}
          </a>
        </li>
      </ul>
    </div>
  )
}

const updateDOM = (config: ILayout) => {
  if (config.app?.footer?.fixed?.desktop) {
    document.body.classList.add('data-kt-app-footer-fixed', 'true')
  }

  if (config.app?.footer?.fixed?.mobile) {
    document.body.classList.add('data-kt-app-footer-fixed-mobile', 'true')
  }
}

export {Footer}
