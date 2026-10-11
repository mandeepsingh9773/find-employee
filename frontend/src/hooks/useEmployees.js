import { useEffect, useState } from "react";
import { searchEmployees } from "../services/employeeApi";
import useDebouncedValue from "./useDebouncedValue";

export default function useEmployees(searchTerm) {
  const debouncedSearch = useDebouncedValue(searchTerm, 300).trim();
  const [requestState, setRequestState] = useState({
    search: "",
    employees: [],
    error: null,
  });

  useEffect(() => {
    if (!debouncedSearch) {
      return;
    }

    // a controller for cancelling this request if the search changes
    // or the component using this hook unmounts.
    const controller = new AbortController();

    let isCurrentRequest = true;

    async function fetchEmployees() {
      try {
        const data = await searchEmployees(debouncedSearch, {
          signal: controller.signal,
        });

        if (isCurrentRequest) {
          setRequestState({
            search: debouncedSearch,
            employees: data,
            error: null,
          });
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        if (isCurrentRequest) {
          setRequestState({
            search: debouncedSearch,
            employees: [],
            error: err.message,
          });
        }
      }
    }

    fetchEmployees();

    return () => {
      isCurrentRequest = false;
      controller.abort();
    };
  }, [debouncedSearch]);

  const hasSearchTerm = debouncedSearch.length > 0;
  const hasSearched = hasSearchTerm && requestState.search === debouncedSearch;

  return {
    employees: hasSearched ? requestState.employees : [],
    error: hasSearched ? requestState.error : null,
    isLoading: hasSearchTerm && !hasSearched,
    hasSearched,
  };
}
