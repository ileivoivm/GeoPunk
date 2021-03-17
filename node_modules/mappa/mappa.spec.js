var Mapper = require('./mappa')
var expect = require('chai').expect


describe ("Mappa", function () {

	describe ("with property config", function () {

		describe ("_read()", function () {

			it ("receives the source object and returns the target value", function () {
				var mapper = Mapper({
					name: {
						_read: function (source) {
							return source.data.OldName
						}
					}
				})

				var source = {
					data: {
						OldName: 'OldName Value',
					}
				}

				var target = {
					name: 'OldName Value'
				}

				expect( mapper.read(source) ).to.eql( target )
			});
		});

		describe ("_write()", function () {
			it ("receives the target value and source object, and sets the source value", function () {
				var mapper = Mapper({
					name: {
						_write: function (value, source) {
							source.data = {OldName: value}
						}
					}
				})

				var source = {
					data: {
						OldName: 'OldName Value',
					}
				}

				var target = {
					name: 'OldName Value'
				}

				expect( mapper.write(target) ).to.eql( source )
			});
		});


		describe ("_read_if()", function () {
			it ("receives the source object and returns a boolean to decide if the read should occur.", function () {
				var mapper = Mapper({
					name: {
						_read_if: function (source) {
							return source.data.id
						},
						_read: function (source) {
							return source.data.name
						}
					}
				})

				expect( mapper.read({data:{name: 'name value'}}) ).to.eql( {} )
				expect( mapper.read({data:{id: 123, name: 'name value'}}) ).to.eql( {name: 'name value'} )
			});
		});


		describe ("_write_if()", function () {
			it ("receives the target value and source object, and returns a boolean to decide if the write should occur.", function () {
				var mapper = Mapper({
					name: {
						_write_if: function (value, source) {
							return value.length > 3
						},
						_write: function (value, source) {
							source.data = {name: value}
						}
					}
				})

				expect( mapper.write({name: 'max'}) ).to.eql( {})
				expect( mapper.write({name: 'maximus'}) ).to.eql( {data: {name: 'maximus'}})
			});
		});

	}); // property config


	describe ("with multiple blocks", function () {
		it ("_map runs each block of changes on the same object.", function () {
			var mapper = Mapper([
				{
					_map: {
						name: Mapper.helper.key('OldName')
					},
				},
				{
					_map: {
						age: Mapper.helper.key('OldAge')
					}
				}
			])

			var source = {
				OldName: 'OldName value',
				OldAge: 'OldAge value'
			}

			var target = {
				name: 'OldName value',
				age: 'OldAge value'
			}

			expect( mapper.read(source) ).to.eql( target )
			expect( mapper.write(target) ).to.eql( source )
		});


		it ("can be located under the full _blocks property", function () {
			var mapper = Mapper({
				_blocks: [
					{
						_map: {
							name: Mapper.helper.key('OldName')
						},
					},
					{
						_map: {
							age: Mapper.helper.key('OldAge')
						}
					}
				]
			})

			var source = {
				OldName: 'OldName value',
				OldAge: 'OldAge value'
			}

			var target = {
				name: 'OldName value',
				age: 'OldAge value'
			}

			expect( mapper.read(source) ).to.eql( target )
			expect( mapper.write(target) ).to.eql( source )
		});


		it ("called with a simple blocks config", function () {
			var mapper = Mapper({
				_blocks: {
					name: Mapper.helper.key('OldName')
				}
			})

			var source = {
				OldName: 'OldName value',
			}

			var target = {
				name: 'OldName value',
			}

			expect( mapper.read(source) ).to.eql( target )
			expect( mapper.write(target) ).to.eql( source )
		});


		it ("_read_if() receives the source object, and determines if each block runs during read.", function () {
			var mapper = Mapper([
				{
					_map: {
						name: Mapper.helper.key('OldName')
					},
				},
				{
					_read_if: function (source) {
						return source.ID != null
					},
					_map: {
						age: Mapper.helper.key('OldAge')
					}
				}
			])

			var source = {
				OldName: 'OldName value',
				OldAge: 'OldAge value'
			}

			var target = {
				name: 'OldName value'
			}

			expect( mapper.read(source) ).to.eql( target )
		});


		it ("_write_if() receives the target object, and determines if each block runs during write.", function () {
			var mapper = Mapper([
				{
					_map: {
						name: Mapper.helper.key('OldName')
					},
				},
				{
					_write_if: function (target) {
						return (target.name == 'pass')
					},
					_map: {
						age: Mapper.helper.key('OldAge')
					}
				}
			])

			var source = {
				OldName: 'OldName value',
				OldAge: 'OldAge value'
			}

			var target = {
				name: 'OldName value'
			}

			expect( mapper.write({name: 'pass', age: 15}) ).to.eql( {OldName: 'pass', OldAge: 15} )
			expect( mapper.write({name: 'fail', age: 15}) ).to.eql( {OldName: 'fail'} )
		});
	});


	describe ("_constructor config", function () {
		it ("_constructor will be called with `new` after a read operation", function () {
			function Sample(opts) {
				this.name = opts.name
			}

			var mapper = Mapper({
				_constructor: Sample,
				_blocks: [
					{
						_map: {name: 'OldName'}
					}
				]
			})

			var source = {
				OldName: 'OldName value'
			}

			var target = mapper.read(source)

			expect( target ).to.be.instanceOf( Sample )
			expect( target.name ).to.eql( 'OldName value' )
		});

	});









	// SUGAR


	it ("accepts a simple block format", function () {
		var mapper = Mapper([
			{
				name: 'OldName'
			},
			{
				age: 'OldAge'
			}
		])

		var source = {
			OldName: 'OldName value',
			OldAge: 'OldAge value'
		}

		var target = {
			name: 'OldName value',
			age: 'OldAge value'
		}

		expect( mapper.read(source) ).to.eql( target )
		expect( mapper.write(target) ).to.eql( source )
	});


	describe ("with a string", function () {

		it ("maps to an object path", function () {
			var mapper = Mapper({
				name: 'data.OldName'
			})

			var source = {
				data: {
					OldName: 'OldName Value',
				}
			}

			var result = {
				name: 'OldName Value'
			}

			expect( mapper.read(source) ).to.eql( result )
			expect( mapper.write(result) ).to.eql( source )
		});


		it ("'=' maps to an object property of the same name", function () {
			var mapper = Mapper({
				same: '=',
				renamed: 'uglyName',
			})

			var source = {
				same: 'same value',
				uglyName: 'uglyName value'
			}

			var result = {
				same: 'same value',
				renamed: 'uglyName value',
			}

			expect( mapper.read(source) ).to.eql( result )
			expect( mapper.write(result) ).to.eql( source )
		});
	});




	describe ("with an array", function () {
		it ("maps an array with a sub-mapper: helper.array()", function () {
			var mapper = Mapper({
				people: [ 'People', {name: 'PersonName'} ]
			})

			var source = {
				People: [
					{PersonName: 'A'},
					{PersonName: 'B'},
				]
			}

			var result = {
				people: [
					{name: 'A'},
					{name: 'B'},
				]
			}

			expect( mapper.read(source) ).to.eql( result )
			expect( mapper.write(result) ).to.eql( source )
		});
	});




	describe ("with an object", function () {
		it ("maps a nested object with a sub-mapper: helper.mapper()", function () {
			var mapper = Mapper({
				person: {
					name: 'PersonName'
				}
			})

			var source = {
				PersonName: 'PersonName value'
			}

			var result = {
				person: {
					name: 'PersonName value'
				}
			}

			expect( mapper.read(source) ).to.eql( result )
			expect( mapper.write(result) ).to.eql( source )
		});
	});




	// options


	describe ("option: {to}", function () {
		it ("can modify an existing object during read() or write()", function () {
			var mapper = Mapper({
				renamed: 'uglyName',
			})

			var source = {
				uglyName: 'uglyName value'
			}

			var result = {
				renamed: 'uglyName value'
			}

			var obj

			obj = {}
			mapper.read(source, {to: obj})
			expect( obj ).to.eql( result )

			obj = {}
			mapper.write(result, {to: obj})
			expect( obj ).to.eql( source )
		});
	});




	// erratta


	describe ("erratta", function () {

		it ("sets missing keys to undefined", function () {
			var mapper = Mapper({
				missing: 'UglyMissing'
			})

			expect( mapper.read({})  ).to.eql( {missing: undefined} )
			expect( mapper.write({}) ).to.eql( {UglyMissing: undefined} )
		});
	});


});
