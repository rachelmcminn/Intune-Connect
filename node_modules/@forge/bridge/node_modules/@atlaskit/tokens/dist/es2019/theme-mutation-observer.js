import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { COLOR_MODE_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from './constants';
import getGlobalTheme from './get-global-theme';
/**
 * A MutationObserver which watches the `<html>` element for changes to the theme.
 *
 * In React, use the {@link useThemeObserver `useThemeObserver`} hook instead.
 *
 * @param {function} callback - A callback function which fires when the theme changes.
 *
 * @example
 * ```
 * const observer = new ThemeMutationObserver((theme) => {});
 * observer.observe();
 * ```
 */
export default class ThemeMutationObserver {
  constructor(callback) {
    _defineProperty(this, "legacyObserver", null);
    this.callback = callback;
    ThemeMutationObserver.callbacks.add(callback);
  }
  observe() {
    if (!ThemeMutationObserver.observer) {
      ThemeMutationObserver.observer = new MutationObserver(() => {
        const theme = getGlobalTheme();
        ThemeMutationObserver.callbacks.forEach(callback => callback(theme));
      });
      // Observer only needs to be configured once
      ThemeMutationObserver.observer.observe(document.documentElement, {
        attributeFilter: [THEME_DATA_ATTRIBUTE, COLOR_MODE_ATTRIBUTE]
      });
    }
  }
  disconnect() {
    if (this.callback) {
      ThemeMutationObserver.callbacks.delete(this.callback);
    }
    if (ThemeMutationObserver.callbacks.size === 0 && ThemeMutationObserver.observer) {
      ThemeMutationObserver.observer.disconnect();
      ThemeMutationObserver.observer = null;
    }
  }
}
_defineProperty(ThemeMutationObserver, "observer", null);
_defineProperty(ThemeMutationObserver, "callbacks", new Set());