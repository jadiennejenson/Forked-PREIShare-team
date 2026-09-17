# Investor Listing Field Inventory

This inventory translates the [investor listing domain brief](investor-listing-domain-brief.md) into a field-level reference. It describes business data only; exact TypeScript syntax, persistence, and UI controls are out of scope.

## Requiredness legend

- **Required**: expected on every listing record.
- **Required for publishable listing**: may be incomplete while `draft`, but must be present for `published`, `under_offer`, or `sold`.
- **Optional**: may be absent when the business does not have the information.
- **Conditional**: required when the stated condition applies.

## Identity and core listing fields

| Field name | Plain-language meaning | Data shape | Required vs optional | Example value |
|---|---|---|---|---|
| `id` | Stable identifier for the listing across edits and systems. | text | Required | `listing_1024` |
| `title` | Human-readable name investors use to recognize the opportunity. | text | Required | `Riverside Apartments` |
| `property_type` | Controlled category describing the real-estate asset. | fixed choice | Required for publishable listing; final choice set is still open | `multifamily` |
| `status` | Current lifecycle state and visibility of the listing. | fixed choice | Required | `draft` |
| `description` | Short explanation of the opportunity for investors. | text | Required for publishable listing | `Value-add multifamily opportunity near downtown employment centers.` |
| `created_at` | Business timestamp for when the listing was created. | text | Required | `2026-09-17T14:30:00Z` |
| `updated_at` | Business timestamp for the latest listing change. | text | Required | `2026-09-17T16:05:00Z` |

### Allowed `status` values

| Value | Meaning | Investor visibility |
|---|---|---|
| `draft` | Being prepared or edited internally. | Not visible |
| `published` | Approved and available for investor browsing. | Visible |
| `under_offer` | Receiving active interest while retaining the published listing structure. | Visible, subject to product policy |
| `sold` | Deal closed and retained for history. | Not part of active browse; historical visibility is a product decision |
| `archived` | Removed from active browse without deletion. | Not visible in active browse |

### Current property-type choices

The current examples for the controlled property-type vocabulary are `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, and `land`. The final set must be agreed before types or validation are finalized.

## Address

`address` is the location information needed to identify and locate the asset.

| Field name | Plain-language meaning | Data shape | Required vs optional | Example value |
|---|---|---|---|---|
| `address` | Complete property location grouped as one value. | nested object | Required for publishable listing | `{ ... }` |
| `address.street_lines` | One or more street address lines. | list | Required for publishable listing | `["125 Riverside Drive", "Building A"]` |
| `address.city` | City or locality where the asset is located. | text | Required for publishable listing | `Austin` |
| `address.region` | State, province, territory, or equivalent region. | text | Required for publishable listing | `Texas` |
| `address.postal_code` | Postal or ZIP code for the location. | text | Required for publishable listing | `78701` |
| `address.country` | Country where the asset is located. | text | Required for publishable listing | `United States` |

## Financial summary

`financial_summary` contains the pricing information needed to evaluate and publish the opportunity. Projected-return metrics remain optional until the team agrees which metrics to track.

| Field name | Plain-language meaning | Data shape | Required vs optional | Example value |
|---|---|---|---|---|
| `financial_summary` | Group of listing-level financial information. | nested object | Required for publishable listing | `{ ... }` |
| `financial_summary.asking_price` | Numeric amount requested for the asset. | number | Required for publishable listing | `18500000` |
| `financial_summary.currency` | Currency code for the asking price. | fixed choice | Required for publishable listing | `USD` |
| `financial_summary.projected_return` | Optional projected-return information agreed by the team. | nested object | Optional | `{ ... }` |
| `financial_summary.projected_return.cap_rate` | Optional projected capitalization rate. | number | Optional | `0.065` |
| `financial_summary.projected_return.irr` | Optional projected internal rate of return. | number | Optional | `0.14` |

The exact currency vocabulary and projected-return metric set should be confirmed before implementation. The examples above do not make those optional metrics mandatory.

## Investor contacts

`investor_contacts` identifies people associated with the listing who can respond to investor interest. A valid publishable listing has at least one contact and at least one reachable channel per contact.

| Field name | Plain-language meaning | Data shape | Required vs optional | Example value |
|---|---|---|---|---|
| `investor_contacts` | People tied to the listing and available to respond. | list | Required for publishable listing; must contain at least one item | `[ ... ]` |
| `investor_contacts[].name` | Contact’s full name. | text | Required for every contact | `Jordan Lee` |
| `investor_contacts[].role` | Contact’s business role in relation to the listing workflow. | text | Required for every contact | `Acquisitions Director` |
| `investor_contacts[].email` | Email address through which the contact can be reached. | text | Conditional: email or `phone` must be present | `jordan.lee@example.com` |
| `investor_contacts[].phone` | Phone number through which the contact can be reached. | text | Conditional: phone or `email` must be present | `+1-512-555-0142` |
| `investor_contacts[].ownership` | How this contact relates to the asset. | nested object | Required for publishable listing | `{ ... }` |

## Ownership

`ownership` records the asset relationship for each investor contact. The relationship must use an agreed fixed vocabulary rather than unrestricted free text.

| Field name | Plain-language meaning | Data shape | Required vs optional | Example value |
|---|---|---|---|---|
| `investor_contacts[].ownership.relationship` | Controlled description of the contact’s relationship to the asset. | fixed choice | Required for publishable listing | `primary_owner` |
| `investor_contacts[].ownership.share` | Optional percentage or fraction of ownership associated with the contact. | number | Optional | `50` |

Current relationship examples are `primary_owner`, `co_owner`, and `broker`. The final ownership-role vocabulary must be agreed before implementation. A broker relationship may describe representation without implying an ownership share.

## Valid-listing summary

For `published`, `under_offer`, or `sold` status, a listing is valid when it has:

- a non-empty `id` and `title`;
- an allowed `status` and an agreed allowed `property_type`;
- a non-empty investor-facing `description`;
- a complete `address` with street lines, city, region, postal code, and country;
- a numeric `asking_price` and currency code in `financial_summary`;
- at least one investor contact with a name, role, and either an email or phone number; and
- an allowed ownership relationship for each contact.

Optional fields, including projected-return metrics and ownership share, may be absent. A `draft` may be incomplete while it is being prepared, but it must not be treated as investor-ready until the publishable-listing rules are satisfied.

## Open decisions

- Final `property_type` choice set.
- Final ownership relationship choice set.
- Currency-code policy and supported currencies.
- Timestamp format and timezone policy.
- Projected-return metrics to support, if any.
- Whether `under_offer` and `sold` remain investor-visible or are only retained for internal/history views.
