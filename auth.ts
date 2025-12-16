import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import z from "zod";
import type { User } from "./app/lib/definitions";
import postgres from "postgres";
import bcrypt from "bcrypt";
// import { nullable } from "zod/v4"; // ❌ Questo import sembra non essere usato o è errato, lo commento o rimuovo

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * Recupera un utente dal database tramite l'indirizzo email.
 * @param email L'email dell'utente da cercare.
 * @returns L'oggetto utente o undefined.
 */
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email = ${email}`;
    // Restituisce il primo utente trovato o undefined se l'array è vuoto
    return user[0];
  } catch (error) {
    console.error("Errore nel recupero dell'utente:", error);
    throw new Error("Errore nel recupero dell'utente");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  // Configurazione di base definita in auth.config.ts
  ...authConfig,

  // Array dei provider di autenticazione
  providers: [
    Credentials({
      /**
       * Funzione asincrona per autorizzare l'utente.
       * @param credentials Le credenziali (email e password) fornite dal form di login.
       * @returns L'oggetto utente se l'autenticazione ha successo, altrimenti null.
       */
      async authorize(credentials) {
        // 1. Validazione delle credenziali usando Zod
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // 2. Recupera l'utente dal database
          const user = await getUser(email);
          if (!user) {
            console.log("Nessun utente trovato con questa email.");
            return null; // Utente non trovato
          }

          // 3. Confronta la password (hashing)
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
            return user; // Successo: restituisce l'oggetto utente
          }
        }

        // Messaggio di log se la validazione Zod fallisce o le credenziali sono errate
        console.log("Credenziali non valide fornite.");

        return null; // Fallimento dell'autenticazione
      },
    }),
  ],
});
