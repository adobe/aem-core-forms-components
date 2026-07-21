# Component Architecture Reference

## Core Forms Component Layers

The component-layer diagram lives
in `docs/architecture/overview.md`; the runtime data flow it links out to lives in
`docs/architecture/runtime-internals.md`. Those files are the single source of truth
for both — do not restate them here. Read `overview.md` before starting Phase 3. This
file covers only what that diagram doesn't: which Java base class and which JS base
class to extend for a new component.

## AbstractBaseImpl vs AbstractFieldImpl vs AbstractContainerImpl

This table is the single source of truth for base-class selection; other references and `SKILL.md` Phase 1 point here.

| Class | Use when | Provides |
|-------|----------|----------|
| `AbstractBaseImpl` | Step, display, or non-value component (button, text, image) | `id`, `name`, `visible`, `enabled`, `required`, `description`, `label`, `data` |
| `AbstractFieldImpl` | Captures a single user-submitted value (text, number, date) | Everything in Base + `readOnly`, `default`, `placeholder`, `constraints`, validation |
| `AbstractOptionsFieldImpl` | Options-based field (checkboxes, radios, selects) | Everything in Field + `enum`, `enumNames`, `enforceEnum` |
| `AbstractContainerImpl` | Holds child components (container/panel) | Everything in Base + child enumeration, container-specific behavior |

**Composite / split widget** (e.g. day/month/year — multiple visible inputs feeding one value): still extend the field base that matches the data type (`AbstractFieldImpl` for a date), but render **one hidden combined `<input>`** as the value-bearing widget plus the visible sub-inputs. This category has extra runtime rules — read `references/runtime-view-js.md` before writing the view JS.

## FormView.FormFieldBase vs FormView.FormContainer

| JS Base Class | Use when |
|---------------|----------|
| `FormView.FormFieldBase` | Component captures a value (field) |
| `FormView.FormContainer` | Component is a step, panel, or container |
