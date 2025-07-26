import { fg } from '@atlaskit/platform-feature-flags';
import { COLOR_MODE_ATTRIBUTE, CONTRAST_MODE_ATTRIBUTE } from './constants';
import { darkModeMediaQuery, moreContrastMediaQuery } from './utils/theme-loading';

/**
 * Provides a script that, when executed before paint, sets the `data-color-mode` attribute based on the current system theme,
 * to enable SSR support for automatic theme switching, avoid a flash of un-themed content on first paint.
 *
 * @param {string} colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 *
 * @returns {string} A string to be added to the innerHTML of a script tag in the document head
 */
var getSSRAutoScript = function getSSRAutoScript(colorMode, contrastMode) {
  if (colorMode !== 'auto' && contrastMode !== 'auto') {
    return undefined;
  }
  var setColorMode = colorMode === 'auto' ? "\n  try {\n    const darkModeMql = window.matchMedia('".concat(darkModeMediaQuery, "');\n    const colorMode = darkModeMql.matches ? 'dark' : 'light';\n    document.documentElement.setAttribute('").concat(COLOR_MODE_ATTRIBUTE, "', colorMode);\n  } catch (e) {}") : '';
  var setContrastMode = contrastMode === 'auto' && fg('platform_increased-contrast-themes') ? "\n  try {\n    const contrastModeMql = window.matchMedia('".concat(moreContrastMediaQuery, "');\n    const contrastMode = contrastModeMql.matches ? 'more' : 'no-preference';\n    document.documentElement.setAttribute('").concat(CONTRAST_MODE_ATTRIBUTE, "', contrastMode);\n  } catch (e) {}") : '';
  return "(() => {".concat(setColorMode).concat(setContrastMode, "})()");
};
export default getSSRAutoScript;