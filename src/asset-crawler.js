var Crawler = require('crawler');
var characters = require('./assets/ArknightsGameData/zh_CN/gamedata/excel/character_table');
var fs = require('fs');

var host = 'http://prts.wiki';

var imageCrawler = new Crawler({
  maxConnections: 10,
  encoding: null,
  jQuery: false,
  callback: function (error, res, done) {
    if (error) {
      throw new Error(error);
    } else {
      fs.open(res.options.filename, 'w', (err, fd) => {
        if (err) {
          console.error(err);
        } else {
          fs.createWriteStream('', {
            fd,
          }).write(res.body);
        }
      });
    }
    done();
  },
});

var characterAvatarCrawler = new Crawler({
  maxConnections: 10,
  callback: function (error, res, done) {
    if (error) {
      console.error(error);
    } else {
      var $ = res.$;
      var id = res.options.id;
      var selector = `img[alt^="${characters[id].name}"]`;
      var avatarUrl = $(selector)[0].attribs['src'];
      var filename = `./src/assets/characters/${id}/avatar.png`;
      crawlIfNotExist(avatarUrl, filename);
    }
    done();
  },
});

var characterCrawler = new Crawler({
  maxConnections: 10,
  callback: function (error, res, done) {
    if (error) {
      console.error(error);
    } else {
      var $ = res.$;
      var id = res.options.id;

      fs.mkdirSync(`./src/assets/characters/${id}/`, {recursive: true});

      // eslint-disable-next-line no-inner-declarations
      function crawlImage(selector, name) {
        var $logo = $(selector)[0];
        if ($logo) {
          var url = $logo.attribs['src'];
          if (url && url !== '') {
            var logoUrl = url.startsWith('http') ? url : `http:${url}`;
            crawlIfNotExist(logoUrl, `./src/assets/characters/${name}.png`);
          }
        } else {
          console.error('error crawling logo for ' + characters[id].name);
        }
      }

      crawlImage('#deflogo img', `logos/${characters[id].displayLogo}`);
      crawlImage('#img-stage0 img', `${id}/init`);
      if (characters[id].phases.length > 2) {
        crawlImage('#img-stage2 img', `${id}/phase2`);
      }

      var skillImages = $('.nomobile img[alt^="技能"]');
      characters[id].skills.forEach((skill, index) => {
        if (skillImages[index]) {
          crawlIfNotExist(`${host}${skillImages[index].attribs['data-src']}`, `./src/assets/skills/${skill.skillId}.png`);
        } else {
          console.error(`Skill image not found for ${id}: ${skill.skillId}`);
        }
      });
    }
    crawlIfNotExist(res.options.avatarUri, `./src/assets/characters/${id}/avatar.png`);
    done();
  },
});

function crawlIfNotExist(uri, filename) {
  if (uri) {
    if (!fs.existsSync(filename)) {
      console.log(`queue ${uri} for file ${filename}`);
      imageCrawler.queue({
        uri,
        filename,
      });
    }
  } else {
    console.error(`no uri specified for ${filename}`);
  }
}

var avatarInfoCrawler = new Crawler({
  maxConnections: 10,
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
  callback: function (error, res, done) {
    var avatar = {};
    if (error) {
      console.error(error);
    } else {
      var $ = res.$;
      var datas = $('.smwdata');
      for (var i = 0; i < datas.length; i++) {
        var $data = datas[i];
        avatar[$data.attribs['data-cn']] = `http:${$data.attribs['data-icon']}`;
      }
    }

    Object.keys(characters)
      .filter((c) => characters[c].profession !== 'TOKEN')
      .filter((c) => characters[c].profession !== 'TRAP')
      .filter((c) => characters[c].displayNumber !== null)
      .forEach((id) => {
        characterCrawler.queue({
          uri: encodeURI(`${host}/w/${characters[id].name}`),
          id: id,
          avatarUri: avatar[characters[id].name],
        });
      });
    done();
  },
});

avatarInfoCrawler.queue({
  uri: encodeURI(`${host}/w/干员一览`),
});
