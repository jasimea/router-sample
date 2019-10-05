"use strict";

import closest from "./closest.js";

export default class Router extends HTMLElement {
  constructor() {
    super();
  }

  get outlet() {
    return this.querySelector("wc-outlet");
  }

  get root() {
    return window.location.pathname;
  }

  get routes() {
    return Array.from(this.querySelectorAll("wc-route"))
      .filter(node => node.parentNode === this)
      .map(r => ({
        path: r.getAttribute("path"),
        title: r.getAttribute("title"),
        component: r.getAttribute("component")
      }));
  }

  connectedCallback() {
    this._updateLinks();
    this.navigate(window.location.pathname);
  }

  _updateLinks() {
    this.querySelectorAll("a").forEach(link => {
      if (closest(link, "wc-router") === this) {
        link.onclick = e => {
          e.preventDefault();
          this.navigate(link.href);
        };
      }
    });
  }

  navigate(url) {
    window.history.pushState(null, null, url);
    const matchedRoute = this.match(url);
    if (matchedRoute !== null) {
      this.activeRoute = matchedRoute;
      this._update();
    }
  }

  match(path) {
    let route = null;
    this.routes.forEach((r, i) => {
      let params = [];
      let regExPath =
        r.path.replace(/([:*])(\w+)/g, (full, colon, name) => {
          params.push(name);
          return "([^/]+)";
        }) + "(?:/|$)";
      let routeMatch = path.match(new RegExp(regExPath));
      if (routeMatch !== null) {
        var p = routeMatch
          .slice(1, routeMatch.length)
          .reduce((p, value, index) => {
            if (p === null) p = {};
            p[params[index]] = value;
            return p;
          }, null);
        route = r;
        route.params = p;
      }
    });
    return route;
  }

  _update() {
    while (this.outlet.firstChild) {
      this.outlet.removeChild(this.outlet.firstChild);
    }
    const view = document.createElement(this.activeRoute.component);
    this.outlet.appendChild(view);
    if (this.activeRoute.title) {
      document.title = this.activeRoute.title;
    }
  }
}

customElements.define("wc-router", Router);
