import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const satelliteRange = 500;
const TIME_STEP = 0.01;
let debris;
const makeRender = (t=0) => {

  // obj.rotation.y = 0.001*t
  // lightsMesh.rotation.y = 0.001*t
  // cloudsMesh.rotation.y = 0.001*t

  debris.step(TIME_STEP)

  satellite.startTracking(debris)
  satellite.track()
  satellite2.startTracking(debris)
  satellite2.track()
  satellite3.startTracking(debris)
  satellite3.track()
  // camera.rotation.z += camera.rotation.z + 0.01*t
  // camera.position.z = 0;
  // camera.rotation.y = 1.3
  // camera.rotation.x = 0.7
  // camera.position.y = 80
  // camera.position.x = 160

renderer.render(scene, camera);
controls.update()
requestAnimationFrame(makeRender)
};


const canvas = document.getElementById("testCanvas");
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;
const fov = 75;
const AR = canvas.width/canvas.height;
const near = 0.1;
const far = 500;
const camera = new THREE.PerspectiveCamera(fov, AR, near, far);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({antialias: false, canvas})




const geo = new THREE.IcosahedronGeometry(1.0, 12);


const material = new THREE.MeshStandardMaterial({color: "blue"});
const obj = new THREE.Mesh(geo, material);
const light = new THREE.DirectionalLight("#aaaaaa", 1.6);
const amb = new THREE.AmbientLight("#ffffff", 0.8);



const cuboid = new THREE.BoxGeometry(1,1.3,2);
const cuboidMat = new THREE.MeshStandardMaterial({color: "hsl(51, 100%, 50%)", wireframe: false});
const cuboidMesh = new THREE.Mesh(cuboid, cuboidMat);
cuboidMesh.position.set(1,0.3,0)
// cuboidMesh.rotation.y = 1.3
// cuboidMesh.rotation.x = 0.7

const solarPanel = new THREE.BoxGeometry(0.1,1.2,10);
const solarPanelMat = new THREE.MeshStandardMaterial({color: "blue", wireframe: false});
const solarPanelMatWire = new THREE.MeshStandardMaterial({color: "white", wireframe: true});
const solarPanelMesh = new THREE.Mesh(solarPanel, solarPanelMat);
const solarPanelWireMesh = new THREE.Mesh(solarPanel, solarPanelMatWire);
// solarPanelWireMesh.scale(1.01,1.01)
solarPanelMesh.position.set(1.0,0.3,0)
solarPanelWireMesh.scale.set(1.01,1.01,1.01)
solarPanelWireMesh.position.set(1.0,0.3,0)
// solarPanelMesh.rotation.y = 1.3
// solarPanelMesh.rotation.x = 0.7
// scene.add(solarPanelWireMesh)

const laser = new THREE.CylinderGeometry(0.2, 0.3, 1.6, 32);
const laserMat = new THREE.MeshStandardMaterial({color: "red", wireframe: false});
const laserMesh = new THREE.Mesh(laser, laserMat);
laserMesh.position.set(1.0,0.5,0.4)
// Move left by 1 unit
// laserMesh.translateX(2* Math.cos(0.7))
// laserMesh.translateZ(2* Math.sin(0.7))
laserMesh.translateY(0.3)

// laserMesh.translateZ(1)
// laserMesh.rotation.y = 1.3
// laserMesh.rotation.x = 0.7


const Radar = new THREE.IcosahedronGeometry(0.4, 1);
const RadarMat = new THREE.MeshStandardMaterial({color: "white", wireframe: false, flatShading: true});
const RadarMesh = new THREE.Mesh(Radar, RadarMat);
RadarMesh.position.set(1.0,1.1,-0.5)

// scene.add(cuboidMesh)
// scene.add(laserMesh)
// scene.add(solarPanelMesh)
// scene.add(RadarMesh)

