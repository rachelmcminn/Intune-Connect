// re-exporting type to make it easy to use

const getDistanceToEdge = {
  top: (rect, client) => Math.abs(client.y - rect.top),
  right: (rect, client) => Math.abs(rect.right - client.x),
  bottom: (rect, client) => Math.abs(rect.bottom - client.y),
  left: (rect, client) => Math.abs(client.x - rect.left)
};

// using a symbol so we can guarantee a key with a unique value
const uniqueKey = Symbol('closestEdge');

/**
 * Adds a unique `Symbol` to the `userData` object. Use with `extractClosestEdge()` for type safe lookups.
 */
export function attachClosestEdge(userData, {
  element,
  input,
  allowedEdges
}) {
  var _entries$sort$0$edge, _entries$sort$;
  const client = {
    x: input.clientX,
    y: input.clientY
  };
  // I tried caching the result of `getBoundingClientRect()` for a single
  // frame in order to improve performance.
  // However, on measurement I saw no improvement. So no longer caching
  const rect = element.getBoundingClientRect();
  const entries = allowedEdges.map(edge => {
    return {
      edge,
      value: getDistanceToEdge[edge](rect, client)
    };
  });

  // edge can be `null` when `allowedEdges` is []
  const addClosestEdge = (_entries$sort$0$edge = (_entries$sort$ = entries.sort((a, b) => a.value - b.value)[0]) === null || _entries$sort$ === void 0 ? void 0 : _entries$sort$.edge) !== null && _entries$sort$0$edge !== void 0 ? _entries$sort$0$edge : null;
  return {
    ...userData,
    [uniqueKey]: addClosestEdge
  };
}

/**
 * Returns the value added by `attachClosestEdge()` to the `userData` object. It will return `null` if there is no value.
 */
export function extractClosestEdge(userData) {
  var _ref;
  return (_ref = userData[uniqueKey]) !== null && _ref !== void 0 ? _ref : null;
}