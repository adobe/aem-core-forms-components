/*******************************************************************************
 * Copyright 2025 Adobe
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


(function() {
    "use strict";
    /**
     * class definition for GeoLocationQueryRequest
     * encapsulated success and error handlers
    */
    class Scribble extends FormView.FormFieldBase {
        _geoLocQuery=null;
        _signSubmitted=false;
        _enforceGeoLoc=!!navigator.userAgent.match(/iPad/i);
        existingSign = '';
        existingCanvas = '';
        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormScribble";
        static bemBlock = 'cmp-adaptiveform-scribble';
        static selectors  = {
            self: `[data-${this.NS}-is="${this.IS}"]`,
            scribbleContainer: `.${Scribble.bemBlock}__container`,
            scribbleContainerPanel: `.${Scribble.bemBlock}__panel`,
            keyboardSignBox: `.${Scribble.bemBlock}__keyboard-sign-box`,
            scribbleControlPanel: `.${Scribble.bemBlock}__controlpanel`,
            geoCanvas: `.${Scribble.bemBlock}__geocanvas`,
            canvasSignedContainer: `.${Scribble.bemBlock}__canvas-signed-container`,
            canvas: `.${Scribble.bemBlock}__canvas`,
            label: `.${Scribble.bemBlock}__label`,
            description: `.${Scribble.bemBlock}__longdescription`,
            qm: `.${Scribble.bemBlock}__questionmark`,
            errorDiv: `.${Scribble.bemBlock}__errormessage`,
            tooltipDiv: `.${Scribble.bemBlock}__shortdescription`,
            scribbleCloseButton: `.${Scribble.bemBlock}__button-close`,
            brushControl: `.${Scribble.bemBlock}__control-brush`,
            scribbleGeoControl: `.${Scribble.bemBlock}__control-geo`,
            clearControl: `.${Scribble.bemBlock}__control-clear`,
            scribbleTextControl: `.${Scribble.bemBlock}__control-text`,
            scribbleMessage: `.${Scribble.bemBlock}__control-message`,
            clearSignButton: `.${Scribble.bemBlock}__button--primary`,
            cancelClearSignButton: `.${Scribble.bemBlock}__button--secondary`,
            clearSignContainer: `.${Scribble.bemBlock}__clearsign-container`,
            scribbleSubmitControl: `.${Scribble.bemBlock}__save-button`,
            scribbleBrushList: `.${Scribble.bemBlock}__brushlist`,
            signCanvases: `.${Scribble.bemBlock}__signcanvases`,
            saveCanvas: `.${Scribble.bemBlock}__save-button`,
            canvasSignedImage: `.${Scribble.bemBlock}__canvas-signed-image`,
            mainCanvas: `.${Scribble.bemBlock}__canvas__main`
        };

        constructor(params) {
            super(params);
            this.initializeScribble();
        }

        initializeScribble() {
            this.getCanvasContainer().addEventListener('click', () => this.scribbleContainerClickHandler());
            this.initScribbleModal();
        }
        
        getWidget() {
            return this.element.querySelector(Scribble.selectors.canvasSignedContainer);
        }

        getLabel() {
            return this.element.querySelector(Scribble.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(Scribble.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(Scribble.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(Scribble.selectors.qm);
        }

        getScribbleControlPanel() {
            return document.querySelector(Scribble.selectors.scribbleControlPanel);
        }

        getScribbleContainer() {
            return document.querySelector(Scribble.selectors.scribbleContainer);
        }

        getMessage() {
            return document.querySelector(Scribble.selectors.scribbleMessage);
        }

        getClearSignContainer() {
            return document.querySelector(Scribble.selectors.clearSignContainer);
        }

        getClearSignButton() {
            return document.querySelector(Scribble.selectors.clearSignButton);
        }

        getCancelClearSignButton() {
            return document.querySelector(Scribble.selectors.cancelClearSignButton);
        }

        getBrushList() {
            return document.querySelector(Scribble.selectors.scribbleBrushList);
        }

        getBrush() {
            return document.querySelector(Scribble.selectors.brushControl);
        }

        getClearControl() {
            return document.querySelector(Scribble.selectors.clearControl);
        }

        getSaveControl() {
            return document.querySelector(Scribble.selectors.saveCanvas);
        }

        getGeoLocationIcon() {
            return document.querySelector(Scribble.selectors.scribbleGeoControl);
        }

        getTextSignControl() {
            return document.querySelector(Scribble.selectors.scribbleTextControl);
        }

        getScribbleContainerPanel() {
            return document.querySelector(Scribble.selectors.scribbleContainerPanel);
        }

        getKeyboardSignBox() {
            return document.querySelector(Scribble.selectors.keyboardSignBox);
        }

        getGeoCanvas() {
            return document.querySelector(Scribble.selectors.geoCanvas);
        }

        getCanvasContainer() {
            return this.element.querySelector(Scribble.selectors.canvasSignedContainer);
        }

        getScribbleCloseButton() {
            return this.element.querySelector(Scribble.selectors.scribbleCloseButton);
        }

        getCanvas() {
            return this.element.querySelector(Scribble.selectors.canvas);
        }

        getMainCanvas() {
            return this.element.querySelector(Scribble.selectors.mainCanvas);
        }

        getSignCanvasesContainer() {
            return this.element.querySelector(Scribble.selectors.signCanvases);
        }

        getDescription() {
            return this.element.querySelector(Scribble.selectors.description);
        }

        getSignedCanvasImage() {
            return document.querySelector(Scribble.selectors.canvasSignedImage);
        }

        showMessage(msg){
            if(this._msgTimeout) { clearTimeout(this._msgTimeout); this._msgTimeout=0; }
             const scribbleMessage = this.getMessage();
             scribbleMessage.innerHTML = msg;
             scribbleMessage.style.display = 'block';
             this._msgTimeout = window.setTimeout(function(){
                scribbleMessage.innerHTML = '';
             },15000);
        }

        extractData(datauri){
            var idx;
            if(datauri!=null&&datauri.length>0&&datauri.indexOf("data:")==0){
                if((idx=datauri.indexOf(","))>0) {
                    return datauri.substr(idx+1);
                }
            }
        }

        openClearSignModal() {
            const clearSignContainer = this.getClearSignContainer();
            const clearSignButton = this.getClearSignButton();
            const cancelClearSignButton = this.getCancelClearSignButton();
        
            clearSignContainer.style.display = 'inline-block';
        
            const handleClearSign = () => {
                this.existingSign = '';
                const mainCanvas = this.getMainCanvas();
                const existingCanvas = this.existingCanvas;
        
                if (mainCanvas && existingCanvas) {
                    mainCanvas.parentNode.replaceChild(existingCanvas, mainCanvas);
                    const ctx = existingCanvas.getContext('2d');
                    ctx.clearRect(0, 0, existingCanvas.width, existingCanvas.height);
                }
        
                const geoCanvas = this.getGeoCanvas();
                if (geoCanvas) {
                    const geoCtx = geoCanvas.getContext('2d');
                    geoCtx.clearRect(0, 0, geoCanvas.width, geoCanvas.height);
                }
        
                this.enableControls(['brush', 'geo', 'clear', 'text', 'save']);
        
                const signedImage = this.getSignedCanvasImage();
                if (signedImage) {
                    signedImage.removeAttribute('src');
                    signedImage.removeAttribute('style');
                    document.querySelector('.cmp-adaptiveform-scribble__clear-sign')?.remove();
                    clearSignContainer.style.display = 'none';
                    this.getKeyboardSignBox().value = '';
                }
        
                this._signSubmitted = false;
                this.setModelValue(null);
            };
        
            clearSignButton.addEventListener('click', handleClearSign);
        
            cancelClearSignButton.addEventListener('click', () => {
                clearSignContainer.style.display = 'none';
            });
        }

        createCanvas() {
            const mainCanvas = document.createElement('canvas');
            mainCanvas.classList.add('cmp-adaptiveform-scribble__canvasImage');
        }

        updateValue(value) {
            // html sets undefined value as undefined string in input value, hence this check is added
            let widgetValue = typeof value === "undefined" ? null : value;
            const signedImage = this.getSignedCanvasImage();
            if (signedImage && widgetValue) {
                signedImage.src = `data:image/png;base64,${widgetValue}`;
                super.updateEmptyStatus();
            }
        }

        isCanvasEmpty(canvas) {
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            
            // Get pixel data from the canvas
            const imageData = ctx.getImageData(0, 0, width, height);
            
            // Check if any pixel is not transparent (not [0, 0, 0, 0] = transparent)
            for (let i = 0; i < imageData.data.length; i += 4) {
                if (imageData.data[i + 3] > 0) {
                    return false; // Found non-transparent pixel
                }
            }
            
            return true; // No non-transparent pixels found
        }

        submitSign() {
            if (!this.isCanvasEmpty(this.canvas)) {
                const mainCanvas = this.createMainCanvas();
                const sigCnv = this.getCanvas(); // Get the sign canvas
                const geoCnv = this.getGeoCanvas(); // Get the geo canvas
        
                this.drawCanvasesOnMainCanvas(mainCanvas, sigCnv, geoCnv);
        
                this.existingCanvas = sigCnv;
                sigCnv.height = mainCanvas.height;
                sigCnv.parentNode.replaceChild(mainCanvas, sigCnv);
        
                let submitData = mainCanvas.toDataURL("image/png");
                this.existingSign = mainCanvas;
                
                submitData = submitData.replace(/^data:image\/png;base64,/, '');
        
                this.updateSignedImage(submitData);
                this.setModelValue(submitData);
                this.addClearSignButton();
        
                if (this._geoLocQuery) {
                    this._geoLocQuery.cancel(); // Cancel the current geo loc request
                }
        
                this.closeEditModal();
                this._signSubmitted = true;
            }
        }

        createMainCanvas() {
            const mainCanvas = document.createElement('canvas');
            mainCanvas.classList.add('cmp-adaptiveform-scribble__canvas__main');
            return mainCanvas;
        }

        drawCanvasesOnMainCanvas(mainCanvas, sigCnv, geoCnv) {
            const ctx = mainCanvas.getContext('2d');
            if (geoCnv && geoCnv.width > 0 && geoCnv.height > 0) {
                // Set the dimensions of the mainCanvas to accommodate both canvases vertically
                mainCanvas.width = Math.max(sigCnv.width, geoCnv.width);
                mainCanvas.height = sigCnv.height + geoCnv.height;
                // Draw the sign canvas on the main canvas
                ctx.drawImage(sigCnv, 0, 0);
                // Draw the geo canvas below the sign canvas
                ctx.drawImage(geoCnv, 0, sigCnv.height, geoCnv.width, geoCnv.height);
            } else {
                mainCanvas.width = sigCnv.width;
                mainCanvas.height = sigCnv.height;
                ctx.drawImage(sigCnv, 0, 0);
            }
        }

        updateSignedImage(newData) {
            const img = this.getSignedCanvasImage();
            img.src = `data:image/png;base64,${newData}`;
            img.style.width = '100%';
            img.style.height = '150px';
        }

        addClearSignButton() {
            const clearSignButton = document.createElement('div');
            clearSignButton.classList.add('cmp-adaptiveform-scribble__clear-sign');

            const mainCanvasImageContainer = this.getCanvasContainer();
            mainCanvasImageContainer.appendChild(clearSignButton);

            clearSignButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openClearSignModal();
            });
        }

        geoQueryErrorHandler(err){
            this.showMessage('errorFetchGeoLocation');
        }

        renderBrushList() {
            [2,3,4,5,6,7,8,9,10].forEach((brush) => {
                var divel = document.createElement('div');
                var cnv = document.createElement('canvas');
                var ctx = cnv.getContext('2d');
                cnv.style.border='1px solid #AAAAAA';
                cnv.width=100;
                cnv.height=20;
                cnv.style.backgroundColor='white'
                ctx.lineWidth=brush;
                ctx.beginPath();
                ctx.moveTo(10,cnv.height/2);
                ctx.lineTo(cnv.width-10,cnv.height/2);
                ctx.stroke();
                divel.appendChild(cnv);
                divel.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.context.lineWidth=brush;
                    this.toggleBrushList();
                    // this.handleBrush(e);
                })
                this.getBrushList().append(divel);
             });
        }

        resizeCanvas(percentage) {
            const signCanvas = this.getCanvas();
            const ctx = signCanvas.getContext('2d', { willReadFrequently: true });
            const container = this.getCanvasContainer();
            this.getSignCanvasesContainer().style.width = `${percentage}%`;
            
            // Ensure the canvas has valid dimensions
            if (signCanvas.width === 0 || signCanvas.height === 0) {
                return;
            }
            
            // Save the content of the canvas if it has valid dimensions
            let imgData = null;
            if (signCanvas.width > 0 && signCanvas.height > 0) {
                imgData = ctx.getImageData(0, 0, signCanvas.width, signCanvas.height);
            }
            // Calculate the new width based on the percentage of the container's width
            const newWidth = container.offsetWidth * (percentage / 100);
            // Set the new width and height of the canvas
            signCanvas.width = newWidth;
            // Restore the content back to the resized canvas if it has valid content
            if (imgData) {
                ctx.putImageData(imgData, 0, 0);
            }
        }

        geoQuerySuccessHandler(position) {
            if (position && position.coords) {
                this.showMessage('');
                const { latitude, longitude } = position.coords;
                const latStr = `Latitude: ${latitude}`;
                const longStr = `Longitude: ${longitude}`;
                const dateObj = new Date();
                const tZone = (dateObj.getTimezoneOffset() / 60) * -1;
                const timeStr = `${dateObj.getTime()}: ${(dateObj.getMonth() + 1)}/${dateObj.getDate()}/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}${tZone > 0 ? ' +' : ' '}${tZone}`;
                this.updateGeoCanvas(latStr, longStr, timeStr);
            }
        }

        updateGeoCanvas(latStr, longStr, timeStr) {
            const geoCanvas = this.getGeoCanvas();
            geoCanvas.style.height = '50px';
            geoCanvas.style.width = '200px';
            geoCanvas.style.display = 'block';

            if (geoCanvas) {
                const ctx = geoCanvas.getContext('2d');
                geoCanvas.width = geoCanvas.offsetWidth;
                geoCanvas.height = geoCanvas.offsetHeight;

                ctx.font = 'bold 10px Arial'; // Font size and type
                ctx.fillStyle = 'black'; // Text color
                ctx.measureText("m").width * 1.5;
                let x = 0;
                let y = 15;

                // Draw the text on the canvas
                ctx.fillText(latStr, x, y);
                ctx.fillText(longStr, x, y + 15);
                ctx.fillText(timeStr, x, y + 30);
            }
        }

        handleGeoLocation() {
            if (navigator.geolocation) {
                this._geoLocQuery = new GeoLocationQuery();
                this._geoLocQuery.init(
                    this.geoQuerySuccessHandler.bind(this),
                    this.geoQueryErrorHandler.bind(this)
                );
                this._geoLocQuery.query();
                this.showMessage('Fetching Geo Location...');
            }
        }

        geoQueryErrorHandler(err) {
            this.showMessage('Error fetching geolocation');
        }

        enableControls(controls) {
            controls.forEach(control => {
                const element = document.querySelector('.' + Scribble.bemBlock + '__control-' + control) || document.querySelector('.' + Scribble.bemBlock + '__' + control + '-button');;
                element?.classList.remove('disable_button');
                element.removeAttribute('disabled');
                element.setAttribute('aria-disabled', 'false');
            });
        }

        disableControl(controls) {
            controls.forEach(control => {
                const element = document.querySelector('.' + Scribble.bemBlock + '__control-' + control) || document.querySelector('.' + Scribble.bemBlock + '__' + control + '-button');
                element?.classList.add('disable_button');
                element.setAttribute('disabled', 'true');
                element.setAttribute('aria-disabled', 'true');
            });
        }

        toggleBrushList(event) {
            var brushList = this.getBrushList();
            if(getComputedStyle(brushList).display === 'none') {
                brushList.style.display = 'block';
            } else {
                brushList.style.display = 'none';
            }
        }

        controlPanelClickHandler(event) {
            const ariaLabel = event.target.getAttribute('aria-label');
            switch(ariaLabel){
                case 'save':
                    this.submitSign();
                    break;
                case 'close':
                    this.closeEditModal();
                    break;
                case 'clearSign':
                    this.eraseSignature();
                    break;
                case 'textSign':
                    this.enableSignatureTextBox();
                    break;
                case 'geolocation':
                    this.handleGeoLocation();
                    break;
                case 'brushes':
                    this.handleBrush(event);
                    this.toggleBrushList();
                    break;
            }
        }

        closeEditModal() {
            if(this.getCanvas()) this.getCanvas().style.display = 'block';
            if(!this._signSubmitted) {
                this.eraseSignature()
            }
            this.hideScribbleModal();
        }

        handleBrush(evt){
            this.getKeyboardSignBox().style.display = 'none';
            this.canvas.style.display = "block";
            this.context.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
            this.eraseSignature();
            this.initializeCanvas();
        }
        initScribbleModal() {
            const controlPanel = this.getScribbleControlPanel();
            const toggleBrushListIcon = this.getBrush();
            const brushList = this.getBrushList();
            const keyboardSignBox = this.getKeyboardSignBox();
        
            this.renderBrushList();
        
            this.addEventListeners(controlPanel, 'click', this.controlPanelClickHandler.bind(this));
        
            keyboardSignBox.addEventListener('input', (event) => {
                if (event?.target?.value) {
                    this.enableControls(['save', 'clear']);
                } else {
                    this.disableControl(['save', 'clear']);
                }
            });
        
            keyboardSignBox.addEventListener('keyup', () => {
                this.updateKeyboardSignBoxFont(keyboardSignBox);
            });
        
            document.addEventListener('click', (event) => {
                if (!brushList.contains(event.target) && !toggleBrushListIcon.contains(event.target)) {
                    brushList.style.display = 'none';
                }
            });
        }
        
        addEventListeners(element, eventType, handler, checkDisabled = false) {
            if (element) {
                element.addEventListener(eventType, (event) => {
                    if (!checkDisabled || element.getAttribute('disabled') !== 'true') {
                        handler(event);
                    }
                });
            }
        }
        
        updateKeyboardSignBoxFont(keyboardSignBox) {
            const fontFamily = "sans-serif, Georgia";
            const fontStyle = "italic";
            keyboardSignBox.style.font = `${fontStyle} 2rem ${fontFamily}`;
            const value = keyboardSignBox.value;
            this.context.font = `${fontStyle} 10rem ${fontFamily}`;
            this.context.fillText(value, 0, this.getCanvas().height / 2);
        }

        enableSignatureTextBox() {
            this.eraseSignature();
            this.getKeyboardSignBox().style.display = "inline-block";
            this.getCanvas().style.display = "none";
        }

        eraseSignature() {
            this.context?.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
            const geoCnv = this.getGeoCanvas();
            if(geoCnv) {
                const geoCanvasContext = geoCnv?.getContext('2d');
                geoCanvasContext?.clearRect(0, 0, geoCnv.width, geoCnv.height);
                geoCnv.style.display = 'none';
            }
            this.getKeyboardSignBox().value='';
            this.disableControl(['clear','save']);
        }

        resizeAndFixCanvas() {
            const dpr = window.devicePixelRatio || 1;
            let imgData = null;
            if (this.canvas.width > 0 && this.canvas.height > 0) {
                imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            }
            this.canvas.width = this.canvas.offsetWidth * dpr;
            this.canvas.height = this.canvas.offsetHeight * dpr;
            if (imgData) {
                this.context.putImageData(imgData, 0, 0);
            }
        }

        handleCanvasEvent(event) {
            switch (event.type) {
                case 'mousedown':
                case 'touchstart':
                    this.startDrawing(event);
                    break;
                case 'mousemove':
                case 'touchmove':
                    this.draw(event);
                    break;
                case 'mouseup':
                case 'mouseleave':
                case 'touchend':
                case 'touchcancel':
                    this.stopDrawing();
                    break;
            }
        }

        addCanvasEventListeners() {
            const events = ['mousedown', 'mousemove', 'mouseup', 'mouseleave', 'touchstart', 'touchmove', 'touchend', 'touchcancel'];
            events.forEach(event => {
                this.canvas.addEventListener(event, this.handleCanvasEvent.bind(this));
            });
        }

        initializeCanvas() {
            if(this.existingSign) {
                this.getCanvasContainer().style.width = '100%';
                this.getMainCanvas().style.border = '1px solid black';
                this.getKeyboardSignBox().style.display = 'none';
                this.disableControl(['brush','geo','clear','text','save']);
            } else {
                this.canvas = this.getCanvas();
                this.canvas.style.display = 'block';
                this.context = this.canvas.getContext('2d', { willReadFrequently: true });
                this.resizeCanvas(100);
                this.resizeAndFixCanvas();
                if (this.canvas) {
                    this.canvas.style.border = '1px dashed #AAAAAA';
                    this.getKeyboardSignBox().style.display = 'none';
                    this.addCanvasEventListeners();
                    this.isDrawing = false;
                }
            }
            // Add event listener for window resize to make the canvas responsive
            window.addEventListener('resize', this.resizeAndFixCanvas.bind(this));
        // }
        }

        showScribbleModal() {
            if(window.getComputedStyle(this.getScribbleContainer()).display !== 'block') {
                this.disableControl(['clear','save']);
            }
            this.getScribbleContainer().style.display = 'block';
        }

        hideScribbleModal() {
            this.getScribbleContainer().style.display = 'none';
        }

        scribbleContainerClickHandler() {
            this.showScribbleModal();
            this.initializeCanvas();
        }
        
        startDrawing(event) {
            // Ensure the context is initialized
            if (!this.context) {
                return;
            }
        
            // Normalize event coordinates for touch events
            const { offsetX, offsetY } = this.getEventCoordinates(event);
        
            this.isDrawing = true;
            this.context.beginPath();
            this.context.moveTo(offsetX, offsetY);
        }

        getMousePos(event) {
            const rect = this.canvas.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
            return { offsetX, offsetY };
        }

        getEventCoordinates(event) {
            const rect = this.canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            if (event.touches && event.touches.length > 0) {
                const touch = event.touches[0];
                return {
                    offsetX: (touch.clientX - rect.left) * dpr,
                    offsetY: (touch.clientY - rect.top) * dpr
                };
            } else {
                return {
                    offsetX: (event.clientX - rect.left) * dpr,
                    offsetY: (event.clientY - rect.top) * dpr
                };
            }
        }

        draw(event) {
            if (!this.isDrawing) return;
            const { offsetX, offsetY } = this.getEventCoordinates(event);
            this.context.lineTo(offsetX, offsetY);
            this.context.stroke();
            this.enableControls(['clear','save']);
        }

        stopDrawing() {
            if (this.isDrawing) {
                this.context.closePath();
                this.isDrawing = false;
            }
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Scribble({element, formContainer})
    }, Scribble.selectors.self);
})();