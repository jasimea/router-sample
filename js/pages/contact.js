import { html, render } from "https://unpkg.com/lit-html?module";

export default class ContactUs extends HTMLElement {
  connectedCallback() {
    render(this.render(), this);
  }

  render() {
    return html`
      <div class="page">
        <h1>Contact Us</h1>
      </div>
    `;
  }
}

customElements.define("wc-contact", ContactUs);
