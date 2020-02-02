export default class Store {
  constructor(storage) {
    this._storage = storage;
  }

  getAll(storeKey) {
    try {
      return JSON.parse(this._storage.getItem(storeKey));
    } catch (err) {
      return {};
    }
  }

  dropAll(storeKey) {
    this._storage.setItem(storeKey, ``);
  }

  setItem(storeKey, key, value) {
    const store = this.getAll(storeKey);

    this._storage.setItem(storeKey, JSON.stringify(Object.assign({}, store, {[key]: value})));
  }

  getItem(storeKey, key) {
    const store = this.getAll(storeKey);
    if (!store[key]) {
      return false;
    }

    return store[key];
  }

  removeItem(storeKey, key) {
    const store = this.getAll(storeKey);

    delete store[key];

    this._storage.setItem(storeKey, JSON.stringify(Object.assign({}, store)));
  }
}
