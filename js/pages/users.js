import { html, render } from "https://unpkg.com/lit-html?module";
import { userList } from "./userlist.js";

export default class Users extends HTMLElement {
  connectedCallback() {
    render(this.render(userList), this);
  }

  render(list) {
    return html`
      <div class="page">
        <h1>Users</h1>
        <ul>
          ${userList.map(
            e =>
              html`
                <li><a route="/users/${e.id}">${e.name}</a></li>
              `
          )}
        </ul>
      </div>
    `;
  }
}

customElements.define("wc-users", Users);
