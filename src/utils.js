
const needKeys = ['type_id','type_id_1','vod_actor','vod_area','vod_blurb','vod_class','vod_content','vod_director','vod_lang','vod_name','vod_pic','vod_play_url','vod_remarks','vod_year'];

const needKeysStr = needKeys.join(',');

const filterKeys = (obj)=>{
  const newObj = {};
  needKeys.forEach(key=>{newObj[key] = obj[key]});
  return newObj;
};



module.exports = {
  filterKeys,
  needKeysStr
}