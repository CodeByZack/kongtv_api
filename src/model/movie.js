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
    const dy = await this.field(needKeysStr).limit(6).where(categoryKeys.dy).cache('index_dy').select();
    const dsj = await this.field(needKeysStr).limit(6).where(categoryKeys.dsj).cache('index_dsj').select();
    const zy = await this.field(needKeysStr).limit(6).where(categoryKeys.zy).cache('index_zy').select();
    const dm = await this.field(needKeysStr).limit(6).where(categoryKeys.dm).cache('index_dm').select();
    return [...dy,...dsj,...zy,...dm];
  }

  async pageByCategory(options){

    const {
      type,
      page = 1,
      pageSize = 10,
      area,
      year,
      _class
    } = options;

    console.log(options);

    let where = categoryKeys[type];
    if( area ){
      where.vod_area = ['like', area];
    }
    if( year ){
      where.vod_year = ['like', year];
    }
    if( _class ){
      where.vod_class = ['like', _class];
    }

    const cacheKey = `category_${type}_${page}_${pageSize}_${area}_${year}_${_class}`;

    const res = await this.field(needKeysStr).where(where).page(page,pageSize).cache(cacheKey).select();
    
    return res;
  }

  async search(word,page=1,pageSize=10){
    const cacheKey = `search_${word}`;
    const res = await this.field(needKeysStr).where({ vod_name : ['like',`%${word}%`] }).page(page,pageSize).cache(cacheKey).select();
    return res;
  }

};