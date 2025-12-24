import { generateYAxis } from "@/app/lib/utils";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { fetchRevenue } from "@/app/lib/data";

// Questo componente è puramente rappresentativo.
// Per una vera UI di visualizzazione dati, si consiglia:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function RevenueChart() {
  const revenue = await fetchRevenue();

  const chartHeight = 350;

  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!revenue || revenue.length === 0) {
    // Traduzione: "No data available." -> "Nessun dato disponibile."
    return <p className="mt-4 text-gray-400">Nessun dato disponibile.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      {/* Traduzione: "Recent Revenue" -> "Entrate Recenti" */}
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Entrate Recenti
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {revenue.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: `${(chartHeight / topLabel) * month.revenue}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {/* Nota: I nomi dei mesi qui non sono tradotti, poiché derivano dal database (es. Jan, Feb) 
                    e non dal codice del componente. Dovresti tradurli nell'utility o nel database, se necessario. */}
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          {/* Traduzione: "Last 12 months" -> "Ultimi 12 mesi" */}
          <h3 className="ml-2 text-sm text-gray-500 ">Ultimi 12 mesi</h3>
        </div>
      </div>
    </div>
  );
}
