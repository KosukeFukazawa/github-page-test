import * as THREE from "three";

import { OrbitControls } from "controls";
import { BVHLoader } from "bvh";
import { Vector3 } from "three";

let camera, controls, scene, renderer;
let mixer, skeletonHelper, clock;

init();
animate();


function init() {

    const container = document.getElementById( 'container' );

    // camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 200, 400);

    // clock
    clock = new THREE.Clock();

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xeeeeee );

    scene.add( new THREE.GridHelper( 500, 10 ) );

    // load bvh
    const BVHloader = new BVHLoader();
    BVHloader.load( "./Aeroplane_BR.bvh", function ( result ) {

        skeletonHelper = new THREE.SkeletonHelper( result.skeleton.bones[ 0 ] );
        skeletonHelper.skeleton = result.skeleton;

        const boneContainer = new THREE.Group();
        boneContainer.add( result.skeleton.bones[ 0 ] );

        scene.add( skeletonHelper );
        scene.add( boneContainer );

        mixer = new THREE.AnimationMixer( skeletonHelper );
        let action = mixer.clipAction( result.clip );
        action.setEffectiveWeight(1);
        action.play();

    } );

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    // controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 100;
    controls.maxDistance = 700;

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
    const delta = clock.getDelta();

    if ( mixer ) mixer.update( delta );

    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}
