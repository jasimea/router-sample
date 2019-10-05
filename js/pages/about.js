import { html, render } from "https://unpkg.com/lit-html?module";

export default class AboutUs extends HTMLElement {
  connectedCallback() {
    render(this.render(), this);
  }

  render() {
    return html`
      <h1>About Us</h1>
    `;
  }
}

customElements.define("wc-about", AboutUs);
