export const DEVICE_PREVIEW_OPTIONS = [
  {
    key: 'desktop',
    label: 'PC 1440',
    width: 1440,
  },
  {
    key: 'tablet',
    label: '平板 1024',
    width: 1024,
  },
  {
    key: 'mobile',
    label: '手机 390',
    width: 390,
  },
] as const;

export type DevicePreviewMode = (typeof DEVICE_PREVIEW_OPTIONS)[number]['key'];

export const DEFAULT_DEVICE_PREVIEW_MODE: DevicePreviewMode = 'desktop';

export const DEVICE_PREVIEW_WIDTHS: Record<DevicePreviewMode, number> =
  DEVICE_PREVIEW_OPTIONS.reduce(
    (widthMap, option) => {
      // Keep the widths centralized so the header labels and canvas shell can never drift apart.
      widthMap[option.key] = option.width;
      return widthMap;
    },
    {} as Record<DevicePreviewMode, number>
  );
