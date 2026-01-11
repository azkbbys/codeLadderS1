import i18n from "@root/i18n";
console.clear()
var walkSpeed = 0.5;
var runSpeed = 0.5;
var acceleration = 0.5;

require('./navigate.ts')

// 函数
/**
 * 获取随机整数
 * 
 * @param min 
 * @param max 
 * @returns 
 */
function randint(min:number, max:number){
    return Math.floor(Math.random() * (max - min + 1) + min);
}
/**
 * 从数组中随机选择一个元素
 * 
 * @param arr 
 * @returns 
 */
function choice<T>(arr:T[]):T{
    return arr[Math.floor(Math.random() * arr.length)];
}
/**
 * 穿戴配件
 * 
 * @param entity 
 * @param data 
 */
function addWearable(entity:GamePlayerEntity, data:any) {
    // 这一步是把角度转成弧度
    const orientation = new GameQuaternion(0, 0, 0, 1)
            .rotateZ(data.rotate[2] * Math.PI / 180) 
            .rotateX(data.rotate[0] * Math.PI / 180) 
            .rotateY(data.rotate[1] * Math.PI / 180) 
    // 将上面声明的配置一一对应地传递给传递API
    entity.player.addWearable({
        bodyPart: data.bodyPart,
        mesh: data.mesh,
        orientation: orientation,
        scale: data.scale,
        offset: data.offset,
    })
}
/**
 * 获取在场所有箱子数量
 * 
 * @returns 箱子数量
 */
function getboxnumber(){
    let box_on_player_head = 0; // 玩家拿着的箱子也要算在全场景箱子内
    world.querySelectorAll('player').forEach((e)=>{
        if(e.taking!==0){
            box_on_player_head+=1;
        }
    })
    return world.querySelectorAll('#标准箱红').length+world.querySelectorAll('#标准箱绿').length+box_on_player_head;
}
/**
 * 生成箱子
 */
