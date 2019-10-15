let paramRe = /^:(.+)/;

function segmentize(uri) {
  return uri.replace(/(^\/+|\/+$)/g, "").split("/");
}

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
