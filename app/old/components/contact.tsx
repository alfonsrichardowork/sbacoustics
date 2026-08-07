'use client'

import { FormEvent, useRef, useState } from 'react'

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

const styles: Record<string, React.CSSProperties> = {
  page: { width: '100%', padding: '32px 64px', boxSizing: 'border-box', color: '#18181b', fontFamily: 'Arial, sans-serif' },
  panel: { width: '100%', padding: '24px', boxSizing: 'border-box', backgroundColor: '#ffffff', boxShadow: '0 4px 16px rgba(24, 24, 27, 0.18)' },
  title: { margin: '0 0 24px', textAlign: 'center', fontSize: '36px', lineHeight: 1.2 },
  columns: { display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(320px, 2fr)', gap: '32px', alignItems: 'start' },
  mapFrame: { position: 'relative', width: '100%', height: '384px', overflow: 'hidden', borderRadius: '8px', backgroundColor: '#e4e4e7' },
  map: { width: '100%', height: '100%', border: 0 },
  mapLoading: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e4e4e7', color: '#52525b' },
  emptyMap: { display: 'flex', minHeight: '384px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: '#f4f4f5', color: '#52525b', textAlign: 'center' },
  contactDetails: { display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px' },
  detail: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  detailText: { margin: 0, lineHeight: 1.5 },
  aboutLink: { display: 'inline-block', marginTop: '16px', padding: '10px 16px', backgroundColor: '#18181b', color: '#ffffff', textDecoration: 'none' },
  formCard: { padding: '24px', backgroundColor: '#ffffff', boxShadow: '0 4px 16px rgba(24, 24, 27, 0.18)' },
  formTitle: { margin: '0 0 8px', fontSize: '24px' },
  formDescription: { margin: '0 0 24px', color: '#71717a', lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: 600 },
  input: { width: '100%', minHeight: '42px', padding: '10px 12px', boxSizing: 'border-box', border: '1px solid #a1a1aa', borderRadius: '4px', backgroundColor: '#ffffff', color: '#18181b', font: 'inherit' },
  textarea: { width: '100%', minHeight: '120px', padding: '10px 12px', boxSizing: 'border-box', border: '1px solid #a1a1aa', borderRadius: '4px', resize: 'vertical', backgroundColor: '#ffffff', color: '#18181b', font: 'inherit' },
  error: { margin: 0, color: '#b91c1c', fontSize: '13px' },
  submit: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '44px', border: 0, borderRadius: '4px', backgroundColor: '#18181b', color: '#ffffff', font: 'inherit', fontWeight: 600, cursor: 'pointer' },
  submitDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  notice: { padding: '12px', borderRadius: '4px', lineHeight: 1.5 },
  offscreen: { position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' },
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
    <div style={styles.field} key={name}>
      <label htmlFor={name} style={styles.label}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={values[name]}
        placeholder={placeholder}
        onChange={(event) => updateValue(name, event.target.value)}
        style={styles.input}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && <p id={`${name}-error`} style={styles.error}>{errors[name]}</p>}
    </div>
  )

  return (
    <div style={styles.page}>
      <div style={styles.panel}>
        <h1 style={styles.title}>Contact</h1>

        <div style={styles.columns}>
          <div>
            {oneBrand ? (
              <>
                {oneBrand.maps ? (
                  <div style={styles.mapFrame}>
                    {mapLoading && <p style={styles.mapLoading}>Loading map...</p>}
                    <iframe
                      src={oneBrand.maps}
                      title="Location map"
                      loading="lazy"
                      style={styles.map}
                      onLoad={() => setMapLoading(false)}
                    />
                  </div>
                ) : (
                  <div style={styles.emptyMap}>
                    <strong>No Maps Available</strong>
                  </div>
                )}

                <div style={styles.contactDetails}>
                  {oneBrand.address && (
                    <div style={styles.detail}>
                      {/* <MapPin size={18} aria-hidden="true" /> */}
                      <p style={styles.detailText}>{oneBrand.address}</p>
                    </div>
                  )}
                  {oneBrand.telephone && (
                    <div style={styles.detail}>
                      {/* <Phone size={18} aria-hidden="true" /> */}
                      <p style={styles.detailText}>{oneBrand.telephone}</p>
                    </div>
                  )}
                  {oneBrand.email && (
                    <div style={styles.detail}>
                      {/* <Mail size={18} aria-hidden="true" /> */}
                      <p style={styles.detailText}>{oneBrand.email}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={styles.emptyMap}>
                <strong>No company information available</strong>
              </div>
            )}

            <a href={aboutHref} style={styles.aboutLink}>
              Find Out More About Us
            </a>
          </div>

          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Send us a message</h2>
            <p style={styles.formDescription}>Fill out the form below and we will get back to you.</p>

            {notice && (
              <p
                role="status"
                style={{
                  ...styles.notice,
                  backgroundColor: notice.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: notice.type === 'success' ? '#166534' : '#991b1b',
                }}
              >
                {notice.text}
              </p>
            )}

            <form onSubmit={onSubmit} style={styles.form} noValidate>
              {field('name', 'Name', 'Your full name')}
              {field('email', 'Email', 'example@example.com', 'email')}
              {field('country', 'Country', 'Which country are you contacting us from')}
              {field('subject', 'Subject', 'What are you contacting us about')}

              <div style={styles.field}>
                <label htmlFor="message" style={styles.label}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={values.message}
                  placeholder="How can we help?"
                  onChange={(event) => updateValue('message', event.target.value)}
                  style={styles.textarea}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && <p id="message-error" style={styles.error}>{errors.message}</p>}
              </div>

              {/* Honeypot + hidden brand payload. Not rendered for humans. */}
              <div style={styles.offscreen} aria-hidden="true">
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
                style={{ ...styles.submit, ...(loading ? styles.submitDisabled : {}) }}
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
