import {
  RenderMarkRule,
  TransformMetaFn,
  TransformedMeta,
  defaultMetaTransformer,
  render,
  renderMarkRule,
  renderNodeRule,
} from 'datocms-structured-text-generic-html-renderer';
import {
  Document as StructuredTextDocument,
  Node,
  Record as StructuredTextGraphQlResponseRecord,
  RenderError,
  RenderResult,
  RenderRule,
  StructuredText as StructuredTextGraphQlResponse,
  isBlock,
  isInlineItem,
  isItemLink,
  isStructuredText,
} from 'datocms-structured-text-utils';
import React, { ReactElement, cloneElement, isValidElement } from 'react';

export { renderNodeRule, renderMarkRule, RenderError };

// deprecated
export { renderNodeRule as renderRule };

export type {
  StructuredTextGraphQlResponse,
  StructuredTextDocument,
  StructuredTextGraphQlResponseRecord,
};

type AdapterReturn = ReactElement | string | null;

export const defaultAdapter = {
  renderNode: React.createElement as (...args: any) => AdapterReturn,
  renderFragment: (
    children: ReactElement | null[],
    key: string,
  ): AdapterReturn => <React.Fragment key={key}>{children}</React.Fragment>,
  renderText: (text: string, key: string): AdapterReturn => text,
};

export function appendKeyToValidElement(
  element: ReactElement | null,
  key: string,
): ReactElement | null {
  if (isValidElement(element) && element.key === null) {
    return cloneElement(element, { key });
  }
  return element;
}

type H = typeof defaultAdapter.renderNode;
type T = typeof defaultAdapter.renderText;
type F = typeof defaultAdapter.renderFragment;

export type RenderInlineRecordContext<
  R extends StructuredTextGraphQlResponseRecord,
> = {
  record: R;
};

export type RenderRecordLinkContext<
  R extends StructuredTextGraphQlResponseRecord,
> = {
  record: R;
  children: RenderResult<H, T, F>;
  transformedMeta: TransformedMeta;
};

export type RenderBlockContext<R extends StructuredTextGraphQlResponseRecord> =
  {
    record: R;
  };

export type StructuredTextPropTypes<
  R1 extends StructuredTextGraphQlResponseRecord,
  R2 extends StructuredTextGraphQlResponseRecord = R1,
> = {
  /** The actual field value you get from DatoCMS **/
  data:
    | StructuredTextGraphQlResponse<R1, R2>
    | StructuredTextDocument
    | Node
    | null
    | undefined;
  /** A set of additional rules to convert nodes to JSX **/
  customNodeRules?: RenderRule<H, T, F>[];
  /** A set of additional rules to convert marks to JSX **/
  customMarkRules?: RenderMarkRule<H, T, F>[];
  /** Fuction that converts an 'inlineItem' node into React **/
  renderInlineRecord?: (
    context: RenderInlineRecordContext<R2>,
  ) => ReactElement | null;
  /** Fuction that converts an 'itemLink' node into React **/
  renderLinkToRecord?: (
    context: RenderRecordLinkContext<R2>,
  ) => ReactElement | null;
  /** Fuction that converts a 'block' node into React **/
  renderBlock?: (context: RenderBlockContext<R1>) => ReactElement | null;
  /** Function that converts 'link' and 'itemLink' `meta` into HTML props */
  metaTransformer?: TransformMetaFn;
  /** Fuction that converts a simple string text into React **/
  renderText?: T;
  /** React.createElement-like function to use to convert a node into React **/
  renderNode?: H;
  /** Function to use to generate a React.Fragment **/
  renderFragment?: F;
  /** @deprecated use customNodeRules **/
  customRules?: RenderRule<H, T, F>[];
};

export function StructuredText<
  R1 extends StructuredTextGraphQlResponseRecord,
  R2 extends StructuredTextGraphQlResponseRecord = R1,
>({
  data,
  renderInlineRecord,
  renderLinkToRecord,
  renderBlock,
  renderText,
  renderNode,
  renderFragment,
  customMarkRules,
  customRules,
  customNodeRules,
  metaTransformer,
}: StructuredTextPropTypes<R1, R2>): ReactElement | null {
  const result = render(data, {
    adapter: {
      renderText: renderText || defaultAdapter.renderText,
      renderNode: renderNode || defaultAdapter.renderNode,
      renderFragment: renderFragment || defaultAdapter.renderFragment,
    },
    metaTransformer,
    customMarkRules,
    customNodeRules: [
      renderNodeRule(isInlineItem, ({ node, key }) => {
        if (!renderInlineRecord) {
          throw new RenderError(
            `The Structured Text document contains an 'inlineItem' node, but no 'renderInlineRecord' prop is specified!`,
            node,
          );
        }

        if (!(isStructuredText(data) && data.links)) {
          throw new RenderError(
            `The document contains an 'itemLink' node, but the passed data prop is not a Structured Text GraphQL response, or data.links is not present!`,
            node,
          );
        }

        const item = data.links.find((item) => item.id === node.item);

        if (!item) {
          throw new RenderError(
            `The Structured Text document contains an 'inlineItem' node, but cannot find a record with ID ${node.item} inside data.links!`,
            node,
          );
        }

        return appendKeyToValidElement(
          renderInlineRecord({ record: item }),
          key,
        );
      }),
      renderNodeRule(isItemLink, ({ node, key, children }) => {
        if (!renderLinkToRecord) {
          throw new RenderError(
            `The Structured Text document contains an 'itemLink' node, but no 'renderLinkToRecord' prop is specified!`,
            node,
          );
        }

        if (!(isStructuredText(data) && data.links)) {
          throw new RenderError(
            `The document contains an 'itemLink' node, but the passed data prop is not a Structured Text GraphQL response, or data.links is not present!`,
            node,
          );
        }

        const item = data.links.find((item) => item.id === node.item);

        if (!item) {
          throw new RenderError(
            `The Structured Text document contains an 'itemLink' node, but cannot find a record with ID ${node.item} inside data.links!`,
            node,
          );
        }

        return appendKeyToValidElement(
          renderLinkToRecord({
            record: item,
            children: children as any as ReturnType<F>,
            transformedMeta: node.meta
              ? (metaTransformer || defaultMetaTransformer)({
                  node,
                  meta: node.meta,
                })
              : null,
          }),
          key,
        );
      }),
      renderNodeRule(isBlock, ({ node, key }) => {
        if (!renderBlock) {
          throw new RenderError(
            `The Structured Text document contains a 'block' node, but no 'renderBlock' prop is specified!`,
            node,
          );
        }

        if (!(isStructuredText(data) && data.blocks)) {
          throw new RenderError(
            `The document contains an 'block' node, but the passed data prop is not a Structured Text GraphQL response, or data.blocks is not present!`,
            node,
          );
        }

        const item = data.blocks.find((item) => item.id === node.item);

        if (!item) {
          throw new RenderError(
            `The Structured Text document contains a 'block' node, but cannot find a record with ID ${node.item} inside data.blocks!`,
            node,
          );
        }

        return appendKeyToValidElement(renderBlock({ record: item }), key);
      }),
      ...(customNodeRules || customRules || []),
    ],
  });

  if (typeof result === 'string') {
    return <>{result}</>;
  }

  return result || null;
}
