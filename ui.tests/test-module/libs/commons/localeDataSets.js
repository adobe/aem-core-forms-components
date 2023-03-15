const selectors = {
    ACCORDION: '.cmp-accordion > label',
    BUTTON: '.button.base:not(.submit):not(.reset) span',
    CHECK_BOX: '.cmp-adaptiveform-checkboxgroup > label',
    CHECK_BOX_ITEM1: '.cmp-adaptiveform-checkboxgroup > div > div > label > span',
    DATE_INPUT: '.cmp-adaptiveform-datepicker label',
    DROPDOWN: '.cmp-adaptiveform-dropdown label',
    EMAIL_INPUT: '.cmp-adaptiveform-emailinput__label',
    FILE_ATTACHMENT: '.cmp-adaptiveform-fileinput__label',
    TABS_ON_TOP: '.cmp-tabs label',
    NUMBER_INPUT: '.cmp-adaptiveform-numberinput__label',
    PANEL: '.cmp-container__label',
    RADIO_BUTTON: '.cmp-adaptiveform-radiobutton__label',
    SUBMIT: '.submit span',
    TELEPHONE_INPUT: 'div[class="cmp-adaptiveform-telephoneinput"] label',
    TEXT_INPUT: '.cmp-adaptiveform-textinput__label',
    TITLE: '.cmp-title__text',
    WIZARD: '.cmp-adaptiveform-wizard__label'
}

