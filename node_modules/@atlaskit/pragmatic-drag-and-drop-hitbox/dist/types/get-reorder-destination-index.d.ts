import type { Edge } from './types';
export declare function getReorderDestinationIndex({ startIndex, closestEdgeOfTarget, indexOfTarget, axis, }: {
    startIndex: number;
    closestEdgeOfTarget: Edge | null;
    indexOfTarget: number;
    axis: 'vertical' | 'horizontal';
}): number;
