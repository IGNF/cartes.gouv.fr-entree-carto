#!/usr/bin/env node
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('fs')) :
	typeof define === 'function' && define.amd ? define(['fs'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fs));
})(this, (function (fs) { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var minimist$1;
	var hasRequiredMinimist;

	function requireMinimist () {
		if (hasRequiredMinimist) return minimist$1;
		hasRequiredMinimist = 1;

		function hasKey(obj, keys) {
			var o = obj;
			keys.slice(0, -1).forEach(function (key) {
				o = o[key] || {};
			});

			var key = keys[keys.length - 1];
			return key in o;
		}

		function isNumber(x) {
			if (typeof x === 'number') { return true; }
			if ((/^0x[0-9a-f]+$/i).test(x)) { return true; }
			return (/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/).test(x);
		}

		function isConstructorOrProto(obj, key) {
			return (key === 'constructor' && typeof obj[key] === 'function') || key === '__proto__';
		}

		minimist$1 = function (args, opts) {
			if (!opts) { opts = {}; }

			var flags = {
				bools: {},
				strings: {},
				unknownFn: null,
			};

			if (typeof opts.unknown === 'function') {
				flags.unknownFn = opts.unknown;
			}

			if (typeof opts.boolean === 'boolean' && opts.boolean) {
				flags.allBools = true;
			} else {
				[].concat(opts.boolean).filter(Boolean).forEach(function (key) {
					flags.bools[key] = true;
				});
			}

			var aliases = {};

			function aliasIsBoolean(key) {
				return aliases[key].some(function (x) {
					return flags.bools[x];
				});
			}

			Object.keys(opts.alias || {}).forEach(function (key) {
				aliases[key] = [].concat(opts.alias[key]);
				aliases[key].forEach(function (x) {
					aliases[x] = [key].concat(aliases[key].filter(function (y) {
						return x !== y;
					}));
				});
			});

			[].concat(opts.string).filter(Boolean).forEach(function (key) {
				flags.strings[key] = true;
				if (aliases[key]) {
					[].concat(aliases[key]).forEach(function (k) {
						flags.strings[k] = true;
					});
				}
			});

			var defaults = opts.default || {};

			var argv = { _: [] };

			function argDefined(key, arg) {
				return (flags.allBools && (/^--[^=]+$/).test(arg))
					|| flags.strings[key]
					|| flags.bools[key]
					|| aliases[key];
			}

			function setKey(obj, keys, value) {
				var o = obj;
				for (var i = 0; i < keys.length - 1; i++) {
					var key = keys[i];
					if (isConstructorOrProto(o, key)) { return; }
					if (o[key] === undefined) { o[key] = {}; }
					if (
						o[key] === Object.prototype
						|| o[key] === Number.prototype
						|| o[key] === String.prototype
					) {
						o[key] = {};
					}
					if (o[key] === Array.prototype) { o[key] = []; }
					o = o[key];
				}

				var lastKey = keys[keys.length - 1];
				if (isConstructorOrProto(o, lastKey)) { return; }
				if (
					o === Object.prototype
					|| o === Number.prototype
					|| o === String.prototype
				) {
					o = {};
				}
				if (o === Array.prototype) { o = []; }
				if (o[lastKey] === undefined || flags.bools[lastKey] || typeof o[lastKey] === 'boolean') {
					o[lastKey] = value;
				} else if (Array.isArray(o[lastKey])) {
					o[lastKey].push(value);
				} else {
					o[lastKey] = [o[lastKey], value];
				}
			}

			function setArg(key, val, arg) {
				if (arg && flags.unknownFn && !argDefined(key, arg)) {
					if (flags.unknownFn(arg) === false) { return; }
				}

				var value = !flags.strings[key] && isNumber(val)
					? Number(val)
					: val;
				setKey(argv, key.split('.'), value);

				(aliases[key] || []).forEach(function (x) {
					setKey(argv, x.split('.'), value);
				});
			}

			Object.keys(flags.bools).forEach(function (key) {
				setArg(key, defaults[key] === undefined ? false : defaults[key]);
			});

			var notFlags = [];

			if (args.indexOf('--') !== -1) {
				notFlags = args.slice(args.indexOf('--') + 1);
				args = args.slice(0, args.indexOf('--'));
			}

			for (var i = 0; i < args.length; i++) {
				var arg = args[i];
				var key;
				var next;

				if ((/^--.+=/).test(arg)) {
					// Using [\s\S] instead of . because js doesn't support the
					// 'dotall' regex modifier. See:
					// http://stackoverflow.com/a/1068308/13216
					var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
					key = m[1];
					var value = m[2];
					if (flags.bools[key]) {
						value = value !== 'false';
					}
					setArg(key, value, arg);
				} else if ((/^--no-.+/).test(arg)) {
					key = arg.match(/^--no-(.+)/)[1];
					setArg(key, false, arg);
				} else if ((/^--.+/).test(arg)) {
					key = arg.match(/^--(.+)/)[1];
					next = args[i + 1];
					if (
						next !== undefined
						&& !(/^(-|--)[^-]/).test(next)
						&& !flags.bools[key]
						&& !flags.allBools
						&& (aliases[key] ? !aliasIsBoolean(key) : true)
					) {
						setArg(key, next, arg);
						i += 1;
					} else if ((/^(true|false)$/).test(next)) {
						setArg(key, next === 'true', arg);
						i += 1;
					} else {
						setArg(key, flags.strings[key] ? '' : true, arg);
					}
				} else if ((/^-[^-]+/).test(arg)) {
					var letters = arg.slice(1, -1).split('');

					var broken = false;
					for (var j = 0; j < letters.length; j++) {
						next = arg.slice(j + 2);

						if (next === '-') {
							setArg(letters[j], next, arg);
							continue;
						}

						if ((/[A-Za-z]/).test(letters[j]) && next[0] === '=') {
							setArg(letters[j], next.slice(1), arg);
							broken = true;
							break;
						}

						if (
							(/[A-Za-z]/).test(letters[j])
							&& (/-?\d+(\.\d*)?(e-?\d+)?$/).test(next)
						) {
							setArg(letters[j], next, arg);
							broken = true;
							break;
						}

						if (letters[j + 1] && letters[j + 1].match(/\W/)) {
							setArg(letters[j], arg.slice(j + 2), arg);
							broken = true;
							break;
						} else {
							setArg(letters[j], flags.strings[letters[j]] ? '' : true, arg);
						}
					}

					key = arg.slice(-1)[0];
					if (!broken && key !== '-') {
						if (
							args[i + 1]
							&& !(/^(-|--)[^-]/).test(args[i + 1])
							&& !flags.bools[key]
							&& (aliases[key] ? !aliasIsBoolean(key) : true)
						) {
							setArg(key, args[i + 1], arg);
							i += 1;
						} else if (args[i + 1] && (/^(true|false)$/).test(args[i + 1])) {
							setArg(key, args[i + 1] === 'true', arg);
							i += 1;
						} else {
							setArg(key, flags.strings[key] ? '' : true, arg);
						}
					}
				} else {
					if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
						argv._.push(flags.strings._ || !isNumber(arg) ? arg : Number(arg));
					}
					if (opts.stopEarly) {
						argv._.push.apply(argv._, args.slice(i + 1));
						break;
					}
				}
			}

			Object.keys(defaults).forEach(function (k) {
				if (!hasKey(argv, k.split('.'))) {
					setKey(argv, k.split('.'), defaults[k]);

					(aliases[k] || []).forEach(function (x) {
						setKey(argv, x.split('.'), defaults[k]);
					});
				}
			});

			if (opts['--']) {
				argv['--'] = notFlags.slice();
			} else {
				notFlags.forEach(function (k) {
					argv._.push(k);
				});
			}

			return argv;
		};
		return minimist$1;
	}

	var minimistExports = requireMinimist();
	var minimist = /*@__PURE__*/getDefaultExportFromCjs(minimistExports);

	var $root = {
		version: {
			required: true,
			type: "enum",
			values: [
				8
			]
		},
		name: {
			type: "string"
		},
		metadata: {
			type: "*"
		},
		center: {
			type: "array",
			value: "number"
		},
		centerAltitude: {
			type: "number"
		},
		zoom: {
			type: "number"
		},
		bearing: {
			type: "number",
			"default": 0,
			period: 360,
			units: "degrees"
		},
		pitch: {
			type: "number",
			"default": 0,
			units: "degrees"
		},
		roll: {
			type: "number",
			"default": 0,
			units: "degrees"
		},
		state: {
			type: "state",
			"default": {
			}
		},
		light: {
			type: "light"
		},
		sky: {
			type: "sky"
		},
		projection: {
			type: "projection"
		},
		terrain: {
			type: "terrain"
		},
		sources: {
			required: true,
			type: "sources"
		},
		sprite: {
			type: "sprite"
		},
		glyphs: {
			type: "string"
		},
		transition: {
			type: "transition"
		},
		layers: {
			required: true,
			type: "array",
			value: "layer"
		}
	};
	var layer = {
		id: {
			type: "string",
			required: true
		},
		type: {
			type: "enum",
			values: {
				fill: {
				},
				line: {
				},
				symbol: {
				},
				circle: {
				},
				heatmap: {
				},
				"fill-extrusion": {
				},
				raster: {
				},
				hillshade: {
				},
				"color-relief": {
				},
				background: {
				}
			},
			required: true
		},
		metadata: {
			type: "*"
		},
		source: {
			type: "string"
		},
		"source-layer": {
			type: "string"
		},
		minzoom: {
			type: "number",
			minimum: 0,
			maximum: 24
		},
		maxzoom: {
			type: "number",
			minimum: 0,
			maximum: 24
		},
		filter: {
			type: "filter"
		},
		layout: {
			type: "layout"
		},
		paint: {
			type: "paint"
		}
	};
	var latest = {
		$root: $root,
		layer: layer};

	// Note: This regex matches even invalid JSON strings, but since we’re
	// working on the output of `JSON.stringify` we know that only valid strings
	// are present (unless the user supplied a weird `options.indent` but in
	// that case we don’t care since the output would be invalid anyway).
	const stringOrChar = /("(?:[^\\"]|\\.)*")|[:,]/g;

	function stringify(passedObj, options = {}) {
	  const indent = JSON.stringify(
	    [1],
	    undefined,
	    options.indent === undefined ? 2 : options.indent
	  ).slice(2, -3);

	  const maxLength =
	    indent === ""
	      ? Infinity
	      : options.maxLength === undefined
	      ? 80
	      : options.maxLength;

	  let { replacer } = options;

	  return (function _stringify(obj, currentIndent, reserved) {
	    if (obj && typeof obj.toJSON === "function") {
	      obj = obj.toJSON();
	    }

	    const string = JSON.stringify(obj, replacer);

	    if (string === undefined) {
	      return string;
	    }

	    const length = maxLength - currentIndent.length - reserved;

	    if (string.length <= length) {
	      const prettified = string.replace(
	        stringOrChar,
	        (match, stringLiteral) => {
	          return stringLiteral || `${match} `;
	        }
	      );
	      if (prettified.length <= length) {
	        return prettified;
	      }
	    }

	    if (replacer != null) {
	      obj = JSON.parse(string);
	      replacer = undefined;
	    }

	    if (typeof obj === "object" && obj !== null) {
	      const nextIndent = currentIndent + indent;
	      const items = [];
	      let index = 0;
	      let start;
	      let end;

	      if (Array.isArray(obj)) {
	        start = "[";
	        end = "]";
	        const { length } = obj;
	        for (; index < length; index++) {
	          items.push(
	            _stringify(obj[index], nextIndent, index === length - 1 ? 0 : 1) ||
	              "null"
	          );
	        }
	      } else {
	        start = "{";
	        end = "}";
	        const keys = Object.keys(obj);
	        const { length } = keys;
	        for (; index < length; index++) {
	          const key = keys[index];
	          const keyPart = `${JSON.stringify(key)}: `;
	          const value = _stringify(
	            obj[key],
	            nextIndent,
	            keyPart.length + (index === length - 1 ? 0 : 1)
	          );
	          if (value !== undefined) {
	            items.push(keyPart + value);
	          }
	        }
	      }

	      if (items.length > 0) {
	        return [start, indent + items.join(`,\n${nextIndent}`), end].join(
	          `\n${currentIndent}`
	        );
	      }
	    }

	    return string;
	  })(passedObj, "", 0);
	}

	function sortKeysBy(obj, reference) {
	    const result = {};
	    for (const key in reference) {
	        if (obj[key] !== undefined) {
	            result[key] = obj[key];
	        }
	    }
	    for (const key in obj) {
	        if (result[key] === undefined) {
	            result[key] = obj[key];
	        }
	    }
	    return result;
	}
	/**
	 * Format a MapLibre Style.  Returns a stringified style with its keys
	 * sorted in the same order as the reference style.
	 *
	 * The optional `space` argument is passed to
	 * [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
	 * to generate formatted output.
	 *
	 * If `space` is unspecified, a default of `2` spaces will be used.
	 *
	 * @private
	 * @param {Object} style a MapLibre Style
	 * @param {number} [space] space argument to pass to `JSON.stringify`
	 * @returns {string} stringified formatted JSON
	 * @example
	 * var fs = require('fs');
	 * var format = require('maplibre-gl-style-spec').format;
	 * var style = fs.readFileSync('./source.json', 'utf8');
	 * fs.writeFileSync('./dest.json', format(style));
	 * fs.writeFileSync('./dest.min.json', format(style, 0));
	 */
	function format(style, space = 2) {
	    style = sortKeysBy(style, latest.$root);
	    if (style.layers) {
	        style.layers = style.layers.map((layer) => sortKeysBy(layer, latest.layer));
	    }
	    return stringify(style, { indent: space });
	}

	const argv = minimist(process.argv.slice(2));

	if (argv.help || argv.h || (!argv._.length && process.stdin.isTTY)) {
	    help();
	} else {
	    console.log(format(JSON.parse(fs.readFileSync(argv._[0]).toString()), argv.space));
	}

	function help() {
	    console.log('usage:');
	    console.log('  gl-style-format source.json > destination.json');
	    console.log('');
	    console.log('options:');
	    console.log('  --space <num>');
	    console.log('     Number of spaces in output (default "2")');
	    console.log('     Pass "0" for minified output.');
	}

}));
//# sourceMappingURL=gl-style-format.cjs.map
