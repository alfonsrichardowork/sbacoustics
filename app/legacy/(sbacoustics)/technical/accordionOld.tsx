"use client"

import { technicals } from "@prisma/client";
import { useEffect, useState } from "react";
interface TechnicalData {
    pdfFiles: technicals[];
}

export const TechnicalClient: React.FC<TechnicalData> = ({
  pdfFiles
}) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    if (typeof window === 'undefined') return;
  return (
    <div 
        style={{
            width: '100%',
        }}
    >
        {pdfFiles.map((file, index) => {
            const isOpen = openIndex === index;

            return (
            <div
                key={index}
                style={{
                paddingBottom: '12px',
                width: '100%',
                }}
            >
                {/* Accordion Trigger */}
                <button
                type="button"
                onClick={() => {
                    setOpenIndex(isOpen ? null : index);
                }}
                style={{
                    width: '100%',
                    backgroundColor: '#3f3f46',
                    color: '#ffffff',
                    paddingLeft: window.innerWidth >= 768 ? '32px' : '16px',
                    paddingRight: window.innerWidth >= 768 ? '32px' : '16px',
                    paddingTop: window.innerWidth >= 768 ? '16px' : '8px',
                    paddingBottom: window.innerWidth >= 768 ? '16px' : '8px',
                    fontSize: '14px',
                    textAlign: 'left',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
                >
                <span>
                    {file.name}
                </span>

                {/* Optional arrow */}
                <span style={{
                    fontSize: '16px',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                }}>
                    ▼
                </span>
                </button>

                {/* Accordion Content */}
                {isOpen && (
                <div style={{
                    backgroundColor: '#f4f4f5',
                    color: '#000000',
                    paddingLeft: window.innerWidth >= 768 ? '32px' : '16px',
                    paddingRight: window.innerWidth >= 768 ? '32px' : '16px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    fontSize: '12px',
                }}>
                    {file.desc}

                    <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    paddingTop: window.innerWidth >= 768 ? '24px' : '16px',
                    }}>
                    <a
                        href={file.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                        textAlign: 'left',
                        fontSize: '16px',
                        lineHeight: '1.42',
                        color: '#000000',
                        padding: '0px',
                        paddingBlock: '4px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        }}
                    >
                        <div style={{
                        paddingRight: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        }}>
                        <div style={{
                            position: 'relative',
                            display: 'inline-flex',
                            height: '32px',
                            width: '32px',
                            alignItems: 'center',
                        }}>
                            <img
                            src="/images/sbacoustics/PDF-download-ver2.png"
                            alt="3D Files Download"
                            width={24}
                            height={24}
                            style={{
                                objectFit: 'contain',
                                maxHeight: '32px',
                                width: 'auto',
                                transitionProperty: 'opacity',
                            }}
                            loading="lazy"
                            />
                        </div>
                        </div>

                        <div style={{
                        paddingLeft: '8px',
                        fontSize: '14px',
                        lineHeight: '1.43',
                        }}>
                        {file.pdfname}
                        </div>
                    </a>
                    </div>
                </div>
                )}
            </div>
            );
        })}
    </div>
  )
}