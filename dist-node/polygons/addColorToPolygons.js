'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilGetColorByPos = require('../util/getColorByPos');

var _utilGetColorByPos2 = _interopRequireDefault(_utilGetColorByPos);

exports['default'] = function (polygons, colorData, params) {
	var pixelIndex = 0;
	var polygonCenterX = undefined;
	var polygonCenterY = undefined;

	var fill = params.fill;
	var fillColor = typeof fill === 'string' ? params.fill : false;
	var stroke = params.stroke;
	var strokeColor = typeof stroke === 'string' ? params.stroke : false;
	var strokeWidth = params.strokeWidth;
	var lineJoin = params.lineJoin;

	polygons.forEach(function (polygon, index) {
		var polygonCenter = {
			x: (polygon.a.x + polygon.b.x + polygon.c.x) * 0.33333,
			y: (polygon.a.y + polygon.b.y + polygon.c.y) * 0.33333
		};

		var color = (0, _utilGetColorByPos2['default'])(polygonCenter, colorData);

		if (fill) {
			polygon.fill = fillColor || 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
		}

		if (stroke) {
			if (strokeColor) {
				polygon.strokeColor = strokeColor;
			} else {
				polygon.strokeColor = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
			}

			polygon.strokeWidth = strokeWidth;
			polygon.lineJoin = lineJoin;
		}
	});

	return polygons;
};

module.exports = exports['default'];