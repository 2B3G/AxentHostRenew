const fs = require("fs");

class SessionManager {
  session = null;
  path = "session.txt";

  constructor() {
    if (fs.existsSync(this.path)) {
      const content = fs.readFileSync(this.path);

      if (content != "") this.session = JSON.parse(content);
    } else {
      fs.writeFileSync(this.path, "");
      this.session = null;
    }
  }

  setSession(data) {
    fs.writeFileSync(this.path, JSON.stringify(data));
    this.session = data;
  }

  getToken() {
    return this.session != null ? this.session.token.token : null;
  }
}

module.exports = SessionManager;
