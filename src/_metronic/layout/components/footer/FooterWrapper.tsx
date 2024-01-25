import { useSetupContext } from '../../../../app/constructor/helpers/SetupContext'
import { useLayout } from '../../core'
import { Footer } from './Footer'

const FooterWrapper = () => {
  const { config } = useLayout()
  const { context: { footer } } = useSetupContext()

  if (!footer/* !config.app?.footer?.display */) {
    return null
  }

  return (
    <div className='app-footer' id='kt_app_footer'>
      <Footer />
    </div>
  )
}

export { FooterWrapper }
