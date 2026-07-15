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
        `${process.env.MY_EMAIL}`, 
        // "alfonskerja@gmail.com"
      ],
      subject: subject,
      react: EmailTemplate({ name, email, country, subject, message, website }),
    },
  );

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
        if (!error) {
          resolve('Email sent');
        } else {
          reject(error.message);
        }
    });

  try {
    await sendMailPromise();
    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

