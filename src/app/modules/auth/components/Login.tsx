/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import { getUserByToken, login } from '../core/_requests'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useAuth } from '../core/Auth'
import api from '../../../api'
import { useIntl } from 'react-intl'
import { useSetupContext } from '../../../constructor/helpers/SetupContext'


//зачистить иниты перед конечной выгрузкой в прод
const initialValues = {
  email: "",
  password: "",
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const { context, refetch: contextRefetch } = useSetupContext()
  const haveRegistration = Boolean(context.sign_up)
  const intl = useIntl()
  const [loading, setLoading] = useState(false)
  const { saveAuth, setCurrentUser } = useAuth()

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email(intl.formatMessage({ id: "AUTH.LOGIN_EMAIL_VALIDATION_FORMAT" }))
      .min(3, intl.formatMessage({ id: "AUTH.LOGIN_EMAIL_VALIDATION_MIN_LENGTH" }))
      .max(50, intl.formatMessage({ id: "AUTH.LOGIN_EMAIL_VALIDATION_MAX_LENGTH" }))
      .required(intl.formatMessage({ id: "AUTH.LOGIN_EMAIl_VALIDATION_REQUIRED" })),
    password: Yup.string()
      .min(8, intl.formatMessage({ id: "AUTH.LOGIN_PASSWORD_VALIDATION_MIN_LENGTH" }))
      .max(50, intl.formatMessage({ id: "AUTH.LOGIN_PASSWORD_VALIDATION_MAX_LENGTH" }))
      .required(intl.formatMessage({ id: "AUTH.LOGIN_PASSWORD_VALIDATION_REQUIRED" })),
  })
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        /*  const {data: auth} = await login(values.email, values.password) */
        const { data: token } = await api("users", "sign-in", { email: values.email, password: values.password })
        localStorage.setItem("authToken", token)
        const { data: user } = await api("users", "get-current")
        contextRefetch()
        setCurrentUser(user)
        /*  saveAuth(auth)
         const {data: user} = await getUserByToken(auth.api_token)
         setCurrentUser(user) */
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus(intl.formatMessage({ id: "AUTH.LOGIN_INCORRECT_DATA" }))
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  return (
    <form
      className='auth_form form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Heading */}
      <div className='text-center mb-8'>
        <h1 className='auth_formTitle'>{intl.formatMessage({ id: "AUTH.LOGIN_TITLE" })}</h1>
        <div className='auth_formDescription'>{intl.formatMessage({ id: "AUTH.LOGIN_DESCRIPTION" })}</div>
      </div>
      {/* begin::Heading */}

      {formik.status ? (
        <div className='mb-5 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : null}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='auth_fieldLabel form-label'>{intl.formatMessage({ id: "AUTH.EMAIL_TITLE" })}</label>
        <input
          placeholder='Email'
          {...formik.getFieldProps('email')}
          className={clsx(
            'auth_field form-control bg-transparent',
            { 'is-invalid': formik.touched.email && formik.errors.email },
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
          type='email'
          name='email'
          autoComplete='off'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-3'>
        <label className='auth_fieldLabel form-label'>{intl.formatMessage({ id: "AUTH.PASSWORD_TITLE" })}</label>
        <input
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'auth_field form-control bg-transparent',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div />

        {/* begin::Link */}
        <Link to='/auth/forgot-password' className='link-primary'>
          {intl.formatMessage({ id: "AUTH.LOGIN_FORGOT_PASSWORD_LINK" })}
        </Link>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className='d-grid mb-5'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='auth_button btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>{intl.formatMessage({ id: "AUTH.LOGIN_SUBMIT_BUTTON" })}</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              {intl.formatMessage({ id: "AUTH.AWAIT_STATUS" })}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}
      {
        haveRegistration ? <div className='text-center fw-semibold fs-6'>
          {intl.formatMessage({ id: "AUTH.LOGIN_REGISTRATION" })}{' '}
          <Link to='/auth/registration' className='link-primary'>
            {intl.formatMessage({ id: "AUTH.LOGIN_REGISTRATION_LINK" })}
          </Link>
        </div> : null
      }

    </form>
  )
}
