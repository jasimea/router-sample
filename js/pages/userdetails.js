import { html, render } from "https://unpkg.com/lit-html?module";
import { userList } from "./userlist.js";

export default class UserDetails extends HTMLElement {
  static observedAttributes() {
    return ["id"];
  }

  connectedCallback() {
    const id = this.getAttribute("id");
    if (id && id !== null) {
      const user = userList.find(e => e.id === parseInt(id));
      render(this.render(user), this);
    }
  }

  render(data = {}) {
    return html`
      <div class="page">
        <h1>User Details</h1>
        <div>${data.name}</div>
      </div>
    `;
  }
}

customElements.define("wc-userdetails", UserDetails);
