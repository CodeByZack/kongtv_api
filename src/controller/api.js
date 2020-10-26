const BaseRest = require('./rest.js');
const { filterKeys } = require('../utils.js');
const { think } = require('thinkjs');
module.exports = class extends think.Controller {
  static get _REST() {
    return true;
  }

  async getAction() {
    // console.log(this);
    // console.log(this.get('type'));
    const action = this.get('action');
    const type = this.get('type');
    console.log(action,type);
    if( think.isEmpty(action) ){
      return this.fail(400,`不存在${action}类型`);
    }

    const movie = this.model('movie');
    if(action === "index"){
      const res = await movie.index();
      return this.json(res);
    }

    if(action === "category"){

      return this.json("category");
    }

  }

  postAction() {}
  putAction() {}
  deleteAction() {}
}
