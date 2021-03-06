// Import the js file to test
//import { testServer } from "../src/client/js/formHandler"

const request = require("supertest");
const app = require("../src/server/js/app");

// The describe() function takes two arguments - a string description, and a test suite as a callback function.
// A test suite may contain one or more related tests
/*
describe("Testing the server functionality", () => {
    // The test() function has two arguments - a string description, and an actual test as a callback function.
    test("Testing the testServer() api function", async () => {
        // Define the input for the function, if any, in the form of variables/array
        // Define the expected output, if any, in the form of variables/array
        // The expect() function, in combination with a Jest matcher, is used to check if the function produces the expected output
        // The general syntax is `expect(myFunction(arg1, arg2, ...)).toEqual(expectedValue);`, where `toEqual()` is a matcher
        //expect(handleSubmit).toBeDefined();
        const input = 8;
        const output = input+1;

        //await expect(testServer(input)).toEqual(output);
        //await expect(testServer(input)).resolves.toEqual(output);
        //return expect(testServer(input)).resolves.toBe(output)
        //expect(testServer(input)).resolves.toBe(output)
        const data = await testServer(input);
        expect(data).toBe(output);
    })
});*/

/*
describe("Testing the server functionality", () => {
    // The test() function has two arguments - a string description, and an actual test as a callback function.
    test("Testing the testServer() api function",  done => {
      const input = 8;
      const data = input

      const output = input+1;
      function callback(error, data) {
        if (error) {
          done(error);
          return;
        }
        try {
          expect(data).toBe(output);
          done();
        } catch (error) {
          done(error);
        }
      }
      testServer(callback)
        // Define the input for the function, if any, in the form of variables/array
        // Define the expected output, if any, in the form of variables/array
        // The expect() function, in combination with a Jest matcher, is used to check if the function produces the expected output
        // The general syntax is `expect(myFunction(arg1, arg2, ...)).toEqual(expectedValue);`, where `toEqual()` is a matcher
        //expect(handleSubmit).toBeDefined();


        //await expect(testServer(input)).toEqual(output);
        //await expect(testServer(input)).resolves.toEqual(output);
        //return expect(testServer(input)).resolves.toBe(output)
        //expect(testServer(input)).resolves.toBe(output)

    })
});*/

describe("Testing the server functionality", () => {
    // The test() function has two arguments - a string description, and an actual test as a callback function.
    test("Testing the testServer() api function", done => {
        // Define the input for the function, if any, in the form of variables/array
        // Define the expected output, if any, in the form of variables/array
        // The expect() function, in combination with a Jest matcher, is used to check if the function produces the expected output
        // The general syntax is `expect(myFunction(arg1, arg2, ...)).toEqual(expectedValue);`, where `toEqual()` is a matcher
        //expect(handleSubmit).toBeDefined();
        //const input = 8;
        //const output = input+1;

        //await expect(testServer(input)).toEqual(output);
        //await expect(testServer(input)).resolves.toEqual(output);
        //return expect(testServer(input)).resolves.toBe(output)
        //expect(testServer(input)).resolves.toBe(output)
        //const data = await testServer(input);
        //expect(data).toBe(output);
        request(app)
          .get("/")
          .then(response => {
            expect(response.statusCode).toBe(200);
            done();
          });
    });
});
