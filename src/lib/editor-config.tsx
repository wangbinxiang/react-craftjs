import { Element } from '@craftjs/core';
import { createTheme } from '@mui/material';
import type { ReactNode } from 'react';

import CaseDetailHero from '../assets/images/case-detail-hero.svg?url';
import CaseDetailMobile from '../assets/images/case-detail-mobile.svg?url';
import CaseDetailSurface from '../assets/images/case-detail-surface.svg?url';
import { Button } from '../components/selectors/Button';
import { Container, Image, ProductCta, Text } from '../components/selectors';
import { Custom1, OnlyButtons } from '../components/selectors/Custom1';
import { Custom2, Custom2VideoDrop } from '../components/selectors/Custom2';
import { Custom3, Custom3BtnDrop } from '../components/selectors/Custom3';
import { Video } from '../components/selectors/Video';
import { productDetail } from '../data/product';

// Keep the example theme centralized so editor and preview pages render with the same typography.
export const editorTheme = createTheme({
  typography: {
    fontFamily: [
      'acumin-pro',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

// Resolver parity is critical because preview deserialization only works for components registered here.
export const editorResolver = {
  Container,
  Image,
  Text,
  Custom1,
  Custom2,
  Custom2VideoDrop,
  Custom3,
  Custom3BtnDrop,
  OnlyButtons,
  Button,
  ProductCta,
  Video,
};

const createCaseSnapshotCard = (label: string, value: string) => (
  <Element
    canvas
    is={Container}
    background={{ r: 255, g: 255, b: 255, a: 1 }}
    padding={['22', '22', '22', '22']}
    radius={22}
    shadow={12}
    width="100%"
    height="auto"
    custom={{ displayName: `${label} Snapshot` }}
  >
    <Text
      fontSize="12"
      fontWeight="700"
      color={{ r: '111', g: '116', b: '126', a: '1' }}
      margin={['0', '0', '10', '0']}
      text={label}
    />
    <Text
      fontSize="20"
      fontWeight="700"
      color={{ r: '24', g: '33', b: '47', a: '1' }}
      text={value}
    />
  </Element>
);

const createCaseChapter = ({
  name,
  eyebrow,
  title,
  body,
  media,
  reverse = false,
}: {
  name: string;
  eyebrow: string;
  title: string;
  body: string;
  media: ReactNode;
  reverse?: boolean;
}) => (
  <Element
    canvas
    is={Container}
    className={`detail-chapter ${reverse ? 'detail-chapter-reverse' : ''}`}
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    width="100%"
    height="auto"
    padding={['0', '0', '0', '0']}
    margin={['0', '0', '60', '0']}
    custom={{ displayName: name }}
  >
    <Element
      canvas
      is={Container}
      className="detail-chapter-copy"
      width="44%"
      height="auto"
      padding={['0', '0', '0', '0']}
      custom={{ displayName: `${name} Copy` }}
    >
      <Text
        fontSize="12"
        fontWeight="700"
        color={{ r: '86', g: '94', b: '105', a: '1' }}
        margin={['0', '0', '16', '0']}
        text={eyebrow}
      />
      <Text
        fontSize="34"
        fontWeight="700"
        color={{ r: '17', g: '24', b: '39', a: '1' }}
        margin={['0', '0', '18', '0']}
        text={title}
      />
      <Text
        fontSize="16"
        fontWeight="400"
        color={{ r: '71', g: '85', b: '105', a: '1' }}
        text={body}
      />
    </Element>
    <Element
      canvas
      is={Container}
      className="detail-chapter-media"
      width="50%"
      height="auto"
      padding={['0', '0', '0', '0']}
      custom={{ displayName: `${name} Media` }}
    >
      {media}
    </Element>
  </Element>
);

const createOutcomeMetric = (label: string, value: string) => (
  <Element
    canvas
    is={Container}
    background={{ r: 255, g: 255, b: 255, a: 1 }}
    padding={['24', '24', '24', '24']}
    radius={22}
    shadow={10}
    width="100%"
    height="auto"
    custom={{ displayName: `${label} Metric` }}
  >
    <Text
      fontSize="14"
      fontWeight="700"
      color={{ r: '88', g: '95', b: '107', a: '1' }}
      margin={['0', '0', '10', '0']}
      text={label}
    />
    <Text
      fontSize="28"
      fontWeight="700"
      color={{ r: '17', g: '24', b: '39', a: '1' }}
      text={value}
    />
  </Element>
);

const createProductHighlightCard = (index: number) => (
  <Element
    canvas
    is={Container}
    className="product-highlight-card"
    background={{ r: 255, g: 255, b: 255, a: 1 }}
    padding={['24', '24', '24', '24']}
    radius={26}
    width="100%"
    height="auto"
    custom={{ displayName: `Highlight ${index + 1}` }}
  >
    <Text
      className="product-highlight-copy"
      fontSize="17"
      fontWeight="400"
      color={{ r: '71', g: '85', b: '105', a: '1' }}
      productField="highlight"
      productIndex={index}
      text={productDetail.highlights[index] ?? ''}
    />
  </Element>
);

const createProductSpecCard = (index: number) => (
  <Element
    canvas
    is={Container}
    className="product-spec-card"
    background={{ r: 255, g: 255, b: 255, a: 1 }}
    padding={['24', '24', '24', '24']}
    radius={26}
    width="100%"
    height="auto"
    custom={{ displayName: `Spec ${index + 1}` }}
  >
    <Text
      className="product-spec-label"
      fontSize="12"
      fontWeight="700"
      color={{ r: '107', g: '114', b: '128', a: '1' }}
      margin={['0', '0', '12', '0']}
      productField="specLabel"
      productIndex={index}
      text={productDetail.specs[index]?.label ?? ''}
    />
    <Text
      className="product-spec-value"
      fontSize="24"
      fontWeight="700"
      color={{ r: '23', g: '32', b: '51', a: '1' }}
      productField="specValue"
      productIndex={index}
      text={productDetail.specs[index]?.value ?? ''}
    />
  </Element>
);

export const createDefaultLandingPage = () => (
  <Element
    canvas
    is={Container}
    className="landing-page-root landing-page-shell"
    width="100%"
    height="auto"
    background={{ r: 255, g: 255, b: 255, a: 1 }}
    padding={['40', '40', '40', '40']}
    custom={{ displayName: 'App' }}
  >
    {/* Lead section mirrors the original landing intro and gives preview mode a known fallback tree. */}
    <Element
      canvas
      is={Container}
      className="landing-section landing-two-column landing-intro"
      flexDirection="row"
      width="100%"
      height="auto"
      padding={['40', '40', '40', '40']}
      margin={['0', '0', '40', '0']}
      custom={{ displayName: 'Introduction' }}
    >
      <Element
        canvas
        is={Container}
        className="landing-intro-heading"
        width="40%"
        height="100%"
        padding={['0', '20', '0', '20']}
        custom={{ displayName: 'Heading' }}
      >
        <Text
          fontSize="23"
          fontWeight="400"
          text="Craft.js is a React framework for building powerful &amp; feature-rich drag-n-drop page editors."
        />
      </Element>
      <Element
        canvas
        is={Container}
        className="landing-intro-copy"
        width="60%"
        height="100%"
        padding={['0', '20', '0', '20']}
        custom={{ displayName: 'Description' }}
      >
        <Text
          fontSize="14"
          fontWeight="400"
          text="Everything you see here, including the editor, itself is made of React components. Craft.js comes only with the building blocks for a page editor; it provides a drag-n-drop system and handles the way user components should be rendered, updated and moved, among other things. <br /> <br /> You control the way your editor looks and behave."
        />
      </Element>
    </Element>

    {/* The nested square section exercises deep container hierarchies in both editing and preview. */}
    <Element
      canvas
      is={Container}
      className="landing-section landing-dark-section"
      background={{ r: 39, g: 41, b: 41, a: 1 }}
      flexDirection="column"
      width="100%"
      height="auto"
      padding={['40', '40', '40', '40']}
      margin={['0', '0', '40', '0']}
      custom={{ displayName: 'ComplexSection' }}
    >
      <Element
        canvas
        background={{ r: 76, g: 78, b: 78, a: 0 }}
        is={Container}
        className="landing-two-column landing-feature-row"
        flexDirection="row"
        margin={['0', '0', '0', '0']}
        width="100%"
        height="auto"
        alignItems="center"
        custom={{ displayName: 'Wrapper' }}
      >
        <Element
          canvas
          background={{ r: 0, g: 0, b: 0, a: 0 }}
          is={Container}
          className="landing-square"
          alignItems="center"
          padding={['0', '0', '0', '0']}
          flexDirection="row"
          width="350px"
          height="250px"
          custom={{ displayName: 'Square' }}
        >
          <Element
            canvas
            is={Container}
            justifyContent="center"
            alignItems="center"
            background={{ r: 76, g: 78, b: 78, a: 1 }}
            shadow={25}
            width="90%"
            height="90%"
            padding={['10', '20', '10', '20']}
            custom={{ displayName: 'Outer' }}
          >
            <Element
              canvas
              is={Container}
              justifyContent="center"
              alignItems="center"
              background={{ r: 76, g: 78, b: 78, a: 1 }}
              shadow={50}
              width="80%"
              height="80%"
              padding={['10', '20', '10', '20']}
              custom={{ displayName: 'Middle' }}
            >
              <Element
                canvas
                is={Container}
                justifyContent="center"
                alignItems="center"
                background={{ r: 76, g: 78, b: 78, a: 1 }}
                shadow={50}
                width="60%"
                height="60%"
                padding={['10', '20', '10', '20']}
                custom={{ displayName: 'Inner' }}
              />
            </Element>
          </Element>
        </Element>
        <Element
          canvas
          background={{ r: 0, g: 0, b: 0, a: 0 }}
          is={Container}
          className="landing-dark-copy"
          padding={['0', '0', '0', '20']}
          flexDirection="column"
          width="55%"
          height="100%"
          fillSpace="yes"
          custom={{ displayName: 'Content' }}
        >
          <Text
            color={{ r: '255', g: '255', b: '255', a: '1' }}
            margin={['0', '0', '18', '0']}
            fontSize="20"
            text="Design complex components"
          />
          <Text
            color={{ r: '255', g: '255', b: '255', a: '0.8' }}
            fontSize="14"
            fontWeight="400"
            text="You can define areas within your React component which users can drop other components into. <br/><br />You can even design how the component should be edited — content editable, drag to resize, have inputs on toolbars — anything really."
          />
        </Element>
      </Element>
    </Element>

    {/* Programmatic drag-and-drop keeps the same custom component constraints in both modes. */}
    <Element
      canvas
      is={Container}
      className="landing-section landing-programmatic"
      background={{ r: 234, g: 245, b: 245, a: 1 }}
      flexDirection="column"
      width="100%"
      height="auto"
      padding={['40', '40', '40', '40']}
      margin={['0', '0', '40', '0']}
      custom={{ displayName: 'Programmatic' }}
    >
      <Element
        canvas
        background={{ r: 76, g: 78, b: 78, a: 0 }}
        is={Container}
        className="landing-programmatic-heading"
        flexDirection="column"
        margin={['0', '0', '20', '0']}
        width="100%"
        height="auto"
        custom={{ displayName: 'Heading' }}
      >
        <Text
          color={{ r: '46', g: '47', b: '47', a: '1' }}
          fontSize="23"
          text="Programmatic drag &amp; drop"
        />
        <Text
          fontSize="14"
          fontWeight="400"
          text="Govern what goes in and out of your components"
        />
      </Element>
      <Element
        canvas
        background={{ r: 76, g: 78, b: 78, a: 0 }}
        is={Container}
        className="landing-two-column landing-programmatic-grid"
        flexDirection="row"
        margin={['30', '0', '0', '0']}
        width="100%"
        height="auto"
        custom={{ displayName: 'Content' }}
      >
        <Element
          canvas
          background={{ r: 0, g: 0, b: 0, a: 0 }}
          is={Container}
          className="landing-programmatic-left"
          padding={['0', '20', '0', '0']}
          flexDirection="row"
          width="45%"
          custom={{ displayName: 'Left' }}
        >
          <Custom1
            background={{ r: 119, g: 219, b: 165, a: 1 }}
            height="auto"
            width="100%"
            padding={['20', '20', '20', '20']}
            margin={['0', '0', '0', '0']}
            shadow={40}
          />
        </Element>
        <Element
          canvas
          background={{ r: 0, g: 0, b: 0, a: 0 }}
          is={Container}
          className="landing-programmatic-right"
          padding={['0', '0', '0', '20']}
          flexDirection="column"
          width="55%"
          custom={{ displayName: 'Right' }}
        >
          <Custom2
            background={{ r: 108, g: 126, b: 131, a: 1 }}
            height="125px"
            width="100%"
            padding={['0', '0', '0', '20']}
            margin={['0', '0', '0', '0']}
            shadow={40}
            flexDirection="row"
            alignItems="center"
          />
          <Custom3
            background={{ r: 134, g: 187, b: 201, a: 1 }}
            height="auto"
            width="100%"
            padding={['20', '20', '20', '20']}
            margin={['20', '0', '0', '0']}
            shadow={40}
            flexDirection="column"
          />
        </Element>
      </Element>
    </Element>
  </Element>
);

export const createBlankContentPage = () => (
  <Element
    canvas
    is={Container}
    width="800px"
    height="auto"
    background={{ r: 255, g: 255, b: 255, a: 1 }}
    padding={['40', '40', '40', '40']}
    custom={{ displayName: 'Page' }}
  />
);

export const createProductDetailPage = () => (
  <Element
    canvas
    is={Container}
    className="product-page"
    width="100%"
    height="auto"
    background={{ r: 247, g: 241, b: 232, a: 1 }}
    padding={['24', '16', '56', '16']}
    custom={{ displayName: 'Product Detail Root' }}
  >
    <Element
      canvas
      is={Container}
      className="product-shell"
      width="100%"
      height="auto"
      padding={['0', '0', '0', '0']}
      background={{ r: 0, g: 0, b: 0, a: 0 }}
      custom={{ displayName: 'Product Detail Shell' }}
    >
      <Element
        canvas
        is={Container}
        className="product-hero"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        height="auto"
        padding={['36', '36', '36', '36']}
        margin={['0', '0', '24', '0']}
        radius={36}
        background={{ r: 255, g: 252, b: 246, a: 0.88 }}
        shadow={20}
        custom={{ displayName: 'Product Hero' }}
      >
        <Element
          canvas
          is={Container}
          className="product-copy"
          width="46%"
          height="auto"
          padding={['0', '0', '0', '0']}
          background={{ r: 0, g: 0, b: 0, a: 0 }}
          custom={{ displayName: 'Product Copy' }}
        >
          <Text
            className="product-eyebrow"
            fontSize="12"
            fontWeight="700"
            color={{ r: '107', g: '114', b: '128', a: '1' }}
            margin={['0', '0', '14', '0']}
            text="Product Detail"
          />
          <Text
            className="product-title"
            fontSize="68"
            fontWeight="700"
            color={{ r: '23', g: '32', b: '51', a: '1' }}
            margin={['0', '0', '16', '0']}
            productField="name"
            text={productDetail.name}
          />
          <Text
            className="product-tagline"
            fontSize="17"
            fontWeight="400"
            color={{ r: '71', g: '85', b: '105', a: '1' }}
            margin={['0', '0', '28', '0']}
            productField="tagline"
            text={productDetail.tagline}
          />
          <Element
            canvas
            is={Container}
            className="product-actions"
            flexDirection="row"
            alignItems="center"
            width="100%"
            height="auto"
            padding={['0', '0', '0', '0']}
            background={{ r: 0, g: 0, b: 0, a: 0 }}
            custom={{ displayName: 'Product Actions' }}
          >
            {/* Product Detail pages keep a dedicated CTA so preview and editor can share modal-only behavior without changing generic buttons. */}
            <ProductCta
              className="product-primary-action"
              background={{ r: 23, g: 32, b: 51, a: 1 }}
              buttonStyle="full"
              color={{ r: 255, g: 254, b: 251, a: 1 }}
              href={productDetail.ctaHref}
              margin={['0', '0', '0', '0']}
              productField="ctaLabel"
              text={productDetail.ctaLabel}
              textComponent={{
                ...Text.craft.props,
                fontSize: '13',
                fontWeight: '700',
                textAlign: 'center',
                color: { r: 255, g: 254, b: 251, a: 1 },
              }}
            />
          </Element>
        </Element>

        <Element
          canvas
          is={Container}
          className="product-media-panel"
          width="50%"
          height="auto"
          padding={['0', '0', '0', '0']}
          background={{ r: 0, g: 0, b: 0, a: 0 }}
          custom={{ displayName: 'Product Media' }}
        >
          <Image
            alt={`${productDetail.name} product hero`}
            className="product-hero-image"
            height="420px"
            productField="heroImage"
            radius={30}
            src={productDetail.heroImage}
          />
          <Element
            canvas
            is={Container}
            className="product-price-card"
            width="200px"
            height="auto"
            padding={['18', '20', '18', '20']}
            radius={24}
            background={{ r: 15, g: 23, b: 42, a: 0.9 }}
            custom={{ displayName: 'Product Price' }}
          >
            <Text
              className="product-price-label"
              fontSize="12"
              fontWeight="700"
              color={{ r: '107', g: '114', b: '128', a: '1' }}
              margin={['0', '0', '6', '0']}
              text="Launch Price"
            />
            <Text
              className="product-price-value"
              fontSize="32"
              fontWeight="700"
              color={{ r: '255', g: '255', b: '255', a: '1' }}
              productField="price"
              text={productDetail.price}
            />
          </Element>
        </Element>
      </Element>

      <Element
        canvas
        is={Container}
        className="product-section"
        width="100%"
        height="auto"
        padding={['32', '32', '32', '32']}
        margin={['0', '0', '20', '0']}
        radius={36}
        background={{ r: 255, g: 252, b: 246, a: 0.88 }}
        shadow={16}
        custom={{ displayName: 'Product Highlights Section' }}
      >
        <Element
          canvas
          is={Container}
          className="product-section-heading"
          width="100%"
          height="auto"
          padding={['0', '0', '0', '0']}
          margin={['0', '0', '24', '0']}
          background={{ r: 0, g: 0, b: 0, a: 0 }}
          custom={{ displayName: 'Highlights Heading' }}
        >
          <Text
            className="product-section-label"
            fontSize="12"
            fontWeight="700"
            color={{ r: '107', g: '114', b: '128', a: '1' }}
            margin={['0', '0', '12', '0']}
            text="Why Teams Choose It"
          />
          <Text
            className="product-section-title"
            fontSize="40"
            fontWeight="700"
            color={{ r: '23', g: '32', b: '51', a: '1' }}
            text="Key benefits mapped directly from the product data source."
          />
        </Element>
        <Element
          canvas
          is={Container}
          className="product-highlight-grid"
          width="100%"
          height="auto"
          padding={['0', '0', '0', '0']}
          background={{ r: 0, g: 0, b: 0, a: 0 }}
          custom={{ displayName: 'Highlights Grid' }}
        >
          {productDetail.highlights.map((_, index) => createProductHighlightCard(index))}
        </Element>
      </Element>

      <Element
        canvas
        is={Container}
        className="product-section"
        width="100%"
        height="auto"
        padding={['32', '32', '32', '32']}
        radius={36}
        background={{ r: 255, g: 252, b: 246, a: 0.88 }}
        shadow={16}
        custom={{ displayName: 'Product Specs Section' }}
      >
        <Element
          canvas
          is={Container}
          className="product-section-heading"
          width="100%"
          height="auto"
          padding={['0', '0', '0', '0']}
          margin={['0', '0', '24', '0']}
          background={{ r: 0, g: 0, b: 0, a: 0 }}
          custom={{ displayName: 'Specs Heading' }}
        >
          <Text
            className="product-section-label"
            fontSize="12"
            fontWeight="700"
            color={{ r: '107', g: '114', b: '128', a: '1' }}
            margin={['0', '0', '12', '0']}
            text="Specifications"
          />
          <Text
            className="product-section-title"
            fontSize="40"
            fontWeight="700"
            color={{ r: '23', g: '32', b: '51', a: '1' }}
            text="Structured facts that stay synchronized with the product data source."
          />
        </Element>
        <Element
          canvas
          is={Container}
          className="product-spec-grid"
          width="100%"
          height="auto"
          padding={['0', '0', '0', '0']}
          background={{ r: 0, g: 0, b: 0, a: 0 }}
          custom={{ displayName: 'Specs Grid' }}
        >
          {productDetail.specs.map((_, index) => createProductSpecCard(index))}
        </Element>
      </Element>
    </Element>
  </Element>
);

export const createCaseDetailPage = () => (
  <Element
    canvas
    is={Container}
    className="detail-page-root"
    width="100%"
    height="auto"
    background={{ r: 239, g: 235, b: 228, a: 1 }}
    padding={['28', '16', '56', '16']}
    custom={{ displayName: 'Case Detail Root' }}
  >
    <Element
      canvas
      is={Container}
      className="detail-page-shell"
      width="100%"
      height="auto"
      padding={['0', '0', '0', '0']}
      custom={{ displayName: 'Case Detail Shell' }}
    >
      {/* Hero establishes the editorial tone before readers enter the longer story below. */}
      <Element
        canvas
        is={Container}
        className="detail-hero-grid"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        height="auto"
        margin={['0', '0', '28', '0']}
        padding={['0', '0', '0', '0']}
        custom={{ displayName: 'Hero' }}
      >
        <Element
          canvas
          is={Container}
          className="detail-hero-copy"
          width="44%"
          height="auto"
          padding={['0', '0', '0', '0']}
          custom={{ displayName: 'Hero Copy' }}
        >
          <Text
            fontSize="13"
            fontWeight="700"
            color={{ r: '93', g: '94', b: '96', a: '1' }}
            margin={['0', '0', '18', '0']}
            text="CASE STUDY / PRODUCT DESIGN SYSTEM"
          />
          <Text
            fontSize="58"
            fontWeight="700"
            color={{ r: '17', g: '24', b: '39', a: '1' }}
            margin={['0', '0', '18', '0']}
            text="Designing a detail page that feels edited, not templated."
          />
          <Text
            fontSize="18"
            fontWeight="400"
            color={{ r: '71', g: '85', b: '105', a: '1' }}
            margin={['0', '0', '28', '0']}
            text="A content-first case detail template for Craft.js that balances visual impact, reusable structure, and editor-friendly composition."
          />
          <Element
            canvas
            is={Container}
            className="detail-meta-grid"
            width="100%"
            height="auto"
            padding={['0', '0', '0', '0']}
            custom={{ displayName: 'Hero Metadata' }}
          >
            {createCaseSnapshotCard('Role', 'Design Systems')}
            {createCaseSnapshotCard('Year', '2026')}
            {createCaseSnapshotCard('Timeline', '6 Weeks')}
            {createCaseSnapshotCard('Outcome', '+27% faster handoff')}
          </Element>
        </Element>
        <Element
          canvas
          is={Container}
          className="detail-hero-media"
          width="50%"
          height="auto"
          padding={['0', '0', '0', '0']}
          custom={{ displayName: 'Hero Media' }}
        >
          <Image
            alt="Case study hero collage showing editorial detail page layouts."
            className="detail-hero-image"
            height="540px"
            radius={32}
            src={CaseDetailHero}
          />
        </Element>
      </Element>

      <Element
        canvas
        is={Container}
        className="detail-snapshot-strip"
        width="100%"
        height="auto"
        margin={['0', '0', '56', '0']}
        padding={['0', '0', '0', '0']}
        custom={{ displayName: 'Snapshot Strip' }}
      >
        {createCaseSnapshotCard('Client', 'Craft.js Example')}
        {createCaseSnapshotCard('Scope', 'Template + Media')}
        {createCaseSnapshotCard('Focus', 'Readability + Reuse')}
        {createCaseSnapshotCard('Ship Mode', 'Editor + Preview')}
      </Element>

      {createCaseChapter({
        name: 'Background Chapter',
        eyebrow: '01 / Background & Problem',
        title: 'The original example could edit pages, but it could not stage a real detail narrative.',
        body: 'The existing demo already had solid drag-and-drop primitives, yet every new page began as either an empty canvas or the landing sentinel. That left no opinionated structure for a richer case-study page, and it forced authors to rebuild editorial scaffolding by hand every time.',
        media: (
          <Image
            alt="Surface mock showing the new case study layout blocks."
            className="detail-support-image"
            height="420px"
            radius={28}
            src={CaseDetailSurface}
          />
        ),
      })}

      {createCaseChapter({
        name: 'Goal Chapter',
        eyebrow: '02 / Design Goals',
        title: 'The new template had to feel deliberate while staying fully editable inside Craft.',
        body: 'Instead of introducing a data-driven detail schema, the page stays node-based. Authors can rewrite headings, swap media, duplicate sections, and still preview the page through the saved site document. That keeps the example teachable and avoids baking product assumptions into the storage layer.',
        reverse: true,
        media: (
          <Element
            canvas
            is={Container}
            className="detail-proof-grid"
            width="100%"
            height="auto"
            padding={['0', '0', '0', '0']}
            custom={{ displayName: 'Goal Proof Grid' }}
          >
            <Image
              alt="Mobile adaptation of the detail page template."
              height="420px"
              radius={24}
              src={CaseDetailMobile}
            />
            <Image
              alt="Secondary layout crop showing compact image treatment."
              height="420px"
              radius={24}
              src={CaseDetailSurface}
            />
          </Element>
        ),
      })}

      {createCaseChapter({
        name: 'System Chapter',
        eyebrow: '03 / System Assembly',
        title: 'We added a single Image selector and let the template do the storytelling work.',
        body: 'The main extension is intentionally small: a resizable image selector with source, alt text, fit mode, width, height, and radius controls. Combined with the existing Container, Text, Button, and Video nodes, the template can now mix large hero imagery, evidence panels, and inline explanation blocks.',
        media: (
          <Element
            canvas
            is={Container}
            width="100%"
            height="auto"
            padding={['0', '0', '0', '0']}
            custom={{ displayName: 'System Media Stack' }}
          >
            <Image
              alt="Image selector preview used as media proof."
              height="260px"
              margin={['0', '0', '18', '0']}
              radius={26}
              src={CaseDetailHero}
            />
            <Element
              canvas
              is={Container}
              width="100%"
              height="280px"
              padding={['0', '0', '0', '0']}
              custom={{ displayName: 'System Video Frame' }}
            >
              <Video videoId="IwzUs1IMdyQ" />
            </Element>
          </Element>
        ),
      })}

      {createCaseChapter({
        name: 'Outcome Chapter',
        eyebrow: '04 / Outcome & Reflection',
        title: 'The result is a page authors can publish quickly without giving up editorial control.',
        body: 'The template starts from a strong first draft: hierarchy is already present, media slots are named, and the story has a clear arc. Authors keep flexibility because everything still resolves to Craft nodes, not fixed CMS fields. That makes the example more realistic without losing its educational value.',
        reverse: true,
        media: (
          <Element
            canvas
            is={Container}
            className="detail-metric-grid"
            width="100%"
            height="auto"
            padding={['0', '0', '0', '0']}
            custom={{ displayName: 'Outcome Metrics' }}
          >
            {createOutcomeMetric('Setup time', '< 2 min')}
            {createOutcomeMetric('Template reuse', '4 sections')}
            {createOutcomeMetric('Media types', 'Image + Video')}
          </Element>
        ),
      })}

      <Element
        canvas
        is={Container}
        className="detail-reflection-block"
        background={{ r: 255, g: 255, b: 255, a: 1 }}
        width="100%"
        height="auto"
        padding={['34', '34', '34', '34']}
        radius={28}
        shadow={12}
        margin={['0', '0', '56', '0']}
        custom={{ displayName: 'Reflection' }}
      >
        <Text
          fontSize="14"
          fontWeight="700"
          color={{ r: '88', g: '95', b: '107', a: '1' }}
          margin={['0', '0', '14', '0']}
          text="KEY LEARNINGS"
        />
        <Text
          fontSize="28"
          fontWeight="700"
          color={{ r: '17', g: '24', b: '39', a: '1' }}
          margin={['0', '0', '18', '0']}
          text="Strong default composition is often more valuable than a larger component catalog."
        />
        <Text
          fontSize="16"
          fontWeight="400"
          color={{ r: '71', g: '85', b: '105', a: '1' }}
          text="By constraining the feature to a single new selector and a rich template tree, the example gains a much more convincing detail-page experience without bloating the editor model."
        />
      </Element>

      <Element
        canvas
        is={Container}
        className="detail-footer-cta"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        background={{ r: 24, g: 33, b: 47, a: 1 }}
        width="100%"
        height="auto"
        padding={['30', '30', '30', '30']}
        radius={30}
        custom={{ displayName: 'Footer CTA' }}
      >
        <Element
          canvas
          is={Container}
          width="68%"
          height="auto"
          padding={['0', '0', '0', '0']}
          background={{ r: 0, g: 0, b: 0, a: 0 }}
          custom={{ displayName: 'CTA Copy' }}
        >
          <Text
            fontSize="12"
            fontWeight="700"
            color={{ r: '191', g: '219', b: '254', a: '1' }}
            margin={['0', '0', '12', '0']}
            text="NEXT MOVE"
          />
          <Text
            fontSize="30"
            fontWeight="700"
            color={{ r: '255', g: '255', b: '255', a: '1' }}
            margin={['0', '0', '12', '0']}
            text="Duplicate this page, swap the story, and publish your next case study."
          />
          <Text
            fontSize="15"
            fontWeight="400"
            color={{ r: '203', g: '213', b: '225', a: '1' }}
            text="The structure is intentionally reusable: hero, facts, chapters, proof, outcomes, and one focused CTA."
          />
        </Element>
        <Element
          canvas
          is={Container}
          className="detail-footer-actions"
          width="220px"
          height="auto"
          padding={['0', '0', '0', '0']}
          background={{ r: 0, g: 0, b: 0, a: 0 }}
          custom={{ displayName: 'CTA Actions' }}
        >
          <Button
            background={{ r: 59, g: 130, b: 246, a: 1 }}
            color={{ r: 255, g: 255, b: 255, a: 1 }}
            margin={['0', '0', '12', '0']}
            text="Open next case"
          />
          <Button
            background={{ r: 255, g: 255, b: 255, a: 0.15 }}
            buttonStyle="outline"
            color={{ r: 255, g: 255, b: 255, a: 1 }}
            margin={['0', '0', '0', '0']}
            text="Return to editor"
          />
        </Element>
      </Element>
    </Element>
  </Element>
);
