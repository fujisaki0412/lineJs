const thrift = require('thrift-http');
const TalkService = require('../line-thrift/TalkService');
const config = require('./config');
module.exports = class Line {
  constructor(token) {
    this.talk = this.create_session(token, config.TALK_PATH);
    this.poll = this.create_session(token, config.POLL_PATH);
    this.getProfile()
    console.log(this.profile.displayName + "Login")
  }
  create_session(token, path) { 
    this.headers = {
      "X-Line-Application": "DESKTOPMAC\t5.24.1\tOS X\t10.15.1",
      "X-Line-Access": token,
      "User-Agent": "Line/5.24.1"
    } 
    this.options = {
      protocol: thrift.TCompactProtocol,
      transport: thrift.TBufferedTransport,
      headers: this.headers,
      path: path,
      https: true
    }
    this.connection = thrift.createHttpConnection(config.LINE_HOST_DOMAIN, 443, this.options);
    this.connection.on('error', (err) => {
      return err;
    });
    return thrift.createHttpClient(TalkService, this.connection);
  }
  getProfile() {
    this.profile = this.talk.getProfile(0);
    return this.profile;
  }
}
