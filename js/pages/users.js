import { userList } from "./userlist.js";

export default class Users extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="page">
        <h1>Users</h1>
        <ul>
          ${userList
            .map(e => `<li><a route="/users/${e.id}">${e.name}</a></li>`)
            .join("")}
        </ul>
      </div>
    `;
  }
}

customElements.define("wc-users", Users);
