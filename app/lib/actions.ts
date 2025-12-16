"use server";

import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

/**
 * Definisce il tipo di stato restituito da una Server Action.
 * @property errors - Contiene gli errori di validazione (se presenti).
 * @property message - Messaggio generico di successo o errore DB.
 */
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// 1. Connessione al Database
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

// 2. Schema di Base Zod (Usato per Creazione e Aggiornamento)
const FormSchema = z.object({
  id: z.string(),

  customerId: z.preprocess(
    // Se l'input è null (mancante) o una stringa, lo convertiamo in stringa.
    (val) => (val === null || val === undefined ? "" : val),
    z.string().min(1, {
      message: "Selezionare un cliente è obbligatorio.",
    })
  ),

  amount: z.coerce
    .number()
    .nullable()
    .optional()
    .default(0)
    .refine((val) => val !== null && val !== undefined && val > 0, {
      // AGGIUNGI IL CONTROLLO ESPLICITO
      message: "L'importo è richiesto e deve essere maggiore di zero.",
    }),

  status: z.enum(["pending", "paid"], {
    invalid_type_error:
      "Lo stato deve essere 'in sospeso' (pending) o 'pagato' (paid).",
  }),
  date: z.string(),
});

// 3. Schema per la Creazione (Omette id e date)
const CreateInvoice = FormSchema.omit({ id: true, date: true });

// 4. Schema per l'Aggiornamento (Omette solo date)
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ==========================================================
// FUNZIONE 1: CREA FATTURA (createInvoice) CORRETTA
// ==========================================================

export async function createInvoice(prevState: State, formData: FormData) {
  // 1. Validazione dei dati con Zod:
  // *** USARE .safeParse() per gestire gli errori senza far crashare il server ***
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // 2. Se la validazione FALLISCE:
  if (!validatedFields.success) {
    // Restituisce lo stato precedente e un nuovo oggetto 'errors' formattato da Zod
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campi mancanti. Impossibile creare la Fattura.",
    };
  }

  // 3. Se la validazione ha successo:
  const { customerId, amount, status } = validatedFields.data; // <<<< .data ORA ESISTE!
  const amountInCents = amount! * 100;
  const date = new Date().toISOString().split("T")[0]; // Genera la data odierna nel formato YYYY-MM-DD

  try {
    // 4. Query SQL di Inserimento
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // Stampa l'errore per il debug
    console.error("Errore Database:", error);
    // Restituisce un messaggio di errore generico del DB, mantenendo lo stato precedente
    return {
      ...prevState,
      message: "Errore del Database: Impossibile creare la Fattura.",
    };
  }

  // 5. Revalidation e Redirect (se tutto OK)
  revalidatePath("/dashboard/invoices"); // Aggiorna la cache della lista
  redirect("/dashboard/invoices");
}

// ==========================================================

// ==========================================================
// FUNZIONE 2: AGGIORNA FATTURA (updateInvoice)
// ==========================================================

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  // L'ID della fattura viene passato come parametro della funzione.

  // 1. Validazione dei dati:
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // 2. Se la validazione FALLISCE:
  if (!validatedFields.success) {
    // Restituisce lo stato precedente e un nuovo oggetto 'errors' formattato da Zod
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campi mancanti. Impossibile aggiornare la Fattura.",
    };
  }

  // 3. Se la validazione ha successo:
  const { customerId, amount, status } = validatedFields.data; // <<<< .data ORA ESISTE!

  const amountInCents = amount! * 100;

  // 2. Query SQL di aggiornamento
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    // Stampa l'errore per il debug
    console.error("Errore Database:", error);
    return {
      message: "Errore del Database: Impossibile aggiornare la Fattura.", // Messaggio visualizzato nel frontend
    };
  }

  // 3. Revalidation e Redirect
  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/invoices/${id}/edit`); // Opzionale: revalida la pagina di modifica
  redirect("/dashboard/invoices");
}

// ==========================================================
// FUNZIONE 3: ELIMINA FATTURA (deleteInvoice)
// ==========================================================

export async function deleteInvoice(id: string) {
  try {
    // Query SQL per eliminare la riga con l'ID specificato
    await sql`DELETE FROM invoices WHERE id = ${id}`;

    // Forza la revalidation della cache per aggiornare la lista delle fatture
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    console.error("Errore Database:", error);
    // Lancia un errore per informare l'utente che l'operazione è fallita
    throw new Error("Impossibile Eliminare la Fattura.");
  }
  // Se la revalidation ha successo, la pagina /dashboard/invoices si aggiorna
  // Nota: il redirect è commentato nel codice originale.
  // redirect("/dashboard/invoices");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenziali non valide.";
        default:
          return "Errore sconosciuto durante l'autenticazione.";
      }
    }
    throw error;
  }
}
