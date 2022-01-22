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

You could also run the tests of `Test` using the `RunTests` method:

```js
await (new Test()).RunTests();
```

Of course you can only run one specific test (without benchmark or assertion count):

**TIP**: To temporary disable a test, simply make it a private method (add the `#` prefix to the method name).

```js
(new Test()).Example_Test();
```

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

## Support

- Synchronous test methods
- Asynchronous test methods
- Assertion
- Exception assertion
- Equal / not equal assertion
- Catch non-asserting test code exception
- Assertion error type
- Assertion count
- Benchmark
- Direct test class execution
- Execution of multiple test classes
- Grouped JavaScript console output
