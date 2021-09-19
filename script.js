const Keyboard = {
  keyLayoutEn: [
    "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
    "done", "shift", "z", "x", "c", "v", "b", "n", "m", " , ", " . ", "?",
    "sound", "en", "space", "<", ">", "voice"
  ],
  keyLayoutEnShift: [
    "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "backspace",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "{", "}",
    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ":", "|", "enter",
    "done", "shift", "z", "x", "c", "v", "b", "n", "m", ";", "`", "/",
    "sound", "en", "space", "<", ">", "voice"
  ],
  keyLayoutRu: [
    "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
    "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
    "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
    "done", "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
    "sound", "рус", "space", "<", ">", "voice"
  ],
  keyLayoutRuShift: [
    "ё", "!", '"', "№", ";", "%", ":", "&", "*", "(", ")", "-", "=", "backspace",
    "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
    "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
    "done", "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ",",
    "sound", "рус", "space", "<", ">", "voice"
  ],

  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    language: "en",
    onShift: false,
    onSound: false,
    onVoice: false,
    sound: "sound_en"
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys("En"));

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);
    this.input = document.querySelectorAll(".use-keyboard-input");
    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
      // save keyboard input
      element.addEventListener("blur", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
    });

    document.addEventListener('keydown', (event) => {
      this.elements.keys[this.keyIndex(event.key)].classList.add("keyboard__key_on", true);
    });
    document.addEventListener('keyup', (event) => {
      this.elements.keys[this.keyIndex(event.key)].classList.remove("keyboard__key_on", true);
    });
  },

  keyIndex(key) {

    switch (key) {
      case ",":
        return 48;
      case ".":
        return 49;
      case "CapsLock":
        return 26;
      case "Backspace":
        return 13;
      case "Shift":
        return 40;
      case "Enter":
        return 38;
      case " ":
        return 53;
      case "ArrowLeft":
        return 54;
      case "ArrowRight":
        return 55;
    }
    return this.keyLayoutEn.indexOf(key.toLowerCase());
  },

  _createKeys(keyboard) {
    const fragment = document.createDocumentFragment();
    let keyLayout;

    switch (keyboard) {
      case "En":
        keyLayout = this.keyLayoutEn;
        break;
      case "EnShift":
        keyLayout = this.keyLayoutEnShift;
        break;
      case "Ru":
        keyLayout = this.keyLayoutRu;
        break;
      case "RuShift":
        keyLayout = this.keyLayoutRuShift;
        break;
    };

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };



    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "]", "}", "enter", "?", "/", "ъ", ".", ","].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "рус":
          keyElement.innerHTML = "рус";
          keyElement.addEventListener("click", () => {
            this.properties.language = "en";
            // recognition.lang = 'en';
            this._languageChg("En");
            this.input[0].focus();
            this.properties.sound = "sound_en";
            if (this.properties.onSound) playSound("lang");
          });
          break;
        case "en":
          keyElement.innerHTML = "en";
          keyElement.addEventListener("click", () => {
            this.properties.language = "ru";
            //  recognition.lang = 'ru';
            this._languageChg("Ru");
            this.input[0].focus();
            this.properties.sound = "sound_ru";
            if (this.properties.onSound) playSound("lang");
          });
          break;

        case "shift":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = key;
          if (this.properties.onShift) keyElement.classList.add("active", true);
          keyElement.addEventListener("click", () => {

            //отжимаем
            if (this.properties.onShift) {
              this.properties.onShift = !this.properties.onShift;
              //восстанавливаем капслок
              if (this.properties.capsLock) {
                this.properties.capsLock = !this.properties.capsLock;
                this._toggleCapsLock();
              }
              //меняем раскладку и состояние клавиши шифт
              (this.properties.language === "en") ? this._languageChg("En") : this._languageChg("Ru");
              (this.properties.onShift) ? keyElement.classList.add("active", true) : keyElement.classList.remove("active", true);
              this.input[0].focus();
              if (this.properties.onSound) playSound("shift");

              //нажимаем
            } else {
              this.properties.onShift = !this.properties.onShift;
              (this.properties.language === "en") ? this._languageChg("EnShift") : this._languageChg("RuShift");

              if (this.properties.capsLock === false) {
                this._toggleCapsLock();
                this.properties.capsLock = false;
              } else {
                this._toggleCapsLock();
                this.properties.capsLock = true;
              }


              (this.properties.onShift) ? keyElement.classList.add("active", true) : keyElement.classList.remove("active", true);
              this.input[0].focus();
              if (this.properties.onSound) playSound("shift");
            }
          });
          break;

        case "<":
          keyElement.innerHTML = createIconHTML("arrow_left");
          keyElement.addEventListener("click", () => {
            var caretPos = doGetCaretPosition(this.input[0]);
            if (!(caretPos === 0)) caretPos -= 1;
            setCaretPosition(this.input[0], caretPos);
            this.input[0].focus();
            if (this.properties.onSound) playSound("arrow");
          });
          break;
        case ">":
          keyElement.innerHTML = createIconHTML("arrow_right");
          keyElement.addEventListener("click", () => {
            var caretPos = doGetCaretPosition(this.input[0]);
            setCaretPosition(this.input[0], caretPos + 1);
            this.input[0].focus();
            if (this.properties.onSound) playSound("arrow");
          });
          break;

        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");
          keyElement.addEventListener("click", () => {
            var caretPos = doGetCaretPosition(this.input[0]);
            var m = [];
            m = this.properties.value.split('');
            m.splice(caretPos - 1, 1);
            this.properties.value = m.join('');
            this._triggerEvent("oninput");
            this.input[0].focus();
            setCaretPosition(this.input[0], caretPos - 1);
            if (this.properties.onSound) playSound("backspace");
          });
          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");
          if (this.properties.capsLock) keyElement.classList.add("active", true);
          keyElement.addEventListener("click", () => {
            if (this.properties.onShift) {
              if (this.properties.capsLock === false) {
                this.properties.capsLock = true;
                this._toggleCapsLock();
                this.properties.capsLock = true;
              } else {
                this.properties.capsLock = false;
                this._toggleCapsLock();
                this.properties.capsLock = false;
              }
            } else {
              this._toggleCapsLock();
            }
            (this.properties.capsLock) ? keyElement.classList.add("active", true) : keyElement.classList.remove("active", true);
            this.input[0].focus();
            if (this.properties.onSound) playSound("cups");
          });
          break;

        case "sound":
          keyElement.innerHTML = key.toLowerCase();
          keyElement.classList.add("sound");
          if (this.properties.onSound) keyElement.classList.add("active", true);
          keyElement.addEventListener("click", () => {
            this.properties.onSound = !this.properties.onSound;
            (this.properties.onSound) ? keyElement.classList.add("active", true) : keyElement.classList.remove("active", true);
            this.input[0].focus();
          });
          break;

        case "voice":
          keyElement.innerHTML = key;
          window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

          const recognition = new SpeechRecognition();

          recognition.interimResults = true;
          recognition.lang = this.properties.language;
          // recognition.lang = 'en-US';

          recognition.addEventListener('result', e => {
            const transcript = Array.from(e.results)
              .map(result => result[0])
              .map(result => result.transcript)
              .join('');

            const poopScript = transcript.replace(/poop|poo|shit|dump/gi, '💩');

            //  this.properties.value += poopScript;

            if (e.results[0].isFinal) {
              this.properties.value += " " + poopScript;
              this._triggerEvent("oninput");
              this.input[0].focus();
              // alert(poopScript);
            }
          });

          recognition.addEventListener('end', recognition.start);

          if (this.properties.onVoice) keyElement.classList.add("active", true);
          keyElement.addEventListener("click", () => {
            this.properties.onVoice = !this.properties.onVoice;
            (this.properties.onVoice) ? keyElement.classList.add("active", true) : keyElement.classList.remove("active", true);


            if (this.properties.onVoice) {
              // recognition.addEventListener('end', recognition.start);
              recognition.start();
            } else {
              // recognition.addEventListener('end', recognition.abort);

              recognition.abort();
            }


            //voiceInput();
            this.input[0].focus();
          });
          break;
        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");
          keyElement.addEventListener("click", () => {
            this.insertChar("\n");
            if (this.properties.onSound) playSound("enter");
          });
          break;
        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");
          keyElement.addEventListener("click", () => {
            this.insertChar(" ");
            if (this.properties.onSound) playSound(this.properties.sound);
          });
          break;
        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");
          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });
          break;
        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener("click", () => {
            this.insertChar(keyElement.textContent);
            if (this.properties.onSound) playSound(this.properties.sound);
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });
    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  },

  _languageChg(keyboard) {
    this.elements.keysContainer.innerHTML = '';
    this.elements.keysContainer.appendChild(this._createKeys(keyboard));
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    if (this.properties.capsLock) {
      this.properties.capsLock = !this.properties.capsLock;
      this._toggleCapsLock();
    }
  },

  insertChar(key) {
    var caretPos = doGetCaretPosition(this.input[0]);
    var m = [];
    m = this.properties.value.split('');
    m.splice(caretPos, 0, key);
    this.properties.value = m.join('');
    this._triggerEvent("oninput");
    this.input[0].focus();
    setCaretPosition(this.input[0], caretPos + 1);
  }
};

function doGetCaretPosition(ctrl) {
  var CaretPos = 0;
  // IE Support
  if (document.selection) {
    ctrl.focus();
    var Sel = document.selection.createRange();
    Sel.moveStart('character', -ctrl.value.length);
    CaretPos = Sel.text.length;
  }
  // Firefox support
  else if (ctrl.selectionStart || ctrl.selectionStart == '0')
    CaretPos = ctrl.selectionStart;
  return (CaretPos);
}

function setCaretPosition(ctrl, pos) {
  if (ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  }
  else if (ctrl.createTextRange) {
    var range = ctrl.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}

function playSound(sound, e) {
  const audio = document.querySelector(`audio[data-key="${sound}"]`);
  if (!audio) return;
  audio.currentTime = 0;
  audio.play();
}

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});
