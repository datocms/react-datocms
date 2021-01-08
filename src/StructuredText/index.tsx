import {
  render,
  renderRule,
} from "datocms-structured-text-generic-html-renderer";
import {
  isBlock,
  isInlineItem,
  isItemLink,
  Record as StructuredTextGraphQlResponseRecord,
  RenderError,
  RenderResult,
  RenderRule,
  StructuredText as StructuredTextGraphQlResponse,
} from "datocms-structured-text-utils";
import React, { cloneElement, isValidElement, ReactElement } from "react";

export {
  renderRule,
  RenderError,
  StructuredTextGraphQlResponse,
  StructuredTextGraphQlResponseRecord,
};

type AdapterReturn = ReactElement | string | null;

export const defaultAdapter = {
  renderNode: React.createElement as (...args: any) => AdapterReturn,
  renderMark: React.createElement as (...args: any) => AdapterReturn,
  renderFragment: (
    children: ReactElement | null[],
    key: string
  ): AdapterReturn => <React.Fragment key={key}>{children}</React.Fragment>,
  renderText: (text: string, key: string): AdapterReturn => text,
};

export function appendKeyToValidElement(
  element: ReactElement | null,
  key: string
): ReactElement | null {
  if (isValidElement(element) && element.key === null) {
    return cloneElement(element, { key });
  }
  return element;
}

type H = typeof defaultAdapter.renderNode;
type M = typeof defaultAdapter.renderMark;
type T = typeof defaultAdapter.renderText;
type F = typeof defaultAdapter.renderFragment;

type RenderInlineRecordContext<
  R extends StructuredTextGraphQlResponseRecord
> = {
  record: R;
};

type RenderRecordLinkContext<R extends StructuredTextGraphQlResponseRecord> = {
  record: R;
  children: RenderResult<H, T, M, F>;
};

type RenderBlockContext<R extends StructuredTextGraphQlResponseRecord> = {
  record: R;
};

export type StructuredTextPropTypes<
  R extends StructuredTextGraphQlResponseRecord
> = {
  /** The actual field value you get from DatoCMS **/
  structuredText: StructuredTextGraphQlResponse<R> | null | undefined;
  /** A set of additional rules to convert the document to JSX **/
  customRules?: RenderRule<H, T, M, F>[];
  /** Fuction that converts an 'inlineItem' node into React **/
  renderInlineRecord?: (
    context: RenderInlineRecordContext<R>
  ) => ReactElement | null;
  /** Fuction that converts an 'itemLink' node into React **/
  renderLinkToRecord?: (
    context: RenderRecordLinkContext<R>
  ) => ReactElement | null;
  /** Fuction that converts a 'block' node into React **/
  renderBlock?: (context: RenderBlockContext<R>) => ReactElement | null;
  /** Fuction that converts a simple string text into React **/
  renderText?: T;
  /** React.createElement-like function to use to convert a node into React **/
  renderNode?: H;
  /** React.createElement-like function to use to convert a mark into React **/
  renderMark?: M;
  /** Function to use to generate a React.Fragment **/
  renderFragment?: F;
};

export function StructuredText<R extends StructuredTextGraphQlResponseRecord>({
  structuredText,
  renderInlineRecord,
  renderLinkToRecord,
  renderBlock,
  renderText,
  renderNode,
  renderMark,
  renderFragment,
  customRules,
}: StructuredTextPropTypes<R>): ReactElement | null {
  if (!structuredText) {
    return null;
  }

  const result = render(
    {
      renderText: renderText || defaultAdapter.renderText,
      renderNode: renderNode || defaultAdapter.renderNode,
      renderMark: renderMark || defaultAdapter.renderMark,
      renderFragment: renderFragment || defaultAdapter.renderFragment,
    },
    structuredText,
    [
      renderRule(isInlineItem, ({ node, key }) => {
        if (!renderInlineRecord) {
          throw new RenderError(
            `The Structured Text document contains an 'inlineItem' node, but no 'renderInlineRecord' prop is specified!`,
            node
          );
        }

        if (!structuredText.links) {
          throw new RenderError(
            `The Structured Text document contains an 'inlineItem' node, but .links is not present!`,
            node
          );
        }

        const item = structuredText.links.find((item) => item.id === node.item);

        if (!item) {
          throw new RenderError(
            `The Structured Text document contains an 'inlineItem' node, but cannot find a record with ID ${node.item} inside .links!`,
            node
          );
        }

        return appendKeyToValidElement(
          renderInlineRecord({ record: item }),
          key
        );
      }),
      renderRule(isItemLink, ({ node, key, children }) => {
        if (!renderLinkToRecord) {
          throw new RenderError(
            `The Structured Text document contains an 'itemLink' node, but no 'renderLinkToRecord' prop is specified!`,
            node
          );
        }

        if (!structuredText.links) {
          throw new RenderError(
            `The Structured Text document contains an 'itemLink' node, but .links is not present!`,
            node
          );
        }

        const item = structuredText.links.find((item) => item.id === node.item);

        if (!item) {
          throw new RenderError(
            `The Structured Text document contains an 'itemLink' node, but cannot find a record with ID ${node.item} inside .links!`,
            node
          );
        }

        return appendKeyToValidElement(
          renderLinkToRecord({
            record: item,
            children: (children as any) as ReturnType<F>,
          }),
          key
        );
      }),
      renderRule(isBlock, ({ node, key }) => {
        if (!renderBlock) {
          throw new RenderError(
            `The Structured Text document contains a 'block' node, but no 'renderBlock' prop is specified!`,
            node
          );
        }

        if (!structuredText.blocks) {
          throw new RenderError(
            `The Structured Text document contains a 'block' node, but .blocks is not present!`,
            node
          );
        }

        const item = structuredText.blocks.find(
          (item) => item.id === node.item
        );

        if (!item) {
          throw new RenderError(
            `The Structured Text document contains a 'block' node, but cannot find a record with ID ${node.item} inside .blocks!`,
            node
          );
        }

        return appendKeyToValidElement(renderBlock({ record: item }), key);
      }),
    ].concat(customRules || [])
  );

  return result;
}
