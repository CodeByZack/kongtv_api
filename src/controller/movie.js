const { think } = require('thinkjs');
const UrlPathPrefix = '/movie';
const vaildType = ['index','updateindex','dy','zy','dm','dsj','search'];

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
    }else if(type === "updateindex"){
      await this.updateIndex();
      return this.json({msg:"更新成功！"});
    }else{
      const res = await movie.pageByCategory({type,page,pageSize,area,year,_class});
      return this.json(res);
    }

  }

  async updateIndex(){
    const movie = this.model('movie');
    // 更新首页的电影
    await movie.updateIndex('dy');
    await movie.updateIndex('dsj');
    await movie.updateIndex('dm');
    await movie.updateIndex('zy');
    // 删除cache
    await this.clearCache();
    return true;
  }

  async clearCache(){
    const cacheConfig = this.config('cache');
    const cachePath = cacheConfig.file.cachePath;
    await think.rmdir(cachePath,true);
    return true;
  }

  postAction() {}
  putAction() {}
  deleteAction() {}
}
