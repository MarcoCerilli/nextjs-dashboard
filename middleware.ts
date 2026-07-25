import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Esporta l'istanza di NextAuth con la configurazione specificata
// Qui si inizializza NextAuth.js con l' authConfigoggetto ed si esporta la authproprietà.
// Si utilizza anche l' matcheropzione del Proxy per specificare che l'esecuzione deve avvenire su percorsi specifici.

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
