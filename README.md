# Chocolate & Art Show Dallas - Static Website

A fully functional static website for the Chocolate & Art Show Dallas event, built according to the provided specifications.

## 🎨 Features

### Core Pages
- **Homepage** - Hero video, waterfall headline, RGB wall, gallery teaser
- **Artists** - 5-card grid with organic blob masks, artist detail pages
- **Tickets** - Night selector, Eventbrite integration, pricing info
- **Gallery** - Lightbox functionality, optimized image loading
- **Schedule** - Interactive timeline for both event nights
- **FAQ** - Accordion-style Q&A sections
- **Contact** - Venue information and contact details

### Interactive Elements
- **Kusama Playground** - Interactive dot canvas with reduced motion support
- **Hero Video** - Auto-starts at 30s with accessibility controls
- **Eventbrite Tracking** - UTM parameters and affiliate tracking
- **Gmail Integration** - Pre-filled compose links for applications

### Technical Features
- **Mobile-First Responsive Design** - Optimized for all device sizes
- **WCAG 2.1 AA Accessibility** - Screen reader support, keyboard navigation
- **Performance Optimized** - Compressed images, lazy loading, caching headers
- **SEO Optimized** - JSON-LD structured data, meta tags, sitemap
- **Progressive Enhancement** - Works without JavaScript, enhanced with it

## 📁 File Structure

```
chocolate-static-build/
├── index.html                 # Homepage
├── tickets.html              # Tickets page
├── gallery.html              # Gallery page
├── schedule.html             # Schedule page
├── faq.html                  # FAQ page
├── contact.html              # Contact page
├── 404.html                  # Error page
├── robots.txt                # Search engine directives
├── sitemap.xml               # Site structure for SEO
├── .htaccess                 # Apache server configuration
├── optimize.sh               # Performance optimization script
├── artists/
│   ├── index.html           # Artists grid page
│   ├── danica.html          # Artist detail page
│   └── david-v.html         # Artist detail page
├── play/kusama/
│   └── index.html           # Interactive playground
└── assets/
    ├── css/
    │   ├── global.css       # Global styles and variables
    │   ├── components.css   # Component styles
    │   ├── artists.css      # Artists page styles
    │   ├── tickets.css      # Tickets page styles
    │   ├── gallery.css      # Gallery page styles
    │   └── schedule.css     # Schedule page styles
    ├── js/
    │   ├── global.js        # Core functionality
    │   ├── gallery.js       # Gallery lightbox
    │   └── schedule.js      # Schedule interactions
    ├── images/
    │   └── choco-logo.png   # Site logo
    ├── gallery/             # Gallery images
    ├── artists/             # Artist images and artwork
    └── play/                # Playground assets
```

## 🚀 Deployment Instructions

### For Siteground Hosting

1. **Upload Files**
   ```bash
   # Upload entire chocolate-static-build folder contents to public_html
   # Maintain the directory structure exactly as shown
   ```

2. **Set Up Domain**
   - Point your domain to the uploaded files
   - Ensure SSL certificate is installed
   - Update sitemap.xml with your actual domain

3. **Configure Server**
   - The included .htaccess file handles compression and caching
   - Verify mod_deflate and mod_expires are enabled
   - Test all pages load correctly

4. **SEO Setup**
   - Submit sitemap.xml to Google Search Console
   - Verify structured data with Google's Rich Results Test
   - Set up Google Analytics if desired

### Performance Optimization

The `optimize.sh` script has already:
- Optimized all images for web delivery
- Created performance-focused .htaccess rules
- Generated SEO files (robots.txt, sitemap.xml)
- Set up error pages

## 🎯 Key Design Elements

### Visual Style
- **Dark Theme** - #0b0b0d background with subtle noise texture
- **Typography** - Inter font family (400, 600, 800 weights)
- **Color Palette** - Blues (#1d66ff), purples (#7f5af0), with RGB effects
- **Organic Shapes** - SVG clip-path blob masks for artist cards

### Interactive Features
- **Waterfall Headlines** - 3D perspective text effects
- **RGB Big-Type** - Chromatic aberration text effects
- **Scroll Animations** - Progressive enhancement with reduced motion support
- **Hover Effects** - Subtle transforms and shadows

### Accessibility
- **Keyboard Navigation** - Full site navigable without mouse
- **Screen Reader Support** - Proper ARIA labels and live regions
- **Focus Management** - Visible focus indicators and logical tab order
- **Reduced Motion** - Respects user preferences for motion

## 📱 Browser Support

- **Modern Browsers** - Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Browsers** - iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive Enhancement** - Core functionality works in older browsers
- **Fallbacks** - CSS Grid falls back to flexbox, clip-path has border-radius fallback

## 🔧 Customization

### Adding New Artists
1. Create new folder in `assets/artists/[artist-name]/`
2. Add `thumb.jpg` and artwork images (`work-1.jpg`, etc.)
3. Copy and modify an existing artist detail page
4. Add to the artists grid in `artists/index.html`

### Updating Event Information
- **Dates/Times** - Update in schedule.html and structured data
- **Venue** - Update in contact.html and JSON-LD
- **Ticket Links** - Update Eventbrite URLs in data-eb-link attributes

### Content Management
- **Gallery Images** - Add to `assets/gallery/` and update gallery.html
- **Schedule** - Modify timeline in schedule.html
- **FAQ** - Add new accordion items in faq.html

## 📞 Support

For questions about the website implementation:
- Email: info@chocolateandartshow.com
- All code follows modern web standards and best practices
- Comprehensive comments included in CSS and JavaScript files

## 🎉 Launch Checklist

- [ ] Upload all files to hosting
- [ ] Configure domain and SSL
- [ ] Test all pages and functionality
- [ ] Verify mobile responsiveness
- [ ] Check accessibility with screen reader
- [ ] Submit sitemap to search engines
- [ ] Set up analytics tracking
- [ ] Test Eventbrite integration
- [ ] Verify email links work correctly

---

**Built by elgAtoAi**

