import EmployeeCard from "./EmployeeCard";

export default function EmployeeList({ employees }) {
  if (employees.length === 0) {
    return null;
  }

  return (
    <section aria-label="Employee search results">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Search results</h2>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {employees.length} {employees.length === 1 ? "employee" : "employees"}
        </span>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {employees.map((employee) => (
          <li key={employee.id}>
            <EmployeeCard employee={employee} />
          </li>
        ))}
      </ul>
    </section>
  );
}
