import { html, render } from "https://unpkg.com/lit-html?module";

export default class NotFound extends HTMLElement {
  connectedCallback() {
    render(this.render(), this);
  }

  render() {
    return html`
      <h1>Error 404</h1>
    `;
  }
}

customElements.define("wc-notfound", NotFound);
