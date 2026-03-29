import { describe, expect, it } from 'vitest';

import { shouldPersistPreviewFrame } from '../src/utils/preview';

describe('editor persistence gate', () => {
  it('only saves when leaving edit mode', () => {
    expect(
      shouldPersistPreviewFrame({ previousEnabled: false, nextEnabled: true })
    ).toBe(false);
    expect(
      shouldPersistPreviewFrame({ previousEnabled: true, nextEnabled: true })
    ).toBe(false);
    expect(
      shouldPersistPreviewFrame({ previousEnabled: false, nextEnabled: false })
    ).toBe(false);
    expect(
      shouldPersistPreviewFrame({ previousEnabled: true, nextEnabled: false })
    ).toBe(true);
  });
});
