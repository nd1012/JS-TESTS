class Tests_Tests extends Tests{
	async Tests_Test(){
		// Version number
		this.AssertEqual(Tests.VERSION,2,true);

		// Success
		let res=await this.AssertNoExceptionAsync(async ()=>await (new Tests_Tests_Ok()).RunTests());
		this.AssertNotEqual(res,null)
			.AssertEqual(res.LastError,null)
			.AssertEqual(res.Tests,1,true)
			.AssertEqual(res.Assertions,19,true)
			.AssertEqual(res.Benchmarks.size,1,true)
			.Assert(res.Benchmarks.has('Ok_Test'))
			.AssertType(res.Benchmarks.get('Ok_Test'),Array)
			.AssertEqual(res.Benchmarks.get('Ok_Test').length,1,true)
			.AssertEqual(res.Benchmarks.get('Ok_Test')[0][0],'Test',true)
			.AssertType(res.Benchmarks.get('Ok_Test')[0][1],'number')
			.Assert(res.TestResults.has('Ok_Test'))
			.AssertType(res.TestResults.get('Ok_Test'),TestResults)
			.AssertEqual(res.TestResults.get('Ok_Test').LastError,null);
		console.log('Adding ok test assertion count',res);
		this.Assertions+=res.Assertions;

		// Fail
		res=await this.AssertNoExceptionAsync(async ()=>await (new Tests_Tests_Fail()).RunTests());
		this.AssertNotEqual(res,null)
			.AssertType(res.LastError,AssertionError)
			.AssertEqual(res.Tests,1,true)
			.AssertEqual(res.Assertions,1,true)
			.Assert(res.TestResults.has('Fail_Test'))
			.AssertType(res.TestResults.get('Fail_Test'),TestResults)
			.AssertType(res.TestResults.get('Fail_Test').LastError,AssertionError);
		console.log('Adding fail test assertion count',res);
		this.Assertions+=res.Assertions;
	}

	constructor(){super();}
}

class Tests_Tests_Ok extends Tests{
	async Ok_Test(){
		const start=this.AssertNoException(()=>this.Benchmark());
		this.Assert(true)
			.AssertEqual(1,true)
			.AssertEqual(true,true,true)
			.AssertNotEqual(1,false)
			.AssertNotEqual(0,false,true)
			.AssertType(this,Tests)
			.AssertType(true,'boolean')
			.AssertType(true,'boolean',true)
			.AssertNotType(this,Number)
			.AssertNotType(this,'string')
			.AssertNotType(this,Tests,true)
			.AssertException(()=>{throw new TypeError()})
			.AssertException(()=>{throw new RangeError()},RangeError)
			.Assert(await this.AssertNoExceptionAsync(async ()=>true))
			.Assert(await this.AssertExceptionAsync(async ()=>{throw new Error()}))
			.AssertNoException(()=>this.Benchmark(start,'Test'));
	}

	constructor(){super();}
}

class Tests_Tests_Fail extends Tests{
	Fail_Test(){
		this.Assert(false);
	}

	constructor(){super();}
}
