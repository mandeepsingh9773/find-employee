# Employee Directory Search System

A full-stack employee directory application that allows users to search employees by name or department. The application uses React and Tailwind CSS for the frontend, FastAPI for the backend, and MySQL for persistent data storage.

## Features

- Search employees by name or department.
- Debounced search input to reduce unnecessary API requests.
- Employee details including name, email, department, designation, and date of joining.
- Loading, error, initial, and empty-result states.
- Reusable React components with separation of UI, API, and state-management responsibilities.
- Parameterized SQL queries to protect against SQL injection.
- Database connection pooling for efficient connection management.
- Configurable API URLs and database settings through environment variables.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | Tailwind CSS |
| Backend | Python, FastAPI |
| Database | MySQL |
| Database access | SQLAlchemy Core, PyMySQL |
| Validation | Pydantic |
| API testing | FastAPI Swagger UI |

## Project Structure

```text
find-employee/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── EmployeeCard.jsx
│   │   │   └── EmployeeList.jsx
│   │   ├── hooks/
│   │   │   ├── useDebouncedValue.js
│   │   │   └── useEmployees.js
│   │   ├── services/
│   │   │   └── employeeApi.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   └── employees.py
│   │   ├── services/
│   │   │   └── employee_service.py
│   │   ├── repositories/
│   │   │   └── employee_repository.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── schemas.py
│   │   └── main.py
│   ├── .env
│   └── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the application:

- Node.js and npm
- Python 3.11 or a compatible Python version supported by the installed dependencies
- MySQL Server

The commands below use PowerShell on Windows.

## Setup and Installation

### 1. Clone the repository

```powershell
git clone <YOUR_REPOSITORY_URL>
cd find-employee
```

If you already have the project locally, navigate directly to its root directory.

### 2. Configure the MySQL database

Log in to MySQL and execute:

```sql
CREATE DATABASE employee_directory;
```

Select the database:

```sql
USE employee_directory;
```

Create the employee table:

```sql
CREATE TABLE employees (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(150) NOT NULL,
    date_of_joining DATE NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_employees_email (email),
    INDEX idx_employees_name (name),
    INDEX idx_employees_department (department)
);
```

Insert sample employee records before testing the application. The database schema supports the six employee fields returned by the API.

For local development, create a dedicated MySQL application user with the permissions required by the application rather than using the root account. The application only needs `SELECT` access for its current search functionality.

### 3. Configure the backend

Navigate to the backend directory:

```powershell
cd backend
```

Create and activate a Python virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the dependencies:

```powershell
python -m pip install fastapi "uvicorn[standard]" sqlalchemy pymysql pydantic-settings
```

Create a `.env` file in the `backend/` directory:

```dotenv
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=employee_directory
DB_USER=employee_app
DB_PASSWORD=your_local_database_password
```

Replace the password placeholder with your local MySQL application user's password.

Create `backend/.env.example` with the same variable names and safe placeholder values. Do not commit actual credentials.

Start the backend from the `backend/` directory:

```powershell
python -m uvicorn app.main:app --reload
```

The API will normally be available at:

- API: `http://127.0.0.1:8000`
- API documentation: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/health`

Keep this terminal running.

### 4. Configure the frontend

Open a second terminal and navigate to the frontend directory:

```powershell
cd frontend
npm install
```

Create `frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Create `frontend/.env.example` with the same variable and a placeholder or local development URL.

Start the frontend:

