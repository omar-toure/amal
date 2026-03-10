import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // In a real application, you would use an email service like SendGrid, Resend, or Nodemailer
    // to send the actual email to toure.omar811@gmail.com
    console.log("-------------------");
    console.log("NEW CONTACT MESSAGE FOR toure.omar811@gmail.com");
    console.log("Name:", data.name);
    console.log("Email:", data.email);
    console.log("Message:", data.message);
    console.log("-------------------");

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
