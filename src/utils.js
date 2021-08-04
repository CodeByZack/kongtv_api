const axios = require('axios');
const temme = require('temme').default;
const AIQIYI_DY = 'https://www.iqiyi.com/ranks1/1/0';
const AIQIYI_DSJ = 'https://www.iqiyi.com/ranks1/2/0';
const AIQIYI_DM= 'https://www.iqiyi.com/ranks1/4/0';
const AIQIYI_ZY = 'https://www.iqiyi.com/ranks1/6/0';

const URL_MAP = {
    dy : AIQIYI_DY,
    dsj : AIQIYI_DSJ,
    dm : AIQIYI_DM,
    zy :AIQIYI_ZY
};

const rule = `.rvi__box@data {
    .rvi__tit1{$name};
    .rvi__type__txt@actors{&{$|replace(/\\s*/g,"")|replace(/\\//g,"")}}
}`;

const needKeys = ['vod_id','type_id','vod_time','vod_level','type_id_1','vod_actor','vod_area','vod_blurb','vod_class','vod_content','vod_director','vod_lang','vod_name','vod_pic','vod_play_url','vod_remarks','vod_year'];

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
