import type { GatsbyNode } from 'gatsby';
import path from 'path';

const ARTIST = 'Spencer Raymond';

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions }) => {
   const { createPage, createRedirect } = actions;
   const LinkPageTemplate = path.resolve('src/templates/LinkPage.tsx');

   // Query for all Sanity Releases
   const result: any = await graphql(`
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

   const mostRecentSlug: any = await graphql(`
      query {
         allSanityRelease(limit: 1, sort: { releaseDate: DESC }) {
            edges {
               node {
                  UPC
                  id
                  slug {
                     current
                  }
               }
            }
         }
      }
   `);

   //Create new pages with the data
   console.log('All Releases:\n-----');

   createRedirect({
      fromPath: '/',
      toPath: `/${mostRecentSlug.data.allSanityRelease.edges[0].node.slug.current}`,
      redirectInBrowser: true,
      isPermanent: true,
      exactPath: true,
   });

   result.data.allSanityRelease.edges.forEach((edge: any, i: any) => {
      console.log(edge.node.title);
      createPage({
         path: `${edge.node.slug.current}`,
         component: LinkPageTemplate,
         context: {
            title: edge.node.title,
            releaseDate: edge.node.releaseDate,
            albumArt: edge.node.albumArt.asset.gatsbyImageData,
            palette: edge.node.albumArt.asset.metadata.palette.muted.background,
            artist: ARTIST,
            links: [
               {
                  url: edge.node.links.appleMusic,
                  name: 'Apple Music',
               },
               {
                  url: edge.node.links.spotify,
                  name: 'Spotify',
               },
               {
                  url: edge.node.links.tidal,
                  name: 'Tidal',
               },
               {
                  url: edge.node.links.youtube,
                  name: 'Youtube',
               },
               {
                  url: edge.node.links.soundcloud,
                  name: 'Soundcloud',
               },
               {
                  url: edge.node.links.bandcamp,
                  name: 'Bandcamp',
               },
            ],
         },
      });
   });
};
