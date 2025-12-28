function getAllBoxesOnConveyor(){ 
    return world.querySelectorAll('.conveyor')
}

world.onPlayerJoin(({entity})=>{
    entity.player.onKeyDown(async(event)=>{
        if(event.keyCode===69){ // 按下E键
            var minDistance = Infinity;
            var nearestBox:GameEntity|null = null;
            getAllBoxesOnConveyor().forEach((box)=>{
                if(entity.position.distance(box.position)<minDistance){
                    minDistance = entity.position.distance(box.position);
                    nearestBox = box;
                }
            })
            if(!nearestBox){
                entity.player.directMessage('传送带上没有箱子！');
            }
            else{
                let box = nearestBox as GameEntity;
                while(entity.taking==0){
                    let a = box.position.z - entity.position.z;
                    let b = box.position.x - entity.position.x;
                    let c = Math.sqrt(a*a + b*b);
                    let sin = a/c;
                    let cos = b/c;
                    let tan = a/b;
                    console.log(entity.position.distance(box.position))
                    if(entity.position.distance(box.position)<3)return;
                    if(voxels.getVoxelId(entity.position.x+1, entity.position.y, entity.position.z)+voxels.getVoxelId(entity.position.x-1, entity.position.y, entity.position.z)+voxels.getVoxelId(entity.position.x, entity.position.y, entity.position.z+1)+voxels.getVoxelId(entity.position.x, entity.position.y, entity.position.z-1)!=0){
                        // 被挡住了，先朝地图中间走
                        entity.velocity.x = entity.position.x>30?-1:1;
                        entity.velocity.z = entity.position.z>30?-1:1;
                    }
                    await sleep(1)
                    entity.velocity.x = 2*cos;
                    entity.velocity.z = 2*sin;
                }
            }
        }
    })
});