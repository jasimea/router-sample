export default class ContactUs extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="page">
        <h1>Contact Us</h1>
      </div>
    `;
  }
}

customElements.define("wc-contact", ContactUs);
