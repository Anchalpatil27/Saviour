import DonateForm from './DonateForm'

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Support Our Mission</h1>
        <p className="text-xl text-center mb-12">Your donation helps us provide critical resources and support to communities affected by disasters. Every contribution makes a difference.</p>
        
        <DonateForm />
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Other Ways to Support</h2>
          <p className="mb-4">If you prefer to donate by check or have any questions about donating, please contact our donation team:</p>
          <p className="font-semibold">donations@saviour.org | +91 8955192479</p>
        </div>
      </div>
    </div>
  )
}