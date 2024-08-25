require('dotenv').config({
   path: `.env.development`,
});

const buffer = Buffer.from(`${process.env.TIDAL_CLIENT_ID}:${process.env.TIDAL_SECRET}`).toString('base64');
console.log(buffer);

const getTidalAccessToken = async () => {
   return await fetch('https://auth.tidal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
         Authorization: `Basic ${buffer}`,
         'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials`,
   })
      .then((res) => res.json())
      .then((data) => {
         console.log(data);
         return `${data.token_type} ${data.access_token}`;
      })
      .catch((error) => console.error('failed in AccessToken', error));
};

const getTidalLink = async (token, title) => {
   return await fetch(
      `https://openapi.tidal.com/v2/searchresults/${ARTIST} ${title}/relationships/albums?countryCode=US&include=albums`,
      {
         headers: { Authorization: token, accept: 'application/vnd.api+json' },
      }
   )
      .then((res) => res.json())
      .then((data) => {
         console.log(data);
         return data.included[0].attributes.externalLinks[0].href;
      })
      .catch((err) => console.log('failed in link', err));
};

const title = 'a moment to pivot on';
const ARTIST = 'spencer raymond';

getTidalAccessToken()
   .then((token) => getTidalLink(token, title))
   .then((link) => {
      console.log(link);
   })
   .catch((error) => console.log('top level', error));
