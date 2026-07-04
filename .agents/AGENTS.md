# CSS Rules

Do NOT use custom arbitrary classes (e.g. `bg-[#1a1a1a]`, `text-custom-blue`, `bg-[#ededed]`) or hardcoded utility colors (like `bg-gray-100`, `text-gray-500`) unless explicitly requested.
Always use standard Tailwind semantic utility classes that map to the `index.css` theme variables.

Use semantic variables such as:
- `bg-background` and `text-foreground`
- `bg-muted` and `text-muted-foreground`
- `bg-primary` and `text-primary-foreground`
- `bg-secondary` and `text-secondary-foreground`
- `bg-card` and `text-card-foreground`
- `border-border`
- `ring-ring`

This ensures that dark mode and global theme changes are perfectly synchronized.
