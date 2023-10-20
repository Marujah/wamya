import sharedCentralStore from "../store";

class M2Toggle extends HTMLElement {
  #shadow = this.attachShadow({ mode: "open" });
  private isChecked: boolean;
  constructor() {
    super();
    this.isChecked = sharedCentralStore.getState().status || false;
    sharedCentralStore.subscribe(() => {
      this.#createCode();
    });
  }

  get mystyle(): string {
    return `
          <style>
              :host {
                --toggle-size: 1;
                display: flex;
              }
              .s-small {
                --toggle-size: 0.75;
              }
              .s-medium {
                --toggle-size: 1;
              }
              .s-large {
                --toggle-size: 1.25;
              }
              .switch {
                  --toggle-width: calc(var(--toggle-size) * 4em);
                  --toggle-height: calc(var(--toggle-size) * 2em);
                  position: relative;
                  display: inline-block;
                  width: var(--toggle-width);
                  height: var(--toggle-height);
                  margin: 0 auto;
              }
              .switch input {
                  display: none;
              }
              .switch .slider:before {
                  position: absolute;
                  content: "";
                  height: calc(var(--toggle-height) - 10px);
                  width: calc(var(--toggle-height) - 10px);
                  left: 4px;
                  bottom: 3px;
                  background-color: #FFFFFF;
                  transition: .3s;
                  border: 1px solid #e8e8e8;
              }
              .switch input:checked+.slider:before {
                  transform: translateX(calc((var(--toggle-width) / 2) - 1px));
              }
              .switch input:checked+.slider {
                  background-color: ${this.rightColor};
                  border: 1px solid #e8e8e8;
              }
              .switch .slider {
                  position: absolute;
                  cursor: pointer;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: ${this.leftColor};
                  transition: .4s;
                  border: 1px solid #e8e8e8;
              }
              .switch .slider.round:before {
                  border-radius: 50%;
              }
              .switch .slider.round {
                  border-radius: calc(var(--toggle-size) * 2em);
              }					
          </style>
        `;
  }

  get template(): string {
    return `
        <div style="display: flex; align-items: center;gap: 0.5rem;">
            <label class="switch s-${this.size}">
                <input type="checkbox" ${this.isChecked ? "checked" : ""}>
                <div class="slider round"></div>
            </label>
            <span>${this.name}</span>
        </div>        
        `;
  }

  #handleClick(event: MouseEvent) {
    const target = event.composedPath()?.[0] as HTMLInputElement;
    if (target.nodeName === "INPUT") {
      this.isChecked = !this.isChecked;
      sharedCentralStore.setState({
        products: {
          ...sharedCentralStore.getState().products,
          [this.name.trim().replace(/\s/g, '-').toLowerCase()]: {
            status: this.isChecked,
          },
        },
        message: this.name,
      });
    }
  }

  #addEvents() {
    this.addEventListener("click", this.#handleClick);
  }

  #removeEvents() {
    this.removeEventListener("click", this.#handleClick);
  }

  #createCode() {
    this.#shadow.innerHTML = `${this.mystyle} ${this.template}`;
  }

  get leftColor(): string {
    return this.getAttribute("leftColor") || "green";
  }

  set leftColor(newColor: string) {
    if (!newColor) {
      newColor = "green";
    }
    this.setAttribute("leftColor", newColor);
  }

  get name(): string {
    return this.getAttribute("name") || "productX";
  }

  set name(n: string) {
    if (!n) {
      n = "productX";
    }
    this.setAttribute("name", n);
  }

  get rightColor(): string {
    return this.getAttribute("rightColor") || "red";
  }

  set rightColor(newColor: string) {
    if (!newColor) {
      newColor = "red";
    }
    this.setAttribute("rightColor", newColor);
  }

  get size(): string {
    return this.getAttribute("size") || "medium";
  }

  set size(newSize: string) {
    if (!newSize || !["small", "medium", "large"].includes(newSize)) {
      newSize = "medium";
    }
    this.setAttribute("size", newSize);
  }

  static get observedAttributes(): string[] {
    return ["leftColor", "rightColor", "size"];
  }

  attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    if (name === "leftColor" || name === "rightColor" || name === "size") {
      this.#createCode();
    }
  }

  connectedCallback() {
    this.#createCode();
    this.#addEvents();
  }

  disconnectedCallback() {
    this.#removeEvents();
  }
}

customElements.define("m2-toggle", M2Toggle);
