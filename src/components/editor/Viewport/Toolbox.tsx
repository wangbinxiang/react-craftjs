import { Element, useEditor } from '@craftjs/core';
import { Tooltip } from '@mui/material';
import React from 'react';
import { styled } from 'styled-components';

import ButtonSvg from '../../../assets/icons/toolbox/button.svg?react';
import ImageSvg from '../../../assets/icons/toolbox/image.svg?react';
import SquareSvg from '../../../assets/icons/toolbox/rectangle.svg?react';
import TypeSvg from '../../../assets/icons/toolbox/text.svg?react';
import YoutubeSvg from '../../../assets/icons/toolbox/video-line.svg?react';
import CaseDetailSurface from '../../../assets/images/case-detail-surface.svg?url';
import { Button } from '../../selectors/Button';
import { Container } from '../../selectors/Container';
import { Image } from '../../selectors/Image';
import { Text } from '../../selectors/Text';
import { Video } from '../../selectors/Video';

const ToolboxDiv = styled.div<{ $enabled: boolean }>`
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  ${(props) => (!props.$enabled ? `width: 0;` : '')}
  ${(props) => (!props.$enabled ? `opacity: 0;` : '')}
`;

const Item = styled.a<{ $move?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #707070;

  svg {
    width: 28px;
    height: 28px;
    fill: #707070;
  }
  ${(props) =>
    props.$move &&
    `
    cursor: move;
  `}
`;

export const Toolbox = () => {
  const {
    enabled,
    connectors: { create },
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <ToolboxDiv
      $enabled={enabled && enabled}
      className="toolbox transition w-12 h-full flex flex-col bg-white"
    >
      <div className="flex flex-1 flex-col items-center pt-3 gap-3">
        <div
          ref={(ref) => {
            // Each toolbox item seeds Craft with a concrete node instance users can drag into the frame.
            create(
              ref,
              <Element
                canvas
                is={Container}
                background={{ r: 78, g: 78, b: 78, a: 1 }}
                color={{ r: 0, g: 0, b: 0, a: 1 }}
                height="300px"
                width="300px"
              ></Element>
            );
          }}
        >
          <Tooltip title="Container" placement="right">
            <Item $move>
              <SquareSvg viewBox="-3 -3 24 24" />
            </Item>
          </Tooltip>
        </div>
        <div
          ref={(ref) => {
            create(
              ref,
              <Text fontSize="12" textAlign="left" text="Hi there" />
            );
          }}
        >
          <Tooltip title="Text" placement="right">
            <Item $move>
              <TypeSvg viewBox="-3 -3 28 28" />
            </Item>
          </Tooltip>
        </div>
        <div
          ref={(ref) => {
            create(ref, <Button />);
          }}
        >
          <Tooltip title="Button" placement="right">
            <Item $move>
              <ButtonSvg viewBox="-4 -3 24 24" />
            </Item>
          </Tooltip>
        </div>
        <div
          ref={(ref) => {
            // Seed media nodes with a valid source so preview immediately demonstrates image serialization.
            create(ref, <Image alt="Case study media" src={CaseDetailSurface} />);
          }}
        >
          <Tooltip title="Image" placement="right">
            <Item $move>
              <ImageSvg viewBox="-3 -3 28 28" />
            </Item>
          </Tooltip>
        </div>
        <div
          ref={(ref) => {
            create(ref, <Video />);
          }}
        >
          <Tooltip title="Video" placement="right">
            <Item $move>
              <YoutubeSvg viewBox="-3 -3 28 28" />
            </Item>
          </Tooltip>
        </div>
      </div>
    </ToolboxDiv>
  );
};