```powershell
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

If the browser reports a CORS error, ensure that FastAPI's CORS middleware allows the frontend origin being used.

## API Reference

### Search employees

**Endpoint:** `GET /employees`

| Parameter | Type | Description |
|---|---|---|
| `search` | String | Required employee name or department prefix |
| `limit` | Integer | Optional maximum number of results; defaults to 50 and allows values from 1 to 100 |

Example request:

```http
GET /employees?search=Rahul
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "department": "Engineering",
    "designation": "Software Engineer",
    "date_of_joining": "2024-06-15"
  }
]
```

The response contains an array of employee objects. An unsuccessful search with no matches returns `200 OK` with an empty array.

### Response and error handling

- `200 OK` — search completed successfully, including searches with no matches.
- `422 Unprocessable Entity` — missing or invalid query parameters.
- `500 Internal Server Error` — an unexpected database-related failure.

The frontend displays loading, error, results, and no-results states based on the API response and request lifecycle.

## Database Choice: MySQL

MySQL was selected as a relational database because employee records have a consistent structure and well-defined fields. A relational model provides suitable data types, constraints, and indexing capabilities for this use case.

The schema uses:

- An auto-incrementing primary key for employee identification.
- A unique constraint on email to prevent duplicate email addresses.
- `DATE` for joining dates.
- Indexes on `name` and `department` to support search operations.

SQLAlchemy is used to manage database connectivity and execute parameterized SQL statements. PyMySQL provides the MySQL driver.

A connection pool helps reuse database connections instead of creating a new connection for every request. The configuration also enables connection health checks through `pool_pre_ping`.

For the current read-only search application, the database user can be restricted to `SELECT` privileges.

## How Search Performance Is Optimized

### 1. Debounced search input

The frontend waits approximately 300 milliseconds after the user stops typing before initiating a search. This reduces requests generated by intermediate keystrokes.

For example, typing `Rahul` quickly should generally produce one request rather than a separate request for every character.

### 2. Prefix-based search

The backend uses a query conceptually equivalent to:

```sql
SELECT
    id,
    name,
    email,
    department,
    designation,
    date_of_joining
FROM employees
WHERE name LIKE :pattern
   OR department LIKE :pattern
ORDER BY name
LIMIT :limit;
```

The search pattern is created as a prefix, such as `Rah%`, rather than a substring pattern such as `%Rah%`.

Prefix searches can use B-tree indexes more effectively because the search does not begin with a wildcard. The database query optimizer determines the actual execution plan, especially when conditions are combined with `OR`.

### 3. Database indexes

Indexes on `name` and `department` help the database locate matching records without necessarily scanning the entire table.

The effectiveness of these indexes depends on the search pattern, data distribution, database collation, and query execution plan. Indexes should be verified with `EXPLAIN` as the dataset grows.

### 4. Result limits

The API defaults to a maximum of 50 records per request and permits a maximum of 100. This limits response size, network transfer, and the number of elements rendered by React.

### 5. Request cancellation and stale-response protection

The frontend uses `AbortController` and request-lifecycle checks to cancel obsolete requests where possible and prevent outdated responses from replacing newer results.

Debouncing reduces request frequency, while cancellation and stale-response protection improve correctness when users type quickly.

### 6. Minimal response fields

The query selects only the fields required by the employee directory instead of returning every database column. This keeps the response focused and avoids unnecessary data transfer.

## Design and Architecture

The frontend separates responsibilities into reusable components, custom hooks, and an API service:

- `SearchBar` handles search input presentation.
- `EmployeeCard` displays an individual employee.
- `EmployeeList` renders the collection of employee cards.
- `useDebouncedValue` handles delayed value updates.
- `useEmployees` manages search requests and their UI states.
- `employeeApi.js` handles HTTP communication.

The backend separates routing, business-level validation, and database access:

- **Router:** handles HTTP parameters, response models, and HTTP errors.
- **Service:** normalizes and validates search input.
- **Repository:** executes database queries.
- **Database module:** configures the SQLAlchemy engine and connection pool.
- **Schema module:** defines the employee response structure.

This separation improves maintainability, testability, and the ability to extend the application.

## Security and Configuration

- Do not commit `.env` files or real credentials.
- Keep `.env.example` files free of secrets.
- Use parameterized SQL queries instead of concatenating user input into SQL.
- Restrict database privileges to the operations the application needs.
- Keep CORS origins appropriate to the deployment environment.
- Remember that Vite variables prefixed with `VITE_` are exposed to client-side code and must not contain secrets.
