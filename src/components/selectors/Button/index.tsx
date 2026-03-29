import { UserComponent, useNode } from '@craftjs/core';
import cx from 'classnames';
import React from 'react';
import { styled } from 'styled-components';

import { ButtonSettings } from './ButtonSettings';

import { Text } from '../Text';

type ButtonProps = {
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

// N.B: Alias required StyledComponent props for Transient Props; https://styled-components.com/docs/api#transient-props
type StyledButtonProps = {
  $background?: Record<'r' | 'g' | 'b' | 'a', number>;
  $buttonStyle?: string;
  $margin?: any[];
};

const StyledButton = styled.button<StyledButtonProps>`
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

export const Button: UserComponent<ButtonProps> = ({
  text,
  textComponent,
  color,
  buttonStyle,
  background,
  margin,
  href,
  className,
}: ButtonProps) => {
  const {
    connectors: { connect },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <StyledButton
      as={href ? 'a' : 'button'}
      ref={(dom) => {
        connect(dom);
      }}
      className={cx([
        'rounded w-full px-4 py-2',
        className,
        {
          'shadow-lg': buttonStyle === 'full',
        },
      ])}
      href={href}
      rel={href ? 'noreferrer' : undefined}
      target={href ? '_blank' : undefined}
      $buttonStyle={buttonStyle}
      $background={background}
      $margin={margin}
    >
      {/* Reuse the Text selector so button labels inherit the same toolbar editing model as plain text nodes. */}
      <Text {...textComponent} text={text} color={color} />
    </StyledButton>
  );
};

Button.craft = {
  displayName: 'Button',
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
