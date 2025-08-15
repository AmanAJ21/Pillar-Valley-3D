// Simple test file to check Hermes compatibility
export const testHermesCompatibility = () => {
  try {
    // Test basic operations that might cause issues
    const testArray = [1, 2, 3];
    const testObject = { a: 1, b: 2 };
    
    // Test spread operator
    const spreadArray = [...testArray];
    const spreadObject = { ...testObject };
    
    // Test template literals
    const templateString = `Test ${testArray.length} items`;
    
    // Test arrow functions
    const arrowFunction = (x) => x * 2;
    const result = testArray.map(arrowFunction);
    
    // Test destructuring
    const [first, ...rest] = testArray;
    const { a, b } = testObject;
    
    // Hermes compatibility test passed
    
    return true;
  } catch (error) {
    // Hermes compatibility test failed
    return false;
  }
};

// Test specific patterns that might cause issues
export const testProblematicPatterns = () => {
  try {
    // Test Date.now() - should be fine
    const timestamp = Date.now();
    
    // Test Math.random() - should be fine
    const randomValue = Math.random();
    
    // Test string methods - avoid substr
    const testString = 'hello world';
    const sliced = testString.slice(0, 5);
    const substring = testString.substring(0, 5);
    
    // Test array methods
    const testArray = [1, 2, 3, 4, 5];
    const filtered = testArray.filter(x => x > 2);
    const mapped = testArray.map(x => x * 2);
    
    // Problematic patterns test passed
    
    return true;
  } catch (error) {
    // Problematic patterns test failed
    return false;
  }
};