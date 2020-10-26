const { filterKeys, needKeysStr } = require("../utils");

const categoryKeys = {
  dy : {type_id_1:1},
  dsj : {type_id_1:2},
  zy : {type_id:3},
  dm : {type_id:4}
};


module.exports = class extends think.Model {
  get tableName() {
    return 'mac_vod';
  }

  async index(){

    const dy = await this.field(needKeysStr).limit(10).where(categoryKeys.dy).cache('index_dy').select();
    const dsj = await this.field(needKeysStr).limit(10).where(categoryKeys.dsj).cache('index_dsj').select();
    const zy = await this.field(needKeysStr).limit(10).where(categoryKeys.zy).cache('index_zy').select();
    const dm = await this.field(needKeysStr).limit(10).where(categoryKeys.dm).cache('index_dm').select();
    return [...dy,...dsj,...zy,...dm];
  }

  async pageByCategory(category,page = 1,pageSize = 10){

    const where = categoryKeys[category];
    const cacheKey = `category_${category}_${page}_${pageSize}`;
    const res = await this.field(needKeysStr).where(where).limit(10).cache(cacheKey).select();
    return res;

  }

};