// TODO: customize the controller
import { DefaultXRControllerOptions, DefaultXRController } from '@react-three/xr'

const XRController = (props: DefaultXRControllerOptions) => {
  return (
    <>
      <DefaultXRController
        rayPointer={true}
        grabPointer={false}
        teleportPointer={false}
        {...props}
      />
    </>
  )}

export default XRController; 