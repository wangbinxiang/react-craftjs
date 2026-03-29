import React from 'react';

import { ToolbarItem, ToolbarSection } from '../../editor';
import { ToolbarRadio } from '../../editor/Toolbar/ToolbarRadio';

export const ImageSettings = () => {
  return (
    <React.Fragment>
      <ToolbarSection title="Image">
        <ToolbarItem full={true} propKey="src" type="text" label="Source" />
        <ToolbarItem full={true} propKey="alt" type="text" label="Alt" />
        <ToolbarItem propKey="objectFit" type="radio" label="Fit">
          <ToolbarRadio value="cover" label="Cover" />
          <ToolbarRadio value="contain" label="Contain" />
        </ToolbarItem>
      </ToolbarSection>
      <ToolbarSection
        title="Dimensions"
        props={['width', 'height']}
        summary={({ width, height }: any) => `${width || 0} x ${height || 0}`}
      >
        <ToolbarItem propKey="width" type="text" label="Width" />
        <ToolbarItem propKey="height" type="text" label="Height" />
      </ToolbarSection>
      <ToolbarSection
        title="Decoration"
        props={['radius', 'margin']}
        summary={({ radius }: any) => `Radius ${radius || 0}px`}
      >
        <ToolbarItem full={true} propKey="radius" type="slider" label="Radius" />
        <ToolbarItem propKey="margin" index={0} type="slider" label="Top" />
        <ToolbarItem propKey="margin" index={1} type="slider" label="Right" />
        <ToolbarItem propKey="margin" index={2} type="slider" label="Bottom" />
        <ToolbarItem propKey="margin" index={3} type="slider" label="Left" />
      </ToolbarSection>
    </React.Fragment>
  );
};
