import React from 'react'
import SVG, { ErrorCallback } from 'react-inlinesvg'
import {toAbsoluteUrl} from '../AssetHelpers'
type Props = {
  className?: string
  path: string
  svgClassName?: string,
  onError?: ErrorCallback
}

const KTSVG: React.FC<Props> = ({className = '', path, svgClassName = 'mh-50px', onError}) => {
  return (
    <span className={`svg-icon ${className}`}>
      <SVG src={toAbsoluteUrl(path)} className={svgClassName} onError={onError} />
    </span>
  )
}

export {KTSVG}
