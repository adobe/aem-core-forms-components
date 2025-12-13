# AEM Forms Core Components Documentation

## Overview

The AEM Forms Core Components library provides a set of standardized, reusable form components built on the Adobe Experience Manager (AEM) platform. These components are designed to accelerate form development, improve consistency, and enable seamless integration with AEM Sites and other Adobe Experience Cloud solutions.

**Last Updated:** 2025-12-13

---

## Table of Contents

1. [Introduction](#introduction)
2. [Core Components List](#core-components-list)
3. [Installation and Setup](#installation-and-setup)
4. [Component Specifications](#component-specifications)
5. [Development Guidelines](#development-guidelines)
6. [Styling and Customization](#styling-and-customization)
7. [Accessibility](#accessibility)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [API Reference](#api-reference)

---

## Introduction

### What are AEM Forms Core Components?

AEM Forms Core Components are a collection of pre-built, production-ready form components that follow the AEM Component Library standards. They provide:

- **Consistency**: Uniform behavior and appearance across all forms
- **Efficiency**: Reduced development time through reusable components
- **Accessibility**: Built-in WCAG 2.1 Level AA compliance
- **Flexibility**: Extensive customization options
- **Maintainability**: Centralized updates benefit all implementations
- **Performance**: Optimized rendering and minimal dependencies

### Key Features

- **Headless Ready**: Components work with both classic AEM and headless architectures
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Validation Support**: Built-in client-side and server-side validation
- **Data Binding**: Seamless integration with AEM form data models
- **Internationalization**: Multi-language support out of the box
- **Analytics Integration**: Built-in tracking capabilities

---

## Core Components List

### Input Components

#### 1. **Text Input**
- **Description**: Single-line text input field
- **Use Cases**: Names, emails, usernames, search queries
- **Key Features**:
  - Placeholder text support
  - Input masking
  - Pattern validation
  - Character limit enforcement
  - Auto-complete capabilities

#### 2. **Email Input**
- **Description**: Specialized text input for email addresses
- **Key Features**:
  - Built-in email validation
  - Automatic formatting
  - Accessibility enhancements
  - Mobile-optimized keyboard

#### 3. **Password Input**
- **Description**: Secure password field with visibility toggle
- **Key Features**:
  - Password strength indicator
  - Show/hide toggle
  - Custom validation rules
  - Secure memory handling

#### 4. **Textarea**
- **Description**: Multi-line text input field
- **Use Cases**: Comments, descriptions, long-form text
- **Key Features**:
  - Dynamic height adjustment
  - Character counter
  - Rich text editing option
  - Word count tracking

#### 5. **Number Input**
- **Description**: Numeric input with increment/decrement controls
- **Key Features**:
  - Min/max value constraints
  - Step increments
  - Currency formatting support
  - Negative number handling

#### 6. **Date Input**
- **Description**: Date picker component
- **Key Features**:
  - Multiple date format support
  - Date range validation
  - Localized calendars
  - Keyboard navigation

#### 7. **Time Input**
- **Description**: Time picker with hour and minute selection
- **Key Features**:
  - 12/24 hour format
  - Time range validation
  - Timezone support
  - Custom step intervals

#### 8. **URL Input**
- **Description**: URL input with automatic validation
- **Key Features**:
  - Protocol detection
  - URL format validation
  - Link preview capabilities

### Selection Components

#### 1. **Checkbox**
- **Description**: Boolean selection with toggle capability
- **Use Cases**: Terms acceptance, feature toggles, multi-select options
- **Key Features**:
  - Independent or grouped checkboxes
  - Indeterminate state support
  - Custom label positioning
  - Accessibility features

#### 2. **Radio Button**
- **Description**: Single selection from multiple options
- **Use Cases**: Preference selection, yes/no questions
- **Key Features**:
  - Mutually exclusive options
  - Vertical/horizontal layout
  - Dynamic option loading
  - Custom styling

#### 3. **Dropdown/Select**
- **Description**: Dropdown list for single or multiple selections
- **Key Features**:
  - Searchable options
  - Grouped options
  - Multi-select capability
  - Custom option rendering
  - Lazy loading support

#### 4. **Multi-Select**
- **Description**: Select multiple items from a list
- **Key Features**:
  - Tag-based display
  - Keyboard navigation
  - Search filtering
  - Option grouping
  - Custom formatting

#### 5. **Autocomplete**
- **Description**: Text input with dynamic suggestions
- **Key Features**:
  - Real-time suggestions
  - Highlighting matched text
  - Custom filtering logic
  - Debounced API calls

### Layout Components

#### 1. **Form Container**
- **Description**: Main wrapper for form elements
- **Key Features**:
  - Form state management
  - Event handling
  - Data binding integration
  - Submission handling

#### 2. **Panel**
- **Description**: Grouped section of form fields
- **Key Features**:
  - Collapsible panels
  - Nested panels support
  - Repeat panel functionality
  - Custom styling

#### 3. **Tabs**
- **Description**: Tabbed interface for organizing form sections
- **Key Features**:
  - Lazy loading tabs
  - Tab validation
  - Keyboard navigation
  - Responsive behavior

#### 4. **Section**
- **Description**: Semantic grouping of related fields
- **Key Features**:
  - Section headers
  - Conditional visibility
  - Custom layout options

### Action Components

#### 1. **Submit Button**
- **Description**: Primary action button for form submission
- **Key Features**:
  - Custom submit handling
  - Loading states
  - Disabled state management
  - Accessibility features

#### 2. **Reset Button**
- **Description**: Button to reset form fields to initial values
- **Key Features**:
  - Confirmation dialogs
  - Selective field reset
  - Custom reset logic

#### 3. **Custom Button**
- **Description**: Generic button for custom actions
- **Key Features**:
  - Custom event handlers
  - Dynamic content
  - Conditional rendering
  - Accessibility support

### Display Components

#### 1. **Text Display**
- **Description**: Static text or content rendering
- **Use Cases**: Instructions, labels, informational text
- **Key Features**:
  - Rich text support
  - Dynamic content binding
  - Conditional display

#### 2. **Image**
- **Description**: Image display component
- **Key Features**:
  - Responsive sizing
  - Alt text support
  - Lazy loading
  - Caption support

#### 3. **Link**
- **Description**: Hyperlink element
- **Key Features**:
  - Internal/external links
  - Custom styling
  - Click tracking

---

## Installation and Setup

### Prerequisites

- AEM 6.5 or higher
- Java 11 or higher
- Maven 3.6+
- NodeJS 14+ (for development)

### Installation Steps

#### 1. Add Dependency to pom.xml

```xml
<dependency>
    <groupId>com.adobe.aem</groupId>
    <artifactId>core-forms-components</artifactId>
    <version>2.0.0</version>
</dependency>
```

#### 2. Clone the Repository

```bash
git clone https://github.com/narendragandhi/aem-core-forms-components.git
cd aem-core-forms-components
```

#### 3. Build the Project

```bash
mvn clean install
```

#### 4. Deploy to AEM

```bash
mvn -PautoInstallPackage clean install
```

#### 5. Verify Installation

Navigate to AEM Tools → Deployment → Packages to verify successful installation.

---

## Component Specifications

### Standard Properties

All core components follow these standard properties:

```json
{
  "name": "Component name",
  "title": "Display title",
  "description": "Component description",
  "componentPath": "path/to/component",
  "type": "Component type",
  "resourceType": "aem/forms/components/...",
  "hideInComponentList": false,
  "editable": true,
  "configurable": true
}
```

### Data Model Structure

Components follow a unified data model:

```json
{
  "fieldName": "field_name",
  "fieldTitle": "Field Title",
  "fieldDescription": "Field description",
  "required": false,
  "readOnly": false,
  "visible": true,
  "value": null,
  "validated": false,
  "errorMessage": null,
  "customProperties": {}
}
```

---

## Development Guidelines

### Creating a Custom Component

#### Step 1: Extend Core Component

```java
public class CustomTextInput extends TextInput {
    @Override
    public void init() {
        super.init();
        // Custom initialization logic
    }
}
```

#### Step 2: Create HTL Template

```html
<div class="custom-text-input">
    <label for="${fieldName}">${fieldTitle}</label>
    <input 
        type="text" 
        id="${fieldName}" 
        name="${fieldName}"
        placeholder="${placeholder}"
        class="form-control"
        data-sly-attribute.required="${required ? 'required' : false}">
</div>
```

#### Step 3: Define CSS

```scss
.custom-text-input {
    margin-bottom: 1rem;
    
    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
    }
    
    input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        
        &:focus {
            outline: none;
            border-color: #0078d4;
            box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.1);
        }
    }
}
```

#### Step 4: Register Component

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root 
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    jcr:primaryType="cq:Component"
    jcr:title="Custom Text Input"
    componentGroup="Custom Forms">
    <content jcr:primaryType="cq:EditConfig"/>
</jcr:root>
```

---

## Styling and Customization

### CSS Class Naming Convention

Components use BEM (Block Element Modifier) methodology:

```css
.component-name { } /* Block */
.component-name__element { } /* Element */
.component-name--modifier { } /* Modifier */
```

### Overriding Component Styles

#### Method 1: CSS Variables

```css
:root {
    --primary-color: #0078d4;
    --input-padding: 0.75rem;
    --input-border-radius: 4px;
}
```

#### Method 2: Component-Level Overrides

```scss
.custom-override .text-input {
    padding: 1rem;
    font-size: 1.1rem;
    border-color: #333;
}
```

#### Method 3: Child Theme

Create a custom theme package extending core styles.

---

## Accessibility

### WCAG 2.1 Compliance

All components meet WCAG 2.1 Level AA standards:

- **Perceivable**: Clear labels, sufficient color contrast, alt text for images
- **Operable**: Keyboard navigation, sufficient time, seizure prevention
- **Understandable**: Clear language, consistent navigation, error prevention
- **Robust**: Valid HTML, ARIA support, browser compatibility

### Accessibility Features

#### 1. Semantic HTML

```html
<form role="form">
    <fieldset>
        <legend>Contact Information</legend>
        <input aria-label="Email Address" type="email">
    </fieldset>
</form>
```

#### 2. ARIA Attributes

```html
<input 
    aria-label="Full Name"
    aria-required="true"
    aria-invalid="false"
    aria-describedby="error-message">
```

#### 3. Keyboard Navigation

- Tab: Move to next field
- Shift+Tab: Move to previous field
- Enter: Submit form or activate button
- Space: Toggle checkbox/radio
- Arrow Keys: Navigate options in dropdowns

#### 4. Screen Reader Support

Components include proper heading structure, role definitions, and announcements.

---

## Best Practices

### 1. Form Design

- **Progressive Disclosure**: Show fields conditionally to reduce cognitive load
- **Clear Labels**: Use descriptive, concise labels
- **Error Messages**: Provide specific, helpful error messages
- **Validation Timing**: Validate on blur for immediate feedback
- **Visual Hierarchy**: Use spacing and typography to guide users

### 2. Performance

```javascript
// Debounce validation
const debounceValidation = (fn, delay = 300) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};
```

### 3. Security

- **Input Sanitization**: Always sanitize user input
- **CSRF Protection**: Include CSRF tokens in form submissions
- **Server-Side Validation**: Never rely solely on client-side validation
- **Secure Data Transmission**: Use HTTPS for all form submissions

### 4. Testing

```javascript
// Example unit test
describe('TextInput Component', () => {
    it('should validate email format', () => {
        const component = new TextInput({ type: 'email' });
        expect(component.validate('test@example.com')).toBe(true);
        expect(component.validate('invalid')).toBe(false);
    });
});
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Component Not Appearing

**Causes**:
- Component not installed
- Incorrect resource type
- Missing permissions

**Solutions**:
```bash
# Verify installation
curl -u admin:admin http://localhost:4502/crx/packmgr/index.jsp

# Check logs
tail -f crx-quickstart/logs/error.log

# Clear cache
curl -X POST -u admin:admin http://localhost:4502/system/console/jcrclassloaders
```

#### Issue 2: Validation Not Working

**Causes**:
- Validation rules not configured
- JavaScript errors
- Missing validator

**Solutions**:
- Check browser console for JavaScript errors
- Verify validation configuration in component properties
- Ensure server-side validation is implemented

#### Issue 3: Styling Issues

**Causes**:
- CSS conflicts
- Missing stylesheets
- Browser compatibility issues

**Solutions**:
- Use browser dev tools to inspect styles
- Check for CSS specificity conflicts
- Use PostCSS for vendor prefixes

---

## API Reference

### Core Component APIs

#### TextInput Component

```typescript
interface TextInputProps {
    fieldName: string;
    fieldTitle: string;
    placeholder?: string;
    required?: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
}
```

#### Form Container API

```typescript
interface FormContainer {
    submit(): Promise<SubmitResponse>;
    reset(): void;
    getFieldValue(fieldName: string): any;
    setFieldValue(fieldName: string, value: any): void;
    getFormData(): Record<string, any>;
    validate(): ValidationResult;
    addEventListener(event: string, handler: Function): void;
    removeEventListener(event: string, handler: Function): void;
}
```

#### Validation API

```typescript
interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings?: ValidationWarning[];
}

interface ValidationError {
    fieldName: string;
    message: string;
    code: string;
}
```

---

## Resources and Support

- **GitHub Repository**: [aem-core-forms-components](https://github.com/narendragandhi/aem-core-forms-components)
- **Issue Tracker**: Report bugs and feature requests on GitHub Issues
- **Documentation**: See `/docs` directory for detailed guides
- **Examples**: Check `/examples` directory for implementation samples
- **Community**: Join discussions on Adobe Community Forums

---

## Version History

| Version | Release Date | Key Features | Status |
|---------|--------------|--------------|--------|
| 2.0.0   | 2025-12-13   | Initial release, Core components, Accessibility compliance | Stable |
| 1.9.0   | 2025-11-01   | Beta release, Feature testing | Deprecated |

---

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Code style
- Testing requirements
- Commit message format
- Pull request process

---

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-13 20:43:42 UTC  
**Maintained By**: AEM Forms Core Components Team
