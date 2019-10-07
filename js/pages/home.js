import { html, render } from "https://unpkg.com/lit-html?module";

export default class Home extends HTMLElement {
  connectedCallback() {
    render(this.render(), this);
  }

  render() {
    return html`
      <div class="page">
        <h1>Home Page</h1>
      </div>
    `;
  }
}

customElements.define("wc-home", Home);
