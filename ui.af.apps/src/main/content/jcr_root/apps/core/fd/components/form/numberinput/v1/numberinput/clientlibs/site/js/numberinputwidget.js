/*******************************************************************************
 * Copyright 2022 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

/**
 * This class is responsible for interacting with the numeric input widget. It implements edit/display format
 * for numeric input, along with the following features
 * - Convert's input type number to text to support display/edit format (for example `$` symbol)
 * - One cannot type or paste alphabets in the html input element
 */
class NumericInputWidget {
    #widget=null
    #model=null // passed by reference
    #options=null
    #defaultOptions={
        value : null,
        curValue: null,
        pos: 0,
        lengthLimitVisible: true,
        zero:"0",
        decimal:".",
        minus:"-"
    }
    //TODO: to support writing in different locales \d should be replaced by [0-9] for different locales
    #matchArray ={
        "integer":"^[+-]?{digits}*$",
        "decimal":"^[+-]?{digits}{leading}({decimal}{digits}{fraction})?$",
        "float":"^[+-]?{digits}*({decimal}{digits}*)?$"
    }
    #regex=null
    #processedValue=null
    #engRegex=null
    #writtenInLocale=false
    #previousCompositionVal=""

    #toLatinForm    (halfOrFullWidthStr) {
        // refer http://www.fileformat.info/info/unicode/block/halfwidth_and_fullwidth_forms/utf8test.htm
        return halfOrFullWidthStr.replace(
            /[\uff00-\uffef]/g,
            function(ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xfee0); }
        );
    }

    constructor(widget, model) {
        // initialize the widget and model
        this.#widget = widget;
        this.#model = model;
        // initialize options for backward compatibility
        this.#options = Object.assign({}, this.#defaultOptions, this.#model._jsonModel);
        let matchStr =  this.#matchArray[this.#options.dataType];
        if(matchStr) {
            let ld = this.#options.leadDigits,
                fd = this.#options.fracDigits,
                ldstr = ld && ld !== -1 ? "{0,"+ld+"}"
                    : "*",
                fdstr = fd && fd !== -1 ? "{0,"+fd+"}"
                    : "*",
                matchStr =  matchStr.replace("{leading}",ldstr)
                    .replace("{fraction}",fdstr),
                localeStr = matchStr.replace(/{digits}/g,this.#getDigits())
                    .replace("{decimal}",this.#escape(this.#options.decimal)),
                engStr = matchStr.replace(/{digits}/g,"[0-9]")
                    .replace("{decimal}","\\.")
            this.#processedValue = !(this.#getDigits() === "[0123456789]" && this.#options.decimal === ".")
            this.#regex = new RegExp(localeStr, "g");
            this.#engRegex = new RegExp(engStr, "g");
        }
        //initialise the model by the existing value entered in the widget (in case data was entered before initialisation)
        this.#model.value = this.getValue(this.#widget.value);
        // change the input type to text for patterns
        this.#widget.setAttribute("type", "text");
        this.#attachEventHandlers(widget);
    }

    #attachEventHandlers(widget, model) {
        widget.addEventListener('keydown', (e)=> {
            this.#handleKeyDown(e);
        });
        widget.addEventListener('keypress', (e)=> {
            this.#handleKeyPress(e);
        });
        widget.addEventListener('paste', (e)=> {
            this.#handlePaste(e);
        });
        widget.addEventListener('cut', (e)=> {
            this.#handleCut(e);
        });
        widget.addEventListener('blur', (e) => {
            this.#model.value = this.getValue(e.target.value);
        })
        // IME specific handling, to handle japanese languages max limit
        this.#attachCompositionEventHandlers(widget);
    }

    #attachCompositionEventHandlers(widget) {
        let isComposing = false; // IME Composing going on
        let hasCompositionJustEnded = false; // Used to swallow keyup event related to compositionend
        // IME specific handling, to handle japanese languages max limit
        // since enter can also be invoked during composing, a special handling is done here
        let that = this,
            changeCaratPosition = function() {
                // change the carat selection position to further limit input of characters
                let range = window.getSelection();
                range.selectAllChildren(widget);
                range.collapseToEnd();
            };
        widget.addEventListener('keyup', function(event) {
            if (/*isComposing || */hasCompositionJustEnded) {
                if (that.#compositionUpdateCallback(event)) {
                    changeCaratPosition();
                }
                // IME composing fires keydown/keyup events
                hasCompositionJustEnded = false;
            }
        });
        widget.addEventListener('compositionstart',
            function(event) {
                isComposing = true;
            });
        widget.addEventListener("compositionupdate",
                function(event) {
                    // event.originalEvent.data refers to the actual content
                    if (that.#compositionUpdateCallback(event)) {
                        changeCaratPosition();
                    }
                });
        widget.addEventListener("compositionend",
                function(event) {
                    isComposing = false;
                    // some browsers (IE, Firefox, Safari) send a keyup event after
                    //  compositionend, some (Chrome, Edge) don't. This is to swallow
                    // the next keyup event, unless a keydown event happens first
                    hasCompositionJustEnded = true;
                });
        widget.addEventListener("keydown",
                function(event) {
                    // Safari on OS X may send a keydown of 229 after compositionend
                    if (event.which !== 229) {
                        hasCompositionJustEnded = false;
                    }
                });
    }

    #getDigits() {
        let zeroCode = this.#options.zero.charCodeAt(0),
            digits = "";
        for(let i = 0;i < 10;i++) {
            digits += String.fromCharCode(zeroCode + i);
        }
        return "["+digits+"]"
    }

    #escape(str) {
        return str.replace(".", "\\.")
    }


    getValue(value) {
        // we support full width, half width and locale specific numbers
        value = this.#toLatinForm(value);
        if(value.length > 0 && this.#processedValue && !value.match(this.#engRegex)) {
            this.#writtenInLocale = true;
            value = this.#convertValueFromLocale(value);
        } else {
            this.#writtenInLocale = false
        }
        if(value && value.length >= this.#options.combCells )
            value = value.slice(0,this.#options.combCells);
        this.#previousCompositionVal = value;
        return value;
    }

    #compositionUpdateCallback(event) {
        let that = this;
        let flag = false;
        let leadDigits = that.#options.leadDigits;
        let fracDigits = that.#options.fracDigits;
        // we don't check use-case where just fracDigits is set since in case of composition update, the value to update is not known
        if (leadDigits !== -1) {
            let val = this.#widget.value;
            if (event.type === "compositionupdate" && event.originalEvent.data) {
                val = val + event.originalEvent.data.substr(event.originalEvent.data.length - 1);
            }
            // can't use the existing regex (since current regex checks for english digits), rather doing leadDigit compare
            let totalLength = leadDigits + (fracDigits !== -1 ? (fracDigits + that.#options.decimal.length) : 0);
            if (val.indexOf(that.#options.decimal) === -1) {
                totalLength = leadDigits;
            }
            let latinVal = this.#toLatinForm(val);
            // match both since we support full width, half width and locale specific input
            let match = latinVal.match(that.#regex)|| latinVal.match(this.#engRegex);
            flag  = !match;
            if (match === null) {
                // entered invalid character, revert to previous value
                that.#widget.value = that.#previousCompositionVal;
                flag = true;
            } else if (flag) {
                // if max reached
                let newVal = val.substr(0, totalLength);
                that.#widget.value = newVal;
                that.#previousCompositionVal = newVal;
                flag = true;
            } else {
                that.#previousCompositionVal = val;
            }
        }
        return flag;
    }

    trigger(event, detail) {
        if (!this.#widget) {
            return this;
        }
        const eventName = event.split('.')[0];
        const isNativeEvent =
            typeof document.body[`on${eventName}`] !== 'undefined';
        if (isNativeEvent) {
            this.#widget.dispatchEvent(new Event(eventName));
            return this;
        }
        const customEvent = new CustomEvent(eventName, {
            detail: detail || null,
        });
        this.#widget.dispatchEvent(customEvent);
        return this;
    }

    getHTMLSupportedAttr(domElement, attr){
        try{
            return domElement[attr];
        }
        catch (err){
            return undefined;
        }
    }

    #handleKeyInput(event, character, code){
        if(event.ctrlKey && !(['paste', 'cut'].includes(event.type))) {
            return true;
        }

        this.#handleKeyDown(arguments);
        this.#options.lengthLimitVisible = true;
        let val = this.#widget.value,
            // if selectionStart attribute isn't supported then its value will be undefined
            selectionStart = this.getHTMLSupportedAttr(this.#widget, "selectionStart") || 0,
            isSelectionAttrSupported = !(selectionStart === undefined || selectionStart === null),
            selectionEnd = this.getHTMLSupportedAttr(this.#widget, "selectionEnd") || 0,
            combCells = parseInt(this.#options.combCells) || 0,
            current,
            change = character;

        if (combCells > 0 ) {
            change = character.substr(0, combCells - val.length + selectionEnd - selectionStart);
        }

        // CQ-4245407 : selectionStart and selectionEnd attributes aren't supported in case of input type = number
        // it is used for providing native HTML5 implementation for numeric field, so no further processing is required
        // As it is specific to AF and AF doesn't support change event on each keypress, so this change should be fine
        if (!isSelectionAttrSupported) {
            return true;
        }

        current = val.substr(0, selectionStart) + change + val.substr(selectionEnd);
        // done to handle support for both full width, half width or mixed input in number field
        let latinCurrentValue = this.#toLatinForm(current);

        if (!(this.#regex == null || latinCurrentValue.match(this.#regex) || latinCurrentValue.match(this.#engRegex))) {
            event.preventDefault();
            return false;
        }
        if (!(['keydown', 'cut'].includes(event.type)) && combCells && (val.length >= combCells || current.length > combCells) && selectionStart === selectionEnd) {
            event.preventDefault();
            return false;
        }

        this.#options.curValue = val;
        this.#previousCompositionVal = val;
        this.#options.pos = selectionStart;
    }

    #handleKeyDown(event){
        if (event) {
            let code = event.charCode || event.which || event.keyCode || 0;
            if(code === 8 || code === 46) // backspace and del
                this.#handleKeyInput(event, "", code);
            else if(code === 32) { // suppress space
                event.preventDefault();
                return false;
            }
        }
    }

    #isValidChar(character) {
        character = this.#toLatinForm(character);
        let lastSingleDigitChar = String.fromCharCode(this.#options.zero.charCodeAt(0) + 9);
        // we only full width, half width and also locale specific if customer has overlayed the i18n file
        return (character >= "0" && character <= "9") || (character>=this.#options.zero && character<=lastSingleDigitChar) || character===this.#options.decimal || character===this.#options.minus;
    }

    isNonPrintableKey(key) {
        return (key   // In IE, event.key returns words instead of actual characters for some keys.
            && !['MozPrintableKey','Divide','Multiply','Subtract','Add','Enter','Decimal','Spacebar','Del'].includes(key)
            && key.length !== 1 )
    }

    #handleKeyPress(event){
        if (event) {
            let code = event.charCode || event.which || event.keyCode || 0,
                character = String.fromCharCode(code);

            if(this.isNonPrintableKey(event.key)) { // mozilla also generates a keypress, along with keydown
                return true;                                               // for all keys, so only handling printable keys in keypress
            }

            if (this.#isValidChar(character))
                this.#handleKeyInput(event, character, code);
            else if (!event.ctrlKey){
                event.preventDefault();
                return false;
            }
        }
    }

    #handlePaste(event){
        if (event) {
            // get the contents
            let pastedChar = undefined;
            if (window.clipboardData && window.clipboardData.getData) { // IE
                pastedChar = window.clipboardData.getData('Text');
            } else if ((event.originalEvent || event).clipboardData && (event.originalEvent || event).clipboardData.getData) {
                pastedChar = (event.originalEvent || event).clipboardData.getData('text/plain');
            }

            if(pastedChar) {
                let allPastedCharsValid = pastedChar.split('').every(function (character) {
                    return this.#isValidChar(character);
                }, this);
                if (allPastedCharsValid) {
                    // during paste we support both half width, full width and locale specific numbers
                    pastedChar = this.#toLatinForm(pastedChar);
                    this.#handleKeyInput(event, pastedChar, 0);
                }
                else if (!event.ctrlKey) {
                    event.preventDefault();
                    return false;
                }
            }
        }
    }

    #handleCut(event) {
        if (event) {
            this.#handleKeyInput(event, "", 0);
        }
    }

    #convertValueToLocale(val) {
        let zeroCode = this.#options.zero.charCodeAt(0);
        return  val.map(function(c) {
            if(c === ".") {
                return this.#options.decimal;
            } else if(c === "-") {
                return this.#options.minus;
            } else {
                return String.fromCharCode(parseInt(c) + zeroCode);
            }
        },this).join("");
    }

    #convertValueFromLocale(val) {
        val = this.#toLatinForm(val);
        let zeroCode = this.#options.zero.charCodeAt(0);
        return  val.map(function(c) {
            if(c === this.#options.decimal) {
                return ".";
            } else if(c === this.#options.minus) {
                return "-";
            } else {
                return (c.charCodeAt(0) - zeroCode).toString();
            }
        },this).join("");
    }

    /**
     * Checks if the edit value is same as value present in the user control(html form element)
     * @returns {boolean}
     */
    #isValueSame() {
        return (((this.#model.value === null) && (this.#widget.value === "")) || (this.#model.value === this.#widget.value));
    }

    setValue(value) {
        // if the value is same, don't do anything
        if(!this.#isValueSame()){
            if(value && this.#writtenInLocale) {
                this.#widget.value = this.#convertValueToLocale(value);
            } else {
                this.#widget.value=  this.#model.value;
            }
        }
    }
}