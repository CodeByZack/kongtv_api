const axios = require('axios');
const temme = require('temme').default;
const AIQIYI_DY = 'https://top.iqiyi.com/dianying.html';
const AIQIYI_DSJ = 'https://top.iqiyi.com/dianshiju.html';
const AIQIYI_DM= 'https://top.iqiyi.com/dongman.html';
const AIQIYI_ZY = 'https://top.iqiyi.com/zongyi.html';

const URL_MAP = {
    dy : AIQIYI_DY,
    dsj : AIQIYI_DSJ,
    dm : AIQIYI_DM,
    zy :AIQIYI_ZY
};

const rule = `.qy-top-row@data {
    .main-title{$name};
    .col-p25 .qy-top-list-des a@actors{&{$|replace(/\\s*/g,"")|replace(/\\//g,"")}}
}`;

const needKeys = ['type_id','vod_time','vod_level','type_id_1','vod_actor','vod_area','vod_blurb','vod_class','vod_content','vod_director','vod_lang','vod_name','vod_pic','vod_play_url','vod_remarks','vod_year'];

const needKeysStr = needKeys.join(',');

const filterKeys = (obj)=>{
  const newObj = {};
  needKeys.forEach(key=>{newObj[key] = obj[key]});
  return newObj;
};


const getTopAdvice = async (type)=>{    
    const baseUrl = URL_MAP[type];
    if(!baseUrl) return null;
    try {
        const res = await axios.get(baseUrl);
        const html = res.data;
        const items = temme(html,rule);
        const data = items.data.filter(_=>_ && _.name);
        return data;
    } catch (error) {
        console.log(error);
    }
    return null;
};

module.exports = {
  filterKeys,
  needKeysStr,
  getTopAdvice
}