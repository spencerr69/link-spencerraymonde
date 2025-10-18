import type { GatsbyConfig } from 'gatsby';

require('dotenv').config({
    path: `.env`,
});

const config: GatsbyConfig = {
    siteMetadata: {
        title: `link-spencerraymonde`,
        siteUrl: `https://link.spencerraymon.de`,
    },
    // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
    // If you use VSCode you can also use the GraphQL plugin
    // Learn more at: https://gatsby.dev/graphql-typegen
    graphqlTypegen: true,
    plugins: [
        'gatsby-plugin-sass',
        {
            resolve: 'gatsby-source-sanity',
            options: { projectId: 'gtllxo8k', dataset: 'production' },
        },
        'gatsby-plugin-image',
        {
            resolve: `gatsby-plugin-posthog`,
            options: {
                // Specify the API key for your Posthog Project (required)
                apiKey: process.env.VITE_PUBLIC_POSTHOG_KEY,
                // Specify the app host if self-hosting (optional, default: https://app.posthog.com)
                apiHost: process.env.VITE_PUBLIC_POSTHOG_HOST,
                // Puts tracking script in the head instead of the body (optional, default: true)
                head: true,
                // Enable posthog analytics tracking during development (optional, default: false)
                isEnabledDevMode: true
            },
        },
    ],
};

export default config;
