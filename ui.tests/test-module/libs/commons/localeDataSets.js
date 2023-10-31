const selectors = {
    ACCORDION: '.cmp-accordion > .cmp-accordion__label-container > label',
    BUTTON: '.button.base:not(.submit):not(.reset) span',
    CHECK_BOX1: '.cmp-adaptiveform-checkboxgroup:has(.checkboxgroup1) .cmp-adaptiveform-checkboxgroup__label-container > label',
    CHECK_BOX1_ITEM1: '.cmp-adaptiveform-checkboxgroup:has(.checkboxgroup1) > div > div > label > span',
    CHECK_BOX2: '.cmp-adaptiveform-checkboxgroup:has(.checkboxgroup2) .cmp-adaptiveform-checkboxgroup__label-container > label',
    CHECK_BOX2_ITEM1: '.cmp-adaptiveform-checkboxgroup:has(.checkboxgroup2) > div > div > label > span',
    DATE_INPUT: '.cmp-adaptiveform-datepicker label',
    DROPDOWN: '.cmp-adaptiveform-dropdown label',
    EMAIL_INPUT: '.cmp-adaptiveform-emailinput__label',
    FILE_ATTACHMENT: '.cmp-adaptiveform-fileinput__label',
    FILE_ATTACHMENT_BUTTON: '.cmp-adaptiveform-fileinput__widgetlabel',
    TABS_ON_TOP: '.cmp-tabs label',
    NUMBER_INPUT: '.cmp-adaptiveform-numberinput__label',
    PANEL: '.cmp-container__label',
    RADIO_BUTTON: '.cmp-adaptiveform-radiobutton__label',
    SUBMIT: '.submit span',
    TELEPHONE_INPUT: '.cmp-adaptiveform-telephoneinput__label',
    TEXT_INPUT: '.cmp-adaptiveform-textinput__label',
    TITLE: '.cmp-title__text',
    WIZARD: '.cmp-adaptiveform-wizard__label'
}

