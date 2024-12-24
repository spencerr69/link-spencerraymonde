import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';

const IndexPage: React.FC<PageProps> = () => {
   React.useEffect(() => {
      console.log('get outta here!');
      location.reload();
   });

   const handleMouse = (e: any) => {
      location.reload();
   };

   return <div onMouseMove={handleMouse}>redirecting... reload if this takes too long :3</div>;
};

export default IndexPage;

export const Head: HeadFC = () => <title></title>;
