let ep = Element.prototype;
ep.matches =
  ep.matches ||
  ep.webkitMatchesSelector ||
  ep.msMatchesSelector ||
  ep.mozMatchesSelector;

export default function closest(elem, selector) {
  while (elem !== document.body) {
    elem = elem.parentElement;
    if (elem.matches(selector)) return elem;
  }
}
