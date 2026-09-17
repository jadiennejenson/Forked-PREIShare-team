# Investor Listing Domain Brief

## Drafting prompt

Draft the PREIshare investor-listing domain brief from the client story and notes below. Keep the language business-focused and concrete. Define the listing shape and lifecycle without inventing UI, API, database, authentication, payment, or document-upload requirements. Flag unresolved choices instead of silently adding fields.

The draft must contain these sections:

1. Actors
2. Goals
3. Listing lifecycle statuses
4. Nested data groups
5. Success criteria for a valid listing

Use fixed values where the notes call for controlled vocabularies. Distinguish required fields from optional fields, and explain which requirements apply before publication versus throughout the listing lifecycle.

## Client story

PREIshare needs one shared definition of an investor listing for the internal team, investors, and the systems that will eventually present and persist listing data. An internal listing editor prepares and updates an opportunity. A reviewer or compliance partner checks that its status, price, contact information, and ownership relationships are trustworthy before publication. Investors browse published opportunities and need complete, consistent information. Future website, API, and database work should consume the same domain shape rather than inventing separate versions.

The immediate goal is a business-language brief that can guide later TypeScript types and validation. It should describe what makes a listing trustworthy and usable without deciding implementation syntax or storage design.

## Source notes

- A listing has a stable identifier, human-readable title, controlled property type, lifecycle status, short investor-facing description, and created/updated timestamps.
- Property types should use a fixed set. Current examples are `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, and `land`; the final set still needs agreement.
- Allowed lifecycle statuses are `draft`, `published`, `under_offer`, `sold`, and `archived`.
- `draft` is internal only. `published` is visible to investors. `under_offer` remains structured like a published listing. `sold` is retained for history. `archived` is removed from active browse but not deleted.
- Address data includes street line(s), city, region/state, postal code, and country.
- Financial data includes a numeric asking price and currency code, with optional projected-return metrics if the team agrees to track them.
- A listing has one or more investor contacts. Each contact has a name, role, and at least one reachable channel: email or phone.
- Ownership describes how each contact relates to the asset, such as primary owner, co-owner, or broker, with an optional ownership share.
- Ownership relationships should come from an agreed fixed set rather than free text.
- Published, under-offer, and sold listings must meet the full validity rules. Optional fields may be absent.
- The current application uses browser-side IndexedDB for the share flow; this brief does not imply a production backend or Supabase integration.

## Actors

Document the responsibilities, needs, and boundaries of each actor involved in creating, reviewing, publishing, browsing, or consuming an investor listing. At minimum, cover the listing editor, investor, reviewer/compliance role, and future systems.

## Goals

Describe the business outcomes the shared listing definition must support, including consistency across teams and screens, reliable investor-facing information, and validation before publication.

## Listing lifecycle statuses

Define each allowed status and its visibility, meaning, and transition implications. Do not add statuses beyond `draft`, `published`, `under_offer`, `sold`, and `archived` without marking them as an unresolved decision.

## Nested data groups

Describe the purpose and required/optional content of the address, financial summary, investor contacts, and ownership groups. Identify controlled values and relationships that should not be represented as unrestricted free text.

## Success criteria for a valid listing

State the validation rules for a valid listing as observable criteria. Include identity, controlled status and property type, complete location, financial summary, reachable contact, and valid ownership relationships. Make clear that `published`, `under_offer`, and `sold` listings require all mandatory data.

## Open decisions

Record unresolved choices separately from agreed requirements, including the final property-type vocabulary, the ownership-role vocabulary, timestamp format, and which projected-return metrics are worth tracking.
