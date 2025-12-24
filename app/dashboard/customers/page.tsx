// app/dashboard/customers/page.tsx

import Table from "@/app/ui/customers/table";
import { fetchFilteredCustomers } from "@/app/lib/data"; // Funzione che recupera i dati
import { lusitana } from "@/app/ui/fonts";

// La pagina sarà statica (Server Component) per il rendering iniziale
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";

  // Chiama la funzione per recuperare i clienti
  const customers = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Clienti
      </h1>

      {/* Search e Table Wrapper (come in /invoices) */}
      <Table customers={customers} />
    </div>
  );
}
