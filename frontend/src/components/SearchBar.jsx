export default function SearchBar({ value, onChange, disabled = false }) {
  return (
    <div className="w-full">
      <label
        htmlFor="employee-search"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Search employees
      </label>

      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 4 4" />
        </svg>

        <input
          id="employee-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder="Try a name or department..."
          autoComplete="off"
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Search by employee name or department.
      </p>
    </div>
  );
}
