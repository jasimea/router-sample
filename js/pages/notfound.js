export default class NotFound extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="page">
        <h1>Error 404</h1>
      </div>
    `;
  }
}

customElements.define("wc-notfound", NotFound);
