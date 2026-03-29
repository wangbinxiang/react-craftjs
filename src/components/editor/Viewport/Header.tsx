import { useEditor } from '@craftjs/core';
import { Tooltip } from '@mui/material';
import cx from 'classnames';
import React from 'react';
import { styled } from 'styled-components';

import Checkmark from '../../../assets/icons/check.svg?react';
import Customize from '../../../assets/icons/customize.svg?react';
import RedoSvg from '../../../assets/icons/toolbox/redo.svg?react';
import UndoSvg from '../../../assets/icons/toolbox/undo.svg?react';

const HeaderDiv = styled.div`
  width: 100%;
  height: 45px;
  z-index: 99999;
  position: relative;
  padding: 0px 10px;
  background: #d4d4d4;
  display: flex;
`;

const Btn = styled.button`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 3px;
  color: #fff;
  font-size: 13px;
  border: 0;
  svg {
    margin-right: 6px;
    width: 12px;
    height: 12px;
    fill: #fff;
    opacity: 0.9;
  }
`;

const Item = styled.a<{ disabled?: boolean }>`
  margin-right: 10px;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
    fill: #707070;
  }
  ${(props) =>
    props.disabled &&
    `
    opacity:0.5;
    cursor: not-allowed;
  `}
`;

type HeaderProps = {
  previewHref: string;
  onOpenPreview: () => void;
};

export const Header = ({ previewHref, onOpenPreview }: HeaderProps) => {
  const { enabled, canUndo, canRedo, actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  return (
    <HeaderDiv className="header text-white transition w-full">
      <div className="items-center flex w-full px-4 justify-end">
        {enabled && (
          <div className="flex-1 flex">
            <Tooltip title="Undo" placement="bottom">
              <Item disabled={!canUndo} onClick={() => actions.history.undo()}>
                <UndoSvg />
              </Item>
            </Tooltip>
            <Tooltip title="Redo" placement="bottom">
              <Item disabled={!canRedo} onClick={() => actions.history.redo()}>
                <RedoSvg />
              </Item>
            </Tooltip>
          </div>
        )}
        <div className="flex">
          <Btn
            as="a"
            className="transition cursor-pointer bg-slate-700 mr-3"
            href={previewHref}
            onClick={onOpenPreview}
          >
            Preview Page
          </Btn>
          <Btn
            className={cx([
              'transition cursor-pointer',
              {
                'bg-green-400': enabled,
                'bg-primary': !enabled,
              },
            ])}
            onClick={() => {
              // Toggling the editor is the main mode switch between demo playback and live editing.
              actions.setOptions((options) => (options.enabled = !enabled));
            }}
            type="button"
          >
            {enabled ? (
              <Checkmark viewBox="-3 -3 20 20" />
            ) : (
              <Customize viewBox="2 0 16 16" />
            )}
            {enabled ? 'Finish Editing' : 'Edit'}
          </Btn>
        </div>
      </div>
    </HeaderDiv>
  );
};
