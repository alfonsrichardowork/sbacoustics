"use client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import React from "react";

export default function GoogleCaptchaWrapper({
    children,
    inlineBadge = false,
}: {
    children: React.ReactNode;
    inlineBadge?: boolean;
}) {
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            container={inlineBadge
                ? {
                    element: "recaptcha-badge-container",
                    parameters: { badge: "inline" },
                }
                : undefined}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}