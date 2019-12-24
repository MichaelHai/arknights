var Crawler = require('crawler');
var characters = require('./assets/ArknightsGameData/excel/character_table');
var fs = require('fs');

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
          var logoUrl = $logo.attribs['src'];
          crawlIfNotExist(logoUrl, `./src/assets/characters/${name}.png`);
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
        crawlIfNotExist(`http://ak.mooncell.wiki${skillImages[index].attribs['data-src']}`, `./src/assets/skills/${skill.skillId}.png`);
      });
    }
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

var avatarInfo = '[{"name":"12F","icon":"http://ak.mooncell.wiki/images/b/b7/%E5%A4%B4%E5%83%8F_12F.png"},{"name":"Castle-3","icon":"http://ak.mooncell.wiki/images/8/82/%E5%A4%B4%E5%83%8F_Castle-3.png"},{"name":"Lancet-2","icon":"http://ak.mooncell.wiki/images/b/b6/%E5%A4%B4%E5%83%8F_Lancet-2.png"},{"name":"临光","icon":"http://ak.mooncell.wiki/images/1/1a/%E5%A4%B4%E5%83%8F_%E4%B8%B4%E5%85%89.png"},{"name":"伊桑","icon":"http://ak.mooncell.wiki/images/c/c1/%E5%A4%B4%E5%83%8F_%E4%BC%8A%E6%A1%91.png"},{"name":"伊芙利特","icon":"http://ak.mooncell.wiki/images/e/ed/%E5%A4%B4%E5%83%8F_%E4%BC%8A%E8%8A%99%E5%88%A9%E7%89%B9.png"},{"name":"克洛丝","icon":"http://ak.mooncell.wiki/images/b/b9/%E5%A4%B4%E5%83%8F_%E5%85%8B%E6%B4%9B%E4%B8%9D.png"},{"name":"凛冬","icon":"http://ak.mooncell.wiki/images/c/cd/%E5%A4%B4%E5%83%8F_%E5%87%9B%E5%86%AC.png"},{"name":"初雪","icon":"http://ak.mooncell.wiki/images/d/d7/%E5%A4%B4%E5%83%8F_%E5%88%9D%E9%9B%AA.png"},{"name":"华法琳","icon":"http://ak.mooncell.wiki/images/3/30/%E5%A4%B4%E5%83%8F_%E5%8D%8E%E6%B3%95%E7%90%B3.png"},{"name":"卡缇","icon":"http://ak.mooncell.wiki/images/8/87/%E5%A4%B4%E5%83%8F_%E5%8D%A1%E7%BC%87.png"},{"name":"古米","icon":"http://ak.mooncell.wiki/images/0/07/%E5%A4%B4%E5%83%8F_%E5%8F%A4%E7%B1%B3.png"},{"name":"可颂","icon":"http://ak.mooncell.wiki/images/a/ab/%E5%A4%B4%E5%83%8F_%E5%8F%AF%E9%A2%82.png"},{"name":"史都华德","icon":"http://ak.mooncell.wiki/images/b/b3/%E5%A4%B4%E5%83%8F_%E5%8F%B2%E9%83%BD%E5%8D%8E%E5%BE%B7.png"},{"name":"嘉维尔","icon":"http://ak.mooncell.wiki/images/c/cc/%E5%A4%B4%E5%83%8F_%E5%98%89%E7%BB%B4%E5%B0%94.png"},{"name":"因陀罗","icon":"http://ak.mooncell.wiki/images/f/fe/%E5%A4%B4%E5%83%8F_%E5%9B%A0%E9%99%80%E7%BD%97.png"},{"name":"地灵","icon":"http://ak.mooncell.wiki/images/5/57/%E5%A4%B4%E5%83%8F_%E5%9C%B0%E7%81%B5.png"},{"name":"坚雷","icon":"http://ak.mooncell.wiki/images/a/ab/%E5%A4%B4%E5%83%8F_%E5%9D%9A%E9%9B%B7.png"},{"name":"塞雷娅","icon":"http://ak.mooncell.wiki/images/e/ee/%E5%A4%B4%E5%83%8F_%E5%A1%9E%E9%9B%B7%E5%A8%85.png"},{"name":"夜刀","icon":"http://ak.mooncell.wiki/images/b/b2/%E5%A4%B4%E5%83%8F_%E5%A4%9C%E5%88%80.png"},{"name":"夜烟","icon":"http://ak.mooncell.wiki/images/5/55/%E5%A4%B4%E5%83%8F_%E5%A4%9C%E7%83%9F.png"},{"name":"夜莺","icon":"http://ak.mooncell.wiki/images/6/64/%E5%A4%B4%E5%83%8F_%E5%A4%9C%E8%8E%BA.png"},{"name":"夜魔","icon":"http://ak.mooncell.wiki/images/a/a7/%E5%A4%B4%E5%83%8F_%E5%A4%9C%E9%AD%94.png"},{"name":"天火","icon":"http://ak.mooncell.wiki/images/f/fa/%E5%A4%B4%E5%83%8F_%E5%A4%A9%E7%81%AB.png"},{"name":"守林人","icon":"http://ak.mooncell.wiki/images/2/27/%E5%A4%B4%E5%83%8F_%E5%AE%88%E6%9E%97%E4%BA%BA.png"},{"name":"安德切尔","icon":"http://ak.mooncell.wiki/images/f/f6/%E5%A4%B4%E5%83%8F_%E5%AE%89%E5%BE%B7%E5%88%87%E5%B0%94.png"},{"name":"安洁莉娜","icon":"http://ak.mooncell.wiki/images/c/ca/%E5%A4%B4%E5%83%8F_%E5%AE%89%E6%B4%81%E8%8E%89%E5%A8%9C.png"},{"name":"安赛尔","icon":"http://ak.mooncell.wiki/images/9/94/%E5%A4%B4%E5%83%8F_%E5%AE%89%E8%B5%9B%E5%B0%94.png"},{"name":"崖心","icon":"http://ak.mooncell.wiki/images/7/7d/%E5%A4%B4%E5%83%8F_%E5%B4%96%E5%BF%83.png"},{"name":"巡林者","icon":"http://ak.mooncell.wiki/images/9/93/%E5%A4%B4%E5%83%8F_%E5%B7%A1%E6%9E%97%E8%80%85.png"},{"name":"布洛卡","icon":"http://ak.mooncell.wiki/images/0/04/%E5%A4%B4%E5%83%8F_%E5%B8%83%E6%B4%9B%E5%8D%A1.png"},{"name":"幽灵鲨","icon":"http://ak.mooncell.wiki/images/2/28/%E5%A4%B4%E5%83%8F_%E5%B9%BD%E7%81%B5%E9%B2%A8.png"},{"name":"微风","icon":"http://ak.mooncell.wiki/images/a/ad/%E5%A4%B4%E5%83%8F_%E5%BE%AE%E9%A3%8E.png"},{"name":"德克萨斯","icon":"http://ak.mooncell.wiki/images/5/57/%E5%A4%B4%E5%83%8F_%E5%BE%B7%E5%85%8B%E8%90%A8%E6%96%AF.png"},{"name":"慕斯","icon":"http://ak.mooncell.wiki/images/f/fc/%E5%A4%B4%E5%83%8F_%E6%85%95%E6%96%AF.png"},{"name":"拉普兰德","icon":"http://ak.mooncell.wiki/images/b/bf/%E5%A4%B4%E5%83%8F_%E6%8B%89%E6%99%AE%E5%85%B0%E5%BE%B7.png"},{"name":"拜松","icon":"http://ak.mooncell.wiki/images/b/b2/%E5%A4%B4%E5%83%8F_%E6%8B%9C%E6%9D%BE.png"},{"name":"推进之王","icon":"http://ak.mooncell.wiki/images/b/ba/%E5%A4%B4%E5%83%8F_%E6%8E%A8%E8%BF%9B%E4%B9%8B%E7%8E%8B.png"},{"name":"斑点","icon":"http://ak.mooncell.wiki/images/3/30/%E5%A4%B4%E5%83%8F_%E6%96%91%E7%82%B9.png"},{"name":"斯卡蒂","icon":"http://ak.mooncell.wiki/images/5/53/%E5%A4%B4%E5%83%8F_%E6%96%AF%E5%8D%A1%E8%92%82.png"},{"name":"星极","icon":"http://ak.mooncell.wiki/images/e/ee/%E5%A4%B4%E5%83%8F_%E6%98%9F%E6%9E%81.png"},{"name":"星熊","icon":"http://ak.mooncell.wiki/images/0/07/%E5%A4%B4%E5%83%8F_%E6%98%9F%E7%86%8A.png"},{"name":"普罗旺斯","icon":"http://ak.mooncell.wiki/images/7/72/%E5%A4%B4%E5%83%8F_%E6%99%AE%E7%BD%97%E6%97%BA%E6%96%AF.png"},{"name":"暗索","icon":"http://ak.mooncell.wiki/images/d/dd/%E5%A4%B4%E5%83%8F_%E6%9A%97%E7%B4%A2.png"},{"name":"暴行","icon":"http://ak.mooncell.wiki/images/3/36/%E5%A4%B4%E5%83%8F_%E6%9A%B4%E8%A1%8C.png"},{"name":"月见夜","icon":"http://ak.mooncell.wiki/images/b/b7/%E5%A4%B4%E5%83%8F_%E6%9C%88%E8%A7%81%E5%A4%9C.png"},{"name":"末药","icon":"http://ak.mooncell.wiki/images/d/d9/%E5%A4%B4%E5%83%8F_%E6%9C%AB%E8%8D%AF.png"},{"name":"杜宾","icon":"http://ak.mooncell.wiki/images/a/a1/%E5%A4%B4%E5%83%8F_%E6%9D%9C%E5%AE%BE.png"},{"name":"杜林","icon":"http://ak.mooncell.wiki/images/2/24/%E5%A4%B4%E5%83%8F_%E6%9D%9C%E6%9E%97.png"},{"name":"杰西卡","icon":"http://ak.mooncell.wiki/images/6/63/%E5%A4%B4%E5%83%8F_%E6%9D%B0%E8%A5%BF%E5%8D%A1.png"},{"name":"格劳克斯","icon":"http://ak.mooncell.wiki/images/5/53/%E5%A4%B4%E5%83%8F_%E6%A0%BC%E5%8A%B3%E5%85%8B%E6%96%AF.png"},{"name":"格拉尼","icon":"http://ak.mooncell.wiki/images/2/29/%E5%A4%B4%E5%83%8F_%E6%A0%BC%E6%8B%89%E5%B0%BC.png"},{"name":"格雷伊","icon":"http://ak.mooncell.wiki/images/f/fe/%E5%A4%B4%E5%83%8F_%E6%A0%BC%E9%9B%B7%E4%BC%8A.png"},{"name":"桃金娘","icon":"http://ak.mooncell.wiki/images/9/9d/%E5%A4%B4%E5%83%8F_%E6%A1%83%E9%87%91%E5%A8%98.png"},{"name":"梅","icon":"http://ak.mooncell.wiki/images/thumb/a/ac/%E5%A4%B4%E5%83%8F_%E6%A2%85.png/180px-%E5%A4%B4%E5%83%8F_%E6%A2%85.png"},{"name":"梅尔","icon":"http://ak.mooncell.wiki/images/0/07/%E5%A4%B4%E5%83%8F_%E6%A2%85%E5%B0%94.png"},{"name":"梓兰","icon":"http://ak.mooncell.wiki/images/8/83/%E5%A4%B4%E5%83%8F_%E6%A2%93%E5%85%B0.png"},{"name":"槐琥","icon":"http://ak.mooncell.wiki/images/e/ed/%E5%A4%B4%E5%83%8F_%E6%A7%90%E7%90%A5.png"},{"name":"泡普卡","icon":"http://ak.mooncell.wiki/images/1/16/%E5%A4%B4%E5%83%8F_%E6%B3%A1%E6%99%AE%E5%8D%A1.png"},{"name":"流星","icon":"http://ak.mooncell.wiki/images/1/14/%E5%A4%B4%E5%83%8F_%E6%B5%81%E6%98%9F.png"},{"name":"深海色","icon":"http://ak.mooncell.wiki/images/d/d1/%E5%A4%B4%E5%83%8F_%E6%B7%B1%E6%B5%B7%E8%89%B2.png"},{"name":"清道夫","icon":"http://ak.mooncell.wiki/images/6/63/%E5%A4%B4%E5%83%8F_%E6%B8%85%E9%81%93%E5%A4%AB.png"},{"name":"火神","icon":"http://ak.mooncell.wiki/images/f/f1/%E5%A4%B4%E5%83%8F_%E7%81%AB%E7%A5%9E.png"},{"name":"炎客","icon":"http://ak.mooncell.wiki/images/d/d6/%E5%A4%B4%E5%83%8F_%E7%82%8E%E5%AE%A2.png"},{"name":"炎熔","icon":"http://ak.mooncell.wiki/images/f/fb/%E5%A4%B4%E5%83%8F_%E7%82%8E%E7%86%94.png"},{"name":"狮蝎","icon":"http://ak.mooncell.wiki/images/c/c5/%E5%A4%B4%E5%83%8F_%E7%8B%AE%E8%9D%8E.png"},{"name":"猎蜂","icon":"http://ak.mooncell.wiki/images/c/c2/%E5%A4%B4%E5%83%8F_%E7%8C%8E%E8%9C%82.png"},{"name":"玫兰莎","icon":"http://ak.mooncell.wiki/images/4/4b/%E5%A4%B4%E5%83%8F_%E7%8E%AB%E5%85%B0%E8%8E%8E.png"},{"name":"白金","icon":"http://ak.mooncell.wiki/images/3/3b/%E5%A4%B4%E5%83%8F_%E7%99%BD%E9%87%91.png"},{"name":"白雪","icon":"http://ak.mooncell.wiki/images/b/b4/%E5%A4%B4%E5%83%8F_%E7%99%BD%E9%9B%AA.png"},{"name":"白面鸮","icon":"http://ak.mooncell.wiki/images/8/83/%E5%A4%B4%E5%83%8F_%E7%99%BD%E9%9D%A2%E9%B8%AE.png"},{"name":"真理","icon":"http://ak.mooncell.wiki/images/e/e6/%E5%A4%B4%E5%83%8F_%E7%9C%9F%E7%90%86.png"},{"name":"砾","icon":"http://ak.mooncell.wiki/images/c/ce/%E5%A4%B4%E5%83%8F_%E7%A0%BE.png"},{"name":"空","icon":"http://ak.mooncell.wiki/images/5/58/%E5%A4%B4%E5%83%8F_%E7%A9%BA.png"},{"name":"空爆","icon":"http://ak.mooncell.wiki/images/c/cd/%E5%A4%B4%E5%83%8F_%E7%A9%BA%E7%88%86.png"},{"name":"米格鲁","icon":"http://ak.mooncell.wiki/images/3/32/%E5%A4%B4%E5%83%8F_%E7%B1%B3%E6%A0%BC%E9%B2%81.png"},{"name":"红","icon":"http://ak.mooncell.wiki/images/a/ac/%E5%A4%B4%E5%83%8F_%E7%BA%A2.png"},{"name":"红云","icon":"http://ak.mooncell.wiki/images/a/af/%E5%A4%B4%E5%83%8F_%E7%BA%A2%E4%BA%91.png"},{"name":"红豆","icon":"http://ak.mooncell.wiki/images/b/bb/%E5%A4%B4%E5%83%8F_%E7%BA%A2%E8%B1%86.png"},{"name":"缠丸","icon":"http://ak.mooncell.wiki/images/1/13/%E5%A4%B4%E5%83%8F_%E7%BC%A0%E4%B8%B8.png"},{"name":"翎羽","icon":"http://ak.mooncell.wiki/images/1/1f/%E5%A4%B4%E5%83%8F_%E7%BF%8E%E7%BE%BD.png"},{"name":"能天使","icon":"http://ak.mooncell.wiki/images/a/ad/%E5%A4%B4%E5%83%8F_%E8%83%BD%E5%A4%A9%E4%BD%BF.png"},{"name":"艾丝黛尔","icon":"http://ak.mooncell.wiki/images/5/57/%E5%A4%B4%E5%83%8F_%E8%89%BE%E4%B8%9D%E9%BB%9B%E5%B0%94.png"},{"name":"艾雅法拉","icon":"http://ak.mooncell.wiki/images/c/cc/%E5%A4%B4%E5%83%8F_%E8%89%BE%E9%9B%85%E6%B3%95%E6%8B%89.png"},{"name":"芙兰卡","icon":"http://ak.mooncell.wiki/images/2/2b/%E5%A4%B4%E5%83%8F_%E8%8A%99%E5%85%B0%E5%8D%A1.png"},{"name":"芙蓉","icon":"http://ak.mooncell.wiki/images/d/d3/%E5%A4%B4%E5%83%8F_%E8%8A%99%E8%93%89.png"},{"name":"芬","icon":"http://ak.mooncell.wiki/images/4/41/%E5%A4%B4%E5%83%8F_%E8%8A%AC.png"},{"name":"苇草","icon":"http://ak.mooncell.wiki/images/7/7a/%E5%A4%B4%E5%83%8F_%E8%8B%87%E8%8D%89.png"},{"name":"苏苏洛","icon":"http://ak.mooncell.wiki/images/6/63/%E5%A4%B4%E5%83%8F_%E8%8B%8F%E8%8B%8F%E6%B4%9B.png"},{"name":"莫斯提马","icon":"http://ak.mooncell.wiki/images/0/0b/%E5%A4%B4%E5%83%8F_%E8%8E%AB%E6%96%AF%E6%8F%90%E9%A9%AC.png"},{"name":"蓝毒","icon":"http://ak.mooncell.wiki/images/6/63/%E5%A4%B4%E5%83%8F_%E8%93%9D%E6%AF%92.png"},{"name":"蛇屠箱","icon":"http://ak.mooncell.wiki/images/0/02/%E5%A4%B4%E5%83%8F_%E8%9B%87%E5%B1%A0%E7%AE%B1.png"},{"name":"角峰","icon":"http://ak.mooncell.wiki/images/e/e4/%E5%A4%B4%E5%83%8F_%E8%A7%92%E5%B3%B0.png"},{"name":"讯使","icon":"http://ak.mooncell.wiki/images/2/27/%E5%A4%B4%E5%83%8F_%E8%AE%AF%E4%BD%BF.png"},{"name":"诗怀雅","icon":"http://ak.mooncell.wiki/images/5/50/%E5%A4%B4%E5%83%8F_%E8%AF%97%E6%80%80%E9%9B%85.png"},{"name":"调香师","icon":"http://ak.mooncell.wiki/images/6/6a/%E5%A4%B4%E5%83%8F_%E8%B0%83%E9%A6%99%E5%B8%88.png"},{"name":"赫拉格","icon":"http://ak.mooncell.wiki/images/c/cd/%E5%A4%B4%E5%83%8F_%E8%B5%AB%E6%8B%89%E6%A0%BC.png"},{"name":"赫默","icon":"http://ak.mooncell.wiki/images/3/39/%E5%A4%B4%E5%83%8F_%E8%B5%AB%E9%BB%98.png"},{"name":"远山","icon":"http://ak.mooncell.wiki/images/6/63/%E5%A4%B4%E5%83%8F_%E8%BF%9C%E5%B1%B1.png"},{"name":"送葬人","icon":"http://ak.mooncell.wiki/images/d/da/%E5%A4%B4%E5%83%8F_%E9%80%81%E8%91%AC%E4%BA%BA.png"},{"name":"银灰","icon":"http://ak.mooncell.wiki/images/2/27/%E5%A4%B4%E5%83%8F_%E9%93%B6%E7%81%B0.png"},{"name":"锡兰","icon":"http://ak.mooncell.wiki/images/3/39/%E5%A4%B4%E5%83%8F_%E9%94%A1%E5%85%B0.png"},{"name":"闪灵","icon":"http://ak.mooncell.wiki/images/5/54/%E5%A4%B4%E5%83%8F_%E9%97%AA%E7%81%B5.png"},{"name":"阿消","icon":"http://ak.mooncell.wiki/images/2/2f/%E5%A4%B4%E5%83%8F_%E9%98%BF%E6%B6%88.png"},{"name":"阿米娅","icon":"http://ak.mooncell.wiki/images/3/36/%E5%A4%B4%E5%83%8F_%E9%98%BF%E7%B1%B3%E5%A8%85.png"},{"name":"陈","icon":"http://ak.mooncell.wiki/images/c/cf/%E5%A4%B4%E5%83%8F_%E9%99%88.png"},{"name":"陨星","icon":"http://ak.mooncell.wiki/images/e/ea/%E5%A4%B4%E5%83%8F_%E9%99%A8%E6%98%9F.png"},{"name":"雷蛇","icon":"http://ak.mooncell.wiki/images/f/f5/%E5%A4%B4%E5%83%8F_%E9%9B%B7%E8%9B%87.png"},{"name":"霜叶","icon":"http://ak.mooncell.wiki/images/2/29/%E5%A4%B4%E5%83%8F_%E9%9C%9C%E5%8F%B6.png"},{"name":"食铁兽","icon":"http://ak.mooncell.wiki/images/d/dd/%E5%A4%B4%E5%83%8F_%E9%A3%9F%E9%93%81%E5%85%BD.png"},{"name":"香草","icon":"http://ak.mooncell.wiki/images/c/c8/%E5%A4%B4%E5%83%8F_%E9%A6%99%E8%8D%89.png"},{"name":"麦哲伦","icon":"http://ak.mooncell.wiki/images/4/4d/%E5%A4%B4%E5%83%8F_%E9%BA%A6%E5%93%B2%E4%BC%A6.png"},{"name":"黑","icon":"http://ak.mooncell.wiki/images/d/d4/%E5%A4%B4%E5%83%8F_%E9%BB%91.png"},{"name":"黑角","icon":"http://ak.mooncell.wiki/images/f/f1/%E5%A4%B4%E5%83%8F_%E9%BB%91%E8%A7%92.png"}]';
var avatar = {};
JSON.parse(avatarInfo).forEach((info) => {
  avatar[info.name] = info.icon;
});

Object.keys(characters)
  .filter((c) => characters[c].profession !== 'TOKEN')
  .filter((c) => characters[c].profession !== 'TRAP')
  .forEach((id) => {
    characterCrawler.queue({
      uri: encodeURI(`http://ak.mooncell.wiki/w/${characters[id].name}`),
      id: id,
    });
    crawlIfNotExist(avatar[characters[id].name], `./src/assets/characters/${id}/avatar.png`);
  });
