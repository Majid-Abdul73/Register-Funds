import { Link } from 'react-router-dom';

export default function HowItWorks() {
  // Steps content
  const steps = [
    'Discover campaigns from verified K-12 schools in Ghana, each sharing their story and specific needs.',
    'Select a school or project that resonates with you—whether it’s funding computers, rebuilding a library, or providing school meals.',
    'Contribute any amount through our safe, transparent platform. Every dollar goes directly to the school’s campaign.',
    'Get data-driven reports with metrics, photos, and stories showing how your donation is improving quality education for schoolchildren and teachers.'
  ];

  // Step headings
  const stepHeadings = [
    'Find a verified school campaign',
    'Choose a school to support',
    'Donate directly, securely to schools',
    'Get reports on real change'
  ];

  

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 -mt8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-register-green-light p-12 rounded-2xl">
          <div>
            <h2 className="text-3xl font-bold text-register-black mb-4">
              {/* How Register<br />Funds Work */}

              We Match  <br /> Every Dollar To <br /> A School Need
            </h2>
            <Link 
              to="/how-it-works" 
              className="hover:text-green-600 flex items-center text-sm font-medium"
            >
              Learn how it works
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="space-y-4 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start relative">
                <div className="flex-shrink-0 mr-6 relative pt-2">
                  {/* Vertical line connecting dots */}
                  <div className="absolute top-6 left-1 w-0.5 h-16 bg-register-green"></div>
                  {/* Dot */}
                  <div className="w-3 h-3 rounded-full bg-register-green relative z-10"></div>
                </div>
                <div>
                  <h3 className="text-register-green text-lg font-bold mb-2">{stepHeadings[index]}</h3>
                  <p className="text-sm font-medium leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
          
        </div>

      <img src="/images/footer.svg" alt="footer image"
      className='mt-40' />


      </div>
   </div>
  );
}