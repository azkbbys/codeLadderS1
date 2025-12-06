import i18n from "@root/i18n";
console.clear()
var walkSpeed = 0.5;
var runSpeed = 0.5;
var acceleration = 0.5;

world.onPlayerJoin(({entity})=>{
    entity.player.enableJump = false;
    entity.player.walkSpeed = walkSpeed;
    entity.player.runSpeed = runSpeed;
    entity.player.walkAcceleration = acceleration;
    entity.player.runAcceleration = acceleration;
})