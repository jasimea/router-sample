let paramRe = /^:(.+)/;

function segmentize(uri) {
  return uri.replace(/(^\/+|\/+$)/g, "").split("/");
}
/**
 * The url matching function. Pass the route definitions and url to the match
 * and the method will return the matched definition or null if there is no
 * fallback scnario found is the definisions.
 *
 * Code is extracted from Reach router path match implementation
 * https://github.com/reach/router/blob/master/src/lib/utils.js
 *
 * @param {Array} routes - Route defenitions
 * @param {string} uri - Url to match
 */
export function match(routes, uri) {
  let match;
  const [uriPathname] = uri.split("?");
  const uriSegments = segmentize(uriPathname);
  const isRootUri = uriSegments[0] === "/";
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const routeSegments = segmentize(route.path);
    const max = Math.max(uriSegments.length, routeSegments.length);
    let index = 0;
    let missed = false;
    let params = {};
    for (; index < max; index++) {
      const uriSegment = uriSegments[index];
      const routeSegment = routeSegments[index];
      const fallback = routeSegment === "*";

      if (fallback) {
        params["*"] = uriSegments
          .slice(index)
          .map(decodeURIComponent)
          .join("/");
        break;
      }

      if (uriSegment === undefined) {
        missed = true;
        break;
      }

      let dynamicMatch = paramRe.exec(routeSegment);

      if (dynamicMatch && !isRootUri) {
        let value = decodeURIComponent(uriSegment);
        params[dynamicMatch[1]] = value;
      } else if (routeSegment !== uriSegment) {
        missed = true;
        break;
      }
    }

    if (!missed) {
      match = {
        params,
        ...route
      };
      break;
    }
  }

  return match || null;
}
