const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");

/**
 * 
 * 
Searches employees by name or department.
@param {string} search - The employee name or department to search for.
@param {object} options - Optional request configuration.
@param {AbortSignal} options.signal - Allows the caller to cancel the request.
@param {number} options.limit - Maximum number of employees to return.
@returns {Promise<Array>} A promise resolving to the matching employee records.
*/

export async function searchEmployees(search, { signal, limit = 50 } = {}) {
  if (!API_BASE_URL) {
    throw new Error(
      "API configuration is missing. Please check your environment settings.",
    );
  }

  const params = new URLSearchParams({
    search: search.trim(),
    limit: String(limit),
  });

  let response;

  try {
    response = await fetch(`${API_BASE_URL}/employees?${params.toString()}`, {
      signal,
    });
  } catch (error) {
    // Preserve cancellation so the caller can handle it separately.
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "Unable to connect to the server. Please check your connection and try again.",
      { cause: error },
    );
  }

  if (!response.ok) {
    let message = "Something went wrong while searching employees.";

    try {
      const errorData = await response.json();

      if (typeof errorData.detail === "string") {
        message = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        message = "The search request is invalid. Please check your input.";
      }
    } catch {
      // Keep the fallback message if the error response isn't valid JSON.
    }

    throw new Error(message);
  }

  return response.json();
}
