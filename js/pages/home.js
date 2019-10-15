export default class Home extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="page">
        <h1>Home Page</h1>
      </div>
    `;
  }
}

customElements.define("wc-home", Home);
