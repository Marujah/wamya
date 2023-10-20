import sharedCentralStore from "../store";

class M2Cart extends HTMLElement {
  #shadow = this.attachShadow({ mode: "open" });
  private items = 0;

  constructor() {
    super();
    sharedCentralStore.subscribe((state: any) => {
      this.items =
        Object.values(sharedCentralStore?.getState()?.products || [])?.filter(
          (p: any) => p.status
        )?.length || 0;
      console.log("Cart - Received updated state from ", state.message);
      this.#createCode();
    });
  }

  get mystyle(): string {
    return `
          <style>
            .cart {
              position: relative;
              z-index: 1;
            }
            .items {
              font-size: 0.85rem;
              color: grey;
              position: absolute;
              top: 0;
              left: -4px;
              z-index: 2;
              font-weight: 700;
              color: green;
              wi
            }
          </style>
        `;
  }

  get template(): string {
    return `
            <div class="cart">
              <span>&#128722;</span>
              <span class="items">${this.items}</span>
            </div>
        `;
  }

  #createCode() {
    this.#shadow.innerHTML = `${this.mystyle} ${this.template}`;
  }

  connectedCallback() {
    this.#createCode();
  }
}

customElements.define("m2-cart", M2Cart);
