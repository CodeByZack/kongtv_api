const axios = require('axios');

const DOUBAN_DY =
  'https://movie.douban.com/j/new_search_subjects?sort=U&range=0,10&tags=%E7%94%B5%E5%BD%B1';
const DOUBAN_DSJ =
  'https://movie.douban.com/j/new_search_subjects?sort=U&range=0,10&tags=%E7%94%B5%E8%A7%86%E5%89%A7';
const DOUBAN_DM =
  'https://movie.douban.com/j/new_search_subjects?sort=U&range=0,10&tags=%E5%8A%A8%E6%BC%AB';
const DOUBAN_ZY =
  'https://movie.douban.com/j/new_search_subjects?sort=U&range=0,10&tags=%E7%BB%BC%E8%89%BA';

const URL_MAP = {
  dy: DOUBAN_DY,
  dsj: DOUBAN_DSJ,
  dm: DOUBAN_DM,
  zy: DOUBAN_ZY
};

const needKeys = [
  'vod_id',
  'type_id',
  'vod_time',
  'vod_level',
  'type_id_1',
  'vod_actor',
  'vod_area',
  'vod_blurb',
  'vod_class',
  'vod_content',
  'vod_director',
  'vod_lang',
  'vod_name',
  'vod_pic',
  'vod_play_url',
  'vod_remarks',
  'vod_year'
];

const needKeysStr = needKeys.join(',');

const filterKeys = (obj) => {
  const newObj = {};
  needKeys.forEach((key) => {
    newObj[key] = obj[key];
  });
  return newObj;
};

const getTopAdvice = async(type) => {
  const baseUrl = URL_MAP[type];
  if (!baseUrl) return null;
  try {
    const res = await axios.get(baseUrl);
    const html = res.data.data;
    const data = html.map((i) => ({ name: i.title, actors: i.casts }));
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
  return null;
};

module.exports = {
  filterKeys,
  needKeysStr,
  getTopAdvice
};
