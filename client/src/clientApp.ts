import i18n from "@root/i18n";

const UiRoot = UiScreen.getAllScreen()[0]
const collectedText = UiText.create();
collectedText.name = 'collectedText';
collectedText.textContent = '已收集数量：0';
collectedText.textFontSize = 24;
collectedText.textColor.r = 255;
collectedText.textColor.g = 255;
collectedText.textColor.b = 255;
collectedText.position.offset.x = 0;
collectedText.position.offset.y = 0;
collectedText.autoResize = 'XY';
collectedText.parent = UiRoot;

remoteChannel.onClientEvent((args) =>{
    if(args.type==='shouji'){
        collectedText.textContent = '已收集数量：'+args.data
    }
})