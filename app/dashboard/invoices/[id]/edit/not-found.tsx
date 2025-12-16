import Link from "next/link";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <FaceFrownIcon className="h-12 w-12 text-gray-400" />
      <h2 className="mt-4 text-center text-2xl font-semibold">
        Invoice Not Found
      </h2>
      <p className="mt-2 text-center text-gray-600">
        The invoice you are looking for does not exist.
      </p>
      <Link
        href="/dashboard/invoices"
        className="mt-6 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Back to Invoices
      </Link>
    </main>
  );
}