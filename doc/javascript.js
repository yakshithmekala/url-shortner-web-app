/*
    🟨 var
    Introduced: ES5 (the oldest one)
    Scope: Function-scoped
    Hoisting: Yes (hoisted to the top of the function but initialized as undefined)
    Redeclaration: Allowed within the same scope
    Use case: Legacy code; avoid in modern JavaScript

    🟩 let
    Introduced: ES6 (2015)
    Scope: Block-scoped (inside {})
    Hoisting: Yes, but not initialized (results in a ReferenceError if accessed before declaration)
    Redeclaration: Not allowed in the same scope
    Use case: When the value will change later

    🟦 const
    Introduced: ES6 (2015)
    Scope: Block-scoped
    Hoisting: Yes, but not initialized
    Redeclaration: Not allowed
    Reassignment: ❌ Not allowed (the reference stays constant, but object properties can be changed)
    Use case: For constants and when you don't want reassignment

    Summary Table
    Feature	var	let	const
    Scope	Function	Block	Block
    Hoisted	Yes (init = undefined)	Yes (TDZ*)	Yes (TDZ*)
    Redeclaration	✅ Yes	❌ No	❌ No
    Reassignment	✅ Yes	✅ Yes	❌ No
    Use in loops	❌ Avoid	✅ Preferred	✅ (if no reassignment)

    TDZ = Temporal Dead Zone (accessing before declaration throws ReferenceError)

    ✅ Best Practice
    Prefer **const** by default.
    Use **let** only if you need to reassign.
    Avoid var in modern code.



    ✅ Key Features of ES6+ (ECMAScript 2015 and beyond)
    =====================================================
    🔹 1. let and const
    Block-scoped variable declarations replacing var.
    let count = 1;
    const PI = 3.14;

    🔹 2. Arrow Functions
    Shorter syntax and lexical this binding.
    const add = (a, b) => a + b;

    🔹 3. Template Literals
    String interpolation and multi-line strings using backticks.
    const name = "Kaushik";
    console.log(`Hello, ${name}!`);

    🔹 4. Destructuring
    Extract values from arrays or objects.
    const [a, b] = [1, 2];
    const { name, age } = { name: "Alice", age: 25 };

    🔹 5. Spread and Rest Operators (...)
    Spread: Expands iterable
    Rest: Gathers arguments into an array
    const arr = [1, 2, 3];
    const newArr = [...arr, 4];

    function sum(...nums) {
        return nums.reduce((a, b) => a + b, 0);
    }

    🔹 6. Default Parameters
    function greet(name = "Guest") {
        return `Hello, ${name}`;
    }

    🔹 7. Object Property Shorthand
    const x = 10, y = 20;
    const point = { x, y }; // { x: 10, y: 20 }

    🔹 8. Promises (ES6) + async/await (ES2017)
    Better handling of asynchronous code.


    // Promise
    fetch('/data')
    .then(res => res.json())
    .then(data => console.log(data));

    // async/await
    async function getData() {
        try {
            const res = await fetch('/data');
            const data = await res.json();
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    }

    🔹 9. Modules (ES6)
    Import/export between files.

    // math.js
    export const add = (a, b) => a + b;

    // main.js
    import { add } from './math.js';

    🔹 10. Classes (Syntactic Sugar for Prototypes)
    class Animal {
        constructor(name) {
            this.name = name;
        }
        speak() {
            console.log(`${this.name} makes a sound`);
        }
    }

    🔹 11. Optional Chaining ?. and Nullish Coalescing ?? (ES2020)

    const user = { profile: { name: "John" } };
    console.log(user.profile?.name); // "John"
    console.log(user.age ?? "Not provided"); // "Not provided"


    ✅ 1. Functions in JavaScript
    A function is a block of code designed to perform a particular task.

    ➤ Syntax
    function greet(name) {
        return "Hello, " + name;
    }

    console.log(greet("Kaushik")); // Output: Hello, Kaushik
    You can also define functions in other ways:


    // Function expression
    const greet = function(name) {
        return `Hello, ${name}`;
    };

    // Arrow function
    const greet = (name) => `Hello, ${name}`;


    Common Higher-Order Functions in JS
    ➤ map()
    Transforms each element in an array.


    const nums = [1, 2, 3];
    const squares = nums.map(x => x * x);
    console.log(squares); // [1, 4, 9]
    ➤ filter()
    Filters elements based on a condition.


    const nums = [1, 2, 3, 4];
    const evens = nums.filter(x => x % 2 === 0);
    console.log(evens); // [2, 4]
    ➤ reduce()
    Reduces an array to a single value.


    const nums = [1, 2, 3, 4];
    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    console.log(sum); // 10

    Let's break down the concepts of async/await, and fetch vs Axios, which are commonly
    used in JavaScript/Node.js for handling asynchronous operations and making HTTP requests.
    =========================================================================================

    ✅ 1. async/await
    async/await is syntactic sugar over Promises that makes asynchronous code look synchronous and easier to read.

    ➤ Basic Example:
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function greet() {
        await delay(1000); // waits 1 second
        console.log("Hello after 1 second");
    }

    greet();
    ➤ Why use async/await?
    Easier to read than .then() chains

    Try/catch can be used for error handling


    async function getUserData() {
        try {
            const res = await fetch("https://api.example.com/user");
            const data = await res.json();
            console.log(data);
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    }

    ✅ 2. fetch
    The fetch API is a built-in browser method to make HTTP requests.

    ➤ Example:
    async function getData() {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
        const data = await response.json();
        console.log(data);
    }


    ➤ Key Notes:
    Returns a Promise

    You need to manually convert the response using .json()

    No automatic timeout or error for HTTP status like 404/500

    ✅ 3. Axios
    Axios is a popular third-party HTTP client library that simplifies requests.

    ➤ Installation:
    npm install axios
    ➤ Example:
    import axios from "axios";

    async function getData() {
        try {
            const res = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
            console.log(res.data); // no need for .json()
        } catch (err) {
            console.error("Error:", err.message);
        }
    }

    ✅ 4. fetch vs Axios Comparison
    Feature	                    fetch	                        axios
    Built-in	                ✅ Yes	                        ❌ No (needs installation)
    Returns JSON automatically	❌ No (use .json())	            ✅ Yes
    Error handling	            ❌ No auto for 4xx/5xx	        ✅ Yes
    Timeout support	            ❌ No	                        ✅ Yes
    Request cancellation	    ❌ Manual via AbortController	✅ Built-in (via CancelToken)
    Interceptors	            ❌ No	                        ✅ Yes
    Older browser support	    ❌ Needs polyfill	            ✅ Better support

*/

// install git 
// install nodejs
// read about javascript es6 

