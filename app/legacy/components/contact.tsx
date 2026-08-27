'use client'

import { FormEvent, useRef, useState } from 'react'
import '@/app/legacy/contact/contact.css'

type Brand = {
  name?: string | null
  email?: string | null
  maps?: string | null
  address?: string | null
  telephone?: string | null
}

type ContactProps = {
  oneBrand?: Brand
  aboutHref?: string
}

type FormValues = {
  name: string
  email: string
  country: string
  subject: string
  message: string
  website: string
  fromemail: string
  hp_company: string // honeypot: must stay empty
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const MIN_FILL_MS = 3000 // humans take longer than this

const initialValues: FormValues = {
  name: '',
  email: '',
  country: '',
  subject: '',
  message: '',
  website: '',
  fromemail: '',
  hp_company: '',
}



function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Please enter a valid email address.'
  if (values.country.trim().length < 2) errors.country = 'Please enter a valid country name.'
  if (values.subject.trim().length < 5) errors.subject = 'Subject must be at least 5 characters.'
  if (values.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.'
  return errors
}

export default function Contact({ oneBrand, aboutHref = '/about' }: ContactProps) {
  const [values, setValues] = useState<FormValues>({
    ...initialValues,
    website: oneBrand?.name ?? '',
    fromemail: oneBrand?.email ?? '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [mapLoading, setMapLoading] = useState(Boolean(oneBrand?.maps))
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string }>()
  const mountedAt = useRef(Date.now())

  const updateValue = (name: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setNotice(undefined)
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const elapsedMs = Date.now() - mountedAt.current

    // Bot traps: silently pretend success so bots get no feedback signal.
    if (values.hp_company.trim() !== '' || elapsedMs < MIN_FILL_MS) {
      setNotice({ type: 'success', text: 'Thank you for reaching out. We will get back to you.' })
      return
    }

    setLoading(true)
    setNotice(undefined)

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, elapsedMs, old: true }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Message failed to send.')

      setValues({
        ...initialValues,
        website: oneBrand?.name ?? '',
        fromemail: oneBrand?.email ?? '',
      })
      mountedAt.current = Date.now()
      setNotice({ type: 'success', text: 'Thank you for reaching out. We will get back to you.' })
    } catch (error) {
      setNotice({
        type: 'error',
        text: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    } finally {
      setLoading(false)
    }
  }

  const field = (name: keyof FormValues, label: string, placeholder: string, type = 'text') => (
    <div className={'field'} key={name}>
      <label htmlFor={name} className={'label'}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={values[name]}
        placeholder={placeholder}
        onChange={(event) => updateValue(name, event.target.value)}
        className={'input'}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && <p id={`${name}-error`} className={'error'}>{errors[name]}</p>}
    </div>
  )

  return (
    <div className={'page'}>
      <div className={'panel'}>
        <h1 className={'title'}>Contact</h1>

        <div className={'columns'}>
          <div>
            {oneBrand ? (
              <>
                {oneBrand.maps ? (
                  <div className={'mapFrame'}>
                    {mapLoading && <p className={'mapLoading'}>Loading map...</p>}
                    <iframe
                      src={oneBrand.maps}
                      title="Location map"
                      loading="lazy"
                      className={'map'}
                      onLoad={() => setMapLoading(false)}
                    />
                  </div>
                ) : (
                  <div className={'emptyMap'}>
                    <strong>No Maps Available</strong>
                  </div>
                )}

                <div className={'contactDetails'}>
                  {oneBrand.address && (
                    <div className={'detail'}>
                      {/* <MapPin size={18} aria-hidden="true" /> */}
                      <p className={'detailText'}>{oneBrand.address}</p>
                    </div>
                  )}
                  {oneBrand.telephone && (
                    <div className={'detail'}>
                      {/* <Phone size={18} aria-hidden="true" /> */}
                      <p className={'detailText'}>{oneBrand.telephone}</p>
                    </div>
                  )}
                  {oneBrand.email && (
                    <div className={'detail'}>
                      {/* <Mail size={18} aria-hidden="true" /> */}
                      <p className={'detailText'}>{oneBrand.email}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={'emptyMap'}>
                <strong>No company information available</strong>
              </div>
            )}

            <a href={aboutHref} className={'aboutLink'}>
              Find Out More About Us
            </a>
          </div>

          <div className={'formCard'}>
            <h2 className={'formTitle'}>Send us a message</h2>
            <p className={'formDescription'}>Fill out the form below and we will get back to you.</p>

            {notice && (
              <p
                role="status"
                style={{
                  backgroundColor: notice.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: notice.type === 'success' ? '#166534' : '#991b1b',
                }}
                className={'notice'}
              >
                {notice.text}
              </p>
            )}

            <form onSubmit={onSubmit} className={'form'} noValidate>
              {field('name', 'Name', 'Your full name')}
              {field('email', 'Email', 'example@example.com', 'email')}
              {field('country', 'Country', 'Which country are you contacting us from')}
              {field('subject', 'Subject', 'What are you contacting us about')}

              <div className={'field'}>
                <label htmlFor="message" className={'label'}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={values.message}
                  placeholder="How can we help?"
                  onChange={(event) => updateValue('message', event.target.value)}
                  className={'textarea'}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && <p id="message-error" className={'error'}>{errors.message}</p>}
              </div>

              {/* Honeypot + hidden brand payload. Not rendered for humans. */}
              <div className={'offscreen'} aria-hidden="true">
                <label htmlFor="hp_company">Company</label>
                <input
                  id="hp_company"
                  name="hp_company"
                  type="text"
                  value={values.hp_company}
                  onChange={(event) => updateValue('hp_company', event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
                <label htmlFor="website">Website</label>
                <input id="website" name="website" value={values.website} readOnly tabIndex={-1} />
                <label htmlFor="fromemail">From Email</label>
                <input id="fromemail" name="fromemail" value={values.fromemail} readOnly tabIndex={-1} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`submit ${loading ? 'submitDisabled' : ''}`}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
