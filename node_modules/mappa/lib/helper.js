var _get = require('lodash/get')
var _set = require('lodash/set')
var _findKey = require('lodash/findKey')
var _isEmpty = require('lodash/isempty')


module.exports = {
	// dog food
	read: read,
	write: write,
	key: key,
	array: array,
	mapper: mapper,
	// bonus
	transform: transform,
	opposite: opposite,
}


function read(path) {
	return function (source) {
		return _get(source, path)
	}
}


function write(path) {
	return function (value, source) {
		_set(source, path, value)
	}
}


function key(path) {
	return {
		_read: read(path),
		_write: write(path),
	}
}


function array(path, mapper) {
	var get = read(path)
	var set = write(path)

	return {
		_read: function (source) {
			var arr = get(source)
			if (_isEmpty(arr)) return []
			return arr.map(mapper.read)
		},
		_write: function (value, source) {
			if (!value) value = []
			set(value.map(mapper.write), source)
		}
	}
}


function mapper(mapper) {
	return {
		_read: function (source) {
			return mapper.read(source)
		},
		_write: function (value, source) {
			mapper.write(value, {to: source})
		}
	}
}


function transform(path, value_map, opts) {
	opts = opts || {}
	var get = read(path)
	var set = write(path)

	return {
		_read: function (source) {
			return value_map[get(source)] || opts.read_default
		},
		_write: function (value, source) {
			var source_value = _findKey(value_map, function (val) {
				return val == value
			})
			set(source_value || opts.write_default, source)
		}
	}
}


function opposite(path, opts) {
	opts = opts || {}
	var get = read(path)
	var set = write(path)

	return {
		_read: function (source) {
			var value = get(source)
			return (value == null) ? (opts.read_default || value) : !value
		},
		_write: function (value, source) {
			set((value == null) ? value : !value, source)
		}
	}
}
