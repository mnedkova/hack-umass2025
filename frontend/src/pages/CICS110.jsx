export default function CICS110() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">CICS 110</h2>
      <p>Welcome to the CICS 110 course page!</p>
       
      <button 
        onClick={() => window.open('http://220demo.s3-website.us-east-2.amazonaws.com/', '_blank')}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded transition-colors"
      >
        Go to Course Website
      </button>

    </div>
  );
}