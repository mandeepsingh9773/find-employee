import { useState } from "react";
import SearchBar from "./components/SearchBar";
import EmployeeList from "./components/EmployeeList";
import useEmployees from "./hooks/useEmployees";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const { employees, isLoading, error, hasSearched } = useEmployees(searchTerm);

  const trimmedSearch = searchTerm.trim();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
            People directory
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find your colleagues
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Search employees by name or department to find their contact details
            and role.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <div className="mt-6" aria-live="polite" aria-atomic="true">
            {!trimmedSearch && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                <h2 className="text-base font-semibold text-slate-800">
                  Start your search
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Enter an employee name or department above.
                </p>
              </div>
            )}

            {trimmedSearch && isLoading && (
              <div className="flex items-center justify-center gap-3 py-10 text-sm text-slate-600">
                <span
                  className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"
                  aria-hidden="true"
                />
                <span>Searching employees...</span>
              </div>
            )}

            {trimmedSearch && !isLoading && error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-5"
              >
                <h2 className="font-semibold text-red-800">
                  We couldn't complete your search
                </h2>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <p className="mt-2 text-sm text-red-700">
                  Please try again in a moment.
                </p>
              </div>
            )}

            {trimmedSearch &&
              !isLoading &&
              !error &&
              hasSearched &&
              employees.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-10 text-center">
                  <h2 className="text-base font-semibold text-slate-800">
                    No employees found
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Try another name or department.
                  </p>
                </div>
              )}

            {trimmedSearch && !isLoading && !error && employees.length > 0 && (
              <EmployeeList employees={employees} />
            )}
          </div>
        </section>

        <footer className="mt-6 text-center text-xs text-slate-500">
          Employee Directory Search
        </footer>
      </div>
    </main>
  );
}

export default App;
