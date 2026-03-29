type SerializedNodeLike = {
  type?: {
    resolvedName?: string;
  };
  displayName?: string;
  custom?: {
    displayName?: string;
  };
  parent?: string | null;
  props?: Record<string, unknown>;
};

type SerializedNodesLike = Record<string, SerializedNodeLike>;

const isSerializedNodesLike = (value: unknown): value is SerializedNodesLike => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((entry) => {
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
      return false;
    }

    return 'props' in entry;
  });
};

const getNodeName = (node: SerializedNodeLike | undefined) => {
  if (!node) {
    return '';
  }

  return typeof node.custom?.displayName === 'string' && node.custom.displayName
    ? node.custom.displayName
    : node.displayName ?? '';
};

const appendClassName = (existingValue: unknown, nextClassName: string) => {
  const classNames = new Set(
    typeof existingValue === 'string'
      ? existingValue.split(/\s+/).filter(Boolean)
      : []
  );

  nextClassName
    .split(/\s+/)
    .filter(Boolean)
    .forEach((className) => classNames.add(className));

  return Array.from(classNames).join(' ');
};

const addNodeClassName = (node: SerializedNodeLike, nextClassName: string) => {
  if (!node.props) {
    return;
  }

  node.props.className = appendClassName(node.props.className, nextClassName);
};

const setNodeProp = (
  node: SerializedNodeLike,
  propName: string,
  propValue: unknown
) => {
  if (!node.props) {
    return;
  }

  // Legacy landing saves need the same mobile-safe sizing defaults as the new template tree.
  node.props[propName] = propValue;
};

const isLegacyLandingTree = (nodes: SerializedNodesLike) => {
  const rootNode = nodes.ROOT;

  if (getNodeName(rootNode) !== 'App') {
    return false;
  }

  const nodeNames = new Set(Object.values(nodes).map((node) => getNodeName(node)));

  return nodeNames.has('Introduction') && nodeNames.has('ComplexSection');
};

export const applyLandingLayoutToSerializedNodes = (frameData: string) => {
  try {
    const parsedValue = JSON.parse(frameData) as unknown;

    if (!isSerializedNodesLike(parsedValue) || !isLegacyLandingTree(parsedValue)) {
      return frameData;
    }

    Object.values(parsedValue).forEach((node) => {
      const props = node.props;

      if (!props) {
        return;
      }

      const nodeName = getNodeName(node);
      const parentName = getNodeName(
        typeof node.parent === 'string' ? parsedValue[node.parent] : undefined
      );

      // Legacy landing saves were authored before the viewport-width shell existed, so rehydrate the old tree with the new responsive class contract and let the outer device shell own the actual page width.
      if (nodeName === 'App') {
        props.width = '100%';
        addNodeClassName(node, 'landing-page-root landing-page-shell');
        return;
      }

      if (nodeName === 'Introduction') {
        addNodeClassName(node, 'landing-section landing-two-column landing-intro');
        return;
      }

      if (nodeName === 'Heading' && parentName === 'Introduction') {
        // The intro heading stacks above body copy on mobile, so it must shrink to its own content height.
        setNodeProp(node, 'height', 'auto');
        addNodeClassName(node, 'landing-intro-heading');
        return;
      }

      if (nodeName === 'Description' && parentName === 'Introduction') {
        // Prevent the body copy column from inheriting a stretched desktop height when the layout collapses.
        setNodeProp(node, 'height', 'auto');
        addNodeClassName(node, 'landing-intro-copy');
        return;
      }

      if (nodeName === 'ComplexSection') {
        addNodeClassName(node, 'landing-section landing-dark-section');
        return;
      }

      if (nodeName === 'Wrapper' && parentName === 'ComplexSection') {
        addNodeClassName(node, 'landing-two-column landing-feature-row');
        return;
      }

      if (nodeName === 'Square') {
        addNodeClassName(node, 'landing-square');
        return;
      }

      if (nodeName === 'Content' && parentName === 'Wrapper') {
        // The dark feature copy becomes a normal stacked block on phones, so its height must be content-driven.
        setNodeProp(node, 'height', 'auto');
        addNodeClassName(node, 'landing-dark-copy');
        return;
      }

      if (nodeName === 'Programmatic') {
        addNodeClassName(node, 'landing-section landing-programmatic');
        return;
      }

      if (nodeName === 'Heading' && parentName === 'Programmatic') {
        addNodeClassName(node, 'landing-programmatic-heading');
        return;
      }

      if (nodeName === 'Content' && parentName === 'Programmatic') {
        addNodeClassName(node, 'landing-two-column landing-programmatic-grid');
        return;
      }

      if (nodeName === 'Left') {
        // Programmatic columns also collapse into a single column on mobile and should not retain stretched heights.
        setNodeProp(node, 'height', 'auto');
        addNodeClassName(node, 'landing-programmatic-left');
        return;
      }

      if (nodeName === 'Right') {
        // Keep the right column content-driven so stacked cards close up naturally on narrow screens.
        setNodeProp(node, 'height', 'auto');
        addNodeClassName(node, 'landing-programmatic-right');
      }
    });

    return JSON.stringify(parsedValue);
  } catch {
    return frameData;
  }
};
