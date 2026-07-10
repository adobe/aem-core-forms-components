# Widget HTML Patterns

Replace the `<input>` placeholder in the HTL field template (template #7) with the appropriate element for the component type.

## Standard widget attributes

Every widget element carries this base attribute set. The patterns below list **only the attributes that are added or changed** on top of it — do not re-type these on each widget.

```html
class="cmp-adaptiveform-{componentname}__widget"
id="${widgetId}"
name="${{componentname}.name}"
data-cmp-data-layer="${{componentname}.data.json}"
disabled="${!{componentname}.enabled}"
readonly="${{componentname}.readOnly}"
required="${{componentname}.required}"
aria-describedby="${{componentname}.id}__errormessage ${{componentname}.id}__longdescription ${{componentname}.id}__shortdescription"
```

Notes:
- `readonly` does not apply to `file`, `select`, or custom `div` widgets — omit it there.
- The `aria-describedby` triple (errormessage / longdescription / shortdescription) is mandatory on every widget; see `references/accessibility-checklist.md`.

## Single-Line Text Input

Base attributes plus:

```html
<input type="text" value="${{componentname}.default}"
       placeholder="${{componentname}.placeHolder}"
       minlength="${{componentname}.minLength}" maxlength="${{componentname}.maxLength}"
       dir="auto"/>
```

## Multi-Line Textarea (shown when `{componentname}.multiLine` is true)

Renders a `<textarea>` when `multiLine` is set, otherwise the single-line `<input>` above. Both carry the base attributes; the textarea adds `placeholder`, `minlength`, `maxlength` (no `value`/`type`/`dir`).

```html
<textarea data-sly-test="${{componentname}.multiLine}"
          placeholder="${{componentname}.placeHolder}"
          minlength="${{componentname}.minLength}" maxlength="${{componentname}.maxLength}">
</textarea>
<input data-sly-test="${!{componentname}.multiLine}" type="text"
       value="${{componentname}.default}" placeholder="${{componentname}.placeHolder}"
       minlength="${{componentname}.minLength}" maxlength="${{componentname}.maxLength}"
       dir="auto"/>
```

## Number Input

Base attributes plus:

```html
<input type="number" value="${{componentname}.default}"
       min="${{componentname}.minimum}" max="${{componentname}.maximum}"
       placeholder="${{componentname}.placeHolder}"/>
```

## File Input

Base attributes (omit `readonly`) plus:

```html
<input type="file" accept="${{componentname}.accept}"/>
```

## Select / Dropdown

Base attributes (omit `readonly`) plus the options list:

```html
<select>
    <sly data-sly-list.option="${{componentname}.enumNames}">
        <option value="${{componentname}.enum[itemList.index]}"
                selected="${{componentname}.default == {componentname}.enum[itemList.index]}">${option}</option>
    </sly>
</select>
```

## Custom / External Widget (e.g., signature pad, rich text, map)

Base attributes (omit `readonly`) plus `role="presentation"`; JS populates the container:

```html
<div role="presentation">
    <!-- JS will populate this container -->
</div>
```
