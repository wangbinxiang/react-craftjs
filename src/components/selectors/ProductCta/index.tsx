import { UserComponent, useNode } from '@craftjs/core';
import cx from 'classnames';
import React from 'react';
import { styled } from 'styled-components';

import { ButtonSettings } from '../Button/ButtonSettings';
import { Text } from '../Text';
import { productDetail } from '../../../data/product';

export type ProductCtaProps = {
  background?: Record<'r' | 'g' | 'b' | 'a', number>;
  color?: Record<'r' | 'g' | 'b' | 'a', number>;
  buttonStyle?: string;
  margin?: any[];
  text?: string;
  textComponent?: any;
  href?: string;
  className?: string;
  productField?: 'ctaLabel';
};

type StyledProductCtaProps = {
  $background?: Record<'r' | 'g' | 'b' | 'a', number>;
  $buttonStyle?: string;
  $margin?: any[];
};

const StyledProductCta = styled.button<StyledProductCtaProps>`
  background: ${(props) =>
    props.$buttonStyle === 'full'
      ? `rgba(${Object.values(props.$background)})`
      : 'transparent'};
  border: 2px solid transparent;
  border-color: ${(props) =>
    props.$buttonStyle === 'outline'
      ? `rgba(${Object.values(props.$background)})`
      : 'transparent'};
  margin: ${({ $margin }) =>
    `${$margin[0]}px ${$margin[1]}px ${$margin[2]}px ${$margin[3]}px`};
`;

export const ProductCta: UserComponent<ProductCtaProps> = ({
  text,
  textComponent,
  color,
  buttonStyle,
  background,
  margin,
  className,
}: ProductCtaProps) => {
  const {
    connectors: { connect },
  } = useNode();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    // Preview and editor both render this selector, so Escape handling stays local instead of leaking into page state.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  const openModal = React.useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <StyledProductCta
        ref={(dom) => {
          // Keep the connector on the interactive CTA itself so editor selection still works when the modal is enabled.
          connect(dom);
        }}
        className={cx([
          'rounded w-full px-4 py-2',
          className,
          {
            'shadow-lg': buttonStyle === 'full',
          },
        ])}
        type="button"
        // The saved CTA still carries href for backward compatibility, but purchase confirmation owns the primary action now.
        onClick={openModal}
        $buttonStyle={buttonStyle}
        $background={background}
        $margin={margin}
      >
        <Text {...textComponent} text={text} color={color} />
      </StyledProductCta>

      {isModalOpen ? (
        <div
          className="product-modal-backdrop"
          data-testid="product-modal-backdrop"
          onClick={closeModal}
        >
          <div
            aria-labelledby="product-modal-title"
            aria-modal="true"
            className="product-modal-dialog"
            role="dialog"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="product-modal-header">
              <p className="product-modal-eyebrow">Purchase Confirmation</p>
              <button
                aria-label="Dismiss"
                className="product-modal-close"
                type="button"
                onClick={closeModal}
              >
                Dismiss
              </button>
            </div>

            <div className="product-modal-copy">
              <h3 className="product-modal-title" id="product-modal-title">
                {productDetail.name}
              </h3>
              <p className="product-modal-price">{productDetail.price}</p>
              <p className="product-modal-description">
                Confirm this product selection before leaving the editor flow.
              </p>
            </div>

            <div className="product-modal-actions">
              <button
                className="product-secondary-action product-modal-secondary"
                type="button"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="product-primary-action product-modal-primary"
                type="button"
                // Confirm is intentionally side-effect free for now so editor and preview can share the same interaction contract.
                onClick={closeModal}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

ProductCta.craft = {
  displayName: 'ProductCta',
  props: {
    background: { r: 255, g: 255, b: 255, a: 0.5 },
    color: { r: 92, g: 90, b: 90, a: 1 },
    buttonStyle: 'full',
    text: 'Button',
    href: '',
    margin: ['5', '0', '5', '0'],
    textComponent: {
      ...Text.craft.props,
      textAlign: 'center',
    },
  },
  related: {
    toolbar: ButtonSettings,
  },
};
