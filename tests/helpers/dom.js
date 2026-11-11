/**
 * Opaque-box virtual DOM tree simulator, query engine, and event dispatcher.
 */

class ClassList {
  constructor(node) {
    this._node = node;
    this._classes = new Set();
    this._syncFromClassName();
  }

  _syncFromClassName() {
    this._classes.clear();
    if (this._node._className) {
      this._node._className.split(/\s+/).filter(Boolean).forEach(c => this._classes.add(c));
    }
  }

  _syncToClassName() {
    this._node._className = Array.from(this._classes).join(' ');
  }

  add(...classes) {
    classes.forEach(c => this._classes.add(c));
    this._syncToClassName();
  }

  remove(...classes) {
    classes.forEach(c => this._classes.delete(c));
    this._syncToClassName();
  }

  contains(cls) {
    return this._classes.has(cls);
  }

  toggle(cls, force) {
    if (force === true) {
      this.add(cls);
      return true;
    }
    if (force === false) {
      this.remove(cls);
      return false;
    }
    if (this.contains(cls)) {
      this.remove(cls);
      return false;
    } else {
      this.add(cls);
      return true;
    }
  }

  toString() {
    return Array.from(this._classes).join(' ');
  }
}

class DOMNode {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentElement = null;
    this._attributes = new Map();
    this._listeners = new Map();
    this._className = '';
    this.classList = new ClassList(this);
    this.style = {};
    this.dataset = {};
    this._value = '';
    this.checked = false;
    this.disabled = false;
    this.name = '';
    this.type = '';
    this.id = '';
    this.scrollWidth = 1200;
    this.clientWidth = 1200;
    this.scrollHeight = 800;
    this.clientHeight = 800;
    this._rect = { top: 0, left: 0, bottom: 44, right: 120, width: 120, height: 44 };
    this._textContent = '';
  }

  get className() {
    return this._className;
  }

  set className(val) {
    this._className = String(val || '');
    this.classList._syncFromClassName();
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = String(val);
  }

  get textContent() {
    if (this.children.length === 0) {
      return this._textContent;
    }
    return this.children.map(c => c.textContent).join('');
  }

  set textContent(val) {
    this.children = [];
    this._textContent = String(val || '');
  }

  get innerHTML() {
    return this.children.map(c => c.outerHTML || c.textContent).join('');
  }

  set innerHTML(htmlString) {
    this.children = [];
    this._textContent = '';
    if (!htmlString) return;
    parseHTMLFragment(htmlString, this);
  }

  get outerHTML() {
    const attrs = [];
    if (this.id) attrs.push(`id="${this.id}"`);
    if (this.className) attrs.push(`class="${this.className}"`);
    for (const [k, v] of this._attributes) {
      if (k !== 'id' && k !== 'class') {
        attrs.push(`${k}="${v}"`);
      }
    }
    const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
    const tag = this.tagName.toLowerCase();
    return `<${tag}${attrStr}>${this.innerHTML || this.textContent}</${tag}>`;
  }

  setAttribute(name, value) {
    const strVal = String(value);
    this._attributes.set(name, strVal);
    if (name === 'id') this.id = strVal;
    if (name === 'class') this.className = strVal;
    if (name === 'value') this.value = strVal;
    if (name === 'disabled') this.disabled = true;
    if (name.startsWith('data-')) {
      const prop = name.slice(5).replace(/-([a-z])/g, (_, g) => g.toUpperCase());
      this.dataset[prop] = strVal;
    }
  }

  getAttribute(name) {
    if (name === 'id') return this.id || null;
    if (name === 'class') return this.className || null;
    if (name === 'value') return this.value;
    return this._attributes.has(name) ? this._attributes.get(name) : null;
  }

  hasAttribute(name) {
    if (name === 'id') return Boolean(this.id);
    if (name === 'class') return Boolean(this.className);
    return this._attributes.has(name);
  }

  removeAttribute(name) {
    this._attributes.delete(name);
    if (name === 'id') this.id = '';
    if (name === 'class') this.className = '';
    if (name === 'disabled') this.disabled = false;
    if (name.startsWith('data-')) {
      const prop = name.slice(5).replace(/-([a-z])/g, (_, g) => g.toUpperCase());
      delete this.dataset[prop];
    }
  }

  appendChild(child) {
    if (!child) return;
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      child.parentElement = null;
      this.children.splice(idx, 1);
    }
    return child;
  }

  getBoundingClientRect() {
    return { ...this._rect };
  }

  setBoundingClientRect(rect) {
    this._rect = { ...this._rect, ...rect };
    this.clientWidth = this._rect.width;
    this.clientHeight = this._rect.height;
  }

  addEventListener(type, listener, options = {}) {
    if (!this._listeners.has(type)) {
      this._listeners.set(type, []);
    }
    this._listeners.get(type).push({ listener, options });
  }

  removeEventListener(type, listener) {
    if (!this._listeners.has(type)) return;
    const list = this._listeners.get(type).filter(item => item.listener !== listener);
    this._listeners.set(type, list);
  }

  dispatchEvent(event) {
    if (!event.target) {
      event.target = this;
    }
    event.currentTarget = this;

    const list = this._listeners.get(event.type) || [];
    for (const { listener } of list) {
      try {
        listener.call(this, event);
      } catch (err) {
        console.error(`Error in event listener for ${event.type}:`, err);
      }
      if (event._immediatePropagationStopped) break;
    }

    if (event.bubbles && !event._propagationStopped && this.parentElement) {
      this.parentElement.dispatchEvent(event);
    }
    return !event.defaultPrevented;
  }

  focus() {
    if (globalWindow.document) {
      globalWindow.document.activeElement = this;
    }
    this.dispatchEvent(new DOMEvent('focus', { bubbles: false }));
  }

  blur() {
    if (globalWindow.document && globalWindow.document.activeElement === this) {
      globalWindow.document.activeElement = globalWindow.document.body;
    }
    this.dispatchEvent(new DOMEvent('blur', { bubbles: false }));
  }

  click() {
    if (this.disabled) return false;
    return this.dispatchEvent(new DOMEvent('click', { bubbles: true, cancelable: true }));
  }

  querySelector(selector) {
    const results = this.querySelectorAll(selector);
    return results.length > 0 ? results[0] : null;
  }

  querySelectorAll(selector) {
    const matched = [];
    const parts = selector.split(/\s+/).map((s) => s.trim()).filter(Boolean);

    function testSingle(node, sel) {
      if (!sel || !node || !node.tagName) return false;

      // 1. Tag name selector
      if (/^[a-zA-Z0-9]+$/.test(sel)) {
        return node.tagName.toLowerCase() === sel.toLowerCase();
      }

      // 2. ID selector
      if (sel.startsWith('#')) {
        return node.id === sel.slice(1);
      }

      // 3. Multi-class compound selector (e.g. .card.active or .btn.btn-primary)
      if (sel.startsWith('.')) {
        const classes = sel.slice(1).split('.').filter(Boolean);
        return classes.every((cls) => node.classList.contains(cls));
      }

      // 4. Attribute selector: [attr] or [attr="val"]
      const attrMatch = sel.match(/^\[([a-zA-Z0-9_-]+)(?:([~|^$*]?=)["']?([^"']*)["']?)?\]$/);
      if (attrMatch) {
        const [, attr, op, val] = attrMatch;
        const actual = node.getAttribute(attr);
        if (actual === null || actual === undefined) return false;
        if (!op) return true;
        if (op === '=') return actual === val;
        if (op === '*=') return actual.includes(val);
        if (op === '^=') return actual.startsWith(val);
        if (op === '$=') return actual.endsWith(val);
      }

      // 5. Compound tag + class or tag + attribute e.g. button[data-action="submit"] or div.card.active
      const compoundMatch = sel.match(/^([a-zA-Z0-9]+)(.+)$/);
      if (compoundMatch) {
        const tag = compoundMatch[1];
        const rest = compoundMatch[2];
        if (node.tagName.toLowerCase() !== tag.toLowerCase()) return false;
        return testSingle(node, rest);
      }

      return false;
    }

    // Verifies that 'node' matches parts[last] and that its ancestors within root match preceding parts
    function matchesDescendantPath(node, selectorParts, rootNode) {
      if (!testSingle(node, selectorParts[selectorParts.length - 1])) {
        return false;
      }
      if (selectorParts.length === 1) {
        return true;
      }

      let partIdx = selectorParts.length - 2;
      let curr = node.parentElement;

      while (curr && curr !== rootNode.parentElement && partIdx >= 0) {
        if (testSingle(curr, selectorParts[partIdx])) {
          partIdx--;
        }
        curr = curr.parentElement;
      }

      return partIdx < 0;
    }

    const root = this;
    function search(node) {
      for (const child of node.children) {
        if (matchesDescendantPath(child, parts, root)) {
          matched.push(child);
        }
        search(child);
      }
    }

    search(this);
    return matched;
  }
}

class DOMEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.bubbles = options.bubbles !== undefined ? options.bubbles : true;
    this.cancelable = options.cancelable !== undefined ? options.cancelable : true;
    this.defaultPrevented = false;
    this._propagationStopped = false;
    this._immediatePropagationStopped = false;
    this.target = null;
    this.currentTarget = null;
    this.key = options.key || '';
    this.code = options.code || '';
    this.clientX = options.clientX || 0;
    this.clientY = options.clientY || 0;
    this.offsetX = options.offsetX || 0;
    this.offsetY = options.offsetY || 0;
    this.touches = options.touches || [];
    this.changedTouches = options.changedTouches || [];
  }

  preventDefault() {
    if (this.cancelable) {
      this.defaultPrevented = true;
    }
  }

  stopPropagation() {
    this._propagationStopped = true;
  }

  stopImmediatePropagation() {
    this._immediatePropagationStopped = true;
    this._propagationStopped = true;
  }
}

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

function parseHTMLFragment(html, parent) {
  if (!html || typeof html !== 'string') return;

  // Robust token scanner for HTML tags and text content
  const tokenRegex = /<(\/)?([a-zA-Z0-9-]+)([^>]*?)(\/)?>|([^<]+)/g;
  const stack = [parent];
  let m;

  while ((m = tokenRegex.exec(html)) !== null) {
    const isClosing = Boolean(m[1]);
    const tagName = m[2];
    const rawAttrs = m[3];
    const isSelfClosing = Boolean(m[4]);
    const textContent = m[5];

    if (textContent) {
      const text = textContent.trim();
      if (text && stack.length > 0) {
        const top = stack[stack.length - 1];
        if (top.children.length === 0 && !top.textContent) {
          top.textContent = text;
        } else {
          const textNode = new DOMNode('#text');
          textNode.textContent = text;
          top.appendChild(textNode);
        }
      }
      continue;
    }

    if (tagName) {
      const lowerTag = tagName.toLowerCase();

      if (isClosing) {
        // Pop stack back to matching open tag
        for (let i = stack.length - 1; i > 0; i--) {
          if (stack[i].tagName.toLowerCase() === lowerTag) {
            stack.length = i;
            break;
          }
        }
      } else {
        // Opening tag
        const node = new DOMNode(lowerTag);
        parseAttributes(rawAttrs, node);
        const currentParent = stack[stack.length - 1];
        currentParent.appendChild(node);

        // Do not push void or self-closing tags onto stack
        if (!isSelfClosing && !VOID_TAGS.has(lowerTag)) {
          stack.push(node);
        }
      }
    }
  }
}

