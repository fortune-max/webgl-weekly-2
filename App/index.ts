import {
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  Scene,
  Mesh,
  Vector2,
  PCFSoftShadowMap,
  Vector3,
  Clock,
  AmbientLight,
  Group,
  ACESFilmicToneMapping,
} from 'three';

import  Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const GL = new GLTFLoader();
const gui = new GUI();

export default class App {
  private _renderer!: WebGLRenderer;
  private _camera!: PerspectiveCamera;
  private _meshCar!: Group;
  private _controls!: OrbitControls;
  private _stats: Stats;
  private _scene: Scene;
  private _mouse: Vector2;
  private _clock: Clock;
  private _useCarCamera: boolean = false;

  constructor() {
    this._scene = new Scene();
    this._stats = new Stats();
    this._clock = new Clock();
    this._clock.start();
    this._mouse = new Vector2(-1000, -1000);
    document.body.appendChild(this._stats.dom);
    this._init();
  }

  _init() {
    this._renderer = new WebGLRenderer({
      canvas: document.getElementById('canvas') as HTMLCanvasElement,
      antialias: true,
      
    });
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._renderer.toneMapping = ACESFilmicToneMapping;
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = PCFSoftShadowMap;
    this._renderer.setSize(window.innerWidth, window.innerHeight);

    const aspect = window.innerWidth / window.innerHeight;
    this._camera = new PerspectiveCamera(70, aspect, 0.1, 100);
    this._camera.position.set(5, 3, 0);
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);

    this._render();
    this._initEvents();
    this._initLights();
    this._createPanorama();
    this._createCar();
    this._createSoldiers();
    this._initGui();
    this._animate();
  }

  _createPanorama() {
    GL.load('/models/sky_pano_-_l.a._helipad.glb', (model) => {
      const car = model.scene;
      car.scale.setScalar(4);
      car.traverse((child) => {
        if (child instanceof Mesh) child.receiveShadow = true;
      });
      this._scene.add(car);
    })
  }

  _createCar() {
    GL.load('/models/fallout_car.glb', (model) => {
      const car = model.scene;
      car.scale.setScalar(0.01);
      car.position.set(-9, -2, 2);
      car.traverse((child) => {
        if (child instanceof Mesh) child.castShadow = true;
      });
      this._scene.add(car);
      this._meshCar = car;
    });
  }

  _createSoldiers() {
    const positions = [
      new Vector3(-4, -15.6, -12),
      new Vector3(-4, -14, 12),
    ];

    positions.forEach((position) => {
      GL.load('/models/polish_soldier.glb', (model) => {
        const baseSoldier = model.scene;
        baseSoldier.scale.setScalar(4);
        baseSoldier.rotateY(-Math.PI * 0.5);
        baseSoldier.position.copy(position);
        baseSoldier.traverse((child) => {
          if (child instanceof Mesh) child.castShadow = true;
        });
        this._scene.add(baseSoldier);
      });
    });
  }

  _initLights() {
    const al = new AmbientLight(0xffffff, 1.3);
    this._scene.add(al);

    const dl = new DirectionalLight(0xffffff, 7);
    dl.position.set(2.8, 3, -13);
    dl.castShadow = true;
    this._scene.add(dl);

    // Directional Light Shadow settings
    dl.shadow.camera.left = 0;
    dl.shadow.camera.right = 20;
    dl.shadow.camera.top = 15;
    dl.shadow.camera.bottom = -18;
    dl.shadow.camera.near = 0.5;
    dl.shadow.camera.far = 35;
  }

  _initGui() {
    gui.add(this, '_useCarCamera').onChange((value: boolean) => {
      if (!value) {
        this._camera.position.set(5, 3, 0);
        this._controls.update();
      }
    });
  }

  _initEvents() {
    window.addEventListener('resize', this._onResize.bind(this));
    window.addEventListener('pointermove', this._onMouseMove.bind(this));
  }

  _onResize() {
    const aspect = window.innerWidth / window.innerHeight;
    this._camera.aspect = aspect;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _onMouseMove(e: MouseEvent) {
    this._mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this._mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  _render() {
    this._renderer.render(this._scene, this._camera);
  }

  _animate() {
    this._stats.begin();
    const t = this._clock.getElapsedTime();

    if (this._meshCar) {
      this._meshCar.position.x = 6 * Math.sin(t * 1) - 10;
      this._meshCar.position.z = 6 * Math.cos(t * 1) + 4;
      this._meshCar.rotation.y = (t * 0.2) % (Math.PI * 2);

      if (this._useCarCamera) {
        this._camera.rotation.set(this._meshCar.rotation.x, this._meshCar.rotation.z, 0);
        this._camera.position.set(this._meshCar.position.x, this._meshCar.position.y + 2, this._meshCar.position.z + 4);
      }
    }
    
    window.requestAnimationFrame(this._animate.bind(this));
    this._renderer.render(this._scene, this._camera);
    this._stats.end();
  }
}
