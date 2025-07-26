import type { Input } from '@atlaskit/pragmatic-drag-and-drop/types';
export type ItemMode = 'standard' | 'expanded' | 'last-in-group';
export type Instruction = {
    type: 'reorder-above';
    currentLevel: number;
    indentPerLevel: number;
} | {
    type: 'reorder-below';
    currentLevel: number;
    indentPerLevel: number;
} | {
    type: 'make-child';
    currentLevel: number;
    indentPerLevel: number;
} | {
    type: 'reparent';
    currentLevel: number;
    indentPerLevel: number;
    desiredLevel: number;
} | {
    type: 'instruction-blocked';
    desired: Exclude<Instruction, {
        type: 'instruction-blocked';
    }>;
};
declare function getInstruction({ element, input, currentLevel, indentPerLevel, mode, }: {
    element: Element;
    input: Input;
    currentLevel: number;
    indentPerLevel: number;
    mode: ItemMode;
}): Instruction;
export declare function attachInstruction(userData: Record<string | symbol, unknown>, { block, ...rest }: Parameters<typeof getInstruction>[0] & {
    block?: Instruction['type'][];
}): Record<string | symbol, unknown>;
export declare function extractInstruction(userData: Record<string | symbol, unknown>): Instruction | null;
export {};
