import { type ActiveThemeState } from './theme-config';
/**
 * A React hook which returns the current themes and color-mode set on `<html>`.
 *
 * @example
 * ```
 * const { colorMode, dark, light, spacing, typography } = useThemeObserver();
 *
 * // Performing side effects when it changes
 * useEffect(() => {
 *   console.log(`The color mode has changed to ${theme.colorMode}`);
 * }, [theme.colorMode]);
 * ```
 */
declare const useThemeObserver: () => Partial<ActiveThemeState>;
export default useThemeObserver;
