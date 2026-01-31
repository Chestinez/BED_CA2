import { Canvas } from '@react-three/fiber'; 
export default function Shop() {
  return (
    <div className='d-flex flex-column align-items-center justify-content-center vh-100'>
      <Canvas className='bg-gradient'>
        {/* Add your 3D content here */}
      </Canvas>
      <div>Shop</div>
    </div>
  )
}
