export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Rox Nails - Test Page</h1>
      <p>If you can see this, the deployment is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  )
}