class Debris{
  constructor(x, y, z, vx, vy, vz, mass, size){
    this.x = x
    this.y = y
    this.z = z
    this.vx = vx
    this.vy = vy
    this.vz = vz
    this.mass = mass
    this.size = size
    this.ax = 0
    this.ay = 0
    this.az = 0
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1*size, 1*size, 1*size), new THREE.MeshStandardMaterial({color: "hsl(51, 100%, 50%)", wireframe: false}))
    this.mesh.position.set(x, y, z)
    scene.add(this.mesh)
  }
  step = (dt) => {
    this.x += this.vx * dt
    this.y += this.vy * dt
    this.z += this.vz * dt
    this.vx += this.ax * dt
    this.vy += this.ay * dt
    this.vz += this.az * dt
    this.mesh.position.set(this.x, this.y, this.z)
    if(this.z> INTERCEPTOR_POS){
      this.ax = 0
      this.ay = 0
      this.az = 0
      // this.vx = 0
      // this.vy = 0

      this.z -= 0.8*this.vz*dt
      this.y -= 0.8*this.vy*dt
      this.x -= 0.8*this.vx*dt
    }

  }
}
class Satellite {
  constructor(x, y, z, theta, phi, psi, size, intensity = 1) {
    this.theta = theta;
    this.phi = phi;
    this.psi = psi;
    this.size = size;
    this.intensity = intensity;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1 * size, 1.3 * size, 2 * size),
      new THREE.MeshStandardMaterial({ color: "hsl(51, 100%, 50%)", wireframe: false })
    );
    this.solarPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.1 * size, 1.2 * size, 10 * size),
      new THREE.MeshStandardMaterial({ color: "blue", wireframe: false })
    );
    this.laser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2 * size, 0.3 * size, 1.6 * size, 32),
      new THREE.MeshStandardMaterial({ color: "red", wireframe: false })
    );
    this.laser.position.set(0.0 * size, 0.6 * size, 0.4 * size);

    this.radar = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.4 * size, 1),
      new THREE.MeshStandardMaterial({ color: "white", wireframe: false, flatShading: true })
    );
    this.radar.position.set(0, 0.9 * size, -0.5 * size);
    this.things = new THREE.Group();
    this.things.add(this.mesh);
    this.things.add(this.solarPanel);
    this.things.add(this.laser);
    this.things.add(this.radar);
    this.things.rotation.set(theta, phi, psi);
    this.things.position.set(x, y, z);
    this.x = x;
    this.y = y;
    this.z = z;
    scene.add(this.things);
    this.target = null;
    this.range = satelliteRange;

    // Add a line to visualize the closest approach
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const points = [new THREE.Vector3(), new THREE.Vector3()];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.closestApproachLine = new THREE.Line(geometry, material);
    scene.add(this.closestApproachLine);
    this.isInFiringAngle = false
  }

  startTracking = (target) => {
    this.target = target;
  };

  track = () => {
    if (this.target) {
      const distance = this.calculateDistance(this.target);
      if (distance > this.range) {
        this.stopTracking();
      } else {
        if(this.isInFiringAngle){
        this.renderClosestApproachLine();
        this.target.az = 0.5
        }
      }
    }
    if (this.target) {
      this.things.lookAt(this.target.x, this.target.y, this.target.z);
      this.things.rotateZ(3.1415 / 2);
      this.things.rotateX(3.1415 / 2);
      console.log(this.things.rotation.y)
      if(((this.z - this.target.z)**2)/((this.z-this.target.z)**2 + (this.y-this.target.y)**2 + (this.x-this.target.x)**2) < 0.03){
        scene.add(this.closestApproachLine)
        this.isInFiringAngle = true
      }
      else{
        this.isInFiringAngle = false
        scene.remove(this.closestApproachLine)
      }
    }
  };

  calculateDistance = (target) => {
    return Math.sqrt(
      (target.x - this.x) ** 2 + (target.y - this.y) ** 2 + (target.z - this.z) ** 2
    );
  };

  renderClosestApproachLine = () => {
    const points = [
      new THREE.Vector3(this.x, this.y, this.z),
      new THREE.Vector3(this.target.x, this.target.y, this.target.z),
    ];

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dz = this.target.z - this.z;
    const mag = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const ux = dx / mag;
    const uy = dy / mag;
    const uz = dz / mag;

    this.target.ax = -5 * ux;
    this.target.ay = -5 * uy;
    this.target.az = -5 * uz;
    this.closestApproachLine.geometry.setFromPoints(points);
    
  };

  stopTracking = () => {
    this.target.ax = 0;
    this.target.ay = 0;
    this.target.az = 0;
    this.target = null;
    this.closestApproachLine.geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  };
}



