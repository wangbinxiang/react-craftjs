import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@craftjs/core',
  () => ({
    useNode: () => ({
      connectors: {
        connect: () => undefined,
      },
    }),
  }),
  { virtual: true }
);

vi.mock('../src/components/selectors/Text', () => ({
  Text: Object.assign(({ text }: { text?: string }) => <span>{text}</span>, {
    craft: {
      props: {
        textAlign: 'center',
      },
    },
  }),
}));

vi.mock('../src/components/selectors/Button/ButtonSettings', () => ({
  ButtonSettings: () => null,
}));

import { ProductCta } from '../src/components/selectors/ProductCta';
import { productDetail } from '../src/data/product';

afterEach(() => {
  cleanup();
});

const renderProductCta = () =>
  render(
    <ProductCta
      background={{ r: 23, g: 32, b: 51, a: 1 }}
      buttonStyle="full"
      className="product-primary-action"
      color={{ r: 255, g: 254, b: 251, a: 1 }}
      href={productDetail.ctaHref}
      margin={['0', '0', '0', '0']}
      productField="ctaLabel"
      text={productDetail.ctaLabel}
      textComponent={{
        fontSize: '13',
        fontWeight: '700',
        textAlign: 'center',
        color: { r: 255, g: 254, b: 251, a: 1 },
      }}
    />
  );

describe('ProductCta', () => {
  it('opens a purchase confirmation modal that shows the current product detail data', () => {
    renderProductCta();

    fireEvent.click(screen.getByRole('button', { name: productDetail.ctaLabel }));

    const dialog = screen.getByRole('dialog');

    expect(dialog.textContent).toContain(productDetail.name);
    expect(dialog.textContent).toContain(productDetail.price);
    expect(dialog.textContent).toContain(
      'Confirm this product selection before leaving the editor flow.'
    );
  });

  it('closes through the close button, confirm button, backdrop, and Escape key', () => {
    renderProductCta();

    const trigger = screen.getByRole('button', { name: productDetail.ctaLabel });

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(trigger);
    fireEvent.click(screen.getByTestId('product-modal-backdrop'));
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
