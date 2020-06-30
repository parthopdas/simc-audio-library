const XLSX = require('xlsx');
const _ = require('lodash')
const rq = require('superagent');

const wb = XLSX.readFile('/home/skussl/Downloads/testing.ods');



const getEpisodes = sheet => {
  const EPISODE_START = '[START] EPISODES'
  const EPISODE_MARKER = 'EPISODE'
  const COL_AUDIO_URI = 'B'
  const COL_TITLE = 'C'
  const COL_DESC = 'D'
  const COL_DURATION = 'E'

  const eStart = _.entries(sheet).find(([cell, { v }]) => cell.startsWith('A') && v.trim() == EPISODE_START)

  if (!eStart) {
    return []
  }

  const headerRow = parseInt(eStart[0].slice(1), 10);
  if (isNaN(headerRow)) {
    console.warn('Could not parse start row.');
    return [];
  }

  let episodes = []
  for (let i = headerRow + 1; i <= headerRow + 3000; i++) {
    if (_.get(sheet, `A${i}.v`, '') !== EPISODE_MARKER) {
      continue;
    }

    episodes.push({
      audioUrl: _.get(sheet, `${COL_AUDIO_URI}${i}.v`, ''),
      title: _.get(sheet, `${COL_TITLE}${i}.v`, ''),
      description: _.get(sheet, `${COL_DESC}${i}.v`, ''),
      duration: _.get(sheet, `${COL_DURATION}${i}.v`, '')
    });
  }

  return episodes;
}


const validateAudio = async audioUrl => {
  const res = await rq.head(audioUrl);

  if (res.status !== 200) {

  }

  if (!res.header['content-type'].startsWith('audio')) {

  }

  const fileSize = parseInt(res.header['content-length'], 10);
  if (isNaN(fileSize) || fileSize <= 100) {

  }

  return {
    url: audioUrl,
    size: fileSize,
    type: res.header['content-type']
  }
}

const validateEpisodes = episodes => {
  // validate audio


}

(async () => {
  const episodes = getEpisodes(wb.Sheets['Tabellenblatt1']);
  console.log(await validateAudio(episodes[0]['audioUrl']))
})();

// wb.SheetNames.map();
