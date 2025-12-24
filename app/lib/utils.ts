import { Revenue } from "./definitions";

// 1. Funzione per la Formattazione della Valuta (EUR/Italia)
export const formatCurrency = (amount: number) => {
  // Conversione da centesimi a euro (amount / 100)
  // Utilizza 'it-IT' per la localizzazione italiana.
  // Utilizza 'EUR' per il simbolo dell'Euro.
  return (amount / 100).toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
  });
};

// 2. Funzione per la Formattazione della Data (Default Italia)
export const formatDateToLocal = (
  dateStr: string,
  // Imposta il default su italiano (Italia)
  locale: string = "it-IT"
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

// 3. Funzione per la Generazione dell'Asse Y (Euro)
export const generateYAxis = (revenue: Revenue[]) => {
  // Calcola quali etichette dobbiamo visualizzare sull'asse y
  // basandosi sul record più alto e in migliaia di Euro.
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    // Aggiornamento: usa 'K €' invece di '$...K'
    yAxisLabels.push(`${i / 1000} K €`);
  }

  return { yAxisLabels, topLabel };
};

// La funzione di paginazione non necessita di modifiche per la localizzazione.
export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
