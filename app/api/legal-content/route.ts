import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/infrastructure/database/connection';
import { MongoClient, Db } from 'mongodb';
import { verifyApiAuth } from '@/app/lib/auth/api-auth';

interface LegalContent {
  _id?: string;
  type: 'terms' | 'privacy';
  title: string;
  content: string;
  bannerText?: string;
  bannerActive: boolean;
  lastUpdated: string;
}

// GET /api/legal-content - Get all legal content
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const contents = await db.collection('legal_content').find({}).toArray();
    
    // Initialize with default content if none exists
    if (contents.length === 0) {
      const defaultContents = [
        {
          type: 'terms',
          title: 'Términos y Condiciones',
          content: '<h2>Términos y Condiciones de Uso</h2><p>Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de ALTUM Legal.</p><p>Al acceder a este sitio web asumimos que aceptas estos términos y condiciones. No continúes usando ALTUM Legal si no aceptas tomar todos los términos y condiciones establecidos en esta página.</p>',
          bannerText: '',
          bannerActive: false,
          lastUpdated: new Date().toISOString()
        },
        {
          type: 'privacy',
          title: 'Política de Privacidad',
          content: '<h2>Política de Privacidad</h2><p>En ALTUM Legal, accesible desde altum-legal.mx, una de nuestras principales prioridades es la privacidad de nuestros visitantes.</p><p>Este documento de Política de Privacidad contiene tipos de información que es recopilada y registrada por ALTUM Legal y cómo la usamos.</p>',
          bannerText: '',
          bannerActive: false,
          lastUpdated: new Date().toISOString()
        }
      ];
      
      await db.collection('legal_content').insertMany(defaultContents);
      return NextResponse.json(defaultContents);
    }
    
    const formattedContents = contents.map(content => ({
      id: content._id?.toString(),
      type: content.type,
      title: content.title,
      content: content.content,
      bannerText: content.bannerText || '',
      bannerActive: content.bannerActive || false,
      lastUpdated: content.lastUpdated
    }));
    
    return NextResponse.json(formattedContents);
  } catch (error) {
    console.error('Error fetching legal content:', error);
    return NextResponse.json(
      { error: 'Error al obtener el contenido legal' },
      { status: 500 }
    );
  }
}

// PUT /api/legal-content - Update legal content - Requiere permiso manage_legal
export async function PUT(request: NextRequest) {
  // Verificar autenticación y permiso manage_legal
  const authResult = await verifyApiAuth('manage_legal');
  if (!authResult.authorized) {
    return authResult.error;
  }

  try {
    const body = await request.json();
    const { type, title, content, bannerText, bannerActive } = body;
    
    if (!type || !['terms', 'privacy'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de contenido inválido' },
        { status: 400 }
      );
    }
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título y contenido son requeridos' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    const updatedContent = {
      type,
      title,
      content,
      bannerText: bannerText || '',
      bannerActive: bannerActive || false,
      lastUpdated: new Date().toISOString()
    };
    
    const result = await db.collection('legal_content').updateOne(
      { type },
      { $set: updatedContent },
      { upsert: true }
    );
    
    if (result.acknowledged) {
      return NextResponse.json({
        success: true,
        message: 'Contenido legal actualizado exitosamente'
      });
    } else {
      return NextResponse.json(
        { error: 'Error al actualizar el contenido' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating legal content:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el contenido legal' },
      { status: 500 }
    );
  }
}

// GET /api/legal-content/[type] - Get specific legal content by type
export async function getSpecificContent(type: 'terms' | 'privacy') {
  try {
    const { db } = await connectToDatabase();
    
    const content = await db.collection('legal_content').findOne({ type });
    
    if (!content) {
      return null;
    }
    
    return {
      id: content._id?.toString(),
      type: content.type,
      title: content.title,
      content: content.content,
      bannerText: content.bannerText || '',
      bannerActive: content.bannerActive || false,
      lastUpdated: content.lastUpdated
    };
  } catch (error) {
    console.error('Error fetching specific legal content:', error);
    throw error;
  }
}