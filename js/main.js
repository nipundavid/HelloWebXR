var canvas = document.getElementById("renderCanvas");
var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
    return new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
    });
};
var createScene = async function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    // Parameters: alpha, beta, radius, target position, scene
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    // Positions the camera overwriting alpha, beta, radius
    camera.setPosition(new BABYLON.Vector3(0, 0, 15));
    // Set the mouse wheel delta percentage or how fast is the camera zooming
    camera.wheelDeltaPercentage = 0.01
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    // sets target on the center
    camera.setTarget(BABYLON.Vector3.Zero());
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
        diameter: 2,
        segments: 32
    }, scene);
    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;
    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {
        width: 6,
        height: 6
    }, scene);

    const xr = await scene.createDefaultXRExperienceAsync({
        floorMeshes: [ground]
    });
    return scene;
};
var engine;
try {
    engine = createDefaultEngine();
} catch (e) {
    console.log("the available createEngine function failed. Creating the default engine instead");
    engine = createDefaultEngine();
}
if (!engine) throw "engine should not be null.";
scene = createScene();
scene.then(returnedScene => {
    sceneToRender = returnedScene;
});
engine.runRenderLoop(function () {
    if (sceneToRender) {
        sceneToRender.render();
    }
});
// Resize
window.addEventListener("resize", function () {
    engine.resize();
});