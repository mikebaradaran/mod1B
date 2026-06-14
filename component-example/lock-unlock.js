// lock-toggle.js
class LockToggle extends HTMLElement {
  static get observedAttributes() {
    return ['locked'];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .btn-lock {
          position: relative;
          display: inline-block;
          background: #5bff7c;
          width: 64px;
          height: 64px;
          box-sizing: border-box;
          padding: 12px 0 0 18px;
          border-radius: 50%;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.3s ease;
          box-shadow:3px 3px 3px grey
        }
        .btn-lock svg {
          fill: none;
        }
        .btn-lock svg .bling {
          stroke: #fff;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-dasharray: 3;
          stroke-dashoffset: 15;
          transition: all 0.3s ease;
        }
        .btn-lock svg .lock {
          stroke: #fff;
          stroke-width: 4;
          stroke-linejoin: round;
          stroke-linecap: round;
          stroke-dasharray: 36;
          transition: all 0.4s ease;
        }
        .btn-lock svg .lockb {
          fill: #fff;
          fill-rule: evenodd;
          clip-rule: evenodd;
          transform: rotate(8deg);
          transform-origin: 14px 20px;
          transition: all 0.2s ease;
        }
        input { display: none; }
        input:checked + label { background: #cc5920; }
        input:checked + label svg .bling {
          animation: bling6132 0.3s linear forwards;
          animation-delay: 0.2s;
        }
        input:checked + label svg .lock {
          stroke-dasharray: 48;
          animation: locked 0.3s linear forwards;
        }
        input:checked + label svg .lockb {
          transform: rotate(0);
          transform-origin: 14px 22px;
        }
        @keyframes bling6132 {
          50% { stroke-dasharray: 3; stroke-dashoffset: 12; }
          100% { stroke-dasharray: 3; stroke-dashoffset: 9; }
        }
        @keyframes locked {
          50% { transform: translateY(1px); }
        }
      </style>

      <input id="lockInput" type="checkbox" />
      <label class="btn-lock" for="lockInput">
        <svg width="36" height="40" viewBox="0 0 36 40">
          <path class="lockb"
            d="M27 27C27 34.1797 21.1797 40 14 40C6.8203 40 1 34.1797 1 27C1 19.8203 6.8203 14 14 14C21.1797 14 27 19.8203 27 27ZM15.6298 26.5191C16.4544 25.9845 17 25.056 17 24C17 22.3431 15.6569 21 14 21C12.3431 21 11 22.3431 11 24C11 25.056 11.5456 25.9845 12.3702 26.5191L11 32H17L15.6298 26.5191Z">
          </path>
          <path class="lock" d="M6 21V10C6 5.58172 9.58172 2 14 2V2C18.4183 2 22 5.58172 22 10V21"></path>
          <path class="bling" d="M29 20L31 22"></path>
          <path class="bling" d="M31.5 15H34.5"></path>
          <path class="bling" d="M29 10L31 8"></path>
        </svg>
      </label>
    `;

    this.checkbox = shadow.querySelector('#lockInput');
    this.checkbox.addEventListener('change', () => {
      const isLocked = this.checkbox.checked;
      this._reflectToAttr(isLocked);
      this.dispatchEvent(new CustomEvent('toggle', { detail: { locked: isLocked } }));
    });
  }

  connectedCallback() {
    if (this.hasAttribute('locked')) {
      this.checkbox.checked = true;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'locked') {
      this.checkbox.checked = newValue !== null;
    }
  }

  _reflectToAttr(locked) {
    locked ? this.setAttribute('locked', '') : this.removeAttribute('locked');
  }

  get locked() {
    return this.checkbox.checked;
  }

  set locked(value) {
    const isLocked = Boolean(value);
    this.checkbox.checked = isLocked;
    this._reflectToAttr(isLocked);
  }
}

customElements.define('lock-toggle', LockToggle);
