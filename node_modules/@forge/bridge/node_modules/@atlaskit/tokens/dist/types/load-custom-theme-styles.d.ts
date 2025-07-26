import { type ThemeState } from './theme-config';
/**
 * Synchronously generates and applies custom theme styles to the page.
 *
 * @param {Object<string, string>} themeState The themes and color mode that should be applied.
 * @param {Object} themeState.UNSAFE_themeOptions The custom branding options to be used for custom theme generation
 *
 * @example
 * ```
 * UNSAFE_loadCustomThemeStyles({
 *    colorMode: 'auto',
 *    UNSAFE_themeOptions: { brandColor: '#FF0000' }
 * });
 * ```
 */
declare const UNSAFE_loadCustomThemeStyles: ({ colorMode, UNSAFE_themeOptions, }?: Partial<ThemeState>) => void;
export default UNSAFE_loadCustomThemeStyles;
