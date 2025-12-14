// Importa il componente AcmeLogo (attualmente commentato)
import AcmeLogo from "@/app/ui/acme-logo";
// Importa l'icona ArrowRightIcon dalla libreria Heroicons
import { ArrowRightIcon } from "@heroicons/react/24/outline";
// Importa il componente Link di Next.js per la navigazione
import Link from "next/link";
// Importa gli stili CSS specifici per la home page
import styles from "@/app/ui/home.module.css";
import { lusitana } from "./ui/fonts";
import Image from "next/image";

// Definisce e esporta il componente della Pagina
export default function Page() {
  return (
    // Contenitore principale (layout flex in colonna che occupa l'intera altezza)
    <main className="flex min-h-screen flex-col p-6">
      {/* Sezione per l'header del logo (sfondo blu) */}
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div>
      {/* Sezione principale del contenuto (layout flex che cresce, passa a riga su schermi medi) */}
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        {/* Colonna di sinistra: Testo e pulsante di login */}
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          {/* Un elemento che usa una classe CSS modulare per la forma */}
          <div className={styles.shape} />
          {/* Paragrafo di benvenuto con stili responsivi */}
          <p
            className={`${lusitana.className}text-xl text-gray-800 md:text-3xl md:leading-normal`}
          >
            <strong>Benvenuti in Acme.</strong> Questo è l'esempio per il{" "}
            {/* Link al corso Next.js Learn */}
            <a href="https://nextjs.org/learn/" className="text-blue-500">
              Corso Next.js Learn
            </a>
            , offerto da Vercel.
          </p>
          {/* Pulsante/Link per il Login */}
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Accedi</span> {/* Testo del pulsante */}
            <ArrowRightIcon className="w-5 md:w-6" /> {/* Icona freccia */}
          </Link>
        </div>
        {/* Colonna di destra: Area per immagini Hero (Immagini principali) */}
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Aggiungi qui le Immagini Hero */}
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshots of the dashboard project showing mobile version"
          />
        </div>
      </div>
    </main>
  );
}
