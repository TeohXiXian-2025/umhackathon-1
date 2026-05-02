// utils/helpers.js

export function parseAIResponse(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data && data.modules) {
        return data.modules;
    }
    return [];
  } catch (error) {
    return [];
  }
}

export function validateFormInput(input) {
  if (!input || input.trim() === "") {
    return { isValid: false, error: "Input cannot be empty" };
  }
  if (input.length < 5) {
     return { isValid: false, error: "Input must be at least 5 characters" };
  }
  return { isValid: true, error: null };
}