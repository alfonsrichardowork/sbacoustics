import { EmailConfirmation, EmailTemplate } from '@/components/resendemail';
import { type NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const toNoReplyEmail = (email: string) => {
  const domain = email.split('@')[1];
  // return `noreply@${domain}`;
  return `noreply@webdemosbe.xyz`;
};
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { email, name, country, subject, message, website, fromemail } = await request.json();

  // const { data, error } = await resend.batch.send([
  //   // Email to user
  //   {
  //     from: `${website} <${toNoReplyEmail(fromemail)}>`,
  //     to: [email],
  //     subject: "We received your message!",
  //     react: EmailConfirmation({ name, website }),
  //   },
  //   // Email to team
  //   {
  //     from: `${website} <${toNoReplyEmail(fromemail)}>`,
  //     to: [`${process.env.MY_EMAIL}`, "backup@sbacoustics.com"],
  //     subject: subject,
  //     react: EmailTemplate({ name, email, country, subject, message, website }),
  //   },
  // ]);

    //DEVELOPMENT ONLY
   const { data, error } = await resend.emails.send(
    // // Email to user
    // {
    //   from: `${website} <${toNoReplyEmail(fromemail)}>`,
    //   to: [email],
    //   subject: "We received your message!",
    //   react: EmailConfirmation({ name, website }),
    // },
    // Email to team
    {
      from: `${website} <${toNoReplyEmail(fromemail)}>`,
      to: [
        // `${process.env.MY_EMAIL}`, 
        "alfonskerja@gmail.com",
        // "it.04@sinarbajaelectric.com",
      ],
      subject: subject,
      react: EmailTemplate({ name, email, country, subject, message, website }),
    },
  );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Email sent",
    data,
  });
}

