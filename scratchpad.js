const ARTIST = 'Spencer Raymond';

process.env = {
   SPOTIFY_CLIENT_ID: '05d7147e20004ce082233ebb9f2597d6',
   SPOTIFY_SECRET: 'da65aa850d5b4fd8a7f39b6cbb99fc37',
   TIDAL_CLIENT_ID: '9qkNDbW9CQhJcVvI',
   TIDAL_SECRET: 'SJyoqEY1Gl0ZjXDLkvGPFafJRztdIcIfTropsUdrSlQ=',
   YOUTUBE_API_KEY: 'AIzaSyC9VD_CtVMvarOVJU66nrChMT_ogo0WHjM',
};

const getStreamLinks = async (upc, overrideLinks, title) => {
   //fill links with override links if they exist. otherwise fetch link from service
   const links = {
      spotify: overrideLinks?.spotify
         ? overrideLinks.spotify
         : await getSpotifyAccessToken()
              .then((token) => getSpotifyLink(token, upc).then((link) => link))
              .catch((error) => console.error(error)),
      appleMusic: overrideLinks?.appleMusic
         ? overrideLinks.appleMusic
         : await getAppleMusicLink(upc)
              .then((link) => link)
              .catch((err) => console.error(err)),
      tidal: overrideLinks?.tidal
         ? overrideLinks.tidal
         : await getTidalAccessToken()
              .then((token) => getTidalLink(token, upc).then((link) => link))
              .catch((error) => console.error(error)),
      youtube: overrideLinks?.youtube
         ? overrideLinks.youtube
         : await getYoutubeLink(title)
              .then((link) => link)
              .catch((err) => console.error(err)),
   };

   getYoutubeLink(title);
   return links;
};

//API Authorisation calls

const getSpotifyAccessToken = async () => {
   return await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_SECRET}`,
   })
      .then((res) => res.json())
      .then((data) => `${data.token_type} ${data.access_token}`);
};

const getTidalAccessToken = async () => {
   return await fetch('https://auth.tidal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
         Authorization: `Basic ${Buffer.from(`${process.env.TIDAL_CLIENT_ID}:${process.env.TIDAL_SECRET}`).toString(
            'base64'
         )}`,
         'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials`,
   })
      .then((res) => res.json())
      .then((data) => {
         return `${data.token_type} ${data.access_token}`;
      });
};

//API URL fetch calls

const getSpotifyLink = async (token, upc) => {
   return await fetch(`https://api.spotify.com/v1/search?q=upc%3A${upc}&type=album&limit=1`, {
      headers: { Authorization: token },
   })
      .then((res) => res.json())
      .then((data) => data.albums.items[0].external_urls.spotify);
};

const getAppleMusicLink = async (upc) => {
   return await fetch(`https://itunes.apple.com/lookup?upc=${upc}`)
      .then((res) => res.json())
      .then((data) => data.results[0].collectionViewUrl);
};

const getTidalLink = async (token, upc) => {
   return await fetch(`https://openapi.tidal.com/v2/albums?countryCode=US&filter%5BbarcodeId%5D=${upc}`, {
      headers: { Authorization: token, accept: 'application/vnd.api+json' },
   })
      .then((res) => {
         return res.json();
      })
      .then((data) => {
         return data.data[0].attributes.externalLinks[0].href;
      })
      .catch((err) => console.log('failed on fetch: ', err));
};

const getYoutubeLink = async (title) => {
   return await fetch(
      `https://www.googleapis.com/youtube/v3/search?q=${ARTIST} ${title}&key=${process.env.YOUTUBE_API_KEY}`
   )
      .then((res) => res.json())
      .then((data) => `https://youtube.com/watch?v=${data.items[0].id.videoId}`);
};

const UPC = '643709107153';
const links = {};
const title = 'A Moment To Pivot On (Deluxe)';

getStreamLinks(UPC, links, title).then((links) => {
   console.log(links);
});
