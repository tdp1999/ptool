/**
 * Determines the position to which to scroll a panel in order for an option to be into view.
 * @param optionOffset Offset of the option from the top of the panel.
 * @param optionHeight Height of the options.
 * @param currentScrollPosition Current scroll position of the panel.
 * @param panelHeight Height of the panel.
 * @docs-private
 */
export function _getOptionScrollPosition(
    optionOffset: number,
    optionHeight: number,
    currentScrollPosition: number,
    panelHeight: number
): number {
    if (optionOffset < currentScrollPosition) {
        return optionOffset;
    }

    if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
        return Math.max(0, optionOffset - panelHeight + optionHeight);
    }

    return currentScrollPosition;
}
