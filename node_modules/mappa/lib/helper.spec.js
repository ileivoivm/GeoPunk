var expect = require('chai').expect
var Mapper = require('../mappa')
var m = Mapper.helper


describe ("Mappa.helper", function () {

	describe (".read()", function () {
		var mapper, source, target


		it ("can be used to get an object paths", function () {
			var mapper = Mapper({
				name: {
					_read: m.read('OldName'),
				}
			})

			var source = {
				OldName: 'OldName Value',
			}

			var target = {
				name: 'OldName Value'
			}

			expect( mapper.read(source) ).to.eql( target )
		});
	});


	describe (".write()", function () {
		var mapper, source, target


		it ("can be used to set object paths", function () {
			var mapper = Mapper({
				name: {
					_write: m.write('OldName')
				}
			})

			var source = {
				OldName: 'OldName Value',
			}

			var target = {
				name: 'OldName Value'
			}

			expect( mapper.write(target) ).to.eql( source )
		});
	});


	describe (".key()", function () {
		var mapper, source, target


		it ("can be used to get AND set object paths", function () {
			var mapper = Mapper({
				name: m.key('OldName')
			})

			var source = {
				OldName: 'OldName Value',
			}

			var target = {
				name: 'OldName Value'
			}

			expect( mapper.read(source) ).to.eql( target )
			expect( mapper.write(target) ).to.eql( source )
		});
	});






	describe (".array()", function () {

		it ("can be used to map an array with another mapper", function () {
			var mapper = Mapper({
				people: m.array('People', Mapper({
					name: 'PersonName'
				}))
			})

			var source = {
				People: [
					{PersonName: 'A'},
					{PersonName: 'B'},
				]
			}

			var target = {
				people: [
					{name: 'A'},
					{name: 'B'},
				]
			}

			expect( mapper.read(source) ).to.eql( target )
			expect( mapper.write(target) ).to.eql( source )
		});


		it ("always returns an array when no source is available", function () {
			var mapper = Mapper({
				people: m.array('People', Mapper({
					name: 'PersonName'
				}))
			})

			expect( mapper.read({}) ).to.eql( {people: []} )
			expect( mapper.write({people: undefined}) ).to.eql( {People: []} )
		});
	});


	describe (".mapper()", function () {

		it ("can be used to map a sub-object with another mapper", function () {
			var mapper = Mapper({
				person: m.mapper(Mapper({
					name: 'PersonName'
				}))
			})

			var source = {
				PersonName: 'PersonName value'
			}

			var target = {
				person: {
					name: 'PersonName value'
				}
			}

			expect( mapper.read(source) ).to.eql( target )
			expect( mapper.write(target) ).to.eql( source )
		});

	});



	describe (".transform()", function () {

		it ("transforms values using an object", function () {
			var types = {
				'source value': 'target value',
			}

			var mapper = Mapper({
				product_type: m.transform('LegacyProductType', types)
			})

			var source = {
				LegacyProductType: 'source value'
			}

			var target = {
				product_type: 'target value',
			}

			expect( mapper.read(source) ).to.eql( target )
			expect( mapper.write(target) ).to.eql( source )
		});


		it ("can use a {read_default} value", function () {
			var types = {
				'source value': 'target value',
			}

			var mapper = Mapper({
				product_type: m.transform('LegacyProductType', types, {read_default: 'default read value'})
			})

			expect( mapper.read({ LegacyProductType: 'missing'}) ).to.eql( {product_type: 'default read value'} )
		});


		it ("can use a {write_default} value", function () {
			var types = {
				'source value': 'target value',
			}

			var mapper = Mapper({
				product_type: m.transform('LegacyProductType', types, {write_default: 'default write value'})
			})

			expect( mapper.write({product_type: 'missing'}) ).to.eql( { LegacyProductType: 'default write value'} )
		});


	});



	describe (".opposite()", function () {
		var mapper, source, target

		it ("inverts boolean values, ignores nullish values, or returns a default when nullish", function () {
			mapper = Mapper({
				opposite_of_true: m.opposite('true_prop'),
				opposite_of_false: m.opposite('false_prop'),
				opposite_of_null: m.opposite('null_prop'),
				opposite_of_null_with_default: m.opposite('null_prop', {read_default: true})
			})

			source = {
				true_prop: true,
				false_prop: false,
				null_prop: null
			}

			target = {
				opposite_of_true: false,
				opposite_of_false: true,
				opposite_of_null: null,
				opposite_of_null_with_default: true,
			}

			expect( mapper.read(source) ).to.eql( target )
			target.opposite_of_null_with_default = null
			expect( mapper.write(target) ).to.eql( source )
		});
	});



});
