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

const adapter = {
  renderNode: React.createElement as (...args: any) => ReactElement | null,
  renderMark: React.createElement as (...args: any) => ReactElement | null,
  renderFragment: (children: ReactElement | null[]) => (
    <React.Fragment>{children}</React.Fragment>
  ),
  renderText: (text: string) => text,
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

type H = typeof adapter.renderNode;
type T = typeof adapter.renderText;
type F = typeof adapter.renderFragment;

type RenderInlineRecordContext<
  R extends StructuredTextGraphQlResponseRecord
> = {
  record: R;
};

type RenderRecordLinkContext<R extends StructuredTextGraphQlResponseRecord> = {
  record: R;
  children: RenderResult<H, T, H, F>;
};

type RenderBlockContext<R extends StructuredTextGraphQlResponseRecord> = {
  record: R;
};

export type StructuredTextPropTypes<
  R extends StructuredTextGraphQlResponseRecord
> = {
  structuredText: StructuredTextGraphQlResponse<R> | null | undefined;
  customRules?: RenderRule<H, T, H, F>[];
  renderInlineRecord?: (
    context: RenderInlineRecordContext<R>
  ) => ReactElement | null;
  renderLinkToRecord?: (
    context: RenderRecordLinkContext<R>
  ) => ReactElement | null;
  renderBlock?: (context: RenderBlockContext<R>) => ReactElement | null;
};

export function StructuredText<R extends StructuredTextGraphQlResponseRecord>({
  structuredText,
  customRules,
  renderInlineRecord,
  renderLinkToRecord,
  renderBlock,
}: StructuredTextPropTypes<R>): ReactElement | null {
  if (!structuredText) {
    return null;
  }

  const result = render<R, H, T, H, F>(
    adapter,
    structuredText,
    [
      renderRule(isInlineItem, ({ node, key }) => {
        if (!renderInlineRecord) {
          throw new RenderError(
            `The Structured Text document contains an 'inlineItem' node, but no 'renderInlineRecord' prop is specified!`,
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

  return result as ReturnType<F>;
}
