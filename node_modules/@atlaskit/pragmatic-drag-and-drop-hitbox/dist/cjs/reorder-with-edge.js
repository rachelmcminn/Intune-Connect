"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reorderWithEdge = reorderWithEdge;
var _reorder = require("@atlaskit/pragmatic-drag-and-drop/reorder");
var _getReorderDestinationIndex = require("./get-reorder-destination-index");
function reorderWithEdge(_ref) {
  var list = _ref.list,
    startIndex = _ref.startIndex,
    closestEdgeOfTarget = _ref.closestEdgeOfTarget,
    indexOfTarget = _ref.indexOfTarget,
    axis = _ref.axis;
  return (0, _reorder.reorder)({
    list: list,
    startIndex: startIndex,
    finishIndex: (0, _getReorderDestinationIndex.getReorderDestinationIndex)({
      closestEdgeOfTarget: closestEdgeOfTarget,
      startIndex: startIndex,
      indexOfTarget: indexOfTarget,
      axis: axis
    })
  });
}