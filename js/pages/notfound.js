import { html, render } from "https://unpkg.com/lit-html?module";

export default class NotFound extends HTMLElement {
  connectedCallback() {
    render(this.render(), this);
  }

  render() {
    return html`
      <div class="page">
        <h1>Error 404</h1>
      </div>
    `;
  }
}

customElements.define("wc-notfound", NotFound);
