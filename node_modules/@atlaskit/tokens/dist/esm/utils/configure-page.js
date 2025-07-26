import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { fg } from '@atlaskit/platform-feature-flags';
import getThemeHtmlAttrs from '../get-theme-html-attrs';
import ColorModeObserver from './color-mode-listeners';
import ContrastModeObserver from './contrast-mode-listeners';

/**
 * Given ThemeState, sets appropriate html attributes on the documentElement,
 * adds a listener to keep colorMode updated, and returns a function to unbind.
 */
export default function configurePage(themeState) {
  if (themeState.colorMode === 'auto') {
    // Set colorMode based on the user preference
    themeState.colorMode = ColorModeObserver.getColorMode();
    // Bind a listener (if one doesn't already exist) to keep colorMode updated
    ColorModeObserver.bind();
  } else {
    ColorModeObserver.unbind();
  }
  if (fg('platform_increased-contrast-themes')) {
    if (themeState.contrastMode === 'auto') {
      // Set contrastMode based on the user preference
      themeState.contrastMode = ContrastModeObserver.getContrastMode();
      // Bind a listener (if one doesn't already exist) to keep contrastMode updated
      ContrastModeObserver.bind();
    } else {
      ContrastModeObserver.unbind();
    }
  }
  var themeAttributes = getThemeHtmlAttrs(themeState);
  Object.entries(themeAttributes).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    document.documentElement.setAttribute(key, value);
  });
  return function () {
    ColorModeObserver.unbind();
    if (fg('platform_increased-contrast-themes')) {
      ContrastModeObserver.unbind();
    }
  };
}