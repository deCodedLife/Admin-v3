/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useAuth } from '../core/Auth'
import { useIntl } from 'react-intl'
import api from '../../../api'
import { useSetupContext } from '../../../constructor/helpers/SetupContext'

const initialValues = {
  email: '',
  password: '',
  confirm_password: '',
}

export function Registration() {
  const setup = useSetupContext()
  const haveRegistration = Boolean(setup.sign_up)
  const intl = useIntl()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { saveAuth, setCurrentUser } = useAuth()

  const registrationSchema = Yup.object().shape({
    email: Yup.string()
      .email(intl.formatMessage({ id: "AUTH.REGISTRATION_EMAIL_VALIDATION_FORMAT" }))
      .min(3, intl.formatMessage({ id: "AUTH.REGISTRATION_EMAIL_VALIDATION_MIN_LENGTH" }))
      .max(50, intl.formatMessage({ id: "AUTH.REGISTRATION_EMAIL_VALIDATION_MAX_LENGTH" }))
      .required(intl.formatMessage({ id: "AUTH.REGISTRATION_EMAIl_VALIDATION_REQUIRED" })),
    password: Yup.string()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: intl.formatMessage({ id: "AUTH.REGISTRATION_PASSWORD_VALIDATION_COMBINATION" }) })
      .required(intl.formatMessage({ id: "AUTH.REGISTRATION_PASSWORD_VALIDATION_REQUIRED" })),
    confirm_password: Yup.string()
      .required(intl.formatMessage({ id: "AUTH.REGISTRATION_CONFIRM_PASSWORD_VALIDATION_REQUIRED" }))
      .when('password', {
        is: (val: string) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf([Yup.ref('password')], intl.formatMessage({ id: "AUTH.REGISTRATION_PASSWORD_VALIDATION_MATCH" })),
      }),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        const { data: response } = await api("users", "sign-up", { email: values.email, password: values.password })
        setLoading(false)
        if (Number.isNaN(response)) {
          throw new Error(response)
        } else {
          setSuccess(true)
        }
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus(intl.formatMessage({ id: "AUTH.REGISTRATION_INCORRECT_DATA" }))
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  if (success) {
    return <div className="auth_form">
      <div className='text-center mb-8'>
        <h1 className='auth_formTitle'>{intl.formatMessage({ id: "AUTH.REGISTRATION_SUCCESS_TITLE" })}</h1>
        <div className='auth_formDescription'>{intl.formatMessage({ id: "AUTH.REGISTRATION_SUCCESS_DESCRIPTION" })}</div>
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

  if (haveRegistration) {
    return <form
      className='auth_form form w-100'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className='text-center mb-8'>
        <h1 className='auth_formTitle'>{intl.formatMessage({ id: "AUTH.REGISTRATION_TITLE" })}</h1>
        <div className='auth_formDescription'>{intl.formatMessage({ id: "AUTH.REGISTRATION_DESCRIPTION" })}</div>
      </div>
      {/* end::Heading */}


      {formik.status ? (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : null}

      {/* begin::Form group Email */}
      <div className='fv-row mb-8'>
        <label className='auth_fieldLabel form-label'>{intl.formatMessage({ id: "AUTH.EMAIL_TITLE" })}</label>
        <input
          placeholder='Email'
          type='email'
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx(
            'auth_field form-control bg-transparent',
            { 'is-invalid': formik.touched.email && formik.errors.email },
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
      {/* end::Form group */}

      {/* begin::Form group Password */}
      <div className='fv-row mb-8' data-kt-password-meter='true'>
        <div className='mb-1'>
          <label className='auth_fieldLabel form-label'>{intl.formatMessage({ id: "AUTH.PASSWORD_TITLE" })}</label>
          <div className='position-relative mb-3'>
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
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className='fv-row mb-5'>
        <label className='auth_fieldLabel form-label'>{intl.formatMessage({ id: "AUTH.CONFIRM_PASSWORD_TITLE" })}</label>
        <input
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('confirm_password')}
          className={clsx(
            'auth_field form-control bg-transparent',
            {
              'is-invalid': formik.touched.confirm_password && formik.errors.confirm_password,
            },
            {
              'is-valid': formik.touched.confirm_password && !formik.errors.confirm_password,
            }
          )}
        />
        {formik.touched.confirm_password && formik.errors.confirm_password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.confirm_password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8' />


      {/* begin::Form group */}
      {/* begin::Action */}
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
      {/* end::Action */}
      {/* end::Form group */}
    </form>
  }

  return <div className="auth_form">
  <div className='text-center mb-8'>
    <h1 className='auth_formTitle'>{intl.formatMessage({ id: "AUTH.REGISTRATION_CLOSED_REGISTRATION_TITLE" })}</h1>
    <div className='auth_formDescription'>{intl.formatMessage({ id: "AUTH.REGISTRATION_CLOSED_REGISTRATION_DESCRIPTION" })}</div>
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
