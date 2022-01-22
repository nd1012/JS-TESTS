/**
 * JavaScript tests base class
 * 
 * @github https://github.com/nd1012/JS-TESTS
 * @license MIT
 * @copyright (c)2022 Andreas Zimmermann, wan24.de
 */
 class Tests{
	/**
	 * Assertion counter
	 * 
	 * @var {int}
	 */
	#Assertions=0;
	/**
	 * Current test assertion counter
	 * 
	 * @var {int}
	 */
	#TestAssertions=0;
	/**
	 * Test counter
	 * 
	 * @var {int}
	 */
	#Tests=0;
	/**
	 * Runtime in ms
	 * 
	 * @var {int}
	 */
	#Runtime=null;

	/**
	 * Get the assertion counter
	 * 
	 * @return {int} Assertions
	 */
	get Assertions(){return this.#Assertions;}

	/**
	 * Get the tests counter
	 * 
	 * @return {int} Tests
	 */
	get Tests(){return this.#Tests;}

	/**
	 * Get the test methods names
	 * 
	 * @return {string[]} Test method names
	 */
	get TestMethods(){return Object.getOwnPropertyNames(Object.getPrototypeOf(this));}

	/**
	 * Get the runtime
	 * 
	 * @return {int?} Runtime in ms
	 */
	get Runtime(){return this.#Runtime;}

	/**
	 * Catch an exception of an action (if any)
	 * 
	 * @param {Function<any>} action Action
	 * @return {any} Action return value
	 */
	Catch(action){
		try{
			return action();
		}catch(ex){
			console.groupEnd();
			console.error('Test code exception catched',ex);
			debugger;
			throw ex;
		}
	}

	/**
	 * Catch an exception of an asynchronous action (if any)
	 * 
	 * @param {AsyncFunction<any>} action Action
	 * @return {any} Action return value
	 */
	async CatchAsync(action){
		try{
			return await action();
		}catch(ex){
			console.groupEnd();
			console.error('Test code exception catched',ex);
			debugger;
			throw ex;
		}
	}

	/**
	 * Assertion
	 * 
	 * @param {boolean} condition Condition result
	 * @return {Tests} This
	 */
	Assert(condition){
		this.#Assertions++;
		this.#TestAssertions++;
		if(!condition){
			console.groupEnd();
			debugger;
			throw new AssertionError('Assertion failed at current test assertion '+this.#TestAssertions);
		}
		return this;
	}

	/**
	 * Equal assertion
	 * 
	 * @param {any} a A
	 * @param {any} b B
	 * @param {boolean} strict (optional) Be strict (default: `false`)?
	 * @return {Tests} This
	 */
	AssertEqual(a,b,strict=false){
		this.#Assertions++;
		this.#TestAssertions++;
		if(strict?a!=b:a!==b){
			console.groupEnd();
			console.warn(a,b,strict);
			debugger;
			throw new AssertionError('Assertion failed at current test assertion '+this.#TestAssertions);
		}
		return this;
	}

	/**
	 * Not equal assertion
	 * 
	 * @param {any} a A
	 * @param {any} b B
	 * @param {boolean} strict (optional) Be strict (default: `false`)?
	 * @return {Tests} This
	 */
	AssertNotEqual(a,b,strict=false){
		this.#Assertions++;
		this.#TestAssertions++;
		if(strict?a==b:a===b){
			console.groupEnd();
			console.warn(a,b,strict);
			debugger;
			throw new AssertionError('Assertion failed at current test assertion '+this.#TestAssertions);
		}
		return this;
	}

	/**
	 * Assert an exception
	 * 
	 * @param {Function<void>} action Action
	 * @param {Function<Error>} type (optional) Exception type
	 * @return {Tests} This
	 */
	AssertException(action,type=null){
		this.#Assertions++;
		try{
			action();
			debugger;
			throw new AssertionError('Assertion failed (exception not thrown) at current test assertion '+this.#TestAssertions);
		}catch(ex){
			if(type&&!(ex instanceof type)){
				console.groupEnd();
				console.warn(ex);
				debugger;
				throw new AssertionError('Assertion failed (exception type mismatch) at current test assertion '+this.#TestAssertions);
			}
		}
		return this;
	}

	/**
	 * Run tests
	 */
	async RunTests(){
		this.#Assertions=0;
		this.#Tests=0;
		this.#Runtime=null;
		let k,
			start=Date.now(),
			begin,
			err=false;
		try{
			for(k of this.TestMethods){
				if(!k.endsWith('_Test')||typeof this[k]!='function') continue;
				console.log('Running test "'+k+'"');
				this.#Tests++;
				this.#TestAssertions=0;
				begin=Date.now();
				await this[k]();
				console.log('Test runtime: '+(Date.now()-begin)+'ms');
			}
		}catch(ex){
			err=true;
			if(!(ex instanceof AssertionError)){
				console.groupEnd();
				console.error('Unexpected exception after '+this.#TestAssertions+' assertions',ex);
			}
			throw ex;
		}finally{
			const msg=this.#Tests+' tests with '+this.#Assertions+' assertions runtime: '+(this.#Runtime=Date.now()-start)+'ms';
			if(err){
				console.warn(msg+' (interrupted by an error)');
			}else{
				console.log(msg+' (without any error)');
			}
		}
	}

	/**
	 * Constructor
	 */
	constructor(){}

	/**
	 * 
	 * @param {...string|...object|...any} types Type names or test instances (or mixed)
	 */
	static async RunAllTests(...types){
		let type,
			start=Date.now(),
			count=0,
			assert=0,
			err=false,
			m;
		try{
			for(type of types){
				console.groupCollapsed('Test of '+(typeof type=='string'?type:type.constructor.name));
				console.log('Running tests of type "'+(typeof type=='string'?type:type.constructor.name)+'"');
				count++;
				if(!(type instanceof Tests)) type=new window[type]();
				await type.RunTests();
				assert+=type.Assertions;
				console.groupEnd();
				m='Last type test finished with '+type.Tests+' tests and '+type.Assertions+' assertions in runtime: '+type.Runtime+'ms';
				if(err){
					console.warn(m+' (interrupted by an error)');
				}else{
					console.log(m+' (without any error)');
				}
			}
		}catch(ex){
			console.groupEnd();
			err=true;
			throw ex;
		}finally{
			const msg=count+' test types runtime: '+(Date.now()-start)+'ms';
			if(err){
				console.warn(msg+' (interrupted by an error)');
			}else{
				console.log(msg+' (without any error)');
			}
		}
	}
}

/**
 * Assertion error
 */
class AssertionError extends Error{
	/**
	 * Constructor
	 * 
	 * @param {string} message Error message
	 */
	constructor(message){super(message);}
}
