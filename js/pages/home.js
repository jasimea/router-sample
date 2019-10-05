import { html, render } from "https://unpkg.com/lit-html?module";

export default class Home extends HTMLElement {
  connectedCallback() {
    render(this.render(), this);
  }

  render() {
    return html`
      <h1>Home Page</h1>
    `;
  }
}

customElements.define("wc-home", Home);
