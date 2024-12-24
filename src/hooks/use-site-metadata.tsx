import { graphql, useStaticQuery } from 'gatsby';

export const useSiteMetadata = () => {
   const data = useStaticQuery(graphql`
      query {
         sanitySiteSettings {
            description
            title
         }
      }
   `);

   return data.sanitySiteSettings;
};
