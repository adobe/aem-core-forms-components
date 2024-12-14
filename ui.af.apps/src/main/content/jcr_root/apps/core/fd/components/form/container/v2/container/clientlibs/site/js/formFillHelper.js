/*******************************************************************************
 * Copyright 2024 Adobe
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

if (typeof window.FormFillHelper === "undefined") {
  window.FormFillHelper = class FormFillHelper {
    static bemBlock = ".cmp-adaptiveform-container__form-fill-helper";
    static OPTIONS_FIELD_TYPE = ['radio-group', 'checkbox-group', 'drop-down']

    constructor(container) {
      this.container = container;
      this.recognition = null;
      this.isRecording = false;
      this.formData = {};
      this.session_id = "id" + Math.random().toString(16).slice(2);
    }
    getOptions(item) {
      const options = item.enumNames && item.enumNames.length ? item.enumNames : item.enums || [];
      return options.map((label, index) => {
        return {
          label: label,
          value: item.enum[index]
        };
      });
    }

    processFormData(items) {
      const result = {};
      items.filter(x=> x.fieldType).forEach((item) => {
        if (item.fieldType === 'panel') {
          result[item.name] = this.processFormData(item.items)
        } else {
          result[item.name] = {
            label: item.label.value,
            id: item.id,
            value: item.value || undefined,
            fieldType: item.fieldType,
            ...(FormFillHelper.OPTIONS_FIELD_TYPE.includes(item.fieldType) ? { options: this.getOptions(item) } : {})
          }
        }
      });
      return result;
    }

    getContainerElement() {
      return document.querySelector(FormFillHelper.bemBlock);
    }

    init() {
      this.createButton();
      // this.createChatBox();
      // const items = this.container.getModel().getState().items;
      // this.formData = this.processFormData(items);
      // this.sendFormData(this.formData);

    }
    initChat(){
      this.createChatBox();
      const items = this.container.getModel().getState().items;
      this.formData = this.processFormData(items);
      this.sendFormData(this.formData);
    }

    createButton() {
      const button = document.createElement("button");
      button.className = "fill-form-button";
      button.innerText = "Start Voice/Chat Fill Form";
      button.addEventListener("click", () => {
        this.initChat();
      });
      this.getContainerElement().appendChild(button);
    }

    sendFormData(formData){
      // api call

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "docId": "carinsurance",
        "formData": formData,
        "sessionId": this.session_id,
        "query": null
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      this.customFetch(requestOptions)

    }

    customFetch(requestOptions) {
      fetch("http://127.0.0.1:5000/query", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if(typeof result === 'string'){
          this.addMessage(result, 'response');
        }else {
          this.addMessage(result.aiMessage, 'response');
          this.fillData(result.formData);
        }
      })
      .catch((error) => console.error(error));
    }

    fillData(res) {
      if(res){
        console.log(res);
        const data = this.fillFormData(res);
        this.importData(data);

        const items = this.container.getModel().getState().items;
        this.formData = this.processFormData(items);
      }
    }

    importData(data) {
      this.container.getModel().importData(data);x
    }

    fillFormData(data) {
      const result = {};
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === 'object' && !data[key].id) {
          result[key] = this.fillFormData(data[key])
        } else {
          result[key] = data[key].value
        }
      });
      return result;
    }

    sendRequest(transcript) {

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "docId": "carinsurance",
        "formData": this.formData,
        "sessionId": this.session_id,
        "query": transcript
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      this.customFetch(requestOptions)
    }

    startRecording() {
      let msgTranscript = '';
      if (!('webkitSpeechRecognition' in window)) {
        console.error("Speech recognition not supported in this browser.");
        return;
      }
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        console.log("Voice recording started...");
        this.isRecording = true;
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Voice input:", event);
        msgTranscript = transcript;
        console.log("Voice input:", transcript);
        // You can also add the transcribed message to the chat
        this.addMessage(transcript, 'user');
        this.sendRequest(transcript);
      };

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      this.recognition.onend = () => {
        console.log("Voice recording ended.");
        // this.textToVoice(msgTranscript);
        // this.isRecording = false;
      };

      this.recognition.start();
    }

    stopRecording() {
      this.recognition.stop();
      this.isRecording = false;
      console.log("Voice recording stopped.");
    }

    textToVoice(message) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = message;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      window.speechSynthesis.speak(speech);
    }


    addMessage( message, type) {
      const messageList = document.querySelector('.message-list');
      const messageItem = document.createElement("div");
      messageItem.className = `message-item ${type}`;
      messageItem.innerText = message;
      messageList.appendChild(messageItem);
      messageList.scrollTop = messageList.scrollHeight; // Scroll to the bottom
    }
    createChatBox() {
      // Create chat container
      const chatContainer = document.createElement("div");
      chatContainer.className = "chat-container";

      // Create message list
      const messageList = document.createElement("div");
      messageList.className = "message-list";
      chatContainer.appendChild(messageList);

      // Create input field container
      const inputContainer = document.createElement("div");
      inputContainer.className = "input-container";

      // Create input field
      const inputField = document.createElement("input");
      inputField.type = "text";
      inputField.className = "chat-input";
      inputField.placeholder = "Type a message...";

      // inputField.addEventListener("change", (event) => {
      //   const value = event?.target?.value;
      //   const sendButton = document.querySelector('.send-button');
      //   const voiceButton = document.querySelector('.voice-button');
      //   if(value){
      //     sendButton.classList.remove('hide');
      //     voiceButton.classList.add('hide');
      //   }else {
      //     sendButton.classList.add('hide');
      //     voiceButton.classList.remove('hide');
      //   }
      // });

      // Create send button
      const sendButton = document.createElement("button");
      sendButton.className = "send-button";
      sendButton.type = "button";
      sendButton.addEventListener("click", () => {
        const message = inputField.value.trim();
        if (message) {
          this.addMessage(message, 'user');
          inputField.value = "";
          this.sendRequest(message);
        }
      });

      // Create voice button
      const voiceButton = document.createElement("button");
      voiceButton.className = "voice-button";
      voiceButton.type = "button";
      voiceButton.addEventListener('click', () => {
        document.querySelector('.voice-button').classList.toggle('voiceRecording');
        if (this.isRecording) {
          this.stopRecording();
        } else {
          this.startRecording();
        }
      });

      inputContainer.appendChild(inputField);
      inputContainer.appendChild(sendButton);
      inputContainer.appendChild(voiceButton);
      chatContainer.appendChild(inputContainer);

      const containerElement = this.getContainerElement();
      containerElement.innerHTML = "";
      containerElement.appendChild(chatContainer);
    }
  };
}
