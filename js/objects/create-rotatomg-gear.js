export default

function createRotatingGear1(scene, x, y) {

    var GearShape = scene.cache.json.get('GearShape');

    //const platform = scene.add.tileSprite(x, y, 384, 384, 'Gear');
    const platform = scene.add.tileSprite(x, y, 384, 384, 'Gear');
    scene.matter.add.gameObject(platform, {
        restitution: 0, // No bounciness
        frictionAir: 0, // Spin forever without slowing down from air resistance
        friction: 0.2, // A little extra friction so the player sticks better
        // Density sets the mass and inertia based on area - 0.001 is the default. We're going lower
        // here so that the platform tips/rotates easily
        density: 0.0008,
    });

    // Alias the native Matter.js API
    const { Constraint } = Phaser.Physics.Matter.Matter;

    // Create a point constraint that pins the center of the platform to a fixed point in space, so
    // it can't move
    const constraint = Constraint.create({
        pointA: { x: platform.x, y: platform.y },
        bodyB: platform.body,
        length: 0
    });

    // We need to add the constraint to the Matter world to activate it
    scene.matter.world.add(constraint);

    // Give the platform a random initial tilt, as a hint to the player that these platforms rotate
    const sign = Math.random() < 0.5 ? -1 : 1;
    const angle = sign * Phaser.Math.Between(15, 25);
    platform.setAngle(angle);
    platform.setAngularVelocity(0.02);
}