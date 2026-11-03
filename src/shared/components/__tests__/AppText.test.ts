import { toKebabCase } from '@/core/theme/colorVariables';
import { fonts, typography } from '@/core/theme/theme';

import { textVariantClass, type TextVariant } from '../AppText';

const fontClassFor = (family: string): string => {
  const key = Object.entries(fonts).find(([, value]) => value === family)?.[0];
  return `font-${toKebabCase(key ?? 'unknown')}`;
};

describe('textVariantClass', () => {
  it.each(Object.keys(typography) as TextVariant[])(
    'uses the font and size of the "%s" typography token',
    (variant) => {
      const classes = textVariantClass[variant].split(' ');

      expect(classes).toContain(fontClassFor(typography[variant].fontFamily));
      expect(classes).toContain(`text-${toKebabCase(variant)}`);
    },
  );
});
