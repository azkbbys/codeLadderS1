import i18n from "@root/i18n";
console.clear()
var walkSpeed = 0.5;
var runSpeed = 0.5;
var acceleration = 0.5;

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
        if(randint(1,2)===1){
            world.createEntity({
                mesh:'mesh/红色标准箱.vb',
                position:new GameVector3(randint(3,60), 13, randint(3,60)),
                meshScale:new GameVector3(0.05, 0.05, 0.05),
                collides:true, // 是否可碰撞
                fixed:false, // 是否固定
                gravity:true, // 是否受重力
                id:'标准箱红',
                meshOrientation:new GameQuaternion(randint(0,100)/100, randint(0,100)/100, randint(0,100)/100, 1),
                friction:0.8,
            })
        }
        else{
            world.createEntity({
                mesh:'mesh/绿色标准箱.vb',
                position:new GameVector3(randint(3,60), 13, randint(3,60)),
                meshScale:new GameVector3(0.05, 0.05, 0.05),
                collides:true, // 是否可碰撞
                fixed:false, // 是否固定
                gravity:true, // 是否受重力
                id:'标准箱绿',
                meshOrientation:new GameQuaternion(randint(0,100)/100, randint(0,100)/100, randint(0,100)/100, 1),
                friction:0.8,
            })
        }
    }
}

world.onPlayerJoin(({entity})=>{
    entity.taking = 0; // 拿着的箱子，0没有，1红色，2绿色
    entity.shouji = 0; // 收集的箱子数量
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
            if(area===entity.taking){
                entity.player.directMessage('收集了1个箱子');
                entity.shouji+=1;
                remoteChannel.sendClientEvent(entity, {type:'shouji', data:entity.shouji});
            }
            else{
                entity.player.directMessage(`类型错误，${entity.taking===1?'红色':'绿色'}箱子不应放在${area===1?'红':'绿'}区域`);
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
        e.taking = 1;
        other.destroy();
    }
    else if(other.id==='标准箱绿'){
        for (const data of green_onhead) {
            addWearable(e, data)
        }
        e.taking = 2;
        other.destroy();
    }
})