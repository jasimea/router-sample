"use strict";
import { closest, matchPath } from "./util.js";
/**
 * Router html element.
 *
 * This collects route definition from the direct wc-route child element.
 * The element also handles the browser history navigation. The API is
 * declarative and inspired by React Router.
 *
 * Example route definition:
 *  <wc-route path="/home" component="wc-home"></wc-route>
 */
export default class Router extends HTMLElement {
  /**
   * Router looks for a wc-outlet tag for updating the views on history updates.
   * Example:
   *
   * <wc-router>
   *  <wc-outlet>
   *    <!-- All DOM update will be happening here on route change -->
   *  </wc-outlet>
   * </wc-router>
   */
  get outlet() {
    return this.querySelector("wc-outlet");
  }

  get root() {
    return window.location.pathname;
  }

  /**
   * Get all routes from the direct wc-route child element.
   * The document title can be updated by providing an
   * title attribute to the wc-route tag
   */
  get routes() {
    return Array.from(this.querySelectorAll("wc-route"))
      .filter(node => node.parentNode === this)
      .map(r => ({
        path: r.getAttribute("path"),
        // Optional: document title
        title: r.getAttribute("title"),
        // name of the web component the should be displayed
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
    /**
     * Find all child link elements with route attribute to update the
     * href with route attribute value.
     *
     * Add custom click event handler to prevent the default
     * behaviour and navigate to the registered route onclick.
     */
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

  /**
   * Update the DOM under outlet based on the active
   * selected route.
   */
  _update() {
    const { component, title, params = {} } = this.activeRoute;
    if (component) {
      // Remove all child nodes under outlet element
      while (this.outlet.firstChild) {
        this.outlet.removeChild(this.outlet.firstChild);
      }

      const view = document.createElement(component);
      document.title = title || document.title;

      for (let key in params) {
        /**
         * all dynamic param value will be passed
         * as the attribute to the newly created element
         * except * value.
         */
        if (key !== "*") view.setAttribute(key, params[key]);
      }

      this.outlet.appendChild(view);
      // Update the route links once the DOM is updated
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
