import i18n from "@root/i18n";
import find from "../UiIndex";

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
const centerText = UiText.create();
centerText.name = 'centerText';
centerText.textContent = '类型错误';
centerText.textFontSize = 100;
centerText.textColor.r = 255;
centerText.textColor.g = 0;
centerText.textColor.b = 0;
centerText.position.offset.x = screenWidth/2;
centerText.position.offset.y = screenHeight/2;
centerText.autoResize = 'XY';
centerText.parent = UiRoot;
centerText.textXAlignment = 'Center';
centerText.textYAlignment = 'Center';
centerText.anchor.x = 0.5
centerText.anchor.y = 0.5
centerText.visible = false
const currentTask = find('screen')?.uiText_currentTask as UiText;
const jindu = find('screen')?.uiText_jindu as UiText;
const time = find('screen')?.uiText_time as UiText;
const average = find('screen')?.uiText_average as UiText;
const totaltime = find('screen')?.uiText_totaltime as UiText;
const chain = find('screen')?.uiText_chain as UiText;
async function show_error() {
    centerText.textContent = '类型错误';
    centerText.visible = true;
    await sleep(3000);
    centerText.visible = false;
}
async function show_taskstatus(text: string) {
    centerText.textContent = text;
    centerText.visible = true;
    await sleep(3000);
    centerText.visible = false;
}

remoteChannel.onClientEvent((args) =>{
    if(args.type==='score'){
        collectedText.textContent = '总分：'+args.data;
    }
    else if(args.type==='error'){
        centerText.textColor.r = 255;
        centerText.textColor.g = 0;
        centerText.position.offset.x = screenWidth/2;
        show_error();
    }
    else if(args.type==='task'){
        centerText.textColor.r = args.data==='任务完成！' ? 0 : 255;
        centerText.textColor.g = args.data==='任务完成！' ? 255 : 0;
        show_taskstatus(args.data);
    }
    else if(args.type==='taskinfo'){
        currentTask.textContent = `当前任务：${args.data.describe}`;
        jindu.textContent = `进度：${args.data.jindu}`;
        time.textContent = `剩余时间：${args.data.time}`;
    }
    else if(args.type==='efficiency'){
        totaltime.textContent = `总操作时间：${args.data.totalTime}`;
        average.textContent = `平均每分钟收集：${args.data.average}`;
        chain.textContent = `连续完成数：${args.data.chain}`;
    }
})