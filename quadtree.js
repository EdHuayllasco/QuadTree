// clase Base Punto, punto en (x,y) en R2
class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}
//Clase Rectangulo, conformado de un Punto(x,y) punto central
// W = with = ancho 
// h = height = alto 
// al ser punto central los limites son medidos x-w, x+w , y-h, y+h 
class Rectangle{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    // contains recibe un punto y verifica si se encuentra dentro de estos limites
    // cabe resaltar que usa el igual, esto para evitar la duplicacion de puntos cuando dividimos
    contains(point){
        return (   point.x>=this.x-this.w 
                && point.x<=this.x+this.w 
                && point.y>=this.y-this.h 
                && point.y<=this.y+this.h
        );
    }
    // interseccion, si existe alguna intereseccion entre dos rectangulos
    intersection(range){
        return !(range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h);
    }
}
class QuadTree{
    // constructor, recibe un rectangulo base, y un n = capacidad de hijos
    constructor(boundary, n){
        this.boundary = boundary;
        this.capacity = n;
        this.points = [];
        this.divided = false;
    }
    // subdividir nuestro arbol en 4
    subdivide(){
        // obtenemos los valores de nuestro primer rectangulo o nuestro primer marco o la Raiz.
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;
        // Procedemos dividir en 4 partes dicho rectangulo
        let ne = new Rectangle(x + w/2, y - h/2, w/2, h/2 );
        // Creamos para cada uno de estos su nuevo sub arbol.
        this.northeast = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(x - w/2, y - h/2, w/2, h/2 );
        this.northwest = new QuadTree(nw , this.capacity);
        let se = new Rectangle(x + w/2, y + h/2, w/2, h/2 );
        this.southeast = new QuadTree(se, this.capacity);  
        let sw = new Rectangle(x - w/2, y + h/2, w/2, h/2 );
        this.southwest = new QuadTree(sw , this.capacity);
        // Cuando hacemos la division del arbol, necesitamos no dejar a un hijo como padre
        // se debe reordenar para que el punto medio sea el padre y se agregue los puntos unicamente en las hojase
        // recorremos todos los indices que de nuestra lista que tiene como maximo a capacity 
        for(let i = 0 ; i < this.points.length;i++){
            let p = this.points[i];
            // comprobamos si tanto este punto como el que vamos a ingresar pertenecen a dicho lado del rectangulo
            // si es si, se elimina dicho nodo que tomara la posicion a nuevo padre y colocamos en su lugar al punto medio
            // una vez verificado agregamos ese nodo eliminado como nuevo hijo y termina la division.
            if(ne.contains(p)){
                //let punto_medio = new Point(x + w/2,y - h/2);
                this.points.splice(i,1);
                this.northeast.insert(p);
            } else if(nw.contains(p)){
                //let punto_medio = new Point(x - w/2,y - h/2);
                this.points.splice(i,1);
                this.northwest.insert(p);
            } else if(se.contains(p)){
                //let punto_medio = new Point(x + w/2,y + h/2);
                this.points.splice(i,1);
                this.southeast.insert(p);
            } else if(sw.contains(p)){
                //let punto_medio = new Point(x - w/2, y + h/2);
                this.points.splice(i,1);
                this.southwest.insert(p);
            }
        }
        this.divided = true;
    }
    insert(point){
        // caso base, sino se ecnuentra retornar false
        if(!this.boundary.contains(point)){
            return false;
        }
        // si se encuentra dentro del maximo de capacidad
        if(this.points.length < this.capacity && !this.divided){
            this.points.push(point);
            return true;
        }
        else{
            // ya que excede la capacidad procedemos a dividir
            if(!this.divided){
                this.subdivide();
            }
            //verificamos recursivamente donde debemos ingresar dicho punto
            if(this.northeast.insert(point)){
                return true;
            }else if(this.northwest.insert(point)){
                return true;
            }else if(this.southeast.insert(point)){
                return true;
            }else if(this.southwest.insert(point)){
                return true;
            }
        }
    }
    //Busqueda por rango, entregamos un cuadrado y tambien enviamos una lista vacia, la cual recuperaremos
    //  con todos los elementos encontrados en dicho rango
    query(range , found){
        if(!this.boundary.intersection(range)){
            // array vacio
            return found;
        }else{
            for(let p of this.points){                
                if(range.contains(p)){
                    // si se encuentra en el rango, agregamos a la lista
                    found.push(p);
                    count++;
                }
            }
            //busqueda recursiva
            if(this.divided){
                this.northwest.query(range,found);
                this.northeast.query(range,found);
                this.southwest.query(range,found);
                this.southeast.query(range,found);
            }
        }
    }
    // funcion mostrar P5.js
    show(){
        // variables inicializacion
        stroke(255);
        strokeWeight(1);
        noFill();
        // dibujamos el rectangulo
        rectMode(CENTER);
        rect(this.boundary.x , this.boundary.y, this.boundary.w*2, this.boundary.h*2);
        if(this.divided){
            // dibujamos recursivamente
            this.northwest.show();
            this.northeast.show();
            this.southwest.show();
            this.southeast.show();
        }
        for(let p of this.points){
            // imprimimos los puntos
            strokeWeight(4);
            point(p.x,p.y);
        }
    }
}