import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import themeConfig from '../theme-config';

/**
 * Finds any matching increased contrast theme available for a selected theme.
 */
export default function getIncreasedContrastTheme(themeId) {
  var _Object$entries$find;
  return (_Object$entries$find = Object.entries(themeConfig).find(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      increasesContrastFor = _ref2[1].increasesContrastFor;
    return increasesContrastFor === themeId;
  })) === null || _Object$entries$find === void 0 ? void 0 : _Object$entries$find[1].id;
}