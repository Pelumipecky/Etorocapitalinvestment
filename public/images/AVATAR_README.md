# Avatar Images

## Required Avatar Files

Please add the following avatar image files to this directory (`/public/images/`):

### Male Avatars
- `avatar_male_1.png` - First male avatar option
- `avatar_male_2.png` - Second male avatar option

### Female Avatar
- `avatar_female_1.png` - Female avatar option

## Image Specifications

- **Format**: PNG with transparent background
- **Size**: 200x200 pixels (minimum), 400x400 pixels (recommended)
- **Style**: Circular profile pictures work best
- **File Size**: Keep under 100KB for optimal loading

## Quick Setup

You can use any avatar generator service or create simple placeholder images. Some free resources:

1. **Avatar Generators**:
   - https://avataaars.com/
   - https://getavataaars.com/
   - https://avatar-placeholder.iran.liara.run/

2. **Free Avatar Sets**:
   - https://www.flaticon.com/packs/avatars
   - https://www.iconfinder.com/search?q=avatar

3. **Or create simple colored circles** with initials/icons as placeholders

## Default Behavior

If images are not found, the component will attempt to load them anyway, showing a broken image icon. To prevent this, you can:

1. Add placeholder images
2. Update the src paths in `UserDashboard.tsx` to use a CDN or base64 data URLs
3. Use an avatar placeholder service URL

## Integration

The avatar system is integrated in:
- **UserDashboard.tsx** - Profile section with selection UI
- **Sidebar** - User avatar display
- **localStorage** - Saves selected avatar preference

Users can click on any avatar to select it, and it will immediately update in the sidebar.
