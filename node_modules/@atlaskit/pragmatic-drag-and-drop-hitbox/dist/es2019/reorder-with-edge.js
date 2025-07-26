import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { getReorderDestinationIndex } from './get-reorder-destination-index';
export function reorderWithEdge({
  list,
  startIndex,
  closestEdgeOfTarget,
  indexOfTarget,
  axis
}) {
  return reorder({
    list,
    startIndex,
    finishIndex: getReorderDestinationIndex({
      closestEdgeOfTarget,
      startIndex,
      indexOfTarget,
      axis
    })
  });
}