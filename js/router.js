"use strict";
import { closest, matchPath } from "./util.js";

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

    window.addEventListener("popstate", this._handlePopstate);
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this._handlePopstate);
  }

  _handlePopstate = () => {
    this.match(window.location.pathname);
  };

  _updateLinks() {
    this.querySelectorAll("a[route]").forEach(link => {
      if (closest(link, "wc-router") === this) {
        const target = link.getAttribute("route");
        link.setAttribute("href", target);
        link.onclick = e => {
          e.preventDefault();
          this.navigate(target);
        };
      }
    });
  }

  navigate(url) {
    window.history.pushState(null, null, url);
    this.match(url);
  }

  match(url) {
    const matchedRoute = matchPath(this.routes, url);
    if (matchedRoute !== null) {
      this.activeRoute = matchedRoute;
      this._update();
    }
  }

  _update() {
    const { component, title, params = {} } = this.activeRoute;
    if (component) {
      while (this.outlet.firstChild) {
        this.outlet.removeChild(this.outlet.firstChild);
      }

      const view = document.createElement(component);
      document.title = title || document.title;

      for (let key in params) {
        if (key !== "*") view.setAttribute(key, params[key]);
      }

      this.outlet.appendChild(view);
      this._updateLinks();
    }
  }

  go(url) {
    this.navigate(url);
  }

  back() {
    window.history.go(-1);
  }
}

customElements.define("wc-router", Router);
