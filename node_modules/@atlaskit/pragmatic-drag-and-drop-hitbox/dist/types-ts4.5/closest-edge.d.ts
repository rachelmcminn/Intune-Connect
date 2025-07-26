import type { Input } from '@atlaskit/pragmatic-drag-and-drop/types';
import type { Edge as EdgeRaw } from './types';
export type Edge = EdgeRaw;
/**
 * Adds a unique `Symbol` to the `userData` object. Use with `extractClosestEdge()` for type safe lookups.
 */
export declare function attachClosestEdge(userData: Record<string | symbol, unknown>, { element, input, allowedEdges, }: {
    element: Element;
    input: Input;
    allowedEdges: Edge[];
}): Record<string | symbol, unknown>;
/**
 * Returns the value added by `attachClosestEdge()` to the `userData` object. It will return `null` if there is no value.
 */
export declare function extractClosestEdge(userData: Record<string | symbol, unknown>): Edge | null;
