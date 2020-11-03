import styled, { createGlobalStyle } from "styled-components";
import { Image } from "react-datocms";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  body {
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
    line-height: 1.5;
    color: #333;
  }
`;

export const Root = styled.div`
  max-width: 750px;
  margin: 0 auto 3em;
`;

export const AppTitle = styled.div`
  font-size: 3em;
  font-weight: bold;
`;

export const AppSubtitle = styled.div`
  margin-bottom: 4em;
`;

export const BlogPost = styled.article`
  padding-bottom: 3em;
  border-bottom: 1px solid #eee;
  margin-bottom: 3em;
`;

export const BlogPostTitle = styled.h6`
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 0.5em;

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const BlogPostExcerpt = styled.div`
  font-size: 0.9em;
  color: #666;
`;

export const BlogPostImage = styled(Image)`
  margin-bottom: 2em;
  border-radius: 3px;
`;

export const BlogPostAuthor = styled.footer`
  display: flex;
  align-items: center;
  font-size: 0.9em;
  margin-top: 1.5em;
  color: #666;
`;

export const BlogPostAuthorImage = styled(Image)`
  border-radius: 50%;
  margin-right: 15px;
  width: 40px;
`;

export const SeoInspect = styled.pre`
  background: #f5f5f5;
  border-radius: 3px;
  padding: 25px;
  overflow: auto;
  font-size: 11px;
  margin-bottom: 8em;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
    monospace;
`;
