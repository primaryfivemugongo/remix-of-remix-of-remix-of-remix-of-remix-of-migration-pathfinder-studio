# Repository import

## Repository size cleanup
- [x] Remove 183 unused import observation files while preserving catalog test fixtures.
- [x] Remove 35 unreferenced local media files without changing active pictures, fonts or document viewers (44,927,063 bytes removed in total).
- [x] Verify all 132 tests and desktop/phone browsing after cleanup.

- [x] Import source pages, catalog and assets without replacing project infrastructure.
- [x] Install missing app dependencies and run source tests.
- [x] Verify library opening, browsing, search and document access on desktop and phone.

## Missing image recovery
- [x] Identify broken image paths across resource and class pages against the live source.
- [x] Replace 19 stale background/image/icon references with originals already imported into this project's media storage.
- [x] Verify all 19 media files return successfully and check resource/home images on desktop and phone.

## PWA install support
- [x] Add web app manifest, generated logo icons and head tags so Fresh App can be installed on phones.
- [x] Add cookie notice naming Fresh Teacher's Platform with a link to a new cookie policy page.
- [x] Add animated "Install the Fresh App" popup with Install now, Remind me later and Not Interested options.
- [x] Verify manifest, icons, cookie notice, policy page and all three popup options in the preview.

## Homepage shelf spacing
- [x] Remove the gaps below the navigation bar and after the last shelf.
- [x] Modestly enlarge shelves within the screen and verify phone and desktop layouts.

## Notice timing and returning visits
- [x] Delay the install offer until five minutes of visible browsing and avoid overlapping the cookie notice.
- [x] Remember cookie choices and app installation across visits.
- [x] Test timing, returning visits and installation suppression.

## PWA review
- [x] Use the existing logo on opaque white app icons.
- [x] Check and repair modern home-screen installation essentials without adding unrequested offline caching.
- [x] Verify phone and desktop installation flows and icon files (native OS installation remains published-device testing).

## Document SEO — first step
- [x] Generate factual document overviews and search descriptions from existing catalog metadata.
- [x] Show source-backed quick facts and useful document questions without promising FAQ search enhancements.
- [x] Verify document content tests, route metadata, and phone/desktop document pages with download links.

## Complete sitemap
- [ ] Generate and verify one sitemap containing every document landing page plus class and category pages. Blocked: this app has no published or confirmed public domain; never substitute its preview URL or the GitHub document host.

## Document information refinement
- [x] Move document facts beneath the viewer, remove the uploader line and use labelled facts instead of prose.
- [x] Keep "About this document" always visible and drop the FAQs section, then verify on desktop and phone.

## PDF loading
- [x] Restore the original flipbook's native loading lifecycle without a dark flash.
- [x] Make detail-page readiness survive early iframe loading and verify both reading modes and repeated opening.

## Menu loading
- [x] Replace document-card placeholders on selection pages with title and dropdown shapes.
- [ ] Verify loading and finished menu pages on phone and desktop while retaining document-list placeholders.
