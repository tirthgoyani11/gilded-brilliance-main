# VMORA One-Phase Delivery Plan

## Phase Name
Single Phase: End-to-End Luxury Commerce and Diamond Trading Launch

## Primary Goal
Deliver VMORA as a production-ready luxury diamond and silver jewelry platform that combines premium brand experience and professional diamond marketplace capabilities in one execution phase.

## Success Criteria
- Full customer journey is functional: discovery, search, compare, wishlist, cart, checkout, account.
- Loose-diamond workflow is complete: advanced filter, table/grid modes, product details, V360, video, certificate view.
- Admin workflow is complete: bulk Excel import, validation, duplicate prevention, inventory and order management.
- Core technical stack is implemented: Next.js frontend, NestJS backend, PostgreSQL, Elasticsearch, S3/Cloudinary.
- SEO and structured data are live for product and content pages.
- Mobile experience supports swipe gallery, sticky buy actions, and fast filters.

## Scope Included in This Phase

### Commerce and Marketplace
- Jewelry ecommerce storefront.
- Loose-diamond marketplace with professional filters.
- Diamond comparison for up to 3 stones.
- Custom ring builder (diamond + setting + metal + preview flow).

### Data and Operations
- Excel bulk diamond import using SheetJS.
- Validation and normalization of imported rows.
- Duplicate prevention by stone_id.
- Product and inventory management in admin dashboard.

### Certification and Media
- IGI/GIA certificate viewer and verification links.
- V360 iframe integration per stone.
- Nivoda-compatible video link support.
- Media priority logic: V360 -> video -> image.

### Brand and UX
- Luxury visual system with specified palette and typography.
- Cinematic homepage with rotating diamond visual and sparkle treatment.
- Premium micro-interactions and hover effects.
- Trust section: certification, secure payments, insured shipping.

### SEO and Discoverability
- SEO-friendly URL pattern: /diamond/{stone-id}.
- Product schema, FAQ schema, review schema.
- Blog and education content structure.

## Website Information Architecture
- Home
- Shop Jewelry
- Loose Diamonds
- Custom Ring Builder
- Diamond Education
- Certificate Verification
- About VMORA
- Blog
- Wishlist
- Cart
- Checkout
- User Account
- Admin Dashboard

## Visual Design System
- Colors
  - Primary Gold: #C6A87D
  - Deep Black: #0B0B0B
  - Diamond White: #FFFFFF
  - Soft Grey: #F5F5F5
  - Accent: #D4AF37
- Typography
  - Heading: Playfair Display
  - Body: Inter
  - Luxury Highlight: Cormorant Garamond

## Detailed Feature Deliverables

### 1. Home Experience
- Hero with cinematic rotating diamond visual and sparkle overlay.
- Headline: Brilliance Beyond Time.
- CTA buttons: Explore Diamonds, Shop Jewelry.
- Category section for rings, earrings, necklaces, bracelets, loose diamonds.
- Best diamonds section with carat, color, clarity, price, quick view.
- Hover behavior on best-diamond cards plays preview video.
- Diamond education cards for 4Cs.
- Trust section for IGI certification, secure payments, insured shipping.

### 2. Loose Diamond Marketplace
- Dual result modes: table and grid.
- Filters:
  - Shape
  - Carat range
  - Price range
  - Color
  - Clarity
  - Cut
  - Polish
  - Symmetry
  - Fluorescence
  - Lab
  - Ratio
  - Depth
  - Table
- Table columns:
  - Shape
  - Carat
  - Color
  - Clarity
  - Cut
  - Price
  - Certificate
  - View

### 3. Diamond Product Page
- Left column:
  - Media gallery
  - V360 viewer iframe: https://v360.in/diamondview.aspx?cid=vd&d={stone_id}
  - Diamond video player (Nivoda link if present)
- Right column:
  - Specs: carat, shape, color, clarity, cut, polish, symmetry, table %, depth %, measurements
  - Price
  - Add to cart
  - Add to ring
- Lower section:
  - Embedded certificate viewer for IGI/GIA

### 4. Custom Ring Builder
- Step 1: Select diamond.
- Step 2: Select setting (Solitaire, Halo, Pave, Three Stone).
- Step 3: Select metal (Silver, White Gold, Yellow Gold, Rose Gold).
- Step 4: 3D ring preview and summary.

