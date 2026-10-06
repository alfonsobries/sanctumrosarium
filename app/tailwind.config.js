const role = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: role('background'),
        surface: role('surface'),
        'surface-raised': role('surface-raised'),
        foreground: role('foreground'),
        muted: role('muted'),
        faint: role('faint'),
        border: role('border'),
        accent: role('accent'),
        'accent-foreground': role('accent-foreground'),
        rubric: role('rubric'),
        bead: role('bead'),
        'bead-done': role('bead-done'),
      },
      fontFamily: {
        display: 'var(--font-display)',
        prayer: 'var(--font-prayer)',
        ui: 'var(--font-ui)',
        'prayer-italic': 'var(--font-prayer-italic)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
      },
    },
  },
};
