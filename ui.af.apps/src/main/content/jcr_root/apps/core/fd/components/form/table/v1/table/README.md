# Adaptive Form Table (v1)

Adaptive Form Table component written in HTL that allows authors to capture data in a tabular format with rows and columns.

## Features

* **Container Component**: Can contain other form components in cells
* **Flexible Structure**: Supports header rows and multiple data rows
* **Configurable**: Authors can configure column widths, sorting, and styling
* **Accessible**: Proper ARIA roles and semantic HTML structure
* **Responsive**: Mobile-friendly table display

## Component Structure

```
table/
├── .content.xml                # Component definition
├── _cq_dialog/                 # Author dialog
├── _cq_template/               # Initial structure (2x2 table)
├── _cq_editConfig.xml          # Edit configuration
├── table.html                  # HTL rendering template
├── clientlibs/                 # Client libraries
│   ├── editor/                 # Author mode CSS/JS
│   └── site/                   # Runtime CSS/JS
└── README.md                   # This file
```

## Usage

### For Authors

1. Drag the "Adaptive Form Table (v1)" component onto the page
2. The component creates a default 2-column table with 1 header row and 1 data row
3. Configure the table properties in the dialog:
   - **Name**: Unique identifier
   - **Title**: Display title
   - **Description**: Help text
   - **Column Width**: Comma-separated proportions (e.g., "1,2,3")
   - **Enable Sorting**: Allow column sorting

### For Developers

#### HTL Template Structure

The component renders as follows:
```html
<div class="cmp-adaptiveform-table">
  <table>
    <thead>
      <tr> <!-- tableheader component -->
        <th>Column 1</th>
        <th>Column 2</th>
      </tr>
    </thead>
    <tbody>
      <tr> <!-- tablerow component -->
        <td>Cell content</td>
        <td>Cell content</td>
      </tr>
    </tbody>
  </table>
</div>
```

#### Child Components

- **tableheader**: Renders header row with `<th>` elements
- **tablerow**: Renders data row with `<td>` elements

## Current Implementation (Frontend-First)

This is Phase 1 implementation focusing on:
- ✅ Component structure and authoring
- ✅ HTL templates for rendering
- ✅ Basic CSS styling
- ✅ Edit configuration for drag-drop

## Future Enhancements (Phase 2 - Backend)

- [ ] Sling Model for business logic
- [ ] Dynamic column calculation
- [ ] Sorting implementation
- [ ] Repeatable rows (add/remove)
- [ ] JSON export for headless forms
- [ ] Advanced accessibility features
- [ ] Mobile layout options

## Technical Information

* **Component Group**: `.core-adaptiveform`
* **Super Type**: `core/fd/components/form/base/v1/base`
* **Client Library Categories**: 
  - `core.forms.components.table.v1` (site)
  - `core.forms.components.table.v1.editor` (author)

## Version Information

* **Version**: 1.0.0
* **Since**: 2024
* **Implemented by**: Phase 1 - Frontend First approach
