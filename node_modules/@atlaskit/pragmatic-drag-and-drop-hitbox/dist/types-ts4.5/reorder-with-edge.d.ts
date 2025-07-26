import type { Edge } from './types';
export declare function reorderWithEdge<Value>({ list, startIndex, closestEdgeOfTarget, indexOfTarget, axis, }: {
    list: Value[];
    closestEdgeOfTarget: Edge | null;
    startIndex: number;
    indexOfTarget: number;
    axis: 'vertical' | 'horizontal';
}): Value[];
