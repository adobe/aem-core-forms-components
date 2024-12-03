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

(function() {
    "use strict";

    /**
     * class definition for GeoLocationQueryRequest
     * encapsulated success and error handlers
     */
    class GeoLocQuery {
        constructor() {
            this._active = false;
        }
    
        init(success, failure) {
            this._successHandler = success;
            this._errorHandler = failure;
            this._active = true;
            return this;
        }
    
        _handleSuccess(data) {
            if (this._successHandler) {
                this._successHandler(data);
            }
        }
    
        _handleError(err) {
            if (this._errorHandler) {
                this._errorHandler(err);
            }
        }
    
        query() {
            const onSuccess = (pos) => {
                if (this._active) {
                    this._handleSuccess(pos);
                }
                this._active = false;
            };
    
            const onError = (err) => {
                if (this._active) {
                    this._handleError(err);
                }
                this._active = false;
            };
    
            navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 10000 });
        }
    
        cancel() {
            this._active = false;
        }
    }


    const PNGUtil = (() => {
        // Helper function to initialize CRC table
        const initCrcTable = () => {
            const table = new Uint32Array(256);
            for (let n = 0; n < 256; n++) {
                let c = n;
                for (let k = 0; k < 8; k++) {
                    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
                }
                table[n] = c;
            }
            return table;
        };
    
        // Helper function to convert 32-bit integer to string
        const u32IntToStr = (n) => String.fromCharCode(
            (n >>> 24) & 0xFF,
            (n >>> 16) & 0xFF,
            (n >>> 8) & 0xFF,
            n & 0xFF
        );
    
        // Helper function to calculate CRC
        const updateCrc = (crc, data) => {
            let c = crc;
            for (let i = 0; i < data.length; i++) {
                c = crcTable[(c ^ data.charCodeAt(i)) & 0xff] ^ (c >>> 8);
            }
            return c;
        };
    
        // Helper function to calculate CRC
        const CRC = (data) => updateCrc(0xffffffff, data) ^ 0xffffffff;
    
        // Helper function to prepare text chunk
        const prepareTextChunk = (content) => {
            const len = content.length;
            const lenStr = u32IntToStr(len);
            const chunkType = "tEXt";
            const checkSumStr = u32IntToStr(CRC(chunkType + content));
            return lenStr + chunkType + content + checkSumStr;
        };
    
        // Initialize CRC table
        const crcTable = initCrcTable();
    
        const _LC_Scribble_MetaDataKey = "LC_SCIBBLE_METADATA";
    
        // Main API
        return {
            // Function to check if data is a PNG
            _isPng: (b64data) => {
                return b64data && b64data.replace(/\s+/g, "").startsWith("iVBORw0KGgo");
            },
    
            // Function to make PNG read-only
            _makeReadOnly: (b64data) => {
                const bindata = atob(b64data.replace(/\s+/g, '')); // remove white spaces
                const pngctx = { p: 8, d: bindata }; // Skip PNG header
                const metadataChunk = prepareTextChunk(_LC_Scribble_MetaDataKey + String.fromCharCode(0) + "true");
                const newdata = pngctx.d.substring(0, pngctx.p) + metadataChunk + pngctx.d.substring(pngctx.p);
                return btoa(newdata);
            },
    
            // Function to decode base64
            _atob: (input) => window.atob ? atob(input) : Base64.decode(input),
    
            // Function to encode to base64
            _btoa: (input) => window.btoa ? btoa(input) : Base64.encode(input),
    
            // Function to check if PNG is read-only
            _isReadOnly: (b64data) => {
                if (this._isPng(b64data)) {
                    const testStr = _LC_Scribble_MetaDataKey + String.fromCharCode(0) + "true";
                    const bindata = this._atob(b64data.replace(/\s+/g, ''));
                    const pngctx = { p: 8, d: bindata }; // Skip PNG header
                    while (pngctx.p < pngctx.d.length) {
                        const size = (pngctx.d.charCodeAt(pngctx.p) << 24) |
                                     (pngctx.d.charCodeAt(pngctx.p + 1) << 16) |
                                     (pngctx.d.charCodeAt(pngctx.p + 2) << 8) |
                                     pngctx.d.charCodeAt(pngctx.p + 3);
                        const type = pngctx.d.slice(pngctx.p + 4, pngctx.p + 8);
                        pngctx.p += 8; // Move past size and type
                        if (type === "tEXt" && pngctx.d.indexOf(testStr, pngctx.p) === pngctx.p) {
                            return true;
                        }
                        pngctx.p += size + 4; // Move past data and CRC
                    }
                }
                return false;
            }
        };
    })();


    
    // GeoLocQuery definition ends here
    // const PNGUtil = (() => {
    //     // Helper function to initialize CRC table
    //     const initCrcTable = () => {
    //         const table = [];
    //         let c;
    //         for (let n = 0; n < 256; n++) {
    //             c = n;
    //             for (let k = 0; k < 8; k++) {
    //                 c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    //             }
    //             table[n] = c;
    //         }
    //         return table;
    //     };
    
    //     // Helper function to convert 32-bit integer to string
    //     const u32IntToStr = (n) => String.fromCharCode(
    //         (n >>> 24) & 0xFF,
    //         (n >>> 16) & 0xFF,
    //         (n >>> 8) & 0xFF,
    //         n & 0xFF
    //     );
    
    //     // Helper function to calculate CRC
    //     const updateCrc = (crc, data) => {
    //         let c = crc;
    //         for (let i = 0; i < data.length; i++) {
    //             c = XOR(crcTable[(XOR(c, data.charCodeAt(i)) & 0xff) >>> 0], c >>> 8);
    //         }
    //         return c;
    //     };
    
    //     // Helper function to calculate XOR
    //     const XOR = (a, b) => (a ^ b) >>> 0;
    
    //     // Helper function to calculate CRC
    //     const CRC = (data) => XOR(updateCrc(0xffffffff, data), 0xffffffff);
    
    //     // Helper function to prepare text chunk
    //     const prepareTextChunk = (content) => {
    //         const len = content.length;
    //         const lenStr = u32IntToStr(len);
    //         const chunkType = "tEXt";
    //         const checkSumStr = u32IntToStr(CRC(chunkType + content));
    //         return lenStr + chunkType + content + checkSumStr;
    //     };
    
    //     // Initialize CRC table
    //     const crcTable = initCrcTable();
    
    //     const _LC_Scribble_MetaDataKey = "LC_SCIBBLE_METADATA"
    //     // Main API
    //     return {
    //         // Function to check if data is a PNG
    //         _isPng: (b64data) => {
    //             return b64data && b64data.replace(/\s+/g, "").startsWith("iVBORw0KGgo");
    //         },
    
    //         // Function to make PNG read-only
    //         _makeReadOnly: (b64data) => {
    //             const bindata = atob(b64data.replace(/\s+/g, '')); // remove white spaces
    //             const pngctx = { p: 8, d: bindata }; // Skip PNG header
    //             const metadataChunk = prepareTextChunk(_LC_Scribble_MetaDataKey + String.fromCharCode(0) + "true");
    //             const newdata = pngctx.d.substring(0, pngctx.p) + metadataChunk + pngctx.d.substring(pngctx.p);
    //             return btoa(newdata);
    //         },
    
    //         // Function to decode base64
    //         _atob: (input) => window.atob ? atob(input) : Base64.decode(input),
    
    //         // Function to encode to base64
    //         _btoa: (input) => window.btoa ? btoa(input) : Base64.encode(input),
    
    //         // Function to check if PNG is read-only
    //         _isReadOnly: (b64data) => {
    //             if (this._isPng(b64data)) {
    //                 const testStr = _LC_Scribble_MetaDataKey + String.fromCharCode(0) + "true";
    //                 const bindata = this._atob(b64data.replace(/\s+/g, ''));
    //                 const pngctx = { p: 8, d: bindata }; // Skip PNG header
    //                 while (pngctx.p < pngctx.d.length) {
    //                     const size = u32IntToStr(pngctx.d.charCodeAt(pngctx.p));
    //                     const type = pngctx.d.slice(pngctx.p, pngctx.p + 4);
    //                     pngctx.p += 4; // Move past type
    //                     if (type === "tEXt" && pngctx.d.indexOf(testStr, pngctx.p) === pngctx.p) {
    //                         return true;
    //                     }
    //                     pngctx.p += size + 4; // Move past data and CRC
    //                 }
    //             }
    //             return false;
    //         }
    //     };
    // })();

    class Scribble extends FormView.FormFieldBase {
        _geoLocQuery=null;
        _signSubmitted=false;
        _enforceGeoLoc=!!navigator.userAgent.match(/iPad/i);
        _geoCanvId=null;
        _geoLocAtBottom=false;
        _geoCanvasWidth=696;
        _defaultStatus="&nbsp;";
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
            scribbleContainerCaption: `.${Scribble.bemBlock}__caption`,
            scribbleControlPanel: `.${Scribble.bemBlock}__controlpanel`,
            geoCanvasRight: `.${Scribble.bemBlock}__geocanvasright`,
            canvas: `.${Scribble.bemBlock}__canvas`,
            label: `.${Scribble.bemBlock}__label`,
            description: `.${Scribble.bemBlock}__longdescription`,
            qm: `.${Scribble.bemBlock}__questionmark`,
            errorDiv: `.${Scribble.bemBlock}__errormessage`,
            tooltipDiv: `.${Scribble.bemBlock}__shortdescription`,
            brushControl: `.${Scribble.bemBlock}__control-brush`,
            scribbleGeoControl: `.${Scribble.bemBlock}__control-geo`,
            clearControl: `.${Scribble.bemBlock}__control-clear`,
            scribbleTextControl: `.${Scribble.bemBlock}__control-text`,
            scribbleMessage: `.${Scribble.bemBlock}__control-message`,
            scribbleSubmitControl: `.${Scribble.bemBlock}__control-submit`,
            scribbleBrushList: `.${Scribble.bemBlock}__brushlist`,
            signCanvases: `.${Scribble.bemBlock}__signcanvases`,
            saveCanvas: `.${Scribble.bemBlock}__control-submit`,
        };

        constructor(params) {
            super(params);
            this.initializeScribble();
        }

        initializeScribble() {
            this.getCanvasContainer().addEventListener('click', () => this.clickHanlder());
            this.initScribbleModal();
        }
           
        getWidget() {
            return this.element.querySelector(Scribble.selectors.canvas);
        }

        getTemplate() {
            return this.element.querySelector('#template-modal');
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

        getTextSignControl() {
            return document.querySelector(Scribble.selectors.scribbleTextControl);
        }

        getScribbleContainerPanel() {
            return document.querySelector(Scribble.selectors.scribbleContainerPanel);
        }

        getScribbleContainerCaption() {
            return document.querySelector(Scribble.selectors.scribbleContainerCaption);
        }

        getKeyboardSignBox() {
            return document.querySelector(Scribble.selectors.keyboardSignBox);
        }

        getGeoCanvasRight() {
            return document.querySelector(Scribble.selectors.geoCanvasRight);
        }

        getCanvasContainer() {
            return this.element.querySelector('.cmp-adaptiveform-scribble__canvas-signed-container');
        }

        getScribbleCloseButton() {
            return this.element.querySelector('.cmp-adaptiveform-scribble__button-close');
        }

        getCanvas() {
            return this.element.querySelector(Scribble.selectors.canvas);
        }

        getMainCanvas() {
            return this.element.querySelector('.cmp-adaptiveform-scribble__canvas__main');
        }

        getSignCanvasesContainer() {
            return this.element.querySelector(Scribble.selectors.signCanvases);
        }

        getDescription() {
            return this.element.querySelector(Scribble.selectors.description);
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
                if((idx=datauri.indexOf(","))>0){
                    return datauri.substr(idx+1);
                }
            }
        }

        openClearSignModal() {
            document.getElementById('msgBox_container').style.display='inline-block';
            document.getElementById('msgBox_Yes').addEventListener('click', () => {
                this.existingSign='';
                this.getMainCanvas().parentNode.replaceChild(this.existingCanvas, this.getMainCanvas());
                this.existingCanvas.getContext('2d').clearRect(0, 0, this.existingCanvas, this.existingCanvas.height);
                const geoCnv = this.getGeoCanvasRight();
                if(geoCnv) {
                    const geoCanvasContext = geoCnv.getContext('2d');
                    geoCanvasContext.clearRect(0, 0, geoCnv.width, geoCnv.height);
                }
                this.enableControls(['brush','geo','clear','text','submit']);
                const box = document.querySelector('.cmp-adaptiveform-scribble__canvas-signed-container');
                if (box.firstChild) {
                    box.removeChild(box.firstChild);
                    document.querySelector('.cmp-adaptiveform-scribble__canvas-signed-container').innerHTML = "";
                    document.querySelector('.sc_popUpMenu')?.remove();
                    document.getElementById('msgBox_container').style.display='none';
                    this.getKeyboardSignBox().value = '';
                }
                this._signSubmitted = false;
            });
            document.getElementById('msgBox_No').addEventListener('click', () => {
                document.getElementById('msgBox_container').style.display='none';
            });
        }

        createCanvas() {
            const mainCanvas = document.createElement('canvas');
            mainCanvas.classList.add('cmp-adaptiveform-scribble__canvasImage');
        }

        doOk() {
            const mainCanvas = document.createElement('canvas');
            // mainCanvas.classList.add('cmp-adaptiveform-scribble__canvas');
            mainCanvas.classList.add('cmp-adaptiveform-scribble__canvas__main');
            const sigCnv = this.getCanvas(); // Get the sign canvas
            const geoCnv = this.getGeoCanvasRight(); // Get the geo canvas
            let ctx = mainCanvas.getContext('2d');
            if (geoCnv && geoCnv.width > 0 && geoCnv.height > 0) {
                // Set the dimensions of the mainCanvas to accommodate both canvases vertically
                mainCanvas.width = Math.max(sigCnv.width, geoCnv.width);
                mainCanvas.height = sigCnv.height + geoCnv.height;
                ctx = mainCanvas.getContext('2d');
                // Draw the sign canvas on the main canvas
                ctx.drawImage(sigCnv, 0, 0);
        
                // Draw the geo canvas below the sign canvas
                ctx.drawImage(geoCnv, 0, sigCnv.height);
            } else {
                mainCanvas.width = sigCnv.width;
                mainCanvas.height = sigCnv.height;
                ctx.drawImage(sigCnv, 0, 0);
            }
        
            // if (geoCnv && geoCnv.width > 0 && geoCnv.height > 0) {
            //     if (this._geoLocAtBottom) {
            //         mainCanvas.width = sigCnv.width;
            //         mainCanvas.height = sigCnv.height + geoCnv.height;
            //         ctx.drawImage(sigCnv, 0, 0);
            //         ctx.drawImage(geoCnv, 0, sigCnv.height);
            //     } else {
            //         // Create the final image after the submit is clicked
            //         mainCanvas.width = sigCnv.width;// + geoCnv.width + 10;
            //         mainCanvas.height = sigCnv.height + geoCnv.height + 10;// Math.max(sigCnv.height, geoCnv.height);
            //         // mainCanvas.height = Math.max(sigCnv.height, geoCnv.height);
            //         ctx.drawImage(sigCnv, 0, 0);
            //         // +10 is added to provide the margin between two images
            //         ctx.drawImage(geoCnv, 0, 180);
            //         // ctx.drawImage(geoCnv, sigCnv.width + 10, 0);
            //         geoCnv.style.display = 'none';
            //     }
            // } else {
            //     mainCanvas.width = sigCnv.width;
            //     mainCanvas.height = sigCnv.height;
            //     ctx.drawImage(sigCnv, 0, 0);
            // }
            this.existingCanvas = sigCnv;
            sigCnv.height = mainCanvas.height;
            sigCnv.parentNode.replaceChild(mainCanvas, sigCnv);
            
            const newData = mainCanvas.toDataURL("image/png");
            this.existingSign = mainCanvas;
            let val;
            if ((val = this.extractData(newData))) {
                val = PNGUtil._makeReadOnly(val);
                this._is_readonly = true;
            }
            
            const img = document.createElement('img');
            img.src = newData;
            img.style.width = '100%';
            img.style.height = '200px';
        
            const clearSignButton = document.createElement('div');
            clearSignButton.classList.add('sc_popUpMenu');
        
            const mainCanvasImageContainer = this.getCanvasContainer();
            mainCanvasImageContainer.appendChild(img);
            mainCanvasImageContainer.appendChild(clearSignButton);

            clearSignButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openClearSignModal();
            });
        
            if (this._geoLocQuery) {
                this._geoLocQuery.cancel(); // Cancel the current geo loc request
            }
            
            this.closeEditModal();
            this._signSubmitted = true;
        }

        handleOk() {
            if (this._enforceGeoLoc) {
                // Create a new GeoLocQuery instance and initialize it with bound handlers
                this._geoLocQuery = new GeoLocQuery().init(
                    (data) => {
                        this.geoQuerySuccessHandler(data);
                        this.doOk();
                    },
                    (err) => {
                        this.geoQueryErrorHandler(err);
                    }
                );
                
                // Start the geolocation query
                this._geoLocQuery.query();
                this.showMessage('fetchGeoLocation');
            } else {
                // If geolocation is not enforced, directly proceed with the operation
                this.doOk();
            }
        }

        geoQueryErrorHandler(err){
            this.showMessage('errorFetchGeoLocation');
        }

        renderBrushList() {
            [2,3,4,5,6,7,8,9,10].forEach((brush) => {
                var divel = document.createElement('DIV');
                var cnv = document.createElement('CANVAS');
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
                console.error('Canvas has invalid dimensions.');
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
            // signCanvas.height = container.offsetHeight; // Maintain the height
    
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
                const time = dateObj.getTime();
                const timeStr = `${time}: ${(dateObj.getMonth() + 1)}/${dateObj.getDate()}/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}${tZone > 0 ? ' +' : ' '}${tZone}`;
        
                const signCanvas = this.getSignCanvasesContainer();
                const geoCanvasRight = this.getGeoCanvasRight();
                const container = this.getCanvasContainer();
        
                // Set the widths of the canvases
                // signCanvas.style.width = '70%';
                geoCanvasRight.style.height = '50px';
                geoCanvasRight.style.width = '200px';
                geoCanvasRight.style.display = 'block';
                // geoCanvasRight.style.display = 'inline-block';
                // geoCanvasRight.style.height = '200px';
                // Adjust the canvas sizes based on the new widths
                // this.resizeAndFixCanvas();
                // this.resizeCanvas(70); // Resize the signCanvas to 70% of its container's width
        
                if (geoCanvasRight) {
                    const ctx = geoCanvasRight.getContext('2d');
                    geoCanvasRight.width = geoCanvasRight.offsetWidth;
                    geoCanvasRight.height = geoCanvasRight.offsetHeight;
        
                    ctx.font = 'bold 10px Arial'; // Font size and type
                    ctx.fillStyle = 'black'; // Text color
                    ctx.measureText("m").width * 1.5;
                    ctx.fillStyle = 'black'; // Text color
                    ctx.measureText("m").width * 1.5;
                    // Define the position to draw the text
                    let x = 0;
                    let y = 15;
        
                    // Draw the text on the canvas
                    ctx.fillText(latStr, x, y);
                    ctx.fillText(longStr, x, y + 15);
                    ctx.fillText(timeStr, x, y + 30);
                }
            }
        }
        handleGeo() {
            // initiate geolocation
            if(navigator.geolocation){
                // Create a new GeoLocQuery instance
                this._geoLocQuery = new GeoLocQuery();
                // Initialize with bound success and error handlers
                this._geoLocQuery.init(
                    this.geoQuerySuccessHandler.bind(this),
                    this.geoQueryErrorHandler.bind(this)
                );
                this._geoLocQuery.query();
                this.showMessage('Fetching Geo Location...'); // Geo Location !
            }
        }

        // This Function is used to fetch the geolocation.
        calculateGeolocation() {
            this.handleGeo();
        }

        enableControls(controls) {
            controls.forEach(control => {
                document.querySelector('.' + Scribble.bemBlock + '__control-' + control)?.classList.remove('disable_button');
            });
        }

        disableControl(controls) {
            controls.forEach(control => {
                document.querySelector('.' + Scribble.bemBlock + '__control-' + control)?.classList.add('disable_button');
            });
        }

        dialogCallback(button_val, arg1) {
            switch(button_val){
                case "ok":
                this.handleOk();
                break;
                case "Cancel":
                this.handleCancel();
                break;
                case "geolocation":
                this.calculateGeolocation();
                break;
                case "BrushSelect":
                this.handleBrushSelect(arg1);
                break;
                case "brushes":
                this.handleBrush(arg1);
                break;
                case "Text":
                this.handleText();
                break;
            }
        }

        toggleBrushList(event) {
            var brushList = this.getBrushList();
            var brushButton = this.getBrush();
            var originalOnSelectStart = document.onselectstart;
        
            if (getComputedStyle(brushList).display !== 'none') {
                brushList.style.display = 'none';
                return;
            }
        
            // Disable text selection
            document.onselectstart = function() {
                return false;
            };
        
            // Show the brush list and position it
            brushList.style.display = 'block';
            brushList.style.visibility = 'hidden';
            // Make it visible
            brushList.style.visibility = 'visible';
        
            // Add an event listener for mouse leave
            function onMouseLeave() {
                brushList.style.display = 'none';
                document.onselectstart = originalOnSelectStart;
                brushList.removeEventListener('mouseleave', onMouseLeave);
            }
        
            brushList.addEventListener('mouseleave', onMouseLeave);
        }
        

        imageClick(event) {
            this.dialogCallback(event.srcElement.title);
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
            this.initializeCanvas();
            this.toggleBrushList(evt);
        }

        makeDraggable() {
            const draggableBar = this.getScribbleContainerPanel();
            const draggableContent = this.getScribbleContainer();
            draggableBar.addEventListener('mousedown', (e) => {
                let offsetX = e.clientX - draggableContent.getBoundingClientRect().left;
                let offsetY = e.clientY - draggableContent.getBoundingClientRect().top;
                function onMouseMove(event) {
                    draggableContent.style.left = `${event.clientX - offsetX}px`;
                    draggableContent.style.top = `${event.clientY - offsetY}px`;
                }
                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }

        initScribbleModal() {
            const eraserIcon = this.getClearControl();
            const textSignIcon =  this.getTextSignControl();
            const controlPanel = this.getScribbleControlPanel();
            const toggleBrushListIcon = this.getBrushList();
            const closeEditModal = this.getScribbleCloseButton();
            const keyboardSignBox = this.getKeyboardSignBox();
            const saveButton = this.getSaveControl();
            // this.resizeAndFixCanvas()

            this.renderBrushList()
            controlPanel.addEventListener('click', (event) => {
                this.imageClick(event);
            })

            saveButton.addEventListener('click', () => {
                this.doOk();
            });

            eraserIcon.addEventListener('click', () => {
                this.eraseSignature();
            })
            textSignIcon.addEventListener('click', () =>{
                this.enableSignatureTextBox();
            })
            toggleBrushListIcon.addEventListener('click', (event) => {
                this.toggleBrushList(event);
            })
            closeEditModal.addEventListener('mousedown', () => {
                this.closeEditModal();
            })

            keyboardSignBox.addEventListener('keyup', () => {
                this.enableControls(['clear','submit']);
                let sigCanvasFontFamily = "sans-serif, Georgia";
                let sigCanvasFontStyle = "italic";
                keyboardSignBox.style.font=sigCanvasFontStyle + " 2rem " + sigCanvasFontFamily;
                const value = keyboardSignBox.value;
                this.context.font = sigCanvasFontStyle + " 2rem " + sigCanvasFontFamily;
                this.context.fillText(value,0,this.getCanvas().height/2);
            })
            
        }

        enableSignatureTextBox() {
            this.context.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
            this.getKeyboardSignBox().style.display = "inline-block";
            this.getCanvas().style.display = "none";
        }

        eraseSignature() {
            this.context.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
            const geoCnv = this.getGeoCanvasRight();
            if(geoCnv) {
                const geoCanvasContext = geoCnv.getContext('2d');
                geoCanvasContext.clearRect(0, 0, geoCnv.width, geoCnv.height);
                geoCnv.style.display = 'none';
            }
            this.getKeyboardSignBox().value='';
            this.disableControl(['clear','submit']);
        }
        

        resizeAndFixCanvas() {
            const dpr = window.devicePixelRatio || 1;
            const imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.width = this.canvas.offsetWidth * dpr;
            this.canvas.height = this.canvas.offsetHeight * dpr;
            this.context.putImageData(imgData, 0, 0);
        }
        

        initializeCanvas() {
            this.canvas = this.getCanvas();

            if(this.existingSign) {
                this.getCanvasContainer().style.width = '100%';
                this.getMainCanvas().style.border = '1px solid black';
                this.getKeyboardSignBox().style.display = 'none';
                this.disableControl(['brush','geo','clear','text','submit']);
            } else {
                this.context = this.canvas.getContext('2d', { willReadFrequently: true });
                this.resizeCanvas(100);
                this.resizeAndFixCanvas();
                if (this.canvas) {
                    this.canvas.style.border = '1px dashed #AAAAAA';
                    this.getKeyboardSignBox().style.display = 'none';
                    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
                    this.canvas.addEventListener('mousemove', this.draw.bind(this));
                    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
                    this.canvas.addEventListener('mouseleave', this.stopDrawing.bind(this));
                    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
                    this.canvas.addEventListener('mousemove', this.draw.bind(this));
                    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
                    this.canvas.addEventListener('mouseleave', this.stopDrawing.bind(this));
                    this.canvas.addEventListener('touchstart', this.startDrawing.bind(this));
                    this.canvas.addEventListener('touchmove', this.draw.bind(this));
                    this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
                    this.canvas.addEventListener('touchcancel', this.stopDrawing.bind(this));
                    this.isDrawing = false;
                }
            }
            // Add event listener for window resize to make the canvas responsive
            window.addEventListener('resize', this.resizeAndFixCanvas.bind(this));
        // }
        }

        showScribbleModal() {
            if(window.getComputedStyle(this.getScribbleContainer()).display !== 'block') {
                this.disableControl(['clear','submit']);
            }
            this.getScribbleContainer().style.display = 'block';
        }

        hideScribbleModal() {
            this.getScribbleContainer().style.display = 'none';
        }

        clickHanlder() {
            this.showScribbleModal();
            this.initializeCanvas();
        }
        

        startDrawing(event) {
            // Ensure the context is initialized
            if (!this.context) {
                console.error('Canvas context is not initialized.');
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
            this.enableControls(['clear','submit']);
        }

        stopDrawing() {
            if (this.isDrawing) {
                this.context.closePath();
                this.isDrawing = false;
                this._model.value = this.canvas.toDataURL();
            }
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Scribble({element, formContainer})
    }, Scribble.selectors.self);
})();