function parseAttributes(rawAttrs, node) {
  if (!rawAttrs) return;
  const attrRegex = /([a-zA-Z0-9_-]+)(?:=["']([^"']*)["'])?/g;
  let m;
  while ((m = attrRegex.exec(rawAttrs)) !== null) {
    node.setAttribute(m[1], m[2] !== undefined ? m[2] : '');
  }
}

class DOMDocument {
  constructor() {
    this.documentElement = new DOMNode('html');
    this.body = new DOMNode('body');
    this.documentElement.appendChild(this.body);
    this.activeElement = this.body;
  }

  createElement(tagName) {
    return new DOMNode(tagName);
  }

  getElementById(id) {
    const find = (node) => {
      if (node.id === id) return node;
      for (const child of node.children) {
        const found = find(child);
        if (found) return found;
      }
      return null;
    };
    return find(this.documentElement);
  }

  querySelector(selector) {
    return this.documentElement.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.documentElement.querySelectorAll(selector);
  }
}

class WindowMock {
  constructor() {
    this.innerWidth = 1920;
    this.innerHeight = 1080;
    this.devicePixelRatio = 2.0;
    this.scrollY = 0;
    this.scrollX = 0;
    this.document = new DOMDocument();
    this._listeners = new Map();
    this.mediaQueries = new Map();
  }

  scrollTo({ top = 0, left = 0 }) {
    this.scrollY = top;
    this.scrollX = left;
    this.dispatchEvent(new DOMEvent('scroll', { bubbles: false }));
  }

  addEventListener(type, listener) {
    if (!this._listeners.has(type)) {
      this._listeners.set(type, []);
    }
    this._listeners.get(type).push(listener);
  }

  removeEventListener(type, listener) {
    if (!this._listeners.has(type)) return;
    const list = this._listeners.get(type).filter(l => l !== listener);
    this._listeners.set(type, list);
  }

  dispatchEvent(event) {
    const list = this._listeners.get(event.type) || [];
    for (const listener of list) {
      listener.call(this, event);
    }
  }

  setViewport(width, height, dpr = 2.0) {
    this.innerWidth = width;
    this.innerHeight = height;
    this.devicePixelRatio = dpr;
    this.document.documentElement.clientWidth = width;
    this.document.documentElement.clientHeight = height;
    this.document.body.clientWidth = width;
    this.document.body.clientHeight = height;
    this.dispatchEvent(new DOMEvent('resize', { bubbles: false }));
  }

  matchMedia(query) {
    let matches = false;
    if (query === '(prefers-reduced-motion: reduce)') {
      matches = this.mediaQueries.get('reduced-motion') || false;
    } else if (query === '(pointer: coarse)') {
      matches = this.mediaQueries.get('pointer-coarse') || (this.innerWidth < 768);
    } else if (query === '(prefers-contrast: more)') {
      matches = this.mediaQueries.get('high-contrast') || false;
    } else if (query.includes('min-width: 768px')) {
      matches = this.innerWidth >= 768;
    } else if (query.includes('min-width: 1024px')) {
      matches = this.innerWidth >= 1024;
    }

    const listeners = [];
    return {
      matches,
      media: query,
      addEventListener: (type, cb) => {
        if (type === 'change') listeners.push(cb);
      },
      removeEventListener: (type, cb) => {
        const idx = listeners.indexOf(cb);
        if (idx !== -1) listeners.splice(idx, 1);
      },
      dispatchEvent: (event) => {
        listeners.forEach(cb => cb(event));
      },
    };
  }
}

const globalWindow = new WindowMock();

module.exports = {
  DOMNode,
  DOMEvent,
  DOMDocument,
  WindowMock,
  globalWindow,
  createDOM: () => new DOMDocument(),
  createWindow: () => new WindowMock(),
};
