const { think } = require("thinkjs");
const { filterKeys, needKeysStr, getTopAdvice } = require("../utils");

const categoryKeys = {
  dy : {type_id_1:1},
  dsj : {type_id_1:2},
  zy : {type_id:3},
  dm : {type_id:4}
};

const indexFlag = { vod_level : 1 };

module.exports = class extends think.Model {
  get tableName() {
    return 'mac_vod';
  }

  get pk() {
    return 'vod_id';
  }

  async index(){

    const dyWhere = {...categoryKeys.dy,...indexFlag};
    const dsjWhere = {...categoryKeys.dsj,...indexFlag};
    const zyWhere = {...categoryKeys.zy,...indexFlag};
    const dmWhere = {...categoryKeys.dm,...indexFlag};

    const dy = await this.field(needKeysStr).order(['vod_time DESC']).limit(6).where(dyWhere).cache('index_dy').select();
    const dsj = await this.field(needKeysStr).order(['vod_time DESC']).limit(6).where(dsjWhere).cache('index_dsj').select();
    const zy = await this.field(needKeysStr).order(['vod_time DESC']).limit(6).where(zyWhere).cache('index_zy').select();
    const dm = await this.field(needKeysStr).order(['vod_time DESC']).limit(6).where(dmWhere).cache('index_dm').select();
    return [...dy,...dsj,...zy,...dm];
  }

  async pageByCategory(options){

    const {
      type,
      page = 1,
      pageSize = 12,
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

    const res = await this.field(needKeysStr).where(where).page(page,pageSize).order(['vod_time DESC']).cache(cacheKey).select();
    
    return res;
  }

  async search(word,page=1,pageSize=10){
    const cacheKey = `search_${word}`;
    const res = await this.field(needKeysStr).where({ vod_name : ['like',`%${word}%`] }).order(['vod_time DESC']).page(page,pageSize).cache(cacheKey).select();
    return res;
  }

  async updateIndex(type){

    const where = categoryKeys[type];
    if(!where)return;

    const condition = { ...where,vod_level:1 };


    const innerFn = async ()=>{

      //拿到当前最新的数据
      const topAdviceArr = await getTopAdvice(type);
      
      //找到之前推荐的
      const oldAdvice = await this.where(condition).select();

      //重置
      const res = await this.updateMany(oldAdvice,{vod_level:0});

      let count = 0;
      for (const item of topAdviceArr) {
        if(count<6){
          const findObj = await this.where({vod_name:['like',`%${item}%`]}).find();
          if(think.isEmpty(findObj))continue;
          const affectsRows = await this.where({vod_id:findObj.vod_id}).update({vod_level:1});
          if(affectsRows > 0) count++;
        }
      }

    };

    return this.transaction(innerFn);

  }

};