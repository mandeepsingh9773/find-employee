export default function EmployeeCard({ employee }) {
  const { name, email, department, designation, date_of_joining } = employee;

  // Append midnight to the date-only value to avoid interpreting the
  // database date as a UTC timestamp and accidentally shifting its day.
  const formattedJoiningDate = new Date(
    `${date_of_joining}T00:00:00`,
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm">
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-semibold text-blue-700"
        >
          {name.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {name}
          </h3>

          <p className="mt-1 break-all text-sm text-slate-500">{email}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {department}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {designation}
            </span>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Joined{" "}
            <time dateTime={date_of_joining}>{formattedJoiningDate}</time>
          </p>
        </div>
      </div>
    </article>
  );
}
