'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilLuminance = require('../util/luminance');

var _utilLuminance2 = _interopRequireDefault(_utilLuminance);

var _utilDistance = require('../util/distance');

var _utilDistance2 = _interopRequireDefault(_utilDistance);

var _utilGetColorByPos = require('../util/getColorByPos');

var _utilGetColorByPos2 = _interopRequireDefault(_utilGetColorByPos);

exports['default'] = function (polygons, colorData, params) {
	polygons.forEach(function (polygon, polygonIndex) {
		var data = {};

		'abc'.split('').forEach(function (key) {
			var color = (0, _utilGetColorByPos2['default'])(polygon[key], colorData);

			data[key] = {
				key: key,
				color: color,
				x: polygon[key].x,
				y: polygon[key].y
			};

			data[key].luminance = (0, _utilLuminance2['default'])(data[key].color);

			var otherKeys = 'abc'.replace(key, '').split('');

			data[key].median = {
				x: (polygon[otherKeys[0]].x + polygon[otherKeys[1]].x) / 2,
				y: (polygon[otherKeys[0]].y + polygon[otherKeys[1]].y) / 2
			};

			data[key].medianColor = (0, _utilGetColorByPos2['default'])(data[key].median, colorData);
			data[key].medianLuminance = (0, _utilLuminance2['default'])(data[key].medianColor);
		});

		// sort by axis of most difference in luminance
		var pointsByDeltaInLuminance = [data.a, data.b, data.c].sort(function (u, v) {
			return Math.abs(u.luminance - u.medianLuminance) - Math.abs(v.luminance - v.medianLuminance);
		});

		var pointWithMostDeltaInLuminance = pointsByDeltaInLuminance[0];
		var startPoint = pointsByDeltaInLuminance[0];
		var endPoint = pointWithMostDeltaInLuminance.median;

		var gradienStopPositions = [startPoint];

		var startToEndDistance = (0, _utilDistance2['default'])(startPoint, endPoint);

		for (var i = 1, len = params.gradientStops - 2; i < len; i++) {
			var pointDistance = i * (startToEndDistance / params.gradientStops);
			var pointPercent = pointDistance / startToEndDistance;

			var point = {
				x: startPoint.x + pointPercent * (endPoint.x - startPoint.x),
				y: startPoint.y + pointPercent * (endPoint.y - startPoint.y)
			};

			gradienStopPositions.push(point);
		}

		gradienStopPositions.push(endPoint);

		polygon.gradient = {
			x1: pointWithMostDeltaInLuminance.x,
			y1: pointWithMostDeltaInLuminance.y,
			x2: pointWithMostDeltaInLuminance.median.x,
			y2: pointWithMostDeltaInLuminance.median.y,
			colors: gradienStopPositions.map(function (pos) {
				return (0, _utilGetColorByPos2['default'])(pos, colorData);
			})
		};

		if (params.stroke) {
			polygon.strokeWidth = params.strokeWidth;
			polygon.lineJoin = params.lineJoin;
		}

		data = null;
	});

	return polygons;
};

module.exports = exports['default'];