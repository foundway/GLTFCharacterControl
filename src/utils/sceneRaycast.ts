import * as THREE from 'three'

export const POINTS_THRESHOLD_SCREEN_PX = 1

export const worldSizeAtDepth = (
  camera: THREE.Camera,
  size: { width: number; height: number },
  depthInWorld: number,
  pixelSize: number
): number => {
  const fovRad =
    'fov' in camera
      ? ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180
      : Math.PI / 4
  return (pixelSize * (2 * depthInWorld * Math.tan(fovRad / 2))) / size.height
}

export const sceneRaycast = (
  camera: THREE.Camera,
  characterGroup: THREE.Object3D | null,
  ndcPointer: THREE.Vector2,
  size: { width: number; height: number },
  stageRadius: number
): THREE.Vector3 | null => {
  if (!characterGroup) return null
  const raycaster = new THREE.Raycaster()
  const fovRad =
    'fov' in camera
      ? ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180
      : Math.PI / 4
  const worldHeightAtDepth = 2 * stageRadius * Math.tan(fovRad / 2)
  const threshold = (POINTS_THRESHOLD_SCREEN_PX / size.height) * worldHeightAtDepth
  raycaster.params.Points = { threshold }
  raycaster.setFromCamera(ndcPointer, camera)
  const hits = raycaster.intersectObject(characterGroup, true)
  const _normal = new THREE.Vector3()
  const _toCamera = new THREE.Vector3()
  const validHits = hits.filter((h) => {
    if (!h.point) return false
    if (h.object instanceof THREE.Line || h.object instanceof THREE.LineSegments) return false
    if (h.object instanceof THREE.Mesh && h.face != null) {
      _normal.copy(h.face.normal).transformDirection(h.object.matrixWorld)
      _toCamera.subVectors(
        (camera as THREE.PerspectiveCamera).position,
        h.point
      ).normalize()
      if (_normal.dot(_toCamera) <= 0) return false
    }
    return true
  })
  const first = validHits[0] ?? null
  return first?.point ?? null
}
