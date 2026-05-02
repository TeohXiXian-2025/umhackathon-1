// utils/helpers.test.js
import { parseAIResponse, validateFormInput } from './helpers';

describe('AI Decision Support Helper Functions', () => {

  test('parseAIResponse should extract modules from valid JSON', () => {
    const mockJson = JSON.stringify({
      modules: [
        { name: "Payroll", price: "RM49" },
        { name: "Attendance", price: "RM29" },
        { name: "Onboarding", price: "RM19" }
      ]
    });
    
    const result = parseAIResponse(mockJson);
    
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe("Payroll");
  });

  test('validateFormInput should block empty strings', () => {
    const result = validateFormInput("   ");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Input cannot be empty");
  });

  test('validateFormInput should allow valid input', () => {
    const result = validateFormInput("High staff turnover");
    expect(result.isValid).toBe(true);
  });
});