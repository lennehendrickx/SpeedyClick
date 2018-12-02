class EventDispatcher {
  constructor() {
    this.listeners = new Map();
  }

  addListener(label, callback) {
    this.listeners.has(label) || this.listeners.set(label, []);
    this.listeners.get(label).push(callback);
  }

  removeListener(label, callback) {
    let isFunction = function (obj) {
      return typeof obj == 'function' || false;
    };

    let listeners = this.listeners.get(label),
      index;

    if (listeners && listeners.length) {
      index = listeners.reduce((i, listener, index) => {
        return (isFunction(listener) && listener === callback) ?
          i = index :
          i;
      }, -1);

      if (index > -1) {
        listeners.splice(index, 1);
        this.listeners.set(label, listeners);
        return true;
      }
    }
    return false;
  }

  dispatch(label, ...args) {
    let listeners = this.listeners.get(label);

    if (listeners && listeners.length) {
      listeners.forEach((listener) => {
        listener(...args);
      });
      return true;
    }
    return false;
  }
}

class DomUtil {

  static createDiv(...classes) {
    return this.createElement('div', ...classes);
  }

  static createElement(type, ...classes) {
    const element = document.createElement(type);
    element.classList.add(...classes);
    return element;
  }

}
