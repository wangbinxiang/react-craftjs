import React from 'react';

import { ImageSettings } from './ImageSettings';

import { Resizer } from '../Resizer';

export type ImageProps = {
  src: string;
  alt: string;
  width: string;
  height: string;
  objectFit: 'cover' | 'contain';
  margin: string[];
  radius: number;
  className?: string;
  productField?: 'heroImage';
};

const defaultProps: ImageProps = {
  src: '',
  alt: 'Case study image',
  width: '100%',
  height: '360px',
  objectFit: 'cover',
  margin: ['0', '0', '0', '0'],
  radius: 24,
  className: '',
};

export const Image = (props: Partial<ImageProps>) => {
  const mergedProps = {
    ...defaultProps,
    ...props,
  };
  const {
    src,
    alt,
    objectFit,
    margin,
    radius,
    className,
  } = mergedProps;
  return (
    <Resizer
      propKey={{ width: 'width', height: 'height' }}
      className={className}
      style={{
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        overflow: 'hidden',
        borderRadius: `${radius}px`,
        background: '#ebe7e1',
      }}
    >
      {src ? (
        <img
          alt={alt || defaultProps.alt}
          src={src}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit,
          }}
        />
      ) : (
        <div
          aria-label={alt || defaultProps.alt}
          className="flex h-full min-h-[220px] w-full items-center justify-center border border-dashed border-slate-400 bg-[#f6f2eb] px-6 text-center text-sm uppercase tracking-[0.2em] text-slate-500"
        >
          Add image source
        </div>
      )}
    </Resizer>
  );
};

Image.craft = {
  displayName: 'Image',
  props: defaultProps,
  related: {
    toolbar: ImageSettings,
  },
};
