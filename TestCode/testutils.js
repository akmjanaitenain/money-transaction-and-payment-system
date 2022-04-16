const SEND = 0,
      RENDER = 1,
      REDIRECT = 2;

class Response {
  constructor() {
    this._sent = null;
    this._rendered = null;
    this._redirected = null;
    this.method = -1;
  }
  send(payload) {
    this._sent = payload;
    this.method = SEND;
  }
  render(path, data) {
    this._rendered = { path, data };
    this.method = RENDER;
  }
  redirect(location) {
    this._redirected = location;
    this.method = REDIRECT;
  }
  getSent() { return this._sent; }
  getRendered() { return this._rendered; }
  getRedirected() { return this._redirected; }
}

class Request {
  constructor(user) {
    this.body = null;
    this.query = null;
    this.host = 'localhost';
    this.protocol = 'http';
    this.session = {
      destroy: () => { this.session.user = {} },
      user: user ? user : {}
    };
  }
  setBody(obj) { this.body = obj; }
  setQuery(obj) { this.query = obj; }
  get(key) { return this[key]; }
}

module.exports = { Request, Response, SEND, RENDER, REDIRECT };