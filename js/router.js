"use strict";
import { match } from "./util.js";

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
        component: r.getAttribute("component"),
        resourceUrl: r.getAttribute("resourceUrl")
      }));
  }

  connectedCallback() {
    this.updateLinks();
    this.navigate(window.location.pathname);

    window.addEventListener("popstate", this._handlePopstate);
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this._handlePopstate);
  }

  _handlePopstate = () => {
    this.navigate(window.location.pathname);
  };

  updateLinks() {
    this.querySelectorAll("a[route]").forEach(link => {
      const target = link.getAttribute("route");
      link.setAttribute("href", target);
      link.onclick = e => {
        e.preventDefault();
        this.navigate(target);
      };
    });
  }

  navigate(url) {
    const matchedRoute = match(this.routes, url);
    if (matchedRoute !== null) {
      this.activeRoute = matchedRoute;
      window.history.pushState(null, null, url);
      this.update();
    }
  }

  update() {
    const {
      component,
      title,
      params = {},
      resourceUrl = null
    } = this.activeRoute;

    if (component) {
      while (this.outlet.firstChild) {
        this.outlet.removeChild(this.outlet.firstChild);
      }

      const updateView = () => {
        const view = document.createElement(component);
        document.title = title || document.title;

        for (let key in params) {
          if (key !== "*") view.setAttribute(key, params[key]);
        }

        this.outlet.appendChild(view);
        this.updateLinks();
      };
      console.log(resourceUrl);
      if (resourceUrl !== null) {
        import(resourceUrl).then(updateView);
      } else {
        updateView();
      }
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
