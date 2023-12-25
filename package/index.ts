import * as THREE from 'three'


type MaterialEnabled = THREE.LineBasicMaterial |
    THREE.MeshBasicMaterial |
    THREE.MeshDepthMaterial |
    THREE.MeshDistanceMaterial |
    THREE.MeshLambertMaterial |
    THREE.MeshMatcapMaterial |
    THREE.MeshPhongMaterial |
    THREE.MeshPhysicalMaterial |
    THREE.MeshStandardMaterial |
    THREE.MeshToonMaterial |
    THREE.PointsMaterial |
    THREE.SpriteMaterial

interface UniformTexture {
    value: THREE.Texture | null
}


class TwoSidedMaterial {

    material: MaterialEnabled
    textureFront: UniformTexture = {
        value: null
    }
    textureBack: UniformTexture = {
        value: null
    }

    constructor(material: MaterialEnabled) {
        material.side = THREE.DoubleSide
        this.material = material
        this.material.onBeforeCompile = shader => {
            shader.uniforms.textureFront = this.textureFront
            shader.uniforms.textureBack = this.textureBack
            shader.fragmentShader = `
                uniform sampler2D textureFront;
                uniform sampler2D textureBack;
                ${shader.fragmentShader}
            `.replace(
        `#include <map_fragment>`,
        `
                        #ifdef USE_MAP
                            if (gl_FrontFacing) {
                                vec4 textureColorFront = texture2D(textureFront, vMapUv);
                                diffuseColor *= textureColorFront;
                            }
                            else {
                                vec4 textureColorBack = texture2D(textureBack, vMapUv);
                                diffuseColor *= textureColorBack;
                            }
                        #endif
                  `
              )
        }
    }

    getMaterial() {
        return this.material
    }

    setTextureFront(texture: THREE.Texture) {
        if (!this.material.map) {
            this.material.map = texture
        }
        texture.needsUpdate = true
        this.textureFront.value = texture
    }

    setTextureBack(texture: THREE.Texture) {
        if (!this.material.map) {
            this.material.map = texture
        }
        texture.needsUpdate = true
        this.textureBack.value = texture
    }

    setTextures(textureFront: THREE.Texture, textureBack: THREE.Texture) {
        this.setTextureFront(textureFront)
        this.setTextureBack(textureBack)
    }
}


export default TwoSidedMaterial