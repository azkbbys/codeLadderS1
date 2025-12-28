import i18n from "@root/i18n";

const UiRoot = UiScreen.getAllScreen()[0]
const collectedText = UiText.create();
collectedText.name = 'collectedText';
collectedText.textContent = '总分：0';
collectedText.textFontSize = 24;
collectedText.textColor.r = 255;
collectedText.textColor.g = 255;
collectedText.textColor.b = 255;
collectedText.position.offset.x = 0;
collectedText.position.offset.y = 0;
collectedText.autoResize = 'XY';
collectedText.parent = UiRoot;
const errorText = UiText.create();
errorText.name = 'errorText';
errorText.textContent = '类型错误';
errorText.textFontSize = 100;
errorText.textColor.r = 255;
errorText.textColor.g = 0;
errorText.textColor.b = 0;
errorText.position.offset.x = screenWidth/2;
errorText.position.offset.y = screenHeight/2;
errorText.autoResize = 'XY';
errorText.parent = UiRoot;
errorText.textXAlignment = 'Center';
errorText.textYAlignment = 'Center';
errorText.anchor.x = 0.5
errorText.anchor.y = 0.5
errorText.visible = false

async function show_error() {
    errorText.visible = true;
    await sleep(3000);
    errorText.visible = false;
}

remoteChannel.onClientEvent((args) =>{
    if(args.type==='shouji'){
        collectedText.textContent = '总分：'+args.data;
    }
    if(args.type==='error'){
        errorText.position.offset.x = screenWidth/2;
        show_error();
    }
})