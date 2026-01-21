import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Rutas que requieren autenticación y rol admin
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// Rutas de API admin que requieren autenticación
const isAdminApiRoute = createRouteMatcher(['/api/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Proteger rutas /admin
  if (isAdminRoute(req)) {
    const { userId } = await auth();

    // Si no está autenticado, redirigir a sign-in
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // La verificación de rol se hace en RoleGuard del lado del cliente
    // y en cada API individualmente para mayor seguridad
  }

  // Proteger rutas /api/admin
  if (isAdminApiRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'No autorizado - Debes iniciar sesión' },
        { status: 401 }
      );
    }

    // La verificación de permisos específicos se hace en cada API
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
