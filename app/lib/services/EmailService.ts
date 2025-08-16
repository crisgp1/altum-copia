import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  area?: string;
  message: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    // Initialize email transporter if environment variables are set
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.initializeTransporter();
    }
  }

  private initializeTransporter() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    };

    this.transporter = nodemailer.createTransporter(config);
  }

  async sendContactNotification(data: ContactEmailData): Promise<boolean> {
    if (!this.transporter) {
      console.log('Email service not configured. Skipping email notification.');
      return false;
    }

    const areaNames: Record<string, string> = {
      corporativo: 'Derecho Corporativo',
      litigios: 'Litigios',
      fiscal: 'Derecho Fiscal',
      propiedad: 'Propiedad Intelectual',
    };

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Altum Legal" <no-reply@altumlegal.mx>',
      to: process.env.CONTACT_EMAIL || 'contacto@altumlegal.mx',
      subject: `Nueva consulta de ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">
            Nueva Consulta Legal
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #475569; margin-top: 0;">Información del Cliente</h3>
            
            <p><strong>Nombre:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.phone ? `<p><strong>Teléfono:</strong> ${data.phone}</p>` : ''}
            ${data.area ? `<p><strong>Área de Interés:</strong> ${areaNames[data.area] || data.area}</p>` : ''}
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #475569; margin-top: 0;">Consulta</h3>
            <p style="white-space: pre-wrap; color: #334155;">${data.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
            <p>Este mensaje fue enviado desde el formulario de contacto en altumlegal.mx</p>
            <p>Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Contact notification email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendClientConfirmation(data: ContactEmailData): Promise<boolean> {
    if (!this.transporter) {
      console.log('Email service not configured. Skipping confirmation email.');
      return false;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Altum Legal" <no-reply@altumlegal.mx>',
      to: data.email,
      subject: 'Hemos recibido su consulta - Altum Legal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 30px 0; background-color: #1e293b;">
            <h1 style="color: #fbbf24; margin: 0;">ALTUM LEGAL</h1>
          </div>
          
          <div style="padding: 40px 20px;">
            <h2 style="color: #1e293b;">Estimado(a) ${data.name},</h2>
            
            <p style="color: #475569; line-height: 1.6;">
              Hemos recibido su consulta y nos pondremos en contacto con usted a la brevedad posible.
            </p>
            
            <p style="color: #475569; line-height: 1.6;">
              Nuestro equipo de profesionales revisará su caso y le proporcionará la asesoría legal
              que necesita. Normalmente respondemos dentro de las próximas 24 horas hábiles.
            </p>
            
            <div style="background-color: #f8fafc; padding: 20px; margin: 30px 0; border-radius: 8px; border-left: 4px solid #fbbf24;">
              <h3 style="color: #1e293b; margin-top: 0;">Resumen de su consulta:</h3>
              <p style="color: #475569; white-space: pre-wrap;">${data.message}</p>
            </div>
            
            <p style="color: #475569; line-height: 1.6;">
              Si necesita asistencia inmediata, no dude en contactarnos:
            </p>
            
            <ul style="color: #475569; line-height: 1.8;">
              <li>Oficina: +52 33 3629 7531</li>
              <li>WhatsApp: +52 33 1568 1688</li>
              <li>Email: contacto@altumlegal.mx</li>
              <li>Horario: Lunes a Viernes, 09:00 - 18:00</li>
              <li>Dirección: Av. Faro #2522, Bosque de la Victoria, CP. 44538, Guadalajara, Jalisco</li>
            </ul>
            
            <p style="color: #475569; line-height: 1.6; margin-top: 30px;">
              Atentamente,<br>
              <strong>Equipo Legal de Altum</strong>
            </p>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            <p>© 2024 Altum Legal. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no responda a este mensaje.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Client confirmation email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }
  }
}

export default new EmailService();