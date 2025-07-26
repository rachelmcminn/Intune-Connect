export function getReorderDestinationIndex({
  startIndex,
  closestEdgeOfTarget,
  indexOfTarget,
  axis
}) {
  // invalid index's
  if (startIndex === -1 || indexOfTarget === -1) {
    return startIndex;
  }

  // if we are targeting the same index we don't need to do anything
  if (startIndex === indexOfTarget) {
    return startIndex;
  }
  if (closestEdgeOfTarget == null) {
    return indexOfTarget;
  }
  const isGoingAfter = axis === 'vertical' && closestEdgeOfTarget === 'bottom' || axis === 'horizontal' && closestEdgeOfTarget === 'right';
  const isMovingForward = startIndex < indexOfTarget;
  // moving forward
  if (isMovingForward) {
    return isGoingAfter ? indexOfTarget : indexOfTarget - 1;
  }
  // moving backwards
  return isGoingAfter ? indexOfTarget + 1 : indexOfTarget;
}