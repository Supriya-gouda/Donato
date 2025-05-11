import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Award, CheckCircle } from 'lucide-react';
import Button from '../../components/shared/Button';
import { getCertificateById, getOrganizationById, getDonationById } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';

const Certificate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [certificate, setCertificate] = useState(getCertificateById(id || ''));
  const [donation, setDonation] = useState(certificate ? getDonationById(certificate.donationId) : null);
  const [organization, setOrganization] = useState(certificate ? getOrganizationById(certificate.organizationId) : null);
  
  const { user } = useAuth();
  
  if (!certificate || !donation || !organization) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Certificate Not Found</h2>
        <p className="text-gray-600 mb-6">The certificate you're looking for doesn't exist or has been removed.</p>
        <Link to="/donor/dashboard">
          <Button variant="primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDownload = () => {
    // In a real app, this would trigger a download of the certificate
    alert("Certificate download started. In a real application, this would download a PDF.");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/donor/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Donation Certificate</h1>
              <Button variant="outline" className="text-white border-white hover:bg-white/10" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="p-8 border-b border-dashed border-gray-200">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Certificate of Appreciation</h2>
                  <p className="text-sm text-gray-500">Donation ID: {donation.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Date Issued</p>
                <p className="font-medium text-gray-900">{formatDate(certificate.date)}</p>
              </div>
            </div>
            
            <div className="text-center mb-10">
              <p className="text-gray-600 mb-3">This certificate is presented to</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{user?.name}</h3>
              <p className="text-gray-600 mb-8">for their generous contribution to</p>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{organization.name}</h4>
              <p className="text-gray-600">{organization.address}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h4 className="font-semibold text-gray-900 mb-3">Donation Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium text-gray-900 capitalize">{donation.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{formatDate(donation.date)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium text-gray-900">{donation.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Points Awarded</p>
                  <p className="font-medium text-gray-900">{donation.pointsAwarded}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Verification Code</p>
                  <p className="font-medium text-gray-900">{certificate.verificationCode}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <img 
                  src="https://i.imgur.com/Hy3SrBG.png" 
                  alt="Organization Signature" 
                  className="h-16 mb-2" 
                />
                <p className="text-sm font-medium text-gray-900">Organization Representative</p>
                <p className="text-xs text-gray-500">Director, {organization.name}</p>
              </div>
              <div className="flex-1 text-center">
                <div className="inline-block p-4 rounded-full bg-green-100 mb-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-sm text-gray-500">Verified Donation</p>
              </div>
              <div className="flex-1 text-right">
                <img 
                  src="https://i.imgur.com/5UdXEzQ.png" 
                  alt="DONATO Seal" 
                  className="h-16 ml-auto mb-2" 
                />
                <p className="text-sm font-medium text-gray-900">DONATO</p>
                <p className="text-xs text-gray-500">Official Platform Certification</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500 mb-3">
              This certificate acknowledges a charitable donation. It may be used for tax deduction purposes where applicable.
            </p>
            <p className="text-xs text-gray-400">
              Verify this certificate at <span className="text-purple-600">www.donato.org/verify/{certificate.verificationCode}</span>
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button onClick={handleDownload} className="mr-4">
            <Download className="h-4 w-4 mr-2" />
            Download Certificate
          </Button>
          <Link to="/donor/dashboard">
            <Button variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Certificate;