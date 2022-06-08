// Import the js file to test
import { testServer } from "../src/client/js/formHandler"

// The describe() function takes two arguments - a string description, and a test suite as a callback function.
// A test suite may contain one or more related tests
describe("Testing the server functionality", () => {
    // The test() function has two arguments - a string description, and an actual test as a callback function.
    test("Testing the testServer() api function", async () => {
        // Define the input for the function, if any, in the form of variables/array
        // Define the expected output, if any, in the form of variables/array
        // The expect() function, in combination with a Jest matcher, is used to check if the function produces the expected output
        // The general syntax is `expect(myFunction(arg1, arg2, ...)).toEqual(expectedValue);`, where `toEqual()` is a matcher
        //expect(handleSubmit).toBeDefined();
        const input = 5;
        const output = input+1;

        await expect(testServer(input)).toEqual(output);
        //return expect(testServer(input)).resolves.toBe(output)
    })
});
