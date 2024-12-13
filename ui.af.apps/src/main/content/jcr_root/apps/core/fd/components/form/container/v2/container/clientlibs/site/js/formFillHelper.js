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
      items.forEach((item) => {
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
      this.createChatBox();
      const items = this.container.getModel().getState().items;
      this.formData = this.processFormData(items)
      this.initChat(this.formData);

    }

    initChat(res) {
      console.log(res);
      res.Address.City.value = 'San Francisco';
      const data = this.fillFormData(res);
      this.importData(data);
    }

    importData(data) {
      this.container.getModel().importData(data);
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
        const messageList = document.querySelector('.message-list');
        this.addMessage(messageList, transcript, 'user');
      };

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      this.recognition.onend = () => {
        console.log("Voice recording ended.");
        this.textToVoice(msgTranscript);
        this.isRecording = false;
      };

      this.recognition.start();
    }

    stopRecording() {
      if (this.recognition) {
        this.recognition.stop();
        this.isRecording = false;
        console.log("Voice recording stopped.");
      }
    }

    textToVoice(message) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = message;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      window.speechSynthesis.speak(speech);
    }


    addMessage(messageList, message, type) {
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

      // Create send button
      const sendButton = document.createElement("button");
      sendButton.className = "send-button";
      sendButton.innerText = "Send";
      sendButton.type = "button";
      sendButton.addEventListener("click", () => {
        const message = inputField.value.trim();
        if (message) {
          this.addMessage(messageList, message, 'user');
          inputField.value = "";
          // Simulate a response after a delay
          setTimeout(() => {
            this.addMessage(messageList, "This is a response", 'response');
          }, 1000);
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
      inputContainer.appendChild(voiceButton);
      inputContainer.appendChild(sendButton);
      chatContainer.appendChild(inputContainer);

      this.getContainerElement().appendChild(chatContainer);
    }
  };
}
