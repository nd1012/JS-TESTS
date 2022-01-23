# JS-TESTS

A simple JavaScript unit testing helper class.

## Usage

Load the `tests.js` and your test class in a browser and execute this command at the JavaScript console:

```js
await Tests.RunAllTests(new Test());
```

Example test class:

```js
class Test extends Tests{
	Example_Test(){
		this.Assert(true);
		this.AssertException(()=>throw new Error('test'),Error);
		this.Assert(false);// Will throw an error
	}

	constructor(){super();}
}
```

All methods having the `_Test` postfix will be executed (a test method may be synchronous or asynchronous).

**TIP**: [Have a look at the tests](tests/tests.tests.js) (especially the `Tests_Tests_Ok` sub-test class) and the [tests.html](tests/tests.html) for more examples. For a demonstration, you can [run the tests in your browser](https://nd1012.github.io/JS-TESTS/index.html).

You could also run the tests of `Test` using the `RunTests` method:

```js
await (new Test()).RunTests();
```

Of course you can only run one specific test (without benchmark or assertion count):

```js
(new Test()).Example_Test();
```

If you want to run multiple single test methods, you might want to reset the test results before, by calling the `Reset` method.

**TIP**: To temporary disable a test, simply make it a private method (add the `#` prefix to the method name).

### Catch non-assertion test code exception

If test code produces an exception, actually the tests would break, and you can't debug the stack of the error. To be able to debug the stack of an error from your test code:

```js
...
Any_Test(){
	this.Catch(()=>throw new Error());
}
...
```

The `Catch` method will re-throw the error, because testing should be interrupted in this case.

For asynchronous test code use `CatchAsync`.

### Benchmark

The `Benchmark` method will return the start time and output the runtime to the console, if the start time was given as a parameter:

```js
Any_Test(){
	let start=this.Benchmark();
	this.Assert(AnyType.AnyMethod());
	this.Benchmark(start);
}
```

## Support

- Synchronous and asynchronous test methods
- Assertions
	- `Assert`: conditional
	- `AssertEqual`: comparing (optional strict mode)
	- `AssertNotEqual`: not comparing (optional strict mode)
	- `AssertType`: type (using a type or a type name, optional strict mode)
	- `AssertNotType`: not type (using a type or a type name, optional strict mode)
	- `AssertException` and `AssertExceptionAsync`: exception
	- `AssertNotException` and `AssertNotExceptionAsync`: not exception
- Catch non-asserting test code exception
	- `Catch`
	- `CatchAsync`
- Benchmark of and (custom) for the tests (customs using `Benchmark`)
- Direct test class execution using `RunTests` (a test class is a test result, too)
- Execution of multiple test classes for combined test results using static `Tests.RunAllTests` (will be returned as combined test result object)
- Grouped JavaScript console output
- Assertion error type `AssertionError`
