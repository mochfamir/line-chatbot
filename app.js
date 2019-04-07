const linebot = require('linebot');
const express = require('express');
const axios = require('axios');
const projectId = process.env.PROJECT_ID

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_TOKEN
});

const app = express();
const linebotParser = bot.parser();

app.post('/linewebhook', linebotParser);

bot.on('message', function (event) {
  let textMessage = event.message.text.split(' ')
  let wordExcept = ['bakso', 'martabak', 'minuman', 'buy', 'cuaca', 'en', 'id']
  let command = wordExcept.filter(word => textMessage[0] === word)
  if (command[0]) {
    switch (command[0]) {
      case 'bakso':
        menuBakso(event)
        break;
      case 'martabak':
        menuMartabak(event)
        break;
      case 'minuman':
        menuMinuman(event)
        break;
      case 'buy':
        buy(event)
        break;
      case 'cuaca':
        cuaca(event, textMessage[1])
        break;
      case 'en':
        translateEn(event, textMessage)
        break;
      case 'id':
        translateId(event, textMessage)
        break;
      default:
        break;
    }
  } else {
    showMenu(event)
  }
});

function showMenu(event) {
  console.log('showmenu')
  event.reply({
    type: 'template',
    altText: 'this is a buttons template',
    template: {
      type: 'buttons',
      thumbnailImageUrl: 'https://i.ibb.co/bXS3vgm/kuyJajan.png',
      title: 'KuyJajan',
      text: 'Silahkan pilih menu',
      actions: [{
        type: 'message',
        label: 'Bakso & Mie Ayam',
        text: 'bakso'
      }, {
        type: 'message',
        label: 'Aneka Martabak',
        text: 'martabak'
      }, {
        type: 'message',
        label: 'Aneka Minuman',
        text: 'minuman'
      }]
    }
  });
}

function buy(event) {
  event.reply('Terima kasih, pesananmu akan segera dibuat')
}

async function cuaca(event, kota) {
  console.log('masuk')
  let {data} = await axios.get(`https://api.weatherbit.io/v2.0/current?city=${kota}&key=${process.env.WEATHER_KEY}`)
  event.reply(`
    City           : ${data.data[0].city_name}
    Latitude       : ${data.data[0].lat}
    Longitude      : ${data.data[0].lon}
    Weather        : ${data.data[0].weather.description}
    Wind Speed     : ${data.data[0].wind_spd}
    Temperature    : ${data.data[0].temp}
    Humidity       : ${data.data[0].rh}
    Clouds Coverage: ${data.data[0].clouds}
    Observation Time: ${data.data[0].ob_time}
  `)
}

async function translateId(event, input) {
  const {Translate} = require('@google-cloud/translate');
  const translate = new Translate({projectId});
  const text = input.slice(1, input.length).join(' ');
  const target = 'id';
  const [translation] = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
  let replyTranslation = await event.reply(translation)
}

async function translateEn(event, input) {
  const {Translate} = require('@google-cloud/translate');
  const translate = new Translate({projectId});
  const text = input.slice(1, input.length).join(' ');
  const target = 'en';
  const [translation] = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
  let replyTranslation = await event.reply(translation)
}

function menuBakso(event) {
  event.reply({
    type: 'template',
    altText: 'this is a carousel template',
    template: {
      type: 'carousel',
      columns: [{
        thumbnailImageUrl: 'https://assets-pergikuliner.com/IJ1S3CGsJyjGp__S2VE_-1idH3E=/385x290/smart/https://assets-pergikuliner.com/uploads/image/picture/747264/picture-1511333614.jpg',
        title: 'Bakso Urat',
        text: 'Rp.15.000',
        actions: [{
          type: 'message',
          label: 'Buy',
          text: 'buy'
        }]
      }, {
        thumbnailImageUrl: 'https://selerasa.com/wp-content/uploads/2015/05/images_mie_Mie_ayam_15-mie-ayam-bakso.jpg',
        title: 'Mie Ayam',
        text: 'Rp. 15.000',
        actions: [{
          type: 'message',
          label: 'Buy',
          text: 'buy'
        }]
      }]
    }
  });
}

function menuMartabak(event) {
  event.reply({
    type: 'template',
    altText: 'this is a carousel template',
    template: {
      type: 'carousel',
      columns: [{
        thumbnailImageUrl: 'https://rasamasa.com/uploads/filemanager/source/Resep_Kita/rasamasa-foto-martabak-manis-greentea-topping%204%20rasa.JPG',
        title: 'Martabak Manis',
        text: 'Rp.35.000',
        actions: [{
          type: 'message',
          label: 'Buy',
          text: 'buy'
        }]
      }, {
        thumbnailImageUrl: 'https://i.ytimg.com/vi/-lpHrVOgWOE/hqdefault.jpg',
        title: 'Martabak Telor',
        text: 'Rp. 45.000',
        actions: [{
          type: 'message',
          label: 'Buy',
          text: 'buy'
        }]
      }]
    }
  });
}

function menuMinuman(event) {
  event.reply({
    type: 'template',
    altText: 'this is a carousel template',
    template: {
      type: 'carousel',
      columns: [{
        thumbnailImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9ph6_M3PTqLKdxE-GWXPIVAmnBP2K_k2vd6YWaCI6nBTCxTyN',
        title: 'Bajigur',
        text: 'Rp.7.000',
        actions: [{
          type: 'message',
          label: 'Buy',
          text: 'buy'
        }]
      }, {
        thumbnailImageUrl: 'https://3.bp.blogspot.com/-jnAT29EV6ts/VuMB24sH_8I/AAAAAAAAEDg/ARUZMnSBkgotztRqUDqvtzC5cEZAw258A/s1600/cara-membuat-bandrek.jpg',
        title: 'Bandrek',
        text: 'Rp. 8.000',
        actions: [{
          type: 'message',
          label: 'Buy',
          text: 'buy'
        }]
      }, {
        thumbnailImageUrl: 'https://pbs.twimg.com/profile_images/915031195481550848/owo3oxZE_400x400.jpg',
        title: 'Kopi Hitam',
        text: 'Rp. 8.000',
        actions: [{
          type: 'message',
          label: 'Buy',
          text: 'buy'
        }]
      }, {
        thumbnailImageUrl: 'https://resepmakansedap.info/wp-content/uploads/2015/06/Resep-Membuat-Wedang-Susu-Jahe-Hangat-Segar.jpg',
        title: 'Susu Jahe',
        text: 'Rp. 6.000',
        actions: [{
          type: 'message',
          label: 'Buy',
          text: 'buy'
        }]
      }]
    }
  });
}

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
