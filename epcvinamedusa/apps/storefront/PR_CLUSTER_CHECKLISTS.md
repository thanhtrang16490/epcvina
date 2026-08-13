# PR Cluster Checklists

Use these checklists to ship marketing changes in small, safe PRs.

## PR 1 - Homepage

- [ ] Update homepage title, description, and keywords
- [ ] Keep homepage as the site-wide hub, not a single-offer landing page
- [ ] Route hero CTA to `calculator`
- [ ] Route secondary CTA to `bao-gia`
- [ ] Make the right-side hero panel point to Solar Home and Solar C&I
- [ ] Keep internal links to all top-level hubs
- [ ] Verify FAQ answers match current offers
- [ ] Run `geo:audit`

## PR 2 - Solar Home

- [ ] Keep `/solar-home` as the family hub
- [ ] Separate messaging for On-Grid, Hybrid, and Hybrid + Battery
- [ ] Make `/dien-mat-troi-gia-dinh` answer general family intent
- [ ] Make `/dien-mat-troi-nha-pho` answer townhouse intent
- [ ] Make `/dien-mat-troi-biet-thu` answer villa intent
- [ ] Point all family pages to `calculator` and `bao-gia`
- [ ] Verify house-type pages do not compete on the same keyword
- [ ] Run `geo:audit`

## PR 3 - Solar C&I

- [ ] Keep `/solar-cong-nghiep` as the industrial hub
- [ ] Make business language focus on ROI, ESG, uptime, and scale
- [ ] Separate industrial hub from application pages
- [ ] Add links to provincial landing pages
- [ ] Add links to `calculator` and `bao-gia`
- [ ] Run `geo:audit`

## PR 4 - Hybrid / BESS

- [ ] Keep `/hybrid-bess` as the storage hub
- [ ] Separate hybrid, storage, and backup use cases
- [ ] Make `calculator/pin-luu-tru` support the decision path
- [ ] Make `bao-gia-pin-luu-tru` the lead capture page
- [ ] Confirm dynamic slug titles stay unique
- [ ] Run `geo:audit`

## PR 5 - EV Charging

- [ ] Keep `/sac-ev` as the EV hub
- [ ] Separate home charging from combined solar charging
- [ ] Keep `bao-gia-sac-xe-dien` as the conversion page
- [ ] Ensure calculator pages route to EV quote or contact
- [ ] Run `geo:audit`

## PR 6 - Quotes And Calculators

- [ ] Keep `/bao-gia` as the main quote hub
- [ ] Make each quote child page answer one buying intent
- [ ] Keep `/calculator` as the cost/ROI hub
- [ ] Keep each calculator child focused on one job
- [ ] Route all calculator results toward quote or contact
- [ ] Run `geo:audit`

## PR 7 - Content And Authority

- [ ] Keep `/tin-tuc` focused on editorial content
- [ ] Keep `/kien-thuc` as foundational knowledge
- [ ] Keep `/hoi-dap` as the FAQ authority hub
- [ ] Keep `/doi-tac`, `/nhan-hang`, and `/thiet-bi` as authority/support hubs
- [ ] Link editorial pages back to the conversion hubs
- [ ] Verify no page is cannibalizing a landing page
- [ ] Run `geo:audit`

## PR 8 - Trust Pages

- [ ] Keep brand/legal pages consistent with `EPCVINA Solar`
- [ ] Ensure `noindex` is set where needed
- [ ] Make policies and support pages link back to conversion hubs
- [ ] Confirm contact and trust signals are consistent across the site
- [ ] Run `geo:audit`

## Release Gate

- [ ] Brand is consistent on public pages
- [ ] No duplicate title or description issues
- [ ] No competing intent within a cluster
- [ ] Hub pages link to their clusters
- [ ] Cluster pages link back to the hub
- [ ] `geo:audit` returns `Issues found: 0`

