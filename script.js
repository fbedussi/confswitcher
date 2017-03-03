var originaleConfEl = document.querySelector('#originalConf');
var convertedConfEl = document.querySelector('#convertedConf');
var convertBtn = document.querySelector('#convertBtn');
var resetBtn = document.querySelector('#resetBtn');
var copyBtn = document.querySelector('#copyBtn');

var tabValue = ' ';

convertBtn.addEventListener('click', () => {
    var originalConf;

    try {
        originalConf = JSON.parse(originaleConfEl.value);
    } catch(e) {
        convertedConfEl.value = 'JSON not valid';
        return;
    }

    var convertedConf = Object.assign({}, originalConf);

    convertedConf.Settings = originalConf.Settings.map(setting => {
        if (!setting.FieldConfiguration) {
            return setting;
        }
        
        var newLabel = setting.FieldConfiguration.LabelKey === 'EmptyString'? 
            setting.FieldConfiguration.PlaceholderKey.replace('Placeholder', 'Field') 
            : setting.FieldConfiguration.LabelKey;
        
        var newPlaceholder = 'EmptyString';

        var newFieldConfiguration = Object.assign(
            {}, 
            setting.FieldConfiguration, 
            {
                LabelKey: newLabel,
                PlaceholderKey: newPlaceholder
            }
        );

        return Object.assign(
            {},
            setting,
            {
                FieldConfiguration: newFieldConfiguration
            }

        ); 
    })

    convertedConfEl.value = JSON.stringify(convertedConf,null,'\t')
        .replace(/\t/g, tabValue)
    ;
});

resetBtn.addEventListener('click', () => {
    originaleConfEl.value = convertedConfEl.value = null;
})

new Clipboard('#copyBtn');

window.addEventListener('keyup', (e) => {
    e.preventDefault();

    if (!(e.ctrlKey && e.shiftKey)) {
        return;
    }
    var btn;
    switch (e.key.toLowerCase()) {
        case 'f':
            btn = convertBtn;
            break;
        case 'x':
            btn = resetBtn;
            break;
        case 'h':
            btn = copyBtn;
            break;
    }

    if (btn) {
        btn.dispatchEvent(new Event('click'));
    }
})