function generate_box(){
    if(getboxnumber()<10){
        let rand = randint(1,4);
        if(rand===1){
            world.createEntity({
                mesh:'mesh/红色标准箱.vb',
                position:new GameVector3(randint(7,60), 13, randint(3,54)),
                meshScale:new GameVector3(0.05, 0.05, 0.05),
                collides:true, // 是否可碰撞
                fixed:false, // 是否固定
                gravity:true, // 是否受重力
                id:'标准箱红',
                meshOrientation:new GameQuaternion(randint(0,100)/100, randint(0,100)/100, randint(0,100)/100, 1),
                friction:0.8,
            })
        }
        else if(rand===2){
            world.createEntity({
                mesh:'mesh/绿色标准箱.vb',
                position:new GameVector3(randint(7,60), 13, randint(3,54)),
                meshScale:new GameVector3(0.05, 0.05, 0.05),
                collides:true, // 是否可碰撞
                fixed:false, // 是否固定
                gravity:true, // 是否受重力
                id:'标准箱绿',
                meshOrientation:new GameQuaternion(randint(0,100)/100, randint(0,100)/100, randint(0,100)/100, 1),
                friction:0.8,
            })
        }
        else if(rand===3){
            world.createEntity({
                mesh:'mesh/红色标准箱.vb',
                position:new GameVector3(48, 10, 59),
                meshScale:new GameVector3(0.05, 0.05, 0.05),
                collides:true, // 是否可碰撞
                fixed:false, // 是否固定
                gravity:true, // 是否受重力
                id:'标准箱红',
                meshOrientation:new GameQuaternion(randint(0,100)/100, randint(0,100)/100, randint(0,100)/100, 1),
                friction:0.8,
                tags:['conveyor'],
            })
        }
        else if(rand===4){
            world.createEntity({
                mesh:'mesh/绿色标准箱.vb',
                position:new GameVector3(48, 10, 59),
                meshScale:new GameVector3(0.05, 0.05, 0.05),
                collides:true, // 是否可碰撞
                fixed:false, // 是否固定
                gravity:true, // 是否受重力
                id:'标准箱绿',
                meshOrientation:new GameQuaternion(randint(0,100)/100, randint(0,100)/100, randint(0,100)/100, 1),
                friction:0.8,
                tags:['conveyor'],
            })
        }
    }
}
// 任务类
/*
c.随机任务类型包括： 
i.“收集 [3-5] 个 A类 货物”
ii.“收集 [2-4] 个 B类 货物”
iii.“在 [30] 秒内收集 [5] 个任意货物”
*/
class Task{
    describe: string;// 任务描述
    timelimit: boolean;// 是否有时限
    type: 'A' | 'B' | 'T';// 任务类别
    required_box: number;// 需要收集箱子数量
    current_box: number;// 当前收集箱子数量
    interval: any;// 定时器ID
    chain: number;// 连续完成任务个数
    time: number;// 限时任务的时间
    constructor(){
        this.describe = '';
        this.timelimit = false;
        this.type = 'A';
        this.time = 0;
        this.current_box = 0;
        this.required_box = 0;
        this.interval = '';
        this.chain = 0; 
        this.refreshTask();
    }
    refreshTask(){
        // 初始化变量
        this.current_box = 0;
        // 随机任务类型，1为A类，2为B类，3为限时
        let type = randint(1,3);
        if(type===1){ 
            this.type = 'A';
            this.required_box = randint(3,5);
            this.describe = `收集${this.required_box}个A类货物`;
        }
        else if(type===2){ 
            this.type = 'B';
            this.required_box = randint(2,4);
            this.describe = `收集${this.required_box}个B类货物`;
        }
        else if(type===3){ 
            this.type = 'T';
            this.time=30;
            this.required_box = 5;
            this.describe = '在 30 秒内收集 5 个任意货物';
            this.startTiming();
        }
    }
    startTiming(){
        // 开始计时
        this.interval = setInterval(()=>{
            this.time--;
        },1000);
    }
    checkTask(){
        if(this.type==='T'&&this.time<=0){// 时间到，任务失败
            clearInterval(this.interval);
            return '时间到';
        }
        else if(this.current_box>=this.required_box){// 完成任务
            clearInterval(this.interval);
            return '完成任务';
        }
        else{
            return '进行中';
        }
    }
    getbox(){
        this.current_box++;
    }
    toString(){
        return `任务类型: ${this.type==='A'?'收集绿色箱子':this.type==='B'?'收集红色箱子':'限时收集箱子'} \n任务描述: ${this.describe} \n任务进度: ${this.current_box}/${this.required_box} \n任务状态: ${this.checkTask()}${this.type==='T'?'\n剩余时间: '+this.time+' 秒':''}`;
    }
}
world.onPlayerJoin(({entity})=>{
    entity.task = new Task();
    // console.log(entity.task)
    entity.totalTime = 0; // 从加入以来到现在的时间
    entity.taking = 0; // 拿着的箱子，0没有，1红色，2绿色
    entity.shouji = 0; // 收集的箱子数量
    entity.score = 0; // 分数
    entity.player.enableJump = false;
    entity.player.walkSpeed = walkSpeed;
    entity.player.runSpeed = runSpeed;
    entity.player.walkAcceleration = acceleration;
    entity.player.runAcceleration = acceleration;
    entity.player.onKeyDown((event)=>{
        if(event.keyCode===32){ // 按下空格键
            let underfoot = voxels.getVoxelId(entity.position.x, entity.position.y-2, entity.position.z)
            if((underfoot!==287 && underfoot!==281)||entity.taking===0)return;//不在区域内跳出
            entity.player.removeWearable(entity.player.wearables(GameBodyPart.HEAD)[0])
            let area = underfoot===287?2:1;
            if(area%2===entity.taking%2){
                if(entity.taking%2===0&&(entity.task.type==='T'||entity.task.type==='A')){
                    entity.task.getbox()
                }
                else if(entity.taking%2===1&&(entity.task.type==='T'||entity.task.type==='B')){
                    entity.task.getbox()
                }
                entity.player.directMessage('收集了1个箱子');
                entity.shouji+=1;
                entity.score+=entity.taking>2?2:1;
                remoteChannel.sendClientEvent(entity, {type:'score', data:entity.score});
            }
            else{
                entity.player.directMessage(`类型错误，${entity.taking%2===1?'红色':'绿色'}箱子不应放在${area===1?'红':'绿'}区域`);
                remoteChannel.sendClientEvent(entity, {type:'error'});
                generate_box();
            }
            entity.taking = 0; // 放下箱子
        }
    })
})