class InterceptorSatellite{
  constructor(x, y, z, theta, phi, psi, size){
    this.x = x
    this.y = y
    this.z = z
    this.size = size
    const radius = 20
    this.mainBodyGeometry = new THREE.BoxGeometry(1*size, 2*size, 1*size)
    this.mainBodyMaterial = new THREE.MeshStandardMaterial({color: "hsl(51, 100%, 50%)", wireframe: false})
    this.mainBody = new THREE.Mesh(this.mainBodyGeometry, this.mainBodyMaterial)
    this.fabricGeometry = new THREE.CylinderGeometry(radius*size, radius*size, 0.1*size, 32)
    this.fabricMaterial = new THREE.MeshStandardMaterial({color: "rgb(200, 100, 90)", wireframe: false})
    this.fabric = new THREE.Mesh(this.fabricGeometry, this.fabricMaterial)
    this.fabric.position.set(0.0*size, 1*size, 0.4*size)
    this.fabricBack1 = new THREE.Mesh(this.fabricGeometry, this.fabricMaterial)
    this.fabricBack1.position.set(0.0*size, -1*size, 0.4*size)
    this.mainBody2 = new THREE.Mesh(this.mainBodyGeometry, this.mainBodyMaterial)
    this.mainBody2.position.set(0.0*size, -2*size, 0.0*size)

    this.things = new THREE.Group()
    this.things.add(this.mainBody)
    this.things.add(this.mainBody2)
    this.things.add(this.fabric)
    this.things.add(this.fabricBack1)
    this.things.position.set(x, y, z)
    this.things.rotation.set(theta, phi, psi)
    scene.add(this.things)
  }
}

const INTERCEPTOR_POS = 80;
const interceptor = new InterceptorSatellite(0, 0, INTERCEPTOR_POS, -Math.PI/2, 0, 0, 0.3)

// Existing code for Debris class and other parts of the file

const globalScale = 1
const offset = 35
const scale = 4
const satellite = new Satellite(-scale*8.66 *globalScale, -scale*5*globalScale, (0+offset)*globalScale, 0, 0, 0, 1)
const satellite2 = new Satellite(+scale*8.66*globalScale, -scale*5*globalScale, (0-offset)*globalScale, 0, 0, 0, 1)
const satellite3 = new Satellite(0, scale*10*globalScale, 0, 0, 0, 3.14, 1)

debris = new Debris(0, 0, -100, 0, 0, 50, 1, 1)

camera.position.z = 150;
camera.position.y = 200;
// camera.rotateOnWorldAxis(THREE.Vector3(0, 0, 0), 1)
// camera.rotation.set(1, 4, 1)
// camera.rotateY(1)
light.position.set(-20,0,0);
// earthGroup.rotation.z = -23.4 *Math.PI/180
// earthGroup.add(obj)
const controls = new OrbitControls(camera, canvas);
// controls.rotarion.set(1, 1, 1)
controls.enableDamping = true;
controls.dampingFactor = 0.03;


scene.add(light);
// scene.add(obj)
scene.add(amb)
// obj.add(wireMesh)


makeRender()
