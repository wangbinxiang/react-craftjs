import { useEditor } from '@craftjs/core';
import { Tooltip } from '@mui/material';
import cx from 'classnames';
import React from 'react';
import { styled } from 'styled-components';

import Checkmark from '../../../assets/icons/check.svg?react';
import Customize from '../../../assets/icons/customize.svg?react';
import RedoSvg from '../../../assets/icons/toolbox/redo.svg?react';
import UndoSvg from '../../../assets/icons/toolbox/undo.svg?react';
import {
  DEVICE_PREVIEW_OPTIONS,
  type DevicePreviewMode,
} from './devicePreview';

const isEditableElement = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tagName = target.tagName.toLowerCase();

  return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
};

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

const DeviceGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 12px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.48);
`;

const DeviceButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border: 0;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: ${(props) => (props.$active ? '#ffffff' : '#475569')};
  background: ${(props) => (props.$active ? '#1e293b' : 'transparent')};
  cursor: pointer;
  transition: background 180ms ease, color 180ms ease;
`;

type HeaderProps = {
  deviceMode: DevicePreviewMode;
  onChangeDeviceMode: (mode: DevicePreviewMode) => void;
  previewHref: string;
  onOpenPreview: () => void;
};

export const Header = ({
  deviceMode,
  onChangeDeviceMode,
  previewHref,
  onOpenPreview,
}: HeaderProps) => {
  const { enabled, canUndo, canRedo, actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  React.useEffect(() => {
    if (typeof window === 'undefined' || !enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableElement(event.target)) {
        return;
      }

      // Mirror native editor expectations on macOS and Windows while leaving text-field undo to the browser.
      const isUndoShortcut =
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        !event.altKey &&
        event.key.toLowerCase() === 'z';
      const isRedoShortcut =
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        ((event.shiftKey && event.key.toLowerCase() === 'z') ||
          (!event.metaKey && !event.shiftKey && event.key.toLowerCase() === 'y'));

      if (isUndoShortcut && canUndo) {
        event.preventDefault();
        actions.history.undo();
      }

      if (isRedoShortcut && canRedo) {
        event.preventDefault();
        actions.history.redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [actions, canRedo, canUndo, enabled]);

  return (
    <HeaderDiv className="header text-white transition w-full">
      <div className="items-center flex w-full px-4">
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
        {!enabled && <div className="flex-1" />}
        <div className="flex items-center">
          <DeviceGroup aria-label="Device preview mode">
            {DEVICE_PREVIEW_OPTIONS.map((option) => (
              <DeviceButton
                $active={deviceMode === option.key}
                aria-pressed={deviceMode === option.key}
                key={option.key}
                onClick={() => {
                  // Device switching only changes the editor shell width and must not touch persisted page content.
                  onChangeDeviceMode(option.key);
                }}
                type="button"
              >
                {option.label}
              </DeviceButton>
            ))}
          </DeviceGroup>
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