const languages = [
    {
        LANGUAGE: 'English',
        LOCALE: 'en',
        TRANSLATION: {
            ACCORDION: 'Accordion',
            BUTTON: 'Button',
            CHECK_BOX1: 'Check Box Group',
            CHECK_BOX1_ITEM1: 'Item 1',
            CHECK_BOX2: 'Select Animal',
            CHECK_BOX2_ITEM1: 'Dog',
            DATE_INPUT: 'Date Input',
            DROPDOWN: 'Dropdown',
            EMAIL_INPUT: 'Email Input',
            FILE_ATTACHMENT: 'File Attachment',
            FILE_ATTACHMENT_BUTTON: 'Attach',
            TABS_ON_TOP: 'Tabs on top',
            NUMBER_INPUT: 'Number Input',
            PANEL: 'Panel',
            RADIO_BUTTON: 'Radio Button',
            SUBMIT: 'Submit',
            TELEPHONE_INPUT: 'Telephone Input',
            TEXT_INPUT: 'Text Input',
            TITLE: 'Title',
            WIZARD: 'wizard'
        },
        I18N_STRINGS: {
            "FileCloseAccessText"   :       "Press Enter to delete the file ",
            "FileSizeGreater"       :       "File(s) ${0} are greater than the expected size: ${1}MB.",
            "FileNameInvalid"       :       "Do not attach files where filename starts with (.), contains \\ / : * ? \" < > | ; % $, or is a reserved keyword like nul, prn, con, lpt, or com.",
            "FileMimeTypeInvalid"   :       "File(s) ${0} are unsupported file types",
            "InternalFormSubmissionError" :  "Encountered an internal error while submitting the form."
        }
    }, {
        LANGUAGE: 'German', LOCALE: 'de', TRANSLATION: {
            ACCORDION: 'Akkordeon',
            BUTTON: 'Knopf',
            CHECK_BOX1: 'Kontrollkästchengruppe',
            CHECK_BOX1_ITEM1: 'Punkt 1',
            CHECK_BOX2: 'Tier auswählen',
            CHECK_BOX2_ITEM1: 'Hund',
            DATE_INPUT: 'Datumseingabe',
            DROPDOWN: 'Dropdown-Menü',
            EMAIL_INPUT: 'E-Mail-Eingabe',
            FILE_ATTACHMENT: 'Dateianhang',
            FILE_ATTACHMENT_BUTTON: 'Befestigen',
            TABS_ON_TOP: 'Registerkarten oben',
            NUMBER_INPUT: 'Nummerneingabe',
            PANEL: 'Gremium',
            RADIO_BUTTON: 'Optionsfeld',
            SUBMIT: 'Senden',
            TELEPHONE_INPUT: 'Telefoneingang',
            TEXT_INPUT: 'Texteingabe',
            TITLE: 'Titel',
            WIZARD: 'Zauberer'
        },
        I18N_STRINGS: {
            "FileCloseAccessText"   :       "Drücken Sie die Eingabetaste, um die Datei zu löschen ",
            "FileSizeGreater"       :        "Dateien ${0} übersteigen die erwartete Größe: ${1}MB.",
            "FileNameInvalid"       :       "Datei(en) ${0} hat/haben ungültige Zeichen in ihrem Namen. Es werden nur alphanumerische Zeichen unterstützt",
            "FileMimeTypeInvalid"   :       "Datei(en) ${0} ist/sind nicht unterstützte(r) Dateityp(en)",
            "InternalFormSubmissionError" :  "Beim Übermitteln des Formulars ist ein interner Fehler aufgetreten."
        }
    }, {
        LANGUAGE: 'Japanese', LOCALE: 'ja', TRANSLATION: {
            ACCORDION: 'アコーディオン',
            BUTTON: 'ボタン',
            CHECK_BOX1: 'チェック ボックス グループ',
            CHECK_BOX1_ITEM1: 'アイテム1',
            CHECK_BOX2: '動物を選択',
            CHECK_BOX2_ITEM1: '犬',
            DATE_INPUT: '日付入力',
            DROPDOWN: 'ドロップダウン',
            EMAIL_INPUT: 'メール入力',
            FILE_ATTACHMENT: '添付ファイル',
            FILE_ATTACHMENT_BUTTON: '添付する',
            TABS_ON_TOP: '上部のタブ',
            NUMBER_INPUT: '数値入力',
            PANEL: 'パネル',
            RADIO_BUTTON: 'ラジオボタン',
            SUBMIT: '送信',
            TELEPHONE_INPUT: '電話入力',
            TEXT_INPUT: 'テキスト入力',
            TITLE: 'タイトル',
            WIZARD: '魔法使い'
        },
        I18N_STRINGS: {
            "FileCloseAccessText"   :       "ファイルを削除するには Enter を押します ",
            "FileSizeGreater"       :        "ファイル「${0}」は予期されたサイズを超えています :${1} MB。",
            "FileNameInvalid"       :       "${0} ファイルの名前に無効な文字が含まれています。サポートされるのは英数字のみになります",
            "FileMimeTypeInvalid"   :       "${0} ファイルの形式はサポートされていません",
            "InternalFormSubmissionError" :  "フォームを送信中に内部エラーが発生しました。"
        }
    }, {
        LANGUAGE: 'Italian', LOCALE: 'it', TRANSLATION: {
            ACCORDION: 'Fisarmonica',
            BUTTON: 'Bottone',
            CHECK_BOX1: 'Gruppo di caselle di controllo',
            CHECK_BOX1_ITEM1: 'Articolo 1',
            CHECK_BOX2: 'Seleziona animale',
            CHECK_BOX2_ITEM1: 'Cane',
            DATE_INPUT: 'Inserimento data',
            DROPDOWN: 'Menù a discesa',
            EMAIL_INPUT: 'Inserisci e-mail',
            FILE_ATTACHMENT: 'File allegato',
            FILE_ATTACHMENT_BUTTON: 'Allegare',
            TABS_ON_TOP: 'Schede in alto',
            NUMBER_INPUT: 'Numero di input',
            PANEL: 'Pannello',
            RADIO_BUTTON: 'Pulsante di opzione',
            SUBMIT: 'Invia',
            TELEPHONE_INPUT: 'Ingresso telefonico',
            TEXT_INPUT: 'Immissione di testo',
            TITLE: 'Titolo',
            WIZARD: 'mago'
        },
        I18N_STRINGS: {
            "FileCloseAccessText"   :       "Premete Invio per eliminare il file ",
            "FileSizeGreater"       :        "I file ${0} superano le dimensioni previste: ${1} MB.",
            "FileNameInvalid"       :       "I file ${0} contengono caratteri non validi nel nome. Sono supportati solo caratteri alfanumerici",
            "FileMimeTypeInvalid"   :       "I file ${0} non sono tipi di file supportati",
            "InternalFormSubmissionError" :  "Errore interno durante l'invio del modulo."
        }
    }, {
        LANGUAGE: 'French', LOCALE: 'fr', TRANSLATION: {
            ACCORDION: 'Accordéon',
            BUTTON: 'Bouton',
            CHECK_BOX1: 'Groupe de cases à cocher',
            CHECK_BOX1_ITEM1: 'Point 1 de l’ordre du jour',
            CHECK_BOX2: 'Sélectionner un animal',
            CHECK_BOX2_ITEM1: 'Chien',
            DATE_INPUT: 'Saisie de la date',
            DROPDOWN: 'Liste déroulante',
            EMAIL_INPUT: 'Saisie par e-mail',
            FILE_ATTACHMENT_BUTTON: 'Joindre',
            FILE_ATTACHMENT: 'Pièce jointe',
            TABS_ON_TOP: 'Onglets en haut',
            NUMBER_INPUT: 'Entrée numérique',
            PANEL: 'Panneau',
            RADIO_BUTTON: 'Bouton radio',
            SUBMIT: 'Envoyer',
            TELEPHONE_INPUT: 'Entrée téléphonique',
            TEXT_INPUT: 'Saisie de texte',
            TITLE: 'Titre',
            WIZARD: 'Sorcier'
        },
        I18N_STRINGS: {
            "FileCloseAccessText"   :       "Appuyer sur Entrée pour supprimer le fichier ",
            "FileSizeGreater"       :       "FLes fichiers ${0} font plus que la taille attendue : ${1} Mo.",
            "FileNameInvalid"       :       "Le nom du ou des fichiers ${0} comportent des caractères non valides. Seuls les caractères alphanumériques sont pris en charge",
            "FileMimeTypeInvalid"   :       "Le ou les fichiers ${0} sont des types de fichiers non pris en charge",
            "InternalFormSubmissionError" :  "Une erreur interne s'est produite lors de l'envoi du formulaire."
        }
    }, {
        LANGUAGE: 'Spanish', LOCALE: 'es', TRANSLATION: {
            ACCORDION: 'Acordeón',
            BUTTON: 'Botón',
            CHECK_BOX1: 'Grupo de casillas de verificación',
            CHECK_BOX1_ITEM1: 'Tema 1',
            CHECK_BOX2: 'Seleccionar animal',
            CHECK_BOX2_ITEM1: 'Perro',
            DATE_INPUT: 'Entrada de fecha',
            DROPDOWN: 'Menú desplegable',
            EMAIL_INPUT: 'Entrada de correo electrónico',
            FILE_ATTACHMENT: 'Archivo adjunto',
            FILE_ATTACHMENT_BUTTON: 'Adjuntar',
            TABS_ON_TOP: 'Pestañas en la parte superior',
            NUMBER_INPUT: 'Entrada de número',
            PANEL: 'Tablero',
            RADIO_BUTTON: 'Botón de opción',
            SUBMIT: 'Enviar',
            TELEPHONE_INPUT: 'Entrada telefónica',
            TEXT_INPUT: 'Entrada de texto',
            TITLE: 'Título',
            WIZARD: 'Hechicero'
        },
        I18N_STRINGS: {
            "FileCloseAccessText"   :       "Presione Intro para eliminar el archivo ",
            "FileSizeGreater"       :        "FLos archivos ${0} tienen un tamaño superior al esperado: ${1}MB.",
            "FileNameInvalid"       :       "El nombre de los archivos ${0} contiene caracteres no válidos. Solo se admiten caracteres alfanuméricos",
            "FileMimeTypeInvalid"   :       "Los tipos de archivo ${0} no son compatibles",
            "InternalFormSubmissionError" :  "Error interno al enviar el formulario."
        }
    }, {
        LANGUAGE: 'Korean', LOCALE: 'ko-kr', TRANSLATION: {
            ACCORDION: '아코디언',
            BUTTON: '단추',
            CHECK_BOX1: '확인란 그룹',
            CHECK_BOX1_ITEM1: '항목 1',
            CHECK_BOX2: '동물 선택',
            CHECK_BOX2_ITEM1: '개',
            DATE_INPUT: '날짜 입력',
            DROPDOWN: '드롭다운',
            EMAIL_INPUT: '이메일 입력',
            FILE_ATTACHMENT: '첨부파일',
            FILE_ATTACHMENT_BUTTON: '붙이다',
            TABS_ON_TOP: '상단의 탭',
            NUMBER_INPUT: '숫자 입력',
            PANEL: '패널',
            RADIO_BUTTON: '라디오 버튼',
            SUBMIT: '전송',
            TELEPHONE_INPUT: '전화 입력',
            TEXT_INPUT: '텍스트 입력',
            TITLE: '타이틀',
            WIZARD: '마법사'
        },
        I18N_STRINGS: {
            "FileCloseAccessText"   :       "Enter 키를 눌러 파일 삭제",
            "FileSizeGreater"       :        "파일 ${0}이(가) 예상 크기 ${1}MB를 초과합니다.",
            "FileNameInvalid"       :       "파일 ${0}의 이름에 잘못된 문자가 포함되어 있습니다. 영숫자만 지원됩니다.",
            "FileMimeTypeInvalid"   :       "파일 ${0}은(는) 지원되지 않는 파일 유형입니다.",
            "InternalFormSubmissionError" :  "양식을 제출하는 중 내부 오류가 발생했습니다."
        }
    }, {
        LANGUAGE: 'Chinese Traditional', LOCALE: 'zh-tw', TRANSLATION: {
            ACCORDION: '手風琴',
            BUTTON: '按鈕',
            CHECK_BOX1: '複選框組',
            CHECK_BOX1_ITEM1: '專案1',
            CHECK_BOX2: '選擇動物',
            CHECK_BOX2_ITEM1: '狗',
            DATE_INPUT: '日期輸入',
            DROPDOWN: '下拉清單',
            EMAIL_INPUT: '電子郵件輸入',
            FILE_ATTACHMENT: '檔附件',
            FILE_ATTACHMENT_BUTTON: '附加',
            TABS_ON_TOP: '頂部的選項卡',
            NUMBER_INPUT: '號碼輸入',
            PANEL: '面板',
            RADIO_BUTTON: '單選按鈕',
            SUBMIT: '提交',
            TELEPHONE_INPUT: '電話輸入',
            TEXT_INPUT: '文本輸入',
            TITLE: '標題',
            WIZARD: '巫師'
        },
        I18N_STRINGS: {
            "FileCloseAccessText"   :       "按 Enter 以刪除檔案",
            "FileSizeGreater"       :        "檔案 ${0} 的大小比預期大: ${1}MB。",
            "FileNameInvalid"       :       "${0} 檔案名稱中包含無效字元。僅支援字母數字字元",
            "FileMimeTypeInvalid"   :       "${0} 檔案的檔案類型不受支援",
            "InternalFormSubmissionError" :  "提交表單時發生內部錯誤。"
        }
    },
    {
        LANGUAGE: 'Chinese Simplified', LOCALE: 'zh-cn', TRANSLATION: {
            ACCORDION: '手风琴',
            BUTTON: '按钮',
            CHECK_BOX1: '复选框组',
            CHECK_BOX1_ITEM1: '项目1',
            CHECK_BOX2: '选择动物',
            CHECK_BOX2_ITEM1: '狗',
            DATE_INPUT: '日期输入',
            DROPDOWN: '下拉列表',
            EMAIL_INPUT: '电子邮件输入',
            FILE_ATTACHMENT: '文件附件',
            FILE_ATTACHMENT_BUTTON: '附加',
            TABS_ON_TOP: '顶部的选项卡',
            NUMBER_INPUT: '号码输入',
            PANEL: '面板',
            RADIO_BUTTON: '单选按钮',
            SUBMIT: '提交',
            TELEPHONE_INPUT: '电话输入',
            TEXT_INPUT: '文本输入',
            TITLE: '标题',
            WIZARD: '巫师'
        },
        I18N_STRINGS: {
            "FileCloseAccessText"   :       "按 Enter 可删除文件",
            "FileSizeGreater"       :        "文件 ${0} 大于预期大小: ${1}MB。",
            "FileNameInvalid"       :       "文件 ${0} 的名称中包含无效字符。仅支持字母数字字符",
            "FileMimeTypeInvalid"   :       "文件 ${0} 的类型不受支持",
            "InternalFormSubmissionError" :  "提交表单时遇到内部错误。"
        }
    }, {
        LANGUAGE: 'Portuguese', LOCALE: 'pt-br', TRANSLATION: {
            ACCORDION: 'Acordeão',
            BUTTON: 'Botão',
            CHECK_BOX1: 'Grupo de caixas de seleção',
            CHECK_BOX1_ITEM1: 'Ponto 1',
            CHECK_BOX2: 'Selecione Animal',
            CHECK_BOX2_ITEM1: 'Cão',
            DATE_INPUT: 'Entrada de data',
            DROPDOWN: 'Menu suspenso',
            EMAIL_INPUT: 'Entrada de e-mail',
            FILE_ATTACHMENT: 'Anexo de arquivo',
            FILE_ATTACHMENT_BUTTON: 'Anexar',
            TABS_ON_TOP: 'Guias na parte superior',
            NUMBER_INPUT: 'Número de Entrada',
            PANEL: 'Painel',
            RADIO_BUTTON: 'Botão de opção',
            SUBMIT: 'Enviar',
            TELEPHONE_INPUT: 'Entrada por telefone',
            TEXT_INPUT: 'Entrada de texto',
            TITLE: 'Título',
            WIZARD: 'mago'
        },
        I18N_STRINGS: {
            "FileCloseAccessText"   :       "Pressione Enter para excluir o arquivo ",
            "FileSizeGreater"       :        "Fos arquivos ${0} são maiores do que o tamanho esperado: ${1}MB.",
            "FileNameInvalid"       :       "O(s) arquivo(s) ${0} tem caracteres inválidos em seu nome. Somente caracteres alfanuméricos são suportados",
            "FileMimeTypeInvalid"   :       "O(s) arquivo(s) ${0} não é(são) suportado(s)",
            "InternalFormSubmissionError" :  "Encontrou um erro interno ao enviar o formulário."
        }
    },
    {
        LANGUAGE: 'Russian - Custom Locale added via overlay', LOCALE: 'ru-ru', TRANSLATION: {
            ACCORDION: 'Аккордеон',
            BUTTON: 'Пуговица',
            CHECK_BOX1: 'Группа флажков',
            CHECK_BOX1_ITEM1: 'Пункт 1',
            CHECK_BOX2: 'Выберите животное',
            CHECK_BOX2_ITEM1: 'Собака',
            DATE_INPUT: 'Ввод даты',
            DROPDOWN: 'Выпадающий список',
            EMAIL_INPUT: 'Ввод электронной почты',
            FILE_ATTACHMENT: 'Вложенный файл',
            FILE_ATTACHMENT_BUTTON: 'Прикреплять',
            TABS_ON_TOP: 'Вкладки сверху',
            NUMBER_INPUT: 'Ввод номера',
            PANEL: 'Панель',
            RADIO_BUTTON: 'Переключатель',
            SUBMIT: 'Отправить',
            TELEPHONE_INPUT: 'Телефонный вход',
            TEXT_INPUT: 'Ввод текста',
            TITLE: 'Титул',
            WIZARD: 'колдун'
        },
        I18N_STRINGS: {
            "FileCloseAccessText" : "Нажмите Enter, чтобы удалить файл",
            "FileSizeGreater" : "Файл(ы) ${0} больше ожидаемого размера: ${1}MB.",
            "FileNameInvalid" : "Не прикрепляйте файлы, у которых имя файла начинается с (.), содержит \\ / : * ? \" < > | ; % $ или является зарезервированным ключевым словом, таким как nul, prn, con, lpt или com.",
            "FileMimeTypeInvalid" : "Файл(ы) ${0} имеют неподдерживаемый тип файла",
            "InternalFormSubmissionError" : "При отправке формы произошла внутренняя ошибка."
        }
    },
    {
        LANGUAGE: 'Hindi - Custom Locale added via clientlib', LOCALE: 'hi', TRANSLATION: {
            ACCORDION: 'अकॉर्डियन',
            BUTTON: 'बटन',
            CHECK_BOX1: 'चेक बॉक्स समूह',
            CHECK_BOX1_ITEM1: 'आइटम 1',
            CHECK_BOX2: 'पशु का चयन करें',
            CHECK_BOX2_ITEM1: 'कुत्ता',
            DATE_INPUT: 'दिनांक इनपुट',
            DROPDOWN: 'ड्रॉपडाउन',
            EMAIL_INPUT: 'ईमेल इनपुट',
            FILE_ATTACHMENT: 'फ़ाइल अनुलग्नक',
            FILE_ATTACHMENT_BUTTON: 'चिपका',
            TABS_ON_TOP: 'शीर्ष पर टैब',
            NUMBER_INPUT: 'संख्या इनपुट',
            PANEL: 'पैनल',
            RADIO_BUTTON: 'रेडियो बटन',
            SUBMIT: 'जमा करें',
            TELEPHONE_INPUT: 'टेलीफ़ोन इनपुट',
            TEXT_INPUT: 'पाठ इनपुट',
            TITLE: 'उपाधि',
            WIZARD: 'जादूगर'
        },
        I18N_STRINGS: {
            "FileCloseAccessText" : "फ़ाइल को हटाने के लिए एंटर दबाएं",
            "FileSizeGreater" : "फ़ाइल(फ़ाइलें) ${0} अपेक्षित आकार से अधिक हैं: ${1}MB.",
            "FileNameInvalid" : "फ़ाइल नाम (.) से शुरू होता है, \\ / : * ? \" < > | ; % $ को मद्देनजर न लें, या nul, prn, con, lpt, या com जैसे आपत्तिजनक शब्द हैं।",
            "FileMimeTypeInvalid" : "फ़ाइल(फ़ाइलें) ${0} असमर्थित फ़ाइल प्रकार हैं",
            "InternalFormSubmissionError" : "फ़ॉर्म प्रस्तुत करते समय आंतरिक त्रुटि हुई है."
        }
    }
];

module.exports.languages = languages;
module.exports.selectors = selectors;