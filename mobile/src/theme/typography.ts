/**
 * Typography System - Optimized for Vietnamese Text
 * Vietnamese text requires specific line heights and font sizes for readability
 */

export const typography = {
  // Large headings - for main titles
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  
  // Section headings
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  
  // Subsection headings
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.1,
  },
  
  // Screen title
  heading: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 26,
    letterSpacing: 0,
  },
  
  // Subheading
  subheading: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  
  // Regular body text - main text for readability
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  
  // Smaller body text
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: 0,
  },
  
  // Label and captions
  label: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  
  // Small captions
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 18,
    letterSpacing: 0,
  },
  
  // Button text
  button: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
};

// Font family (system fonts that support Vietnamese)
export const fontFamily = {
  regular: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  bold: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  mono: 'Courier New, monospace',
};
