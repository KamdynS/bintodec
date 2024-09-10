import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/api/auth/firebase(.*)',
  '/api/scores(.*)'
]);

export default clerkMiddleware((auth, req) => {
  console.log('Error at line 10 in file middleware.ts:', 'Middleware called for path:', req.url);
  if (isProtectedRoute(req)) {
    console.log('Error at line 12 in file middleware.ts:', 'Protected route accessed:', req.url);
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};