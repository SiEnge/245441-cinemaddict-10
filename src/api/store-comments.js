export default class StoreComments {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getAll() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey));
    } catch (err) {
      return {};
    }
  }

  dropAll() {
    this._storage.setItem(this._storeKey, ``);
  }

  setItem(key, value) {
    const store = this.getAll();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {[key]: value})
        )
    );
  }

  getItem(key) {
    const store = this.getAll();
    if (!store[key]) {
      return false;
    }

    return store[key];
  }

  removeItem(key) {
    const store = this.getAll();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store)
        )
    );
  }
}