### 5. Excel Import System (Admin)
- File upload UI and parser workflow.
- Required column support:
  - Image path
  - Type
  - Branch
  - Stone ID
  - Shape
  - Carats
  - Color
  - Clarity
  - Cut
  - Polish
  - Symmetry
  - Price
  - Certificate number
  - Length
  - Width
  - Height
  - Table %
  - Depth %
  - Girdle %
  - Ratio
  - Certificate link
  - Video link
- Import flow:
  - Upload Excel
  - Parse via SheetJS
  - Validate
  - Reject duplicates by stone_id
  - Persist to database
  - Generate/update diamond product pages

### 6. Certificate System
- Auto-generate verification URL when certificate number exists.
- Show lab badge (IGI/GIA) and report number.
- Render certificate PDF or external viewer link.

### 7. Diamond Media System
- Media model supports image, video, 360 viewer.
- Render priority:
  - 360 viewer first
  - video second
  - image fallback

### 8. Diamond Comparison
- Compare up to 3 diamonds.
- Compare attributes:
  - Carat
  - Color
  - Clarity
  - Cut
  - Price

### 9. Admin Dashboard
- Product manager.
- Bulk diamond upload.
- Inventory management.
- Order management.
- Customer management.

## Technical Build Plan (Single Phase, Parallel Workstreams)

### Frontend (Next.js, React, TypeScript, Tailwind, Framer Motion)
- Build route structure and page shells.
- Implement shared UI components and design tokens.
- Build marketplace, product, comparison, and ring-builder interfaces.
- Add mobile-specific interactions (sticky buy bar, quick filters, swipe media).

### 3D and Viewer Layer
- Integrate Three.js scene components for luxury visual moments.
- Integrate V360 iframe on diamond detail pages.
- Add media orchestrator for V360/video/image fallback.

### Backend (NestJS)
- Build modules: auth, users, products, diamonds, import, orders, cart, wishlist, certificates, admin.
- Expose REST or GraphQL APIs for all client flows.
- Add validation and DTOs for import and product lifecycle.

### Data Layer (PostgreSQL)
- Core entities: users, addresses, diamonds, jewelry, media, certificates, orders, order_items, cart, wishlist, ring_builder_sessions.
- Add indexes for stone_id, price, carat, shape, color, clarity, cut, lab.

### Search Layer (Elasticsearch)
- Define diamond index mapping for numeric and faceted fields.
- Sync imported/updated diamonds to search index.
- Implement query builder for fast multi-filter search at 100k+ records.

### Storage Layer (AWS S3 and Cloudinary)
- Store images/videos with signed URLs.
- Support media ingestion from Excel links.

### SEO and Structured Data
- Add canonical metadata and route-level tags.
- Inject Product, FAQ, and Review schema JSON-LD.
- Ensure SEO-friendly dynamic routes for diamonds.

## Non-Functional Targets
- Performance:
  - Lazy-loaded media and route-level code splitting.
  - Optimized image delivery and caching.
- Security:
  - Role-based admin access.
  - Secure auth/session handling.
  - Payment data handled by provider-compliant flow.
- Reliability:
  - Input validation for all import and checkout APIs.
  - Graceful fallback for missing media/certificates.

## QA and Acceptance Checklist
- Home renders all luxury sections and interactions.
- Marketplace filters return accurate subsets and sort correctly.
- Diamond detail page loads V360/video/image based on priority.
- Certificate verification resolves IGI/GIA links and displays viewer.
- Ring builder supports full 4-step progression and add-to-cart handoff.
- Excel import rejects malformed rows and duplicates, and imports valid rows.
- Compare tool limits to 3 diamonds and renders required attributes.
- Mobile UX includes swipe gallery and sticky buy behavior.
- Structured data validates in schema testing tools.

## Optional Enhancements Included as Stretch Within Same Phase
- AI diamond recommendation module.
- Virtual try-on experience.
- Ring size detection.
- Price trend graph per diamond profile.

## Delivery Output for This Single Phase
- Fully branded VMORA application with customer and admin surfaces.
- Working API services and data pipeline for diamonds.
- Search-ready architecture for high-volume listings.
- Production deployment configuration and monitoring hooks.