// 开启OBB碰撞
world.useOBB = true;

// 生成标准箱
world.onTick(({tick})=>{
    if(tick % (16*3)===0){
        world.querySelectorAll('*').forEach((e)=>{
            if(e.player)return;
            if(e.position.y<=5||e.position.y>=10.5){ // 删除掉落虚空和卡在墙上的箱子
                e.destroy();
            }
        })
        generate_box()
    }
    else if(tick % (16*1)===0){ 
        world.querySelectorAll('player').forEach((e)=>{
            e.totalTime++;
        })
    }
    else if(tick % (16*0.5)===0){ 
        world.querySelectorAll('player').forEach((e)=>{
            // console.clear();
            // console.log(e.task);
            let status = e.task.checkTask();
            remoteChannel.sendClientEvent(e, {type:'taskinfo', data:{
                describe: e.task.describe,
                jindu: `${e.task.current_box}/${e.task.required_box}`,
                time: e.task.type==='T'?String(e.task.time):'无限制',
            }});
            remoteChannel.sendClientEvent(e, {type:'efficiency', data:{
                totalTime: e.totalTime,
                average: Math.floor(e.shouji/(e.totalTime/60)),
                chain: e.task.chain,
            }});
            if(status!=='进行中'){
                if(status==='时间到'){ 
                    remoteChannel.sendClientEvent(e, {type:'task', data:'时间到！'});
                    e.task.chain=0;
                }
                else if(status==='完成任务'){
                    remoteChannel.sendClientEvent(e, {type:'task', data:'任务完成！'});
                    e.player.directMessage('你已完成任务，获得100分，新的任务已生成！');
                    e.score += 100;
                    e.task.chain++;
                }
                e.task.refreshTask();
            }
        })
    }
})
const destroyArea = world.addZone({
    selector: "*",
    bounds: new GameBounds3(
        new GameVector3(0, 8, 13),
        new GameVector3(5, 13, 14)
    ),
});
destroyArea.onEnter(({entity})=>{// 销毁末端箱子
    if(entity.player)return;
    entity.destroy();
})
const red_onhead = [
    { bodyPart: GameBodyPart.HEAD, name: '标准箱红', mesh: 'mesh/红色标准箱.vb', offset: [1, 0, 0], rotate: [0, 0, 0], scale: [0.3, 0.3, 0.3] },
]
const green_onhead = [
    { bodyPart: GameBodyPart.HEAD, name: '标准箱绿', mesh: 'mesh/绿色标准箱.vb', offset: [1, 0, 0], rotate: [0, 0, 0], scale: [0.3, 0.3, 0.3] },
]
// 收集箱子
world.onEntityContact(({entity, other})=>{
    if(!entity.player)return
    let e = entity as GamePlayerEntity
    if(e.taking!==0){ // 已经拿着箱子了
        e.player.directMessage('你已经拿着一个箱子了，不要贪心哦~');
        return;
    };
    if(other.id==='标准箱红'){
        for (const data of red_onhead) {
            addWearable(e, data)
        }
        if(other.tags().includes('conveyor')){
            e.taking = 3;
            entity.player.directMessage(`你捡起了一个传送带上的红色箱子`)
        }
        else{
            e.taking = 1;
            entity.player.directMessage(`你捡起了一个红色箱子`)
        }
        other.destroy();
    }
    else if(other.id==='标准箱绿'){
        for (const data of green_onhead) {
            addWearable(e, data)
        }
        if(other.tags().includes('conveyor')){
            e.taking = 4;
            entity.player.directMessage(`你捡起了一个传送带上的绿色箱子`)
        }
        else{
            e.taking = 2;
            entity.player.directMessage(`你捡起了一个绿色箱子`)
        }
        other.destroy();
    }
})