# Table Component — QA Test Plan

Branch: `tableComponentFirstCheckIn`

---

## Prerequisites

- AEM instance running with the `tableComponentFirstCheckIn` branch deployed
- Open the table sample pages under `/content/core-components-examples/...`
- Three sample pages are available for runtime tests: `basic`, `columnwidth`, `sorting`, `mergesplit`

---

## 1. Basic Structure & Rendering

| # | What to test | Expected result |
|---|---|---|
| 1.1 | Load a page with a Table component | Table renders with `<table>`, `<thead>`, `<tbody>` tags |
| 1.2 | Table label visibility | Label appears above the table when authored |
| 1.3 | Table visibility/enabled state | Toggling visible/enabled via rules hides or disables the table |
| 1.4 | Header row renders `<th>` cells with `scope="col"` | Each header cell has correct semantic HTML |
| 1.5 | Static (non-repeatable) table row renders `<tr>` inside `<tbody>` | No add/remove buttons visible on static rows |
| 1.6 | Static row has the correct number of `<td>` cells | Cell count matches column count |
| 1.7 | Short description / long description / question mark | Help text renders below the table title |

---

## 2. Authoring (Edit Dialog)

| # | What to test | Expected result |
|---|---|---|
| 2.1 | Insert Table component into a form container | Component drops in and renders in authoring mode |
| 2.2 | Open Table edit dialog | Dialog opens with fields: Title, Name, Description, Column Width, Enable Sorting |
| 2.3 | Open TableRow Repeat Panel tab | Fields for Min Occur / Max Occur are present and editable |
| 2.4 | Add a column via toolbar action on a header cell | New column appended to both `<thead>` and all `<tbody>` rows |
| 2.5 | Delete a column via toolbar action on a header cell | Column removed from header and all body rows |
| 2.6 | Replace a table cell with another component | Cell is replaced via the Replace action |

---

## 3. Column Width

| # | What to test | Expected result |
|---|---|---|
| 3.1 | Author comma-separated column widths (e.g. `1,2,1`) | `<colgroup>` with `<col>` elements injected into the table |
| 3.2 | Number of `<col>` elements matches column count | Column count equals the number of weights |
| 3.3 | First `<col>` width ≈ 25% (weight 1 of sum 4) | Width attribute is approximately 25% |
| 3.4 | Second `<col>` width ≈ 50% (weight 2 of sum 4) | Width attribute is approximately 50% |
| 3.5 | Third `<col>` width ≈ 25% (weight 1 of sum 4) | Width attribute is approximately 25% |
| 3.6 | Table with no Column Width authored | No `<colgroup>` rendered |
| 3.7 | Column count in header still matches when Column Width is set | Header `<th>` count equals `<col>` count |
| 3.8 | No sort buttons on a table where sorting is not enabled | Sort buttons absent when `enableSorting` is false |

---

## 4. Sorting

| # | What to test | Expected result |
|---|---|---|
| 4.1 | Author a table with `enableSorting = true` | Sort buttons appear on all header columns that have sorting enabled |
| 4.2 | Column with `disableSorting = true` | No sort button on that column's header |
| 4.3 | `data-cmp-sorting-enabled="true"` attribute on table element | Attribute present in both authoring and publish DOM |
| 4.4 | Sort button has correct `aria-label` | Accessible label reflects sort action |
| 4.5 | Sort button carries `data-cmp-hook-table-sort` with column index | Index matches the column position (0-based) |
| 4.6 | Sorted header `<th>` has `.cmp-adaptiveform-table__sort-header-inner` wrapper | Inner wrapper element exists |
| 4.7 | First click on sort button | `--asc` modifier class added; `aria-sort="ascending"` set on that `<th>` |
| 4.8 | Second click on same column sort button | Switches to `--desc` modifier; `aria-sort="descending"` |
| 4.9 | Other header cells have no `aria-sort` after a sort | Only the active column has `aria-sort` |
| 4.10 | Ascending sort reorders rows A → Z | Row order matches alphabetical ascending on the sorted column |
| 4.11 | Descending sort reorders rows Z → A | Row order matches alphabetical descending |
| 4.12 | Row count unchanged after sorting | `<tbody>` still has the same number of `<tr>` elements |
| 4.13 | Non-active column has neither `--asc` nor `--desc` class | Modifier classes absent on inactive sort headers |
| 4.14 | Remove sorting on a column via toolbar (`removecolumnsorting`) | Sort button disappears from that column |
| 4.15 | Restore sorting on a column via toolbar (`enablecolumnsorting`) | Sort button reappears on that column |
| 4.16 | Toggle both columns sorting on/off | Total sort button count changes correctly |

---

## 5. Repeatable Rows (Runtime)

| # | What to test | Expected result |
|---|---|---|
| 5.1 | Repeatable row renders Add (+) and Remove (−) buttons | Both buttons visible on the row |
| 5.2 | Add button `data-hook` references its own row ID | Hook attribute value matches the row's `id` |
| 5.3 | Remove button `data-hook` references its own row ID | Hook attribute value matches the row's `id` |
| 5.4 | At minimum occurrence (1 instance) remove button is hidden | Remove button not visible when only 1 row exists |
| 5.5 | Add button visible when instance count is below `maxOccur` | Add button visible below the limit |
| 5.6 | Click Add button | New row appended; `<tbody>` row count increases by 1 |
| 5.7 | Added rows have unique `id` attributes | No duplicate IDs in the DOM |
| 5.8 | Add/Remove hooks on cloned rows point to the correct row ID | Hook attributes update correctly after cloning |
| 5.9 | When `maxOccur` is reached | Add button hidden on all rows |
| 5.10 | Instance Manager reflects correct count at `maxOccur` | JS model `items` count matches the DOM |
| 5.11 | Click Remove button | Row removed; row count decreases by 1 |
| 5.12 | When `minOccur` is reached after removal | Remove button hidden on remaining row(s) |

---

## 6. Merge & Split Row Cells (Authoring)

| # | What to test | Expected result |
|---|---|---|
| 6.1 | A merged cell has `colspan=2` in JCR | Property set correctly on the node |
| 6.2 | Merged cell renders with `colspan="2"` in authoring DOM | `colspan` attribute present on the `<td>` |
| 6.3 | Header cells have no `colspan` (header merge not yet supported) | No `colspan` on `<th>` elements |
| 6.4 | Unmerged row cells have no `colspan` | `colspan` absent on normal cells |
| 6.5 | `splitrowcell` action on a merged cell (colspan=2) | Row cell count increases by 1 |
| 6.6 | After split, the cell no longer has a `colspan` attribute | `colspan` removed from the split cell |
| 6.7 | `mergerowcells` with only a single cell selected | Validation error dialog shown |
| 6.8 | Error dialog closes after clicking OK | Dialog dismisses and row cell count is unchanged |

---

## 7. Document of Record (DoR)

| # | What to test | Expected result |
|---|---|---|
| 7.1 | Submit a form containing the table | DoR PDF generated includes the table structure |
| 7.2 | Column widths are reflected in DoR | Column proportions in DoR match authored `columnWidth` values |

---

## Known Limitations / Not Yet Supported

- **Header cell merge**: Merging `<th>` cells is intentionally commented out in this build and is **not testable**.
