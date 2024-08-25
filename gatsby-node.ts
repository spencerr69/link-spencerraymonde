import type { GatsbyNode } from 'gatsby';
import path from 'path';
import { graphql } from 'gatsby';

const ARTIST = 'Spencer Raymond';

export const createPages = async ({ graphql, actions }: { graphql: any; actions: any }) => {
   const { createPage } = actions;
   const LinkPageTemplate = path.resolve('templates/LinkPage.tsx');

   // Query for all Sanity Releases
   const result = await graphql(`
      query {
         allSanityRelease {
            edges {
               node {
                  slug {
                     current
                  }
                  UPC
                  title
                  releaseDate
                  albumArt {
                     asset {
                        gatsbyImageData(width: 1000, height: 1000, placeholder: BLURRED)
                        metadata {
                           palette {
                              muted {
                                 background
                              }
                           }
                        }
                     }
                  }
                  links {
                     appleMusic
                     bandcamp
                     soundcloud
                     spotify
                     tidal
                     youtube
                  }
               }
            }
         }
      }
   `);

   if (result.errors) {
      console.log(result.errors);
      return;
   }

   //Create new pages with the data
   result.data.allSanityRelease.edges.forEach((edge: any) => {
      const linksPromise = getStreamLinks(edge.node.UPC, edge.node.links, edge.node.title);
      linksPromise.then((links) => console.log(links));
   });
};

type StreamLinks = {
   appleMusic?: string;
   bandcamp?: string;
   soundcloud?: string;
   spotify?: string;
   tidal?: string;
   youtube?: string;
};

/**
 * getStreamLinks - async, Gets links for a release.
 * @param upc UPC of the release to get links for.
 * @param overrideLinks Links to override search results with.
 * @returns Promise for links for the release.
 */
const getStreamLinks = async (
   upc: string,
   overrideLinks: StreamLinks | undefined,
   title: string
): Promise<StreamLinks> => {
   //fill links with override links if they exist. otherwise fetch link from service
   const links: StreamLinks = {
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
              .then((token) => getTidalLink(token, title))
              .then((link) => link)
              .catch((error) => console.log('top level', error)),
   };

   return links;
};

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

const getSpotifyLink = async (token: string, upc: string) => {
   return await fetch(`https://api.spotify.com/v1/search?q=upc%3A${upc}&type=album&limit=1`, {
      headers: { Authorization: token },
   })
      .then((res) => res.json())
      .then((data) => data.albums.items[0].external_urls.spotify);
};

const getAppleMusicLink = async (upc: string) => {
   return await fetch(`https://itunes.apple.com/lookup?upc=${upc}`)
      .then((res) => res.json())
      .then((data) => data.results[0].collectionViewUrl);
};

const getTidalLink = async (token: string, title: string) => {
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
      });
};
