const { think } = require('thinkjs');
const UrlPathPrefix = '/movie';
const vaildType = ['index','dy','zy','dm','dsj','search'];

module.exports = class extends think.Controller {
  static get _REST() {
    return true;
  }

  getType (path){
    if(path.length <= UrlPathPrefix.length) return 'index';
    const type = path.slice(UrlPathPrefix.length+1,path.length);
    return type;
  };

  async getAction() {
    const type = this.getType(this.ctx.path);
    const page = this.get("page");
    const pageSize = this.get("pagesize");
    const area = this.get("area");
    const year = this.get("year");
    const _class = this.get("class");
    const word = this.get("word");
    if( think.isEmpty(type) || !vaildType.includes(type) ){
      return this.fail(400,`不存在${type}类型`);
    }

    const movie = this.model('movie');
    if(type === "index"){
      const res = await movie.index();
      return this.json(res);
    }else if(type === "search"){
      const res = await movie.search(word,page,pageSize);
      return this.json(res);
    }else{
      const res = await movie.pageByCategory({type,page,pageSize,area,year,_class});
      return this.json(res);
    }

  }

  postAction() {}
  putAction() {}
  deleteAction() {}
}
