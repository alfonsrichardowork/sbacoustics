import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { email, fname, lname, country, sbacousticsinterest, sbaudienceinterest } = await req.json();

  // 2. Retrieve Mailchimp credentials from environment variables
  const API_KEY = process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY;
  const API_SERVER = process.env.NEXT_PUBLIC_MAILCHIMP_API_SERVER;
  const AUDIENCE_ID = process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID;

  // 3. Construct Mailchimp API request URL
  const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

  // 4. Prepare request data
  const data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
        "FNAME": fname,
        "LNAME": lname,
        "MMERGE7": country
    },
    interests: {
        'ed2808e891': sbacousticsinterest, //SB Acoustics
        'a7b8b98cc4': sbaudienceinterest  //SB Audience
    },
  };

  // 5. Set request headers
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `api_key ${API_KEY}`,
    },
  };

  // 6. Send POST request to Mailchimp API
  try {
    const response = await axios.post(url, data, options);
    if (response.status == 200) {
        return NextResponse.json({ message: 'success' });
    }
    return NextResponse.json({ message: 'failed' }, { status: response.status });
  } catch (error) {
    
    if (axios.isAxiosError(error)) {
      console.error(
        `${error.response?.status}`,
        `${error.response?.data.title}`,
        `${error.response?.data.detail}`
      );

      if (error.response?.data.title == "Member Exists") {
        return NextResponse.json({ message: 'already' });
      }
    }

    
    return NextResponse.json({ message: 'error' });
   }
};