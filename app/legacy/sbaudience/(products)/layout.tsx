export default function ProductLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return(
      <div
          style={{
              width: '100%',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              top: '112px',
              paddingTop: '80px',
              backgroundColor: '#ffffff',
          }}
      >
        {children}
      </div>
    )
}