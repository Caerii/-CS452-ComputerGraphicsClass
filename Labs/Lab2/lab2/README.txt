# Alif Jakir

1) I created a polygon with 8 vertices by defining all the vertices and then placing them in a buffer.
2) The shape starts at the origin and moves right, the way that it 
does this is a constant translation in the render function I defined.
3) The various keys will switch the direction of the shape movement based on specific key press events.
 I also added a bounce when the shape hits the wall so it swaps to the opposite direction.
4) Increase and decrease buttons speed modify a global variable 
and I use it as a multiplier for the theta and the translations.
5) Mouse click events are captured and used as positional tx variables, 
the shape will jump to that location and continue moving, as the render loop is not interrupted.
6) I combined StartRotate and StopRotate buttons into one by making it affect a StartStopFlag. 
This will basically pause rotation, but not reset it, by stopping rotation iteration while it's on.