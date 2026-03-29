import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockUndo = vi.fn();
const mockRedo = vi.fn();

let mockEnabled = true;
let mockCanUndo = true;
let mockCanRedo = true;

vi.mock(
  '@craftjs/core',
  () => ({
    useEditor: (selector: (state: unknown, query: unknown) => unknown) =>
      ({
        ...selector(
          {
            options: {
              enabled: mockEnabled,
            },
          },
          {
            history: {
              canUndo: () => mockCanUndo,
              canRedo: () => mockCanRedo,
            },
          }
        ),
        actions: {
          history: {
            undo: mockUndo,
            redo: mockRedo,
          },
          setOptions: () => undefined,
        },
      }) as unknown,
  }),
  { virtual: true }
);

vi.mock('../../../src/assets/icons/check.svg?react', () => ({
  default: () => <svg aria-hidden="true" />,
}));

vi.mock('../../../src/assets/icons/customize.svg?react', () => ({
  default: () => <svg aria-hidden="true" />,
}));

vi.mock('../../../src/assets/icons/toolbox/redo.svg?react', () => ({
  default: () => <svg aria-hidden="true" />,
}));

vi.mock('../../../src/assets/icons/toolbox/undo.svg?react', () => ({
  default: () => <svg aria-hidden="true" />,
}));

vi.mock('@mui/material', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { Header } from '../src/components/editor/Viewport/Header';

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  mockUndo.mockReset();
  mockRedo.mockReset();
  mockEnabled = true;
  mockCanUndo = true;
  mockCanRedo = true;
});

describe('editor history keyboard shortcuts', () => {
  it('dispatches undo on Meta+Z and Ctrl+Z while editing is enabled', () => {
    render(
      <Header
        deviceMode="desktop"
        onChangeDeviceMode={() => {}}
        onOpenPreview={() => {}}
        previewHref="/preview/home"
      />
    );

    fireEvent.keyDown(window, { key: 'z', metaKey: true });
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });

    expect(mockUndo).toHaveBeenCalledTimes(2);
  });

  it('dispatches redo on Meta+Shift+Z and Ctrl+Y while editing is enabled', () => {
    render(
      <Header
        deviceMode="desktop"
        onChangeDeviceMode={() => {}}
        onOpenPreview={() => {}}
        previewHref="/preview/home"
      />
    );

    fireEvent.keyDown(window, { key: 'z', metaKey: true, shiftKey: true });
    fireEvent.keyDown(window, { key: 'y', ctrlKey: true });

    expect(mockRedo).toHaveBeenCalledTimes(2);
  });

  it('does not hijack undo while the user is typing in a text field', () => {
    render(
      <>
        <input aria-label="Title" />
        <Header
          deviceMode="desktop"
          onChangeDeviceMode={() => {}}
          onOpenPreview={() => {}}
          previewHref="/preview/home"
        />
      </>
    );

    const input = screen.getByLabelText('Title');
    input.focus();

    fireEvent.keyDown(input, { key: 'z', metaKey: true });

    expect(mockUndo).not.toHaveBeenCalled();
  });
});
