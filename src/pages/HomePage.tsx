import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Handshake, Users, Award, MapPin, Calendar } from 'lucide-react';
import Button from '../components/shared/Button';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white min-h-[90vh]">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-4 py-32 md:py-48 relative z-10">
          <div className="max-w-3xl mx-auto text-center mt-[-2rem]">
            <Heart className="h-16 w-16 text-white/90 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-center whitespace-nowrap">
              Connect, Donate, Empower!
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/80">
              Be the reason someone smiles today! Together lets make a difference by donating.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button variant="primary" size="lg" className="bg-purple text-white-700">
                  Donate now
                </Button>
              </Link>
              <Link to="/signup?type=recipient">
                <Button variant="primary" size="lg" className="bg-purple text-white-700">
                  Register Organization
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#F9FAFB" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,170.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Donato Works</h2>
            <p className="text-lg text-gray-600">Our platform makes it easy to connect donors with organizations that need support, creating meaningful impact in communities.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Find Local Organizations</h3>
              <p className="text-gray-600">Discover NGOs, orphanages, and old age homes near you that need your support.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Handshake className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Contribute Meaningfully</h3>
              <p className="text-gray-600">Donate food, books, clothes, money, or infrastructure based on what's needed most.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Celebrate Special Occasions</h3>
              <p className="text-gray-600">Make your special days even more meaningful by sharing joy with those who need it most.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <p className="text-4xl font-bold text-purple-600 mb-2">1200+</p>
              <p className="text-gray-600">Organizations</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-teal-600 mb-2">15K+</p>
              <p className="text-gray-600">Active Donors</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-orange-600 mb-2">₹25M+</p>
              <p className="text-gray-600">Value Donated</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-indigo-600 mb-2">750+</p>
              <p className="text-gray-600">Events Celebrated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">What People Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-8 relative">
              <div className="absolute -top-4 left-8 bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 italic">"Donato made it incredibly easy to find local orphanages where I could donate books and toys. The impact reports and certificates helped me see the real difference my contributions made."</p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Donor" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-semibold text-gray-900">Priya Sharma</p>
                  <p className="text-sm text-gray-500">Regular Donor</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-8 relative">
              <div className="absolute -top-4 left-8 bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 italic">"As a small NGO, we struggled to connect with potential donors. DONATO has transformed our reach. We've received consistent support and even had donors celebrate events with our children."</p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Organization Representative" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-semibold text-gray-900">Rajesh Kumar</p>
                  <p className="text-sm text-gray-500">Hope Foundation</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-8 relative">
              <div className="absolute -top-4 left-8 bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 italic">"I celebrated my daughter's birthday at an orphanage through DONATO. The joy on those children's faces was the best gift we could have received. The platform made everything seamless."</p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Event Donor" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-semibold text-gray-900">Anita Desai</p>
                  <p className="text-sm text-gray-500">Event Donor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of donors who are making a positive change in their communities through DONATO.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button variant="outline" size="lg" className="bg-white text-purple-700 border-none shadow-none hover:bg-white hover:text-purple-700 hover:shadow-none">
                Become a Donor
              </Button>
            </Link>
            <Link to="/signup?type=recipient">
              <Button variant="outline" size="lg" className="bg-white text-purple-700 border-none shadow-none hover:bg-white hover:text-purple-700 hover:shadow-none">
                Register Your Organization
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;