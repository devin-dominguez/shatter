# SHATTER
Shatter is a fast-paced abstract arena shooter. It's like a first-person version of [Robotron](https://en.wikipedia.org/wiki/Robotron:_2084) or [Geometry wars](https://en.wikipedia.org/wiki/Geometry_Wars). Shatter was made using the wonderful [three.js](http://threejs.org/) library.

You can play Shatter [here](https://devin-dominguez.github.io/shatter)

## Notable Features

- Explodable 3D geometry
- "Bullet-Time" style time-warp effects
- Potential Field based artificial intelligence system

### Explodable 3D Geometry

Shatter gets its name from the fact that bullets and enemies will shatter into their constituent triangles upon impact. This explosion effect makes destroying enemies very visually satisfying.

The shatter effect works by iterating over a geometry's faces and vertices to create an array of new single-triangle objects using the same material as the original object. To ensure a proper rotational center for the newly created triangles, they are repositioned so that their center points are at the original object's origin and then translated back to their offset position.

This approach allows shatter to explode any triangle based 3D geometry in a satisfying manner.

### Time-Warp

All movement related calculations are done using delta time or dt. Delta time is the elapsed time between the current frame and the previous frame. Instead of moving an object 8 units a frame using code like this: `this.x += 8` dt allows us to specify a speed that an object should move in terms of time. To move an object 32 units a second would look like `this.x += 32 * dt`. This ensures that even if the framerate is not consistent that the object will move the necessary distance in the expected time.

Another neat feature of using dt in all time calculations is that it becomes simple to change the rate of all motion in the game just by applying some sort of scalar to dt. If one were to do something like `dt *= 0.25` the game would run at a quarter speed while still maintaining its original frame rate.

In Shatter the player has the ability to change the scale of dt while playing to give themselves more time to react to enemies.

### Artificial Intelligence

The movement of the enemies in Shatter is determined using a "potential field" style AI system. The game terrain is divided into a grid of equally sized cells. Each cell has a value assigned to it based on its distance from the enemies and the player. Every enemy's distance is added to the cell while the player's distance is subtracted from it. During each step of the game each enemy scans its neighboring cells and moves to the one with the lowest value. This ensures that the enemies will tend to move toward the player but also try to take a route that avoids other enemies. The tricky part about this sort of AI strategy is weighting the player and enemy distances when calculating a cell's value to achieve the optimal balance of aggression and avoidance.

## Upcoming Features
- Refactor, refactor, refactor
- Tweak enemy AI
- Tune balance and pacing
- Add persistent high-score
- Add more visual FX
- node webkit optimized version
- Maybe someday add sound :(