const languages = [
    {
        LANGUAGE: 'English', LOCALE: 'en', TRANSLATION: {
            ACCORDION: 'Accordion',
            BUTTON: 'Button',
            CHECK_BOX: 'Check Box Group',
            CHECK_BOX_ITEM1: 'Item 1',
            DATE_INPUT: 'Date Input',
            DROPDOWN: 'Dropdown',
            EMAIL_INPUT: 'Email Input',
            FILE_ATTACHMENT: 'File Attachment',
            TABS_ON_TOP: 'Tabs on top',
            NUMBER_INPUT: 'Number Input',
            PANEL: 'Panel',
            RADIO_BUTTON: 'Radio Button',
            SUBMIT: 'Submit',
            TELEPHONE_INPUT: 'Telephone Input',
            TEXT_INPUT: 'Text Input',
            TITLE: 'Title',
            WIZARD: 'wizard'
        }
    }, {
        LANGUAGE: 'German', LOCALE: 'de', TRANSLATION: {
            ACCORDION: 'Akkordeon',
            BUTTON: 'Knopf',
            CHECK_BOX: 'Kontrollkästchengruppe',
            CHECK_BOX_ITEM1: 'Punkt 1',
            DATE_INPUT: 'Datumseingabe',
            DROPDOWN: 'Dropdown-Menü',
            EMAIL_INPUT: 'E-Mail-Eingabe',
            FILE_ATTACHMENT: 'Dateianhang',
            TABS_ON_TOP: 'Registerkarten oben',
            NUMBER_INPUT: 'Nummerneingabe',
            PANEL: 'Gremium',
            RADIO_BUTTON: 'Optionsfeld',
            SUBMIT: 'Senden',
            TELEPHONE_INPUT: 'Telefoneingang',
            TEXT_INPUT: 'Texteingabe',
            TITLE: 'Titel',
            WIZARD: 'Zauberer'
        }
    }, {
        LANGUAGE: 'Japanese', LOCALE: 'ja', TRANSLATION: {
            ACCORDION: 'アコーディオン',
            BUTTON: 'ボタン',
            CHECK_BOX: 'チェック ボックス グループ',
            CHECK_BOX_ITEM1: 'アイテム1',
            DATE_INPUT: '日付入力',
            DROPDOWN: 'ドロップダウン',
            EMAIL_INPUT: 'メール入力',
            FILE_ATTACHMENT: '添付ファイル',
            TABS_ON_TOP: '上部のタブ',
            NUMBER_INPUT: '数値入力',
            PANEL: 'パネル',
            RADIO_BUTTON: 'ラジオボタン',
            SUBMIT: '送信',
            TELEPHONE_INPUT: '電話入力',
            TEXT_INPUT: 'テキスト入力',
            TITLE: 'タイトル',
            WIZARD: '魔法使い'
        }
    }, {
        LANGUAGE: 'Italian', LOCALE: 'it', TRANSLATION: {
            ACCORDION: 'Fisarmonica',
            BUTTON: 'Bottone',
            CHECK_BOX: 'Gruppo di caselle di controllo',
            CHECK_BOX_ITEM1: 'Articolo 1',
            DATE_INPUT: 'Inserimento data',
            DROPDOWN: 'Menù a discesa',
            EMAIL_INPUT: 'Inserisci e-mail',
            FILE_ATTACHMENT: 'File allegato',
            TABS_ON_TOP: 'Schede in alto',
            NUMBER_INPUT: 'Numero di input',
            PANEL: 'Pannello',
            RADIO_BUTTON: 'Pulsante di opzione',
            SUBMIT: 'Invia',
            TELEPHONE_INPUT: 'Ingresso telefonico',
            TEXT_INPUT: 'Immissione di testo',
            TITLE: 'Titolo',
            WIZARD: 'mago'
        }
    }, {
        LANGUAGE: 'French', LOCALE: 'fr', TRANSLATION: {
            ACCORDION: 'Accordéon',
            BUTTON: 'Bouton',
            CHECK_BOX: 'Groupe de cases à cocher',
            CHECK_BOX_ITEM1: 'Point 1 de l’ordre du jour',
            DATE_INPUT: 'Saisie de la date',
            DROPDOWN: 'Liste déroulante',
            EMAIL_INPUT: 'Saisie par e-mail',
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
        }
    }, {
        LANGUAGE: 'Spanish', LOCALE: 'es', TRANSLATION: {
            ACCORDION: 'Acordeón',
            BUTTON: 'Botón',
            CHECK_BOX: 'Grupo de casillas de verificación',
            CHECK_BOX_ITEM1: 'Tema 1',
            DATE_INPUT: 'Entrada de fecha',
            DROPDOWN: 'Menú desplegable',
            EMAIL_INPUT: 'Entrada de correo electrónico',
            FILE_ATTACHMENT: 'Archivo adjunto',
            TABS_ON_TOP: 'Pestañas en la parte superior',
            NUMBER_INPUT: 'Entrada de número',
            PANEL: 'Tablero',
            RADIO_BUTTON: 'Botón de opción',
            SUBMIT: 'Enviar',
            TELEPHONE_INPUT: 'Entrada telefónica',
            TEXT_INPUT: 'Entrada de texto',
            TITLE: 'Título',
            WIZARD: 'Hechicero'
        }
    }, {
        LANGUAGE: 'Korean', LOCALE: 'ko-kr', TRANSLATION: {
            ACCORDION: '아코디언',
            BUTTON: '단추',
            CHECK_BOX: '확인란 그룹',
            CHECK_BOX_ITEM1: '항목 1',
            DATE_INPUT: '날짜 입력',
            DROPDOWN: '드롭다운',
            EMAIL_INPUT: '이메일 입력',
            FILE_ATTACHMENT: '첨부파일',
            TABS_ON_TOP: '상단의 탭',
            NUMBER_INPUT: '숫자 입력',
            PANEL: '패널',
            RADIO_BUTTON: '라디오 버튼',
            SUBMIT: '전송',
            TELEPHONE_INPUT: '전화 입력',
            TEXT_INPUT: '텍스트 입력',
            TITLE: '타이틀',
            WIZARD: '마법사'
        }
    }, {
        LANGUAGE: 'Chinese Traditional', LOCALE: 'zh-tw', TRANSLATION: {
            ACCORDION: '手風琴',
            BUTTON: '按鈕',
            CHECK_BOX: '複選框組',
            CHECK_BOX_ITEM1: '專案1',
            DATE_INPUT: '日期輸入',
            DROPDOWN: '下拉清單',
            EMAIL_INPUT: '電子郵件輸入',
            FILE_ATTACHMENT: '檔附件',
            TABS_ON_TOP: '頂部的選項卡',
            NUMBER_INPUT: '號碼輸入',
            PANEL: '面板',
            RADIO_BUTTON: '單選按鈕',
            SUBMIT: '提交',
            TELEPHONE_INPUT: '電話輸入',
            TEXT_INPUT: '文本輸入',
            TITLE: '標題',
            WIZARD: '巫師'
        }
    },
    {
        LANGUAGE: 'Chinese Simplified', LOCALE: 'zh-cn', TRANSLATION: {
            ACCORDION: '手风琴',
            BUTTON: '按钮',
            CHECK_BOX: '复选框组',
            CHECK_BOX_ITEM1: '项目1',
            DATE_INPUT: '日期输入',
            DROPDOWN: '下拉列表',
            EMAIL_INPUT: '电子邮件输入',
            FILE_ATTACHMENT: '文件附件',
            TABS_ON_TOP: '顶部的选项卡',
            NUMBER_INPUT: '号码输入',
            PANEL: '面板',
            RADIO_BUTTON: '单选按钮',
            SUBMIT: '提交',
            TELEPHONE_INPUT: '电话输入',
            TEXT_INPUT: '文本输入',
            TITLE: '标题',
            WIZARD: '巫师'
        }
    }, {
        LANGUAGE: 'Portuguese', LOCALE: 'pt-br', TRANSLATION: {
            ACCORDION: 'Acordeão',
            BUTTON: 'Botão',
            CHECK_BOX: 'Grupo de caixas de seleção',
            CHECK_BOX_ITEM1: 'Ponto 1',
            DATE_INPUT: 'Entrada de data',
            DROPDOWN: 'Menu suspenso',
            EMAIL_INPUT: 'Entrada de e-mail',
            FILE_ATTACHMENT: 'Anexo de arquivo',
            TABS_ON_TOP: 'Guias na parte superior',
            NUMBER_INPUT: 'Número de Entrada',
            PANEL: 'Painel',
            RADIO_BUTTON: 'Botão de opção',
            SUBMIT: 'Enviar',
            TELEPHONE_INPUT: 'Entrada por telefone',
            TEXT_INPUT: 'Entrada de texto',
            TITLE: 'Título',
            WIZARD: 'mago'
        }
    }
];

module.exports.languages = languages;
module.exports.selectors = selectors;