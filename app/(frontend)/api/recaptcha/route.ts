import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const postData = await request.json();

    const { gRecaptchaToken } = postData;

    let res;

    const formData = `secret=${secretKey}&response=${gRecaptchaToken}`;
    try {
        res = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            formData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
    } catch (e) {
        return NextResponse.json({ success: false })
    }

    //DEVELOPMENT ONLY
    if (res && res.data?.success && res.data?.score > 0.05) {

        return NextResponse.json({
            success: true,
            score: res.data.score,
        });
    } else {
        // return NextResponse.json(
        //     {
        //         success: false,
        //         error:
        //         res.data?.["error-codes"]?.join(", ") ||
        //         `Low reCAPTCHA score (${res.data?.score ?? "unknown"})`,
        //         google: res.data,
        //     },
        //     { status: 400 }
        // );
        return NextResponse.json(
            {
                success: false,
                error: `${
                res.data?.["error-codes"]?.join(", ") ||
                `Low reCAPTCHA score (${res.data?.score ?? "unknown"})`
                } | success=${res.data?.success}, action=${res.data?.action ?? "unknown"}, hostname=${res.data?.hostname ?? "unknown"}`,
            },
            { status: 400 }
        );
    }
}