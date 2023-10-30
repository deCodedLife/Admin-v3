import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import { useIntl } from 'react-intl'
import api from '../../../api'

const initialValues = {
  email: '',
}


export function ForgotPassword() {
  const intl = useIntl()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email(intl.formatMessage({ id: "AUTH.RESET_PASSWORD_EMAIL_VALIDATION_FORMAT" }))
      .min(3, intl.formatMessage({ id: "AUTH.RESET_PASSWORD_EMAIL_VALIDATION_MIN_LENGTH" }))
      .max(50, intl.formatMessage({ id: "AUTH.RESET_PASSWORD_EMAIL_VALIDATION_MAX_LENGTH" }))
      .required(intl.formatMessage({ id: "AUTH.RESET_PASSWORD_EMAIl_VALIDATION_REQUIRED" })),
  })
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const { data: response } = await api("users", "forgot-password", { email: values.email })
        setLoading(false)
        if (response) {
          setSuccess(true)
        } else {
          throw new Error(intl.formatMessage({ id: "AUTH.RESET_PASSWORD_INCORRECT_DATA" }))
        }
      } catch {
        setStatus(intl.formatMessage({ id: "AUTH.RESET_PASSWORD_INCORRECT_DATA" }))
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  if (success) {
    return <div className="auth_form">
      <div className='text-center mb-8'>
        <h1 className='auth_formTitle'>{intl.formatMessage({ id: "AUTH.RESET_PASSWORD_SUCCESS_TITLE" })}</h1>
        <div className='auth_formDescription'>{intl.formatMessage({ id: "AUTH.RESET_PASSWORD_SUCCESS_DESCRIPTION" })}</div>
      </div>
      <div className='d-grid mb-5'>
        <Link to='/auth'>
          <button
            type='button'
            id='kt_login_signup_form_cancel_button'
            className='auth_button btn btn-secondary w-100'
          >
            {intl.formatMessage({ id: "BUTTON.PREVIOUS" })}
          </button>
        </Link>
      </div>
    </div>
  }

  return (
    <form
      className='auth_form form w-100'
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-10'>
        <h1 className='auth_formTitle'>{intl.formatMessage({ id: "AUTH.RESET_PASSWORD_TITLE" })}</h1>
        <div className='auth_formDescription'>{intl.formatMessage({ id: "AUTH.RESET_PASSWORD_DESCRIPTION" })}</div>
      </div>

    
      {formik.status ? (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : null}

     
      <div className='fv-row mb-8'>
        <label className='auth_fieldLabel form-label'>{intl.formatMessage({ id: "AUTH.EMAIL_TITLE" })}</label>
        <input
          type='email'
          placeholder=''
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx(
            'auth_field form-control bg-transparent',
            {'is-invalid': formik.touched.email && formik.errors.email},
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
  

      <div className='d-grid mb-5'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='auth_button btn btn-primary mb-5'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>{intl.formatMessage({ id: "BUTTON.SUBMIT" })}</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              {intl.formatMessage({ id: "AUTH.AWAIT_STATUS" })}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth'>
          <button
            type='button'
            id='kt_login_signup_form_cancel_button'
            className='auth_button btn btn-secondary w-100'
          >
            {intl.formatMessage({ id: "BUTTON.CANCEL" })}
          </button>
        </Link>
      </div>

    </form>
  )
}
