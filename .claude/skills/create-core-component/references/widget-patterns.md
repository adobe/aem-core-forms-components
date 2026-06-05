# Widget HTML Patterns

Replace the `<input>` placeholder in the HTL field template (template #7) with the appropriate element for the component type.

## Single-Line Text Input

```html
<input class="cmp-adaptiveform-{componentname}__widget"
       id="${widgetId}" type="text" name="${{componentname}.name}"
       data-cmp-data-layer="${{componentname}.data.json}"
       value="${{componentname}.default}"
       disabled="${!{componentname}.enabled}" readonly="${{componentname}.readOnly}"
       required="${{componentname}.required}" placeholder="${{componentname}.placeHolder}"
       minlength="${{componentname}.minLength}" maxlength="${{componentname}.maxLength}"
       aria-describedby="${{componentname}.id}__errormessage ${{componentname}.id}__longdescription ${{componentname}.id}__shortdescription"
       dir="auto"/>
```

## Multi-Line Textarea (shown when `{componentname}.multiLine` is true)

```html
<textarea data-sly-test="${{componentname}.multiLine}"
          class="cmp-adaptiveform-{componentname}__widget"
          id="${widgetId}" name="${{componentname}.name}"
          data-cmp-data-layer="${{componentname}.data.json}"
          disabled="${!{componentname}.enabled}" readonly="${{componentname}.readOnly}"
          required="${{componentname}.required}" placeholder="${{componentname}.placeHolder}"
          minlength="${{componentname}.minLength}" maxlength="${{componentname}.maxLength}"
          aria-describedby="${{componentname}.id}__errormessage ${{componentname}.id}__longdescription ${{componentname}.id}__shortdescription">
</textarea>
<input data-sly-test="${!{componentname}.multiLine}"
       class="cmp-adaptiveform-{componentname}__widget" id="${widgetId}" type="text"
       name="${{componentname}.name}" value="${{componentname}.default}"
       disabled="${!{componentname}.enabled}" readonly="${{componentname}.readOnly}"
       required="${{componentname}.required}" placeholder="${{componentname}.placeHolder}"
       minlength="${{componentname}.minLength}" maxlength="${{componentname}.maxLength}"
       aria-describedby="${{componentname}.id}__errormessage ${{componentname}.id}__longdescription ${{componentname}.id}__shortdescription"
       dir="auto"/>
```

## Number Input

```html
<input class="cmp-adaptiveform-{componentname}__widget"
       id="${widgetId}" type="number" name="${{componentname}.name}"
       value="${{componentname}.default}" min="${{componentname}.minimum}" max="${{componentname}.maximum}"
       disabled="${!{componentname}.enabled}" readonly="${{componentname}.readOnly}"
       required="${{componentname}.required}" placeholder="${{componentname}.placeHolder}"
       aria-describedby="${{componentname}.id}__errormessage ${{componentname}.id}__longdescription ${{componentname}.id}__shortdescription"/>
```

## File Input

```html
<input class="cmp-adaptiveform-{componentname}__widget"
       id="${widgetId}" type="file" name="${{componentname}.name}"
       data-cmp-data-layer="${{componentname}.data.json}"
       disabled="${!{componentname}.enabled}"
       required="${{componentname}.required}"
       accept="${{componentname}.accept}"
       aria-describedby="${{componentname}.id}__errormessage ${{componentname}.id}__longdescription ${{componentname}.id}__shortdescription"/>
```

## Select / Dropdown

```html
<select class="cmp-adaptiveform-{componentname}__widget"
        id="${widgetId}" name="${{componentname}.name}"
        data-cmp-data-layer="${{componentname}.data.json}"
        disabled="${!{componentname}.enabled}"
        required="${{componentname}.required}"
        aria-describedby="${{componentname}.id}__errormessage ${{componentname}.id}__longdescription ${{componentname}.id}__shortdescription">
    <sly data-sly-list.option="${{componentname}.enumNames}">
        <option value="${{componentname}.enum[itemList.index]}"
                selected="${{componentname}.default == {componentname}.enum[itemList.index]}">${option}</option>
    </sly>
</select>
```

## Custom / External Widget (e.g., signature pad, rich text, map)

```html
<div class="cmp-adaptiveform-{componentname}__widget"
     id="${widgetId}"
     data-cmp-data-layer="${{componentname}.data.json}"
     aria-describedby="${{componentname}.id}__errormessage ${{componentname}.id}__longdescription ${{componentname}.id}__shortdescription"
     role="presentation">
    <!-- JS will populate this container -->
</div>
```
