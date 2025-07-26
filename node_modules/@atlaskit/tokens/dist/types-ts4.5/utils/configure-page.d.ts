import { type ThemeState } from '../theme-config';
/**
 * Given ThemeState, sets appropriate html attributes on the documentElement,
 * adds a listener to keep colorMode updated, and returns a function to unbind.
 */
export default function configurePage(themeState: ThemeState): () => void;
