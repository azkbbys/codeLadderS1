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
 * 获取在场所有箱子数量
 * 
 * @returns 箱子数量
 */
function getboxnumber(){
    return world.querySelectorAll('#标准箱').length
}

world.onPlayerJoin(({entity})=>{
    entity.shouji=0
    entity.player.enableJump = false;
    entity.player.walkSpeed = walkSpeed;
    entity.player.runSpeed = runSpeed;
    entity.player.walkAcceleration = acceleration;
    entity.player.runAcceleration = acceleration;
})

// 开启OBB碰撞
world.useOBB = true;

// 生成标准箱
world.onTick(({tick})=>{
    if(tick % (16*3)===0){
        if(getboxnumber()<10){
            // if(randint(1,2)===1){
                world.createEntity({
                    mesh:'mesh/红色标准箱.vb',
                    position:new GameVector3(randint(1,63), 10, randint(1,63)),
                    meshScale:new GameVector3(0.05, 0.05, 0.05),
                    collides:true, // 是否可碰撞
                    fixed:false, // 是否固定
                    gravity:true, // 是否受重力
                    id:'标准箱',
                })
            // }
            // else{
                // world.createEntity({
                //     mesh:'mesh/绿色标准箱.vb',
                //     position:new GameVector3(randint(1,63), 10, randint(1,63)),
                //     meshScale:new GameVector3(0.05, 0.05, 0.05),
                //     collides:true, // 是否可碰撞
                //     fixed:false, // 是否固定
                //     gravity:true, // 是否受重力
                //     id:'box_green',
                // })
            // }
        }
    }
})

// 收集箱子
world.onEntityContact(({entity, other})=>{
    if(!entity.player)return
    let e = entity as GamePlayerEntity
    if(other.id==='标准箱'){
        e.shouji+=1
        e.player.directMessage('收集了1个标准箱')
        remoteChannel.sendClientEvent(e, {type:'shouji', data:e.shouji})
        other.destroy()
    }
})