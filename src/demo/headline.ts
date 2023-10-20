import sharedCentralStore from "../store";

class M2Headline extends HTMLElement {
  #shadow = this.attachShadow({ mode: "open" });

  constructor() {
    super();
    sharedCentralStore.subscribe((state: any) => {
      console.log("Headline - Received updated state from ", state.message);
      this.#createCode();
    });
   
  }

  get mystyle(): string {
    return `
          <style>
              h1 {
                font-size: 1rem;
              }
          </style>
        `;
  }

  get template(): string {
    return `
            <h1>
              ${Object.values(sharedCentralStore?.getState()?.products || [])?.some((p: any) => p.status)? "YES" : "NO"}
            </h1>
        `;
  }

  #createCode() {
    this.#shadow.innerHTML = `${this.mystyle} ${this.template}`;
  }

  connectedCallback() {
    this.#createCode();
  }
}

customElements.define("m2-headline", M2Headline);
