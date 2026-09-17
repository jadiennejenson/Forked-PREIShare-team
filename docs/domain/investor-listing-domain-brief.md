# Investor Listing Domain Brief

## Purpose and context

PREIshare needs one shared business definition of an investor listing for internal teams, investors, and the systems that will eventually present and persist listing data. The definition should guide later types and validation without deciding UI, API, database, authentication, payment, or document-upload design.

An investor listing represents a real-estate opportunity with enough consistent information for an investor to understand what is being offered, where it is located, what price is being asked, and whom to contact. Draft listings may be incomplete while they are being prepared, but listings shown as ready for investors must meet the validity rules below.

## Actors

### Listing editor

The listing editor is an internal operations user who creates and maintains an opportunity. This person supplies the title, description, property classification, location, financial summary, contacts, and ownership relationships. The editor may work on a listing while it is still a `draft` and is responsible for keeping the information current as the opportunity changes.

### Investor

The investor is the end user who browses opportunities and decides whether to pursue one. Investors need information that is complete, understandable, current, and consistent across listings. They should be able to identify the asset, understand its broad financial proposition, and reach an appropriate contact without relying on missing or improvised fields.

### Reviewer or compliance role

The reviewer checks a listing before it becomes visible to investors. This role verifies that the status, price, currency, location, contact details, and ownership relationships are credible and represented using the agreed vocabulary. Review is a business responsibility; the listing should not be considered publishable merely because it has been saved.

### Future systems

The future website, API, database, and reporting tools are consumers of the same listing definition. They should share the domain meaning and controlled values rather than creating separate interpretations of status, property type, financial data, or ownership.

## Goals

- Establish one shared definition of an investor listing across operations, investor-facing experiences, and future systems.
- Give investors a dependable summary of the opportunity, including identity, location, price, currency, contacts, and ownership context.
- Make the difference between an incomplete working draft and an investor-ready listing explicit.
- Catch missing, ambiguous, or invalid information before publication through clear business rules and controlled choices.
- Preserve useful history when an opportunity is under offer, sold, or archived without treating every non-active listing as deleted.
- Keep nested information such as address, financial summary, contacts, and ownership organized so later types and validation can follow the same model.

## Listing lifecycle statuses

Only the following statuses are allowed:

| Status | Business meaning | Visibility and expectations |
|---|---|---|
| `draft` | The opportunity is being prepared or edited internally. | Not visible to investors. It may be incomplete, but it should become publishable before moving to an investor-facing state. |
| `published` | The opportunity has passed review and is available for investor consideration. | Visible to investors. All required listing information must be present and valid. |
| `under_offer` | An investor has expressed active interest or negotiations are in progress. | Retains the structure of a published listing. Visibility and any explanatory messaging are product decisions, but the underlying data must remain complete and trustworthy. |
| `sold` | The opportunity has reached a closed deal. | Retained for history rather than deleted. It must continue to satisfy the required data rules so its record remains reliable. |
| `archived` | The opportunity is no longer active and has been removed from active browsing. | Not shown in active browse. The record is retained rather than deleted. |

A listing may be edited as its status changes, but a status must always communicate a real business state. Free-text status variants are not allowed. The exact transition permissions and visibility of `under_offer` and `sold` require product agreement, but no additional lifecycle statuses should be introduced without revising this brief.

## Nested data groups

### Address

The address identifies where the asset is located. It includes one or more street lines, city, region or state, postal code, and country. For a listing that investors can rely on, the address must contain enough information to locate the property; an incomplete or vague location is not sufficient.

### Financial summary

The financial summary gives investors the basic price context for the opportunity. It includes a numeric asking price and the currency code that qualifies that amount. Projected-return measures may be added as optional information after the team agrees which measures are meaningful and how they should be described. Optional projections must never substitute for the asking price and currency.

### Investor contacts

Investor contacts are the people associated with the listing who can respond to interest. A publishable listing has at least one contact. Every contact has a name, a business role, and at least one reachable channel: an email address or a phone number. Contact information should identify a real point of follow-up rather than a generic or unusable placeholder.

### Ownership

Ownership explains how each listed contact relates to the asset, such as primary owner, co-owner, or broker. The relationship must come from an agreed fixed vocabulary, not unrestricted free text. An ownership share may be included when it is known and relevant; it is optional, and a broker relationship does not necessarily imply an ownership share.

### Core listing identity

The nested groups support a set of core listing fields: a stable identifier, human-readable title, controlled property type, lifecycle status, short investor-facing description, and created/updated timestamps. Property type must use the agreed fixed set; current candidates are `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, and `land`.

## Success criteria for a valid listing

A listing is valid for `published`, `under_offer`, or `sold` status only when all of these concrete rules pass:

1. **Identity:** `id` is non-empty and `title` is non-empty.
2. **Status:** `status` is exactly one of the closed list `draft`, `published`, `under_offer`, `sold`, or `archived`.
3. **Property classification:** `property_type` is one of the agreed fixed property-type values.
4. **Address:** `address` is complete, including street line(s), city, region or state, postal code, and country.
5. **Financial summary:** `financial_summary` contains a numeric `asking_price` and a `currency` value.
6. **Reachable contact:** `investor_contacts` contains at least one contact with a name, role, and either an email address or phone number.
7. **Ownership:** each contact has an ownership relationship from the agreed fixed vocabulary.
8. **Description and record history:** the investor-facing description, created timestamp, and updated timestamp are present.

Optional projected-return metrics and ownership shares may be absent. A `draft` may omit information while the editor is preparing it, but it must not be presented as investor-ready until the required criteria are satisfied. `archived` records are retained for history and should preserve the information needed to understand what the listing represented, even though they are not active browse results.

## Open decisions

Record unresolved choices separately from agreed requirements, including the final property-type vocabulary, the ownership-role vocabulary, timestamp format, and which projected-return metrics are worth tracking.
