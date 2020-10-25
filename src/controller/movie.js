const BaseRest = require('./rest.js');
const { filterKeys } = require('../utils.js');
module.exports = class extends think.Controller {
  static get _REST() {
    return true;
  }

  async getAction() {
    
    
    
    const movie = this.model('movie');
    const res = await movie.limit(10).select();
    const temp = res.map(filterKeys);
    console.log(temp)
    return this.json(temp);
  }

  postAction() {}
  putAction() {}
  deleteAction() {}
}
