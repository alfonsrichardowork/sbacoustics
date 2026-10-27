interface EmailConfirmationProps {
  name: string;
  website: string;
}

interface EmailTemplateProps {
  name: string;
  email: string;
  country: string;
  subject: string;
  message: string;
  website: string;
}

const emailStyles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    backgroundImage: `url(${process.env.NEXT_PUBLIC_ROOT_URL}/images/sbacoustics/contactheader.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative' as const,
    padding: '60px 20px',
    textAlign: 'center' as const,
    color: '#ffffff',
    backgroundColor: '#1a1a1a',
  },
  headerOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 0,
  },
  headerContent: {
    position: 'relative' as const,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  headerSubtitle: {
    fontSize: '14px',
    fontWeight: '500',
    opacity: 0.95,
    margin: 0,
  },
  content: {
    padding: '16px',
    color: '#1a1a1a',
  },
  greeting: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1a1a1a',
  },
  message: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#4a4a4a',
    margin: '0 0 0 0',
  },
  section: {
    backgroundColor: '#f8f9fa',
    padding: '10px',
    marginBottom: '16px',
    borderRadius: '6px',
    borderLeft: '4px solid #ef4444',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    color: '#ef4444',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  sectionContent: {
    fontSize: '14px',
    color: '#1a1a1a',
    wordBreak: 'break-word' as const,
  },
  fieldRow: {
    marginBottom: '12px',
    fontSize: '14px',
  },
  fieldLabel: {
    fontWeight: '600',
    color: '#ef4444',
    display: 'inline-block',
    minWidth: '80px',
    marginRight: '8px',
  },
  fieldValue: {
    color: '#1a1a1a',
    display: 'inline',
  },
  closing: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb',
  },
  closingText: {
    fontSize: '14px',
    color: '#4a4a4a',
    margin: '0 0 2px 0',
  },
  signature: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '0',
    margin: 0,
  },
  footer: {
    backgroundColor: '#f8f9fa',
    padding: '16px 30px',
    textAlign: 'center' as const,
    fontSize: '12px',
    color: '#6b7280',
    borderTop: '1px solid #e5e7eb',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '12px',
  },
};

export function EmailConfirmation({ name, website }: EmailConfirmationProps) {
  return (
    <div style={emailStyles.container}>
        <div style={emailStyles.header}>
            <div style={emailStyles.headerOverlay}></div>
            <div style={emailStyles.headerContent}>
                <div style={emailStyles.headerTitle}>Thank You!</div>
                <p style={emailStyles.headerSubtitle}>We&apos;ve received your message</p>
            </div>
        </div>

        <div style={emailStyles.content}>
            <div style={emailStyles.greeting}>Hello {name},</div>

            <div style={emailStyles.section}>
                <p style={emailStyles.message}>
                Thank you for reaching out to us. Our team has received your submission and will get back to you soon.
                </p>
            </div>

            {/* <div style={emailStyles.section}>
            <div style={emailStyles.sectionLabel}>What&apos;s next?</div>
            <p style={{ ...emailStyles.sectionContent, margin: 0 }}>
                Our team has received your submission and will review it carefully. We&apos;ll get back to you as soon as possible with a response.
            </p>
            </div> */}

            <div style={emailStyles.closing}>
            <p style={emailStyles.closingText}>Best regards,</p>
            <p style={emailStyles.signature}>{website} Team</p>
            </div>
        </div>

        <div style={emailStyles.footer}>
            <p style={{ margin: '0 0 4px 0' }}>© {new Date().getFullYear()} {website}. All rights reserved.</p>
            <p style={{ margin: 0 }}>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
  );
}

export function EmailTemplate({
  name,
  email,
  country,
  subject,
  message,
  website
}: EmailTemplateProps) {
  return (
    <div style={emailStyles.container}>
      <div style={emailStyles.header}>
        <div style={emailStyles.headerOverlay}></div>
        <div style={emailStyles.headerContent}>
          <div style={emailStyles.headerTitle}>{website} Contact Form</div>
          <p style={emailStyles.headerSubtitle}>New Message</p>
        </div>
      </div>

      <div style={emailStyles.content}>

        <div style={emailStyles.section}>
          <div style={emailStyles.sectionLabel}>Sender Information</div>
          <div style={emailStyles.fieldRow}>
            <span style={emailStyles.fieldLabel}>Name:</span>
            <span style={emailStyles.fieldValue}>{name}</span>
          </div>
          <div style={emailStyles.fieldRow}>
            <span style={emailStyles.fieldLabel}>Email:</span>
            <span style={emailStyles.fieldValue}>
              <a href={`mailto:${email}`} style={{ color: '#667eea', textDecoration: 'none' }}>
                {email}
              </a>
            </span>
          </div>
          <div style={emailStyles.fieldRow}>
            <span style={emailStyles.fieldLabel}>Country:</span>
            <span style={emailStyles.fieldValue}>{country}</span>
          </div>
        </div>

        <div style={emailStyles.section}>
          <div style={emailStyles.sectionLabel}>Subject</div>
          <p style={{ ...emailStyles.sectionContent, fontWeight: '600', margin: 0 }}>{subject}</p>
        </div>

        <div style={emailStyles.section}>
          <div style={emailStyles.sectionLabel}>Message</div>
          <p style={{ ...emailStyles.sectionContent, margin: 0, whiteSpace: 'pre-wrap' }}>{message}</p>
        </div>

        <div style={emailStyles.closing}>
          <p style={{ ...emailStyles.closingText, fontSize: '12px' }}>
            Reply directly to <a href={`mailto:${email}`} style={{ color: '#667eea', textDecoration: 'none' }}>
              {email}
            </a> to send a response.
          </p>
        </div>
      </div>
    </div>
  );
}
