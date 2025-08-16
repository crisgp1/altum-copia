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
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Por favor ingrese un correo electrónico válido' },
        { status: 400 }
      );
    }
    
    // Save to database (if MongoDB is configured)
    try {
      const db = await connectToDatabase();
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
        console.log('Contact saved to database:', result.insertedId);
      }
    } catch (dbError) {
      console.log('Database not configured or error saving:', dbError);
      // Continue without database - email will still work
    }
    
    // Send email notifications
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
    
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar su solicitud' },
      { status: 500 }
    );
  }
}