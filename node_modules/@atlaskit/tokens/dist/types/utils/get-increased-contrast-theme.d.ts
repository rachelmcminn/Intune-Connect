import { type ThemeIds, type ThemeOverrideIds } from '../theme-config';
/**
 * Finds any matching increased contrast theme available for a selected theme.
 */
export default function getIncreasedContrastTheme(themeId: ThemeIds | ThemeOverrideIds): ThemeIds | ThemeOverrideIds | undefined;
