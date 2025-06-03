// This file defines a custom error class called ApiError that extends the built-in JavaScript Error class.
// It is used to create structured and consistent error objects for better error handling in the application.

class ApiError extends Error {
  /**
   * Constructor for the ApiError class.
   * @param {string} message - The error message to describe the error. Defaults to "Something went wrong".
   * @param {number} statusCode - The HTTP status code associated with the error (e.g., 404, 500).
   * @param {Array} errors - An array of additional error details (e.g., validation errors). Defaults to an empty array.
   * @param {string} stack - The stack trace of the error. If not provided, it will be automatically captured.
   */
  constructor(
    message = "Something went wrong", // Default error message
    statusCode, // HTTP status code for the error
    errors = [], // Additional error details
    stack = "" // Stack trace (optional)
  ) {
    super(message); // Call the parent Error class constructor with the message

    // Properties specific to the ApiError class
    this.statusCode = statusCode; // HTTP status code (e.g., 404 for Not Found, 500 for Internal Server Error)
    this.data = null; // Placeholder for any additional data related to the error
    this.message = message; // Error message
    this.success = false; // Indicates the operation was not successful
    this.errors = errors; // Array of additional error details

    // Stack trace handling
    if (stack) {
      this.stack = stack; // Use the provided stack trace if available
    } else {
      Error.captureStackTrace(this, this.constructor); // Automatically capture the stack trace
    }
  }
}

// Export the ApiError class so it can be used in other parts of the application.
// This class is particularly useful for creating custom error responses in APIs.
export default ApiError;
