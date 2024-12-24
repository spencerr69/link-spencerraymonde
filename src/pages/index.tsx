import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';

const IndexPage: React.FC<PageProps> = () => {
   React.useEffect(() => {
      location.reload();
   });

   const handleMouse = (e: any) => {
      location.reload();
   };

   return (
      <div onMouseMove={handleMouse} style={{ width: '100vw', height: '100vh' }}>
         redirecting... reload if this takes too long :3
      </div>
   );
};

export default IndexPage;

export const Head: HeadFC = () => <title></title>;
