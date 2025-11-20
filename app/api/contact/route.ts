import { NextRequest, NextResponse } from 'next/server';
import EmailService from '@/app/lib/services/EmailService';
import { connectToDatabase } from '@/app/lib/infrastructure/database/connection';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  area: string;
  message: string;
}

// Contact model for MongoDB
interface ContactDocument {
  name: string;
  email: string;
  phone?: string;
  area?: string;
  message: string;
  createdAt: Date;
  status: 'pending' | 'contacted' | 'resolved';
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Por favor complete todos los campos requeridos' },
        { status: 400 }
      );
    }
    
    // Validate email format - RFC 5322 compliant
    // Allows hyphens, plus signs, dots, and other valid characters
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Por favor ingrese un correo electrónico válido' },
        { status: 400 }
      );
    }
    
    // Save to database (if MongoDB is configured)
    let insertedId: any = null;
    let db: any = null;

    try {
      db = await connectToDatabase();
      if (db) {
        const contactData: ContactDocument = {
          name: body.name,
          email: body.email,
          phone: body.phone || undefined,
          area: body.area || undefined,
          message: body.message,
          createdAt: new Date(),
          status: 'pending'
        };

        const result = await db.collection('contacts').insertOne(contactData);
        insertedId = result.insertedId;
        console.log('Contact saved to database:', insertedId);
      }
    } catch (dbError) {
      console.log('Database not configured or error saving:', dbError);
      // Continue without database - email will still work
    }

    // Send email notifications with error handling and rollback
    try {
      const [notificationSent, confirmationSent] = await Promise.all([
        EmailService.sendContactNotification(body),
        EmailService.sendClientConfirmation(body)
      ]);

      if (notificationSent || confirmationSent) {
        console.log('Email notifications sent:', { notificationSent, confirmationSent });
      }

      return NextResponse.json(
        {
          message: 'Su consulta ha sido recibida. Nos pondremos en contacto pronto.',
          success: true
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Error sending emails:', emailError);

      // Rollback: Delete database entry if email sending failed
      if (db && insertedId) {
        try {
          await db.collection('contacts').deleteOne({ _id: insertedId });
          console.log('Rolled back database entry due to email failure');
        } catch (rollbackError) {
          console.error('Error rolling back database entry:', rollbackError);
        }
      }

      // Return error to user
      return NextResponse.json(
        {
          error: 'Error al enviar la consulta. Por favor intente nuevamente.',
          success: false
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar su solicitud' },
      { status: 500 }
    );
  }
}