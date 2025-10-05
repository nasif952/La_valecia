export default function TestPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Page</h1>
      <p className="text-lg text-gray-600 mb-4">This is a simple test page to check if basic styling works.</p>
      
      <div className="bg-brand-primary text-white p-4 rounded-lg mb-4">
        <p>Brand primary color test</p>
      </div>
      
      <div className="bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white p-4 rounded-lg mb-4">
        <p>Gradient test</p>
      </div>
      
      <button className="bg-brand-primary text-white px-6 py-3 rounded-2xl hover:bg-brand-primary/90 transition-colors">
        Button Test
      </button>
    </div>
  )
}
