import React from 'react';
import { describe, expect, it } from 'vitest';

import { createDefaultLandingPage } from '../src/lib/editor-config';

type ReactNodeLike = React.ReactNode;

const flattenElements = (node: ReactNodeLike): React.ReactElement[] => {
  if (!React.isValidElement(node)) {
    return [];
  }

  const directChildren = React.Children.toArray(node.props.children).flatMap((child) =>
    flattenElements(child)
  );

  return [node, ...directChildren];
};

const findByClassName = (elements: React.ReactElement[], className: string) => {
  return elements.find((element) =>
    typeof element.props.className === 'string' &&
    element.props.className.split(/\s+/).includes(className)
  );
};

describe('landing template defaults', () => {
  it('uses content-driven heights for sections that stack on mobile', () => {
    const landingPage = createDefaultLandingPage();
    const elements = flattenElements(landingPage);

    expect(findByClassName(elements, 'landing-intro-heading')?.props.height).toBe(
      'auto'
    );
    expect(findByClassName(elements, 'landing-intro-copy')?.props.height).toBe(
      'auto'
    );
    expect(findByClassName(elements, 'landing-dark-copy')?.props.height).toBe(
      'auto'
    );
    expect(
      findByClassName(elements, 'landing-programmatic-left')?.props.height
    ).toBe('auto');
    expect(
      findByClassName(elements, 'landing-programmatic-right')?.props.height
    ).toBe('auto');
  });
});
