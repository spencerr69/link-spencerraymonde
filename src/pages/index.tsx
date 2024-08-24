import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { LinkPage } from '../templates/LinkPage';

const IndexPage: React.FC<PageProps> = () => {
   return <LinkPage />;
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
