import prismadb from "@/lib/prismadb";
import { CSSProperties, ReactNode } from "react";
import '@/app/legacy/(sbacoustics)/catalogues/catalogues.css'
export const revalidate = 60;


type EmptyProps = {
  children: ReactNode
  style?: CSSProperties
}

type EmptyContentProps = {
  children: ReactNode
}

type EmptyTitleProps = {
  children: ReactNode
}

type EmptyDescriptionProps = {
  children?: ReactNode
}

const styles = {
  empty: {
    width: "100%",
    minHeight: "24rem",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    padding: "2rem",
    boxSizing: "border-box",
    textAlign: "center",
  } satisfies CSSProperties,

  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
  } satisfies CSSProperties,

  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: "1rem",
    fontWeight: 600,
  } satisfies CSSProperties,

  description: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.875rem",
  } satisfies CSSProperties,
}

export function Empty({ children, style }: EmptyProps) {
  return <div style={{ ...styles.empty, ...style }}>{children}</div>
}

export function EmptyContent({ children }: EmptyContentProps) {
  return <div style={styles.content}>{children}</div>
}

export function EmptyTitle({ children }: EmptyTitleProps) {
  return <h3 style={styles.title}>{children}</h3>
}

export function EmptyDescription({ children }: EmptyDescriptionProps) {
  return children ? <p style={styles.description}>{children}</p> : null
}


export default async function CataloguesSBAudienceJsonLd() {
  const pdfFiles = await prismadb.catalogues.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID
    }
  });

  return (
      <div className="catalogues-parent-page">
        <h1 style={{
          fontSize: '30px',
          lineHeight: '1.2',
          fontWeight: 700,
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Catalogues
        </h1>
          {pdfFiles.length > 0 ? pdfFiles.map((item, index) => (
            <div className="catalogues-child-page" key={index}>
              <div>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%'
            }}>
              <img 
                src={item.cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.cover}` : item.cover}
                alt={item.pdfname}
                width={500}
                height={500}
                style={{
                  height: 'fit-content',
                  width: '100%',
                  objectFit: 'contain'
                }}
                loading={'lazy'}
              />
            </div>
          </div>
          <div className="catalogues-files-page">
            <a href={`${item.pdf}`} target="_blank" style={{
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
            }}>
              <div style={{
                paddingRight: '8px'
              }}>
                <div style={{
                  position: 'relative',
                  display: 'inline-flex',
                  height: '32px',
                  width: '32px',
                  alignItems: 'center'
                }}>
                  <img
                    src={'/images/sbacoustics/PDF-download-ver2.png'}
                    alt="3D Files Download"
                    width={100} 
                    height={100}
                    style={{
                      maxHeight: '32px',
                      width: 'auto',
                      flexShrink: 0
                    }}
                    loading="lazy"
                  />
                </div>
              </div>
              <h2 style={{
                paddingLeft: '8px'
              }}>
                {item.pdfname}
              </h2>
            </a>
          </div>
          </div>
          ))
        :
        <Empty>
          <EmptyContent>
            <EmptyTitle>No Catalogues Available</EmptyTitle>
            <EmptyDescription />
          </EmptyContent>
        </Empty>
      }
      </div>
  );
}
