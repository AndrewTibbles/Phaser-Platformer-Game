export default function createJumpingPlatform(scene, x, y) {
    // A TileSprite is a Sprite whose texture repeats to fill the given width and height. We can use
    // this with an image from our tileset to create a platform composed of tiles:
    const platform = scene.add.tileSprite(x, y, 128 , 64, "spring");
  
    scene.matter.add.gameObject(platform, {
      restitution: 0.85, 
      frictionAir: 1, // Spin forever without slowing down from air resistance
      friction: 0.1, // A little extra friction so the player sticks better
      // Density sets the mass and inertia based on area - 0.001 is the default. We're going lower
      // here so that the platform tips/rotates easily
      density: 0.001
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
  
    platform.setAngle(0);
  
  }