/*******************************************************************************
 * Copyright 2023 Adobe
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



class DatePickerWidget {

    #widget=null;
    #model=null // passed by reference
    #options=null

    #lang="en";

    #dp=null;
    #curInstance=null;
    static #visible=false;
    static #clickedWindow;

    /** default configuration options
     *
     * yearsPerView: number of years to show in the yearset view
     *
     * width: with of the widget
     *
     * viewHeight: Height of the month,year and yearset view. This doesn't include
     *             the height of the header
     *
     * locale: locale information for the locale in which to show the datepicker which comprises of
     *        days: day names to display in the monthview
     *        months: month names to display in the yearview
     *        zero: string representation of zero in the locale. Numbers will be
     *              displayed in that locale only
     *        clearText: Text to display for the reset button
     *        name: name of the locale
     *
     * format: input format for the datepicker (not implemented)
     *
     * pickerType: type of the datetimepicker (date, datetime and time)
     *
     * positioning: element around which datepicker will be displayed. if null then it
     *              will be displayed around the input element
     *
     * showCalendarIcon: to show the Calendar on the right of the text field or not
     */
    #defaultOptions={
        yearsPerView: 16,
        width: 433,
        viewHeight: 248,
        locale: {
            days:[1, 2, 3, 4, 5, 6, 7].map(d => new Date(2001, 0, d)),
            months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(m => new Date(2000, m, 1)),
            zero: "0",
            clearText: "Clear",
            name:"en_US"
        },
        format:"YYYY-MM-DD",
        pickerType:"date",
        positioning: null,
        showCalendarIcon: true
    }

    #dates = [31,28,31,30,31,30,31,31,30,31,30,31]
    /*
     *  Actions to perform when clicked on the datepicker buttons
     *  for different views
     *  caption: view to show when clicked on caption
     *           (Year/YearSet/Month/null) null means don't change the view
     *  li: view to show when clicked on date, month or year element
     *  upDown: add(up key) or subtract(down key) current date (for monthview),
     *          month(Year View) or year(YearSetView) with the number provided
     *  key: identifies the key that needs to be changed for that view
     */
    #viewAction = {
        Month: {
            caption: 'Year',
            li: null,
            key:"day",
            upDown:7
        },
        Year: {
            caption: "Yearset",
            li: "Month",
            key:"month",
            upDown:3
        },
        Yearset: {
            caption: null,
            li: "Year",
            key:"year",
            upDown:4
        }
    }

    selectedDay = 0;
    selectedMonth=0;
    selectedYear=0;
    currentDay=0;
    currentMonth=0;
    currentYear=0;
    //view="Month";
    #touchSupported = !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
    #defaultView="Month";
    #keysEnabled=false;
    #focusedOnLi =false;
    #keyboardAccessibility=true;
    #scriptFocus;

    /* template for the clear Button */
    #clearButtonTemplate = '<div class="dp-clear">' +
        '<a></a>' +
        '</div>';

    /* template for the calendar
    * header contains the navigation icons (left and right arrows)
    * and the current caption (which can be date, year or month)
    *
    * monthview displays the grid for showing the dates for a particular
    * month
    *
    * yearview displays all the months of that year
    *
    * yearsetview displays a grid of 16 years. This can be configured
    * through the option: yearsPerView
    *
    */
    #calendarTemplate = '<div class="dp-header">' +
        '<div class="dp-leftnav"></div>' +
        '<div class="dp-caption"></div>' +
        '<div class="dp-rightnav"></div>' +
        '</div>' +
        '<div class="view dp-monthview"></div>' +
        '<div class="view dp-yearview"></div>' +
        '<div class="view dp-yearsetview"></div>';

    constructor(view, widget, model) {
        this.#model = model;
        this.#lang = view.formContainer.getModel()._jsonModel.lang;
        let editValFn = (value) => {
            return this.#formatDate(value, model.editFormat);
        };
        let displayValueFn = (value) => {
            return this.#formatDate(value, model.displayFormat);
        };
        this.#options = Object.assign({editValue:editValFn, displayValue:displayValueFn}, this.#defaultOptions, this.#model._jsonModel);
        this.#localizeDateElements(this.#options);

        this.#initialiseCalenderElement();

        //update widget markup to have input type=text element.
        let newDatePickerElement = widget.cloneNode(true);
        newDatePickerElement.setAttribute("type", "text");
        newDatePickerElement.id = widget.name;

        widget.parentNode.replaceChild(newDatePickerElement, widget);
        this.#widget = view.getWidget();
        this.#attachField(view.getWidget(), this.#options);
    }

    #formatDate(value, format) {
        let dateValue = new Date(value);
        if (!isNaN(dateValue)) {
            return FormView.Formatters.formatDate(new Date(value), this.#lang, format);
        }
        return null;
    }

    #initialiseCalenderElement() {
        let self = this,
            html="";
        if (this.#options.pickerType.match(/date/)) {
            html += this.#calendarTemplate;
        }
        html += this.#clearButtonTemplate;

        this.#dp = document.getElementsByClassName("datetimepicker")[0];
        if (!this.#dp) {
            this.#dp = document.createElement("div");
            this.#dp.classList.add("datetimepicker", "datePickerTarget");
            this.#dp.innerHTML = html;
            //Always inserting it in body
            document.body.appendChild(this.#dp);
        }
        // attach click event on entire datePicker popup
        this.#dp.addEventListener("click",
            function (evnt) {
                //focus only if the device doesn't support touch
                // input otherwise on screen keyboard will popup
                if (!self.#touchSupported) {
                    if (self.#curInstance) {
                        self.#curInstance.$field.focus();
                    }
                }
            }, false);
        "touchstart mousedown".split(" ").forEach(function (e) {
            self.#dp.addEventListener(e, function (evt) {
                self.#checkWindowClicked(evt)
            }, false);
        });

        this.$month = this.#dp.getElementsByClassName("dp-monthview")[0];
        this.$year = this.#dp.getElementsByClassName("dp-yearview")[0];
        this.$yearset = this.#dp.getElementsByClassName("dp-yearsetview")[0];

        this.clear = this.#dp.getElementsByClassName("dp-clear")[0].getElementsByTagName("a")[0];
        this.clear.addEventListener("click", function (evnt) {
            if (self.view && self.#curInstance) {
                self.#clearDate(self.view);
            }
        });
        this.prevNavWidthBtn = this.#dp.getElementsByClassName("dp-leftnav")[0];
        this.prevNavWidthBtn.addEventListener("click",
            function (evnt) {
                if (self.view && self.#curInstance) {
                    self.#adjustDate(-1, self.view, false)
                }
            });
        this.nextNavWidthBtn = this.#dp.getElementsByClassName("dp-rightnav")[0];
        this.nextNavWidthBtn.addEventListener("click",
            function (evnt) {
                if (self.view && self.#curInstance) {
                    self.#adjustDate(1, self.view, false)
                }
            });
        this.caption = this.#dp.getElementsByClassName("dp-caption")[0];
        this.caption.addEventListener("click",
            function (evnt) {
                if (self.view && self.#curInstance) {
                    if (!self.caption.classList.contains("disabled")) {
                        self.#layout(self.#viewAction[self.view].caption);
                    }
                }
            });
        if (this.#keyboardAccessibility) {
            [this.prevNavWidthBtn, this.caption, this.nextNavWidthBtn, this.clear].forEach(function (elem, i) {
                elem.setAttribute("tabIndex", i + 1);
            });
        }

    }


    /*
     * attaches the date picker to the field. This is a one time operation
     * First creates a configuration object and stores it in the field data attributes
     * then attaches event handlers on click, focus (to show the picker) and blur (to hide) events
     */
    #attachField(widget, options) {
        let inst = this.#newInst(widget, options),
            self = this,
            activateField = function(evnt) {
                if(!self.#curInstance)
                    self.#activateField(evnt);

                if(self.#options.showCalendarIcon) {
                    if (evnt.type === self.#getEvent()) {
                        if (self._iconClicked) {
                            self._iconClicked = false;
                            if (DatePickerWidget.#visible) {
                                self.#hide(); // hide the calendar popup if visible when calendar icon is clicked
                                self.#curInstance.$field.focus(); // bring back focus in field
                            } else {
                                self.#show(); //// show the calendar popup if not visible when calendar icon is clicked
                            }
                        }
                    }
                } else {
                    /*show the popup only if
                     1. click/touch event
                     2. focus event in case of non-touch devices and focus is not done using script
                     */
                    if (evnt.type === self.#getEvent() || (evnt.type === "focus" && !self.#touchSupported && !self.#scriptFocus)) {
                        self.#show(evnt);
                    }
                }

                DatePickerWidget.#clickedWindow = true;
                self.#scriptFocus = false;
            },
            deactivateField = function(evnt) {
                //deactivate only if clicked outside window
                // on touch devices only keyboard or calendar should be active at once, touching keyboard should deactivate calendar
                if ((DatePickerWidget.#clickedWindow && !self.#focusedOnLi) && (self.#options.showCalendarIcon || !self.#touchSupported)) {
                    self.#hide();
                    self.#deactivateField();
                    DatePickerWidget.#clickedWindow = true;
                }
            };

        window.afCache.put(widget,"datetimepicker",inst);

        widget.addEventListener(this.#getEvent(), activateField);
        widget.onfocus = activateField;
        widget.onblur = deactivateField;

        if(options.showCalendarIcon) {
            let calendarIcon = document.createElement("div");
            calendarIcon.classList.add("datepicker-calendar-icon");

            widget.parentNode.insertBefore(calendarIcon, widget.nextSibling);

            if (this.#keyboardAccessibility) {
                calendarIcon.setAttribute("tabindex", 0);
            }
            calendarIcon.addEventListener(this.#getEvent(), function (evnt) {
                self._iconClicked = true;
                widget.click();
            });
            calendarIcon.addEventListener("keydown", function (event) {
                if (event.keyCode === 32 || event.keyCode === 13) {
                    widget.click();
                }
            });
        }
    }

    #newInst(widget, options) {
        return {
            $field:widget,
            locale: options.locale,
            positioning: options.positioning || widget,
            access:options.access,
            selectedDate:options.value,
            editValue :options.editValue,
            displayValue: options.displayValue,
            minValidDate : options.minimum,
            maxValidDate : options.maximum,
            exclMinDate :  options.exclusiveMinimum,
            exclMaxDate : options.exclusiveMaximum
        }
    }

    /*
     * To check where the click happened, if happened outside the datepicker
     * then hide the picker. This is checked whether any ancestor of clicked target
     * has a class datePickerTarget. This class is added to the attached element as well
     */
    #checkWindowClicked(evnt) {
        let self = this;
        if(self.#curInstance) {
            // datepickerTarget class depicts that the component is a part of the Date Field
            // and on click of that class, we should not hide the datepicker or fire exit events.
            if(!evnt.target.closest(".datePickerTarget")) {
                //non-touch devices do not deactivate on blur. Hence needs to be done here
                if(self.#touchSupported) {
                    self.#hide();
                    //clicking outside a field doesn't blur the field in IPad. Doing it by script
                    self.#curInstance.$field.blur();
                    self.#deactivateField();
                } else{
                    DatePickerWidget.#clickedWindow = true;
                }
            }
            else {
                DatePickerWidget.#clickedWindow = false;
            }
        }
    }

    /*
     * handling of key strokes. All the key strokes prevent the default browser action
     * unless specified otherwise
     * tab: set focus on calendar icon when dateinput field is active, navigates through date picker buttons when datepicker is open,
     * otherwise perform default browser action
     * escape: hides the datepicker
     * down arrow key: navigate the picker downwards by the number specified in actionView.upDown of the current View
     * up arrow key: navigate the picker upwards by the number specified in actionView.upDown of the current View
     * left arrow key: navigate the picker one unit of that view backward
     * right arrow key: navigate the picker one unit of that view forward
     * shift + up: perform the action that happens on clicking the caption (as specified in actionView.caption)
     * shift + left: perform the action that happens on clicking the left navigation button
     * shift + right: perform the action that happens on clicking the right navigation button
     * space/enter: triggers the click event for the current focused element from datepicker/ opens datepicker when calendar icon is focused.
     */
    #hotKeys(evnt) {
        var handled = false, date;
        switch(evnt.keyCode) {
            case 9: //tab
                // CQ-4239352 : Setting clickedWindow property to true on tabbing so that deactivateField logic gets executed
                // When clicking on "x" on input field in in IE and when selecting the content and releasing the mouse select outside the field
                // the click event is not trigerred on the field and hence activateField is not executed, so clickedWindow remains as false
                DatePickerWidget.#clickedWindow = true;
                handled = false;
                break;
            case 27://escape
                if(DatePickerWidget.#visible) {
                    this.#hide();
                    this.#curInstance.$field.focus();
                    this.#deactivateField();
                    handled = true;
                }
                break;
            case 32: //space
            case 13: // enter
                if(evnt.target.classList.contains("datepicker-calendar-icon")){
                    if(!DatePickerWidget.#visible) {
                        this.#show();
                        return;
                    }
                    this.$focusedDate.classList.add("dp-focus");
                }
                break;
            case 40: //down arrow key
                if(!DatePickerWidget.#visible) {
                    this.#show();
                    return;
                }
                this.$focusedDate.classList.add("dp-focus");
                break;
        }

        if(DatePickerWidget.#visible && this.#keysEnabled) {
            var v = this.#viewAction[this.view].key,
                updown = this.#viewAction[this.view].upDown;
            switch(evnt.keyCode) {
                case 9: // tab
                    if (evnt.shiftKey) {
                        if (evnt.target.classList.contains("dp-leftnav") || evnt.target.classList.contains("dp-focus")) {
                            this.#hide();
                            this.#curInstance.$field.focus();
                            handled = true;
                        } else {
                            handled = false;
                        }
                    } else {
                        const buttonTabindex = evnt.target.getAttribute("tabindex");
                        if (buttonTabindex === '0') {
                            if (evnt.target.tagName.toLocaleLowerCase() === "input") {
                                this.#hide();
                                handled = false;
                            } else {
                                this.prevNavWidthBtn.focus();
                                handled = true;
                            }
                        } else if (buttonTabindex === '4') {
                            this.#hide();
                            this.#curInstance.$field.focus();
                            handled = true;
                        } else {
                            handled = false;
                        }
                    }
                    break;
                case 32: //select on space
                case 13: // select on enter
                    this.hotKeyPressed = true;
                    this.#focusedOnLi = false;
                    if (!this.#focusedOnLi) {
                        evnt.target.click();
                    } else {
                        if (this.$focusedDate) {
                            this.$focusedDate.click() //todo
                        }
                    }
                    this.hotKeyPressed = false;
                    handled = true;
                    break;
                case 37: //left arrow key
                    if (evnt.shiftKey) {
                        this.prevNavWidthBtn.click();
                    } else {
                        this.#adjustDate(-1, v, true);
                    }
                    handled = true;
                    break;
                case 38: //up arrow key
                    if (evnt.shiftKey) {
                        this.caption.click();
                    } else {
                        this.#adjustDate(-updown, v, true);
                    }
                    handled = true;
                    break;
                case 39: //right arrow key
                    if (evnt.shiftKey) {
                        this.nextNavWidthBtn.click();
                    } else {
                        this.#adjustDate(+1, v, true);
                    }
                    handled = true;
                    break;
                case 40: //down arrow key
                    this.#adjustDate(updown, v, true);
                    handled = true;
                    break;
                default:
            }
        }
        if(handled) {
            evnt.preventDefault();
        }
    }

    /*
     * show the datepicker. //TODO: migrate this to vanilla js
     */
    #show() {
        this.#options.locale = this.#curInstance.locale;
        if(!DatePickerWidget.#visible) {
            let date,
                validDate;
            validDate = this.#curInstance.selectedDate;
            date = validDate ? new Date(validDate): new Date();
            this.selectedDay = this.currentDay = date.getDate();
            this.selectedMonth = this.currentMonth = date.getMonth();
            this.selectedYear = this.currentYear = date.getFullYear();
            this.maxValidDate = this.#options.maximum ? new Date(this.#curInstance.maxValidDate) : null;
            this.minValidDate = this.#options.minimum ? new Date(this.#curInstance.minValidDate) : null;
            this.exclMaxDate = this.#curInstance.exclMaxDate;
            this.exclMinDate = this.#curInstance.exclMinDate;
            this.#dp.getElementsByClassName("dp-clear")[0].getElementsByTagName("a")[0].innerText = this.#options.locale.clearText;
            this.#layout(this.#defaultView);
            this.#position();
            this.#dp.style.display = "flex";
            this.#focusedOnLi = false;
            DatePickerWidget.#visible = true;
            if (this.#options.showCalendarIcon) {
                this.#curInstance.$field.setAttribute('readonly', true);    // when the datepicker is active, deactivate the field
            }
        }

        //   Disabling the focus on ipad  due to a bug where value of
        // date picker is not being set
        // Removing this code will only hamper one use case
        // where on ipad if you click on the calander then
        // the field becomes read only so
        // there is no indication where the current focus is
        // And  if you remove this foucs code all together
        // then what happens is that on desktop MF in iframe the exit event
        // is not getting called hence calander getting remained open even
        // when you click somewhere on window or focus into some other field
        if (this.#options.showCalendarIcon  && !this.#touchSupported ) {
            this.#curInstance.$field.focus(); // field loses focus after being marked readonly, causing blur event not to be fired later
        }
    }

    /*
     * position the datepicker around the positioning element //TODO: migrate this to vanilla js
     * provided in the options
     */
    #position() {
        let $elem = this.#curInstance.positioning,
            windowScrollX = window.scrollX,
            windowScrollY = window.scrollY,
            windowInnerHeight = window.innerHeight,
            windowInnerWidth = window.innerWidth,
            height = $elem.offsetHeight,
            top = this.#getOffset($elem).top  + height,
            left = this.#getOffset($elem).left,
            styles = {"top": (top+"px"), "left": (left+"px")},
            diffBottom = top + 333 - windowInnerHeight - windowScrollY, //todo: hard-coded dp height to 333
            newLeft,
            newTop;
        if(diffBottom > 0) {
            //can't appear at the bottom
            //check top
            newTop = top - height - 333 - 20;
            if(newTop < windowScrollY) {
                //can't appear at the top as well ... the datePicker pop up overlaps the date field
                newTop = top - diffBottom;
            }
            styles.top = newTop + "px";
        }
        if(left + 433 > windowScrollX + windowInnerWidth ) { //todo: hard-coding width to 433
            //align with the right edge
            newLeft = windowScrollX + windowInnerWidth - 433 - 20;
            styles.left = newLeft + "px";
        }
        this.#dp.style.top = styles.top;
        this.#dp.style.left = styles.left;
        return this;
    }

    #getOffset(elem) {
        let box = elem.getBoundingClientRect();
        return {
            top: box.top + window.scrollY ,
            left: box.left + window.scrollX
        };
    }

    /*
     * layout the nextView. if nextView is null return
     *
     */
    #layout(nextView) {
        if(nextView == null) {
            this.#hide();
        } else {
            if(this.view) {
                this['$' + this.view.toLowerCase()].style.display = "none";
            }
            this.view = nextView;
            this.caption.classList.toggle("disabled",!this.#viewAction[this.view].caption);
            this['$'+this.view.toLowerCase()].style.display = "block";
            this["show"+this.view]();
        }
        return this;
    }

    /*
     * show the month view
     */
    showMonth() {
        var self = this,
            curDate = new Date(this.currentYear, this.currentMonth),
            maxDay =   this.#maxDate(this.currentMonth),
            prevMaxDay = this.#maxDate((this.currentMonth + 12)%12),
            day1 = new Date(this.currentYear,this.currentMonth,1).getDay(),
            rowsReq = Math.ceil((day1 + maxDay) / 7) + 1,
            data, display;

        this.#tabulateView(
            {
                caption: this.#options.locale.months[this.currentMonth] + ", "+ this.#convertNumberToLocale(this.currentYear),
                header:this.#options.locale.days,
                numRows:rowsReq,
                numColumns:7,
                elementAt: function(row,col) {
                    var day = (row-1)*7 + col - day1 + 1;
                    let gridId = "day-" + day;
                    display = self.#convertNumberToLocale(day);
                    data = day;
                    if(day < 1) {
                        display = self.#convertNumberToLocale(prevMaxDay + day);
                        data = -1
                    }
                    else if(day > maxDay) {
                        display = self.#convertNumberToLocale(day-maxDay);
                        data = -1;
                    }
                    else {
                        curDate.setDate(day);
                        // check if the currentdate is valid based on max and min valid date
                        if(self.#compareVal(curDate, self.maxValidDate, self.exclMaxDate) || self.#compareVal(self.minValidDate, curDate, self.exclMinDate)) {
                            data = -1;
                        }
                    }
                    return {
                        data : data,
                        gridId: gridId,
                        display : display,
                        ariaLabel : self.#options.editValue(self.currentYear+"-"+self.#pad2(self.currentMonth + 1)+"-"+self.#pad2(display))
                    };
                }
            });
    }

    /**
     * returns boolean based on val1, val2, checkEqual
     * For comparing date, use date object
     */
    #compareVal(val1, val2, checkEqual) {
        if(!val1 || !val2) {
            return false;
        }

        if(checkEqual) {
            return val1 >= val2;
        } else {
            return val1 > val2;
        }
    }

    /*
     * show the year view
     */
    showYear() {
        var self = this,
            minDate = this.minValidDate ? new Date(this.minValidDate.getFullYear(), this.minValidDate.getMonth()) : null,
            maxDate = this.maxValidDate ? new Date(this.maxValidDate.getFullYear(), this.maxValidDate.getMonth()) : null,
            curDate = new Date(this.currentYear, 0), //can't omit month, if only one param present it is treated as millisecond
            data,
            month;
        this.#tabulateView(
            {
                caption : this.#convertNumberToLocale(this.currentYear),
                numRows : 4,
                numColumns : 3,
                elementAt : function(row,col) {
                    data = month =  row*3 + col;
                    let gridId = "month-" + data;
                    curDate.setMonth(month);
                    if ((minDate && curDate < minDate) || (maxDate && curDate > maxDate)) {
                        data = -1;
                    }
                    return {
                        data : data,
                        gridId: gridId,
                        display : self.#options.locale.months[month],
                        ariaLabel : self.#options.locale.months[month] + " " +self.currentYear
                    };
                }
            });
    }

    /*
     * show the year set view
     */
    showYearset() {
        var year,
            minDate = this.minValidDate ? new Date(this.minValidDate.getFullYear(), 0) : null ,
            maxDate = this.maxValidDate ? new Date(this.maxValidDate.getFullYear() + 1, 0) : null,
            curDate = new Date(),
            data,
            self = this;
        this.#tabulateView(
            {
                caption: this.#convertNumberToLocale(this.currentYear - this.#options.yearsPerView/2) +"-"+this.#convertNumberToLocale(this.currentYear - this.#options.yearsPerView/2 + this.#options.yearsPerView - 1),
                numRows:4,
                numColumns:4,
                elementAt: function(row,col) {
                    data = year =  self.currentYear - 8 + (row*4 + col);
                    let gridId = "year-"+data;
                    curDate.setFullYear(year);
                    if ((minDate && curDate < minDate) || (maxDate && curDate > maxDate)) {
                        data = -1;
                    }
                    return {
                        "data" : data,
                        "gridId" : gridId,
                        "display" : self.#convertNumberToLocale(year),
                        ariaLabel : year
                    };
                }
            });
    }

    insertRow (rowNum, rowArray, isHeader, elementAt) {
        let $view = this["$"+this.view.toLowerCase()],
            $row = $view.getElementsByTagName("ul")[rowNum],
            items,$li,element,$tmp,
            self= this;
        if(!$row) {
            let rowEl = document.createElement("ul");
            rowEl.removeAttribute("aria-label");
            rowEl.classList.toggle("header", isHeader);
            $row = $view.appendChild(rowEl);
        }
        items = $row.getElementsByTagName("li").length;
        while(items++ < rowArray.length) {
            let listItemEl = document.createElement("li");
            listItemEl.id = "li-" + elementAt(rowNum, items).gridId;
            $tmp = $row.appendChild(listItemEl);
            if(!isHeader) {
                let cb = function (evnt) {
                    self.#selectDate(evnt);
                };
                $tmp.addEventListener("click", cb);
            }
        }

       rowArray.forEach(function(el,index) {
            $li = $row.getElementsByTagName("li")[index];
            if(isHeader)
                $li.innerText = rowArray[index];
            else {
                element = rowArray[index];
                window.afCache.put($li, "value", element.data);
                if(self.#checkDateIsFocussed(element.data)) {
                    if(self.$focusedDate) {
                        self.$focusedDate.classList.remove("dp-focus");
                        self.$focusedDate.setAttribute("tabindex", "-1");
                    }
                    self.$focusedDate = $li;
                    if(self.#keysEnabled)
                        self.$focusedDate.classList.add("dp-focus")
                }
                $li.setAttribute("title", element.ariaLabel);
                $li.setAttribute("aria-label", element.ariaLabel);
                $li.setAttribute("tabindex", -1);
                $li.classList.toggle("dp-selected",self.#checkDateIsSelected(element.data));
                $li.classList.toggle("disabled", element.data === -1);
                $li.innerText = element.display;
            }
        });
        return $row;
    }

    /*
     * creates a tabular view based on the options provided. The options that can be passed are
     * numRows: number of rows that needs rendering
     * numCols: number of columns that needs rendering
     * caption: text for the datepickers caption element
     * header: an array of elements that identifies the header row
     * elementAt: a function(row, column) that returns an object (data: <data>, display: <display>) where
     *            <data> is the value to set for that view when the element at (row,column) is clicked and
     *            <display> is the value that will be visible to the user
     */
    #tabulateView (options) {
        var r = 0,rows = 0,
            row = [],
            c;
        this.caption.innerHTML = options.caption;
        if(options.header) {
            this.insertRow(r++,options.header,true, options.elementAt);
        }
        while(r < options.numRows) {
            c = 0;
            while(c < options.numColumns) {
                row[c] = options.elementAt(r,c);
                c++;
            }
            this.insertRow(r++,row,false, options.elementAt);
        }

        rows = this["$" + this.view.toLowerCase()].querySelectorAll("ul");
        rows = [...rows].filter((r)=> {return !(r.offsetHeight===0 && r.offsetWidth===0)});
        let len = rows.length;
        while (len > options.numRows) {
            this["$" + this.view.toLowerCase()].querySelectorAll("ul")[--len].style.display = "none";
        }
        while (options.numRows > len) {
            this["$" + this.view.toLowerCase()].querySelectorAll("ul")[len++].style.display = "flex";
        }
    }

    #hotKeysCallBack = this.#hotKeys.bind(this);

    #activateField(evnt) {
        let self = this;
        this.#curInstance = window.afCache.get(evnt.target,"datetimepicker");
        // Issue LC-7049:
        // datepickerTarget should be added when activate the field and should be removed
        // after the fields gets deactivated.
        if (this.#options.showCalendarIcon) {
            this.#curInstance.$field.parentNode.classList.add("datePickerTarget");
        }
        //enable hot keys only for non touch devices
        if(!this.#touchSupported && !this.#keysEnabled) {
            document.addEventListener("keydown", self.#hotKeysCallBack);
            this.#keysEnabled = true;
        }
    }

    #deactivateField() {
        let self = this;
        if(self.#curInstance) {
            if(this.#keysEnabled) {
                document.removeEventListener("keydown", self.#hotKeysCallBack);
                this.#keysEnabled = false;
            }
            // Issue LC-7049:
            // datepickerTarget should be added when activate the field and should be removed
            // after the fields gets deactivated. Otherwise clicking on any other datefield
            // will not hide the existing datepicker
            if (this.#options.showCalendarIcon) {
                self.#curInstance.$field.parentNode.classList.remove("datePickerTarget");
            }
            self.#curInstance = null;
            this.#hideAllViews();
        }
    }

    #hide() {
        if(DatePickerWidget.#visible) {
            this.#dp.style.display = "none";
            this.#hideAllViews();
            DatePickerWidget.#visible = false;
            if (this.#options.showCalendarIcon) {
                this.#curInstance.$field.removeAttribute('readonly');    // when the datepicker is deactivated, activate the field
            }
        }
    }
    #hideAllViews() {
        this['$month'].replaceChildren();
        this['$year'].replaceChildren();
        this['$yearset'].replaceChildren();
        this['$month'].style.display = "none";
        this['$year'].style.display = "none";
        this['$yearset'].style.display = "none";
    }

    #adjustDate(step, view, focus) {
        let maxDate,prevMaxDate;
        let _focus = focus || false;
        switch(view.toLowerCase()) {
            case "day":
                this.currentDay += step;
                maxDate = this.#maxDate(this.currentMonth)
                if(this.currentDay < 1) {
                    prevMaxDate =  this.#maxDate((this.currentMonth - 1 + 12)%12);
                    this.currentDay = prevMaxDate + this.currentDay;
                    return this.#adjustDate(-1, "month", _focus);
                }
                if(this.currentDay > maxDate) {
                    this.currentDay -= maxDate;
                    return this.#adjustDate(+1, "month", _focus);
                }
                break;
            case "month":
                this.currentMonth += step;
                if(this.currentMonth > 11) {
                    this.currentYear++;
                    this.currentMonth = 0;
                }
                if(this.currentMonth < 0) {
                    this.currentYear--;
                    this.currentMonth = 11;
                }
                break;
            case "year":
                this.currentYear += step;
                break;
            case "yearset":
                this.currentYear += step*this.#options.yearsPerView;
                break;
        }
        this.#layout(this.view);
        if (_focus) {
            this.#focusedOnLi = true;
            this.$focusedDate.setAttribute("tabindex", 0);
            this.$focusedDate.focus();
        }
    }

    #checkDateIsSelected(data) {
        switch(this.view.toLowerCase()) {
            case "month":
                return this.currentYear === this.selectedYear && this.currentMonth === this.selectedMonth && data === this.selectedDay;
            case "year":
                return this.currentYear === this.selectedYear && this.selectedMonth === data;
            case "yearset":
                return this.selectedYear === data;
        }
    }

    #checkDateIsFocussed(data) {
        switch(this.view.toLowerCase()) {
            case "month":
                return data === this.currentDay;
            case "year":
                return this.currentMonth === data;
            case "yearset":
                return this.currentYear === data;
        }
    }

    #convertNumberToLocale(number) {
        const zeroCode = this.#options.locale.zero.charCodeAt(0);
        number += "";
        let newNumber = [];
        for(let i = 0;i < number.length;i++) {
            newNumber.push(String.fromCharCode(zeroCode + parseInt(number.charAt(i))));
        }
        return newNumber.join("");
    }

    #clearDate(view) {
        this.setValue("");
        let existingSelectedItem = this['$'+view.toLowerCase()].getElementsByClassName("dp-selected")[0];
        if (existingSelectedItem) {
            existingSelectedItem.classList.remove("dp-selected");
        }
    }

    #getEvent() {
        return "click";//this.#touchSupported ? "touchstart" : "click";
    }

    #pad2(m) {
        return m = m < 10 ?"0"+m:m;
    }

    toString() {
        return this.selectedYear + "-" + this.#pad2(this.selectedMonth + 1) + "-" + this.#pad2(this.selectedDay);
    }

    #selectDate(evnt) {
        let val = window.afCache.get(evnt.target, "value"),
            nextView = this.#viewAction[this.view].li;

        //disabled dates have a value of -1. Do nothing in that case
        if(val === -1)
            return;
        switch(this.view.toLowerCase()) {
            case "month":
                this.selectedMonth = this.currentMonth;
                this.selectedYear = this.currentYear;
                this.selectedDay = val;
                this.setValue(this.toString());
                this.#curInstance.$field.focus();
                let existingSelectedElement =  this['$'+this.view.toLowerCase()].getElementsByClassName("dp-selected")[0];
                if (existingSelectedElement) {
                    existingSelectedElement.classList.remove("dp-selected");
                }
                evnt.target.classList.add("dp-selected");
                break;
            case "year":
                this.currentMonth = val;
                break;
            case "yearset":
                this.currentYear = val;
                break;
        }
        this.#layout(nextView);
        //manually focus on the field if clicked on the popup buttons for non-touch device
        if(!this.#touchSupported) {
            //No need to focus if selection is made by pressing space.
            if(!this.hotKeyPressed) {
                this.#scriptFocus = true;
            }
        } else if(nextView == null){
            //For touch devices, deactivate the field if a selection is made
            this.#deactivateField()
        }
    }

    #leapYear() {
        return this.currentYear % 400 === 0 || (this.currentYear % 100 !== 0 && this.currentYear % 4 === 0);
    }

    #maxDate(m) {
        if(this.#leapYear() && m === 1)
            return 29;
        else return this.#dates[m];
    }

    #localizeDateElements(options, locale) {
        options.locale.months =  options.locale.months.map(month => {
            const parts = new Intl.DateTimeFormat(locale, {month: "long"}).formatToParts(month);
            const m = parts.find(p => p.type === 'month');
            return m && m.value;
        });
        options.locale.days = options.locale.days.map(day => {
            const parts = new Intl.DateTimeFormat(locale, {weekday: 'short'}).formatToParts(day);
            const m = parts.find(p => p.type === 'weekday');
            return m && m.value[0];
        });
    }

    /**
     * returns the original value of format YYYY-MM-DD
     * @returns {*|string}
     */
    getValue() {
        let dateVal = new Date(this.toString());
        if (!isNaN(dateVal)) {
            return this.toString();
        }
        return this.#widget.value;
    }

    /**
     * Sets the formatted display value on the widget.
     * value should be in YYYY-MM-DD format
     * @param value
     */
    setDisplayValue(value) {
        if (this.#curInstance != null) {
            this.#curInstance.$field.value = this.#curInstance.displayValue(this.toString()) || value;
        } else {
            this.#widget.value = this.#formatDate(value, this.#model.displayFormat) || value;
        }
    }

    /**
     * Sets the formatted edit value on the widget
     * @param value
     */

    setValue(value) {
        let currDate = new Date(value);
        if (!isNaN(currDate) && value != null) {
            //in case the value is directly updated from the field without using calendar widget
            this.selectedMonth = currDate.getMonth();
            this.selectedYear = currDate.getFullYear();
            this.selectedDay = currDate.getDate();
        } else {
            this.selectedYear
                = this.selectedMonth
                = this.selectedYear
                = -1;
        }
        if (this.#curInstance != null) {
            this.#curInstance.selectedDate = value;
            this.#curInstance.$field.value = this.#curInstance.editValue(this.toString()) || value;
        } else {
            this.#widget.value = this.#formatDate(value, this.#model.editFormat) || value;
        }
    }

    addEventListener(event, handler, widget) {
        let inst = window.afCache.get(widget, "datetimepicker");
        inst.$field.addEventListener(event, function(e) {
            switch(e.type) {
                case 'blur':
                    if (!DatePickerWidget.#visible) {
                        handler(e);
                    }
                    break;
                case 'focus':
                    handler(e);
                    break;

            }
        });
    }

}