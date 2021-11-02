var tree;
count = 0;
function setup() {
  createCanvas(600, 600);
  let boundary = new Rectangle(300,300,300,300);
  tree = new QuadTree(boundary,1);
  console.log(tree);
  
  for (let i = 0; i < 50; i++) {
    let x = randomGaussian(width/2,width/8);
    let y = randomGaussian(height/2,height/8);
    let p = new Point(x,y);
    tree.insert(p);
  }
  background(0);
  tree.show();
}
function mouseClicked(){
  stroke(0,255,0);
  rectMode(CENTER);
  let range = new Rectangle(mouseX,mouseY,25,25);  
  rect(range.x, range.y, range.w*2,range.h*2);
  let points = [];
  tree.query(range,points);
  for(let p of points){
    strokeWeight(3);
    point(p.x,p.y);
  }

  console.log("El Numero de puntos encontrados es: ",count);
  count = 0;
}
// function draw(){
//   if(mouseIsPressed){
//     for(let i = 0 ; i < 5 ; i++){
//     let m = new Point(mouseX+random(-5,5),mouseY+random(-5,5));
//     tree.insert(m);
//     }
//   }
//   background(0);
//   tree.show();
// }
// function mouseClicked(){
//   let m = new Point(mouseX,mouseY);
//   tree.insert(m);
//   background(0);
//   tree.show();
// }