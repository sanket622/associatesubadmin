import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployerProfile } from "../../../redux/dashboardhome/employerProfileSlice";

// Material-UI Icons (using similar SVG paths for compatibility)
const BusinessIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-4h-2v-2h2V9h-2V7h8v12zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
  </svg>
);

const PolicyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22S19,14.25 19,9A7,7 0 0,0 12,2Z"/>
  </svg>
);

const ContractIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
  </svg>
);

export default function EmployerProfile() {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(state => state.employerProfile);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchEmployerProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const {
    name,
    email,
    employerId,
    mobile,
    pan,
    gst,
    employerBusinessDetails,
    EmployerCompanyPolicies,
    EmployerLocationDetails,
    EmployerContractType,
  } = profile;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const sections = [
    {
      id: "business",
      title: "Business Details",
      icon: <BusinessIcon />,
      color: "blue",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <InfoCard 
            label="Company Name" 
            value={name || "N/A"} 
            icon="🏢"
            color="blue"
          />
          <InfoCard 
            label="Employer ID" 
            value={employerId || "N/A"} 
            icon="🆔"
            color="indigo"
          />
          <InfoCard 
            label="Industry" 
            value={employerBusinessDetails?.industryType?.name || "N/A"} 
            icon="🏭"
            color="green"
          />
          <InfoCard 
            label="Founded" 
            value={formatDate(employerBusinessDetails?.establishmentDate) || "N/A"} 
            icon="📅"
            color="purple"
          />
          <InfoCard 
            label="Business Location" 
            value={employerBusinessDetails?.businessLocation || "N/A"} 
            icon="📍"
            color="orange"
          />
          <InfoCard 
            label="PIN Code" 
            value={employerBusinessDetails?.pincode || "N/A"} 
            icon="📮"
            color="red"
          />
        </div>
      )
    },
    {
      id: "policies",
      title: "Company Policies",
      icon: <PolicyIcon />,
      color: "green",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <PolicyCard
            title="Remote Work Policy"
            description={EmployerCompanyPolicies?.remoteworkPolicy || "N/A"}
            icon="🏠"
            color="blue"
          />
          <PolicyCard
            title="Overtime Policy"
            description={EmployerCompanyPolicies?.overtimePolicy || "N/A"}
            icon="⏰"
            color="orange"
          />
          <PolicyCard
            title="Notice Period"
            description={`${EmployerCompanyPolicies?.noticePeriod || 0} days notice required`}
            icon="📋"
            color="red"
          />
          <PolicyCard
            title="Annual Leaves"
            description={`${EmployerCompanyPolicies?.annualLeaves || 0} days paid time off per year`}
            icon="🌴"
            color="green"
          />
          <PolicyCard
            title="Sick Leaves"
            description={`${EmployerCompanyPolicies?.sickLeaves || 0} days sick leave per year`}
            icon="🏥"
            color="red"
          />
          <PolicyCard
            title="Casual Leaves"
            description={`${EmployerCompanyPolicies?.casualLeaves || 0} days casual leave per year`}
            icon="☀️"
            color="yellow"
          />
          <PolicyCard
            title="Maternity Leaves"
            description={`${EmployerCompanyPolicies?.maternityLeaves || 0} days maternity leave`}
            icon="👶"
            color="pink"
          />
          <PolicyCard
            title="Probation Period"
            description={`${EmployerCompanyPolicies?.probationPeriod || 0} days initial assessment period`}
            icon="📝"
            color="purple"
          />
          <PolicyCard
            title="Registration Policy"
            description={EmployerCompanyPolicies?.registrationPolicy || "N/A"}
            icon="📄"
            color="indigo"
          />
        </div>
      )
    },
    {
      id: "email",
      title: "Contact Information",
      icon: <EmailIcon />,
      color: "purple",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContactCard
            title="Primary Email"
            email={email || "N/A"}
            type="Administrative Contact"
            color="purple"
          />
          <ContactCard
            title="Mobile Number"
            email={mobile || "N/A"}
            type="Primary Contact"
            color="green"
          />
          <ContactCard
            title="PAN Number"
            email={pan || "N/A"}
            type="Tax Identification"
            color="blue"
          />
          <ContactCard
            title="GST Number"
            email={gst || "N/A"}
            type="Tax Registration"
            color="orange"
          />
        </div>
      )
    },
    {
      id: "location",
      title: "Work Locations",
      icon: <LocationIcon />,
      color: "orange",
      content: (
        <div className="space-y-6">
          {EmployerLocationDetails?.map((location, index) => (
            <LocationCard key={location.id || index} location={location} />
          ))}
          {(!EmployerLocationDetails || EmployerLocationDetails.length === 0) && (
            <div className="text-center py-12 text-gray-500">
              <LocationIcon />
              <p className="mt-4 text-lg">No locations added yet</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: "contract",
      title: "Contract Details",
      icon: <ContractIcon />,
      color: "indigo",
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Available Contract Types</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {EmployerContractType?.map((contract, index) => (
              <ContactCard key={contract.id || index} contract={contract} />
            ))}
          </div>
          {(!EmployerContractType || EmployerContractType.length === 0) && (
            <div className="text-center py-12 text-gray-500">
              <ContractIcon />
              <p className="mt-4 text-lg">No contract types configured</p>
            </div>
          )}
        </div>
      )
    }
  ];

  const getColorClasses = (color, isActive = false) => {
    const colors = {
      blue: isActive ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-blue-50',
      green: isActive ? 'border-green-500 text-green-600 bg-green-50' : 'border-transparent text-gray-600 hover:text-green-600 hover:bg-green-50',
      purple: isActive ? 'border-purple-500 text-purple-600 bg-purple-50' : 'border-transparent text-gray-600 hover:text-purple-600 hover:bg-purple-50',
      orange: isActive ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-transparent text-gray-600 hover:text-orange-600 hover:bg-orange-50',
      indigo: isActive ? 'border-indigo-500 text-indigo-600 bg-indigo-50' : 'border-transparent text-gray-600 hover:text-indigo-600 hover:bg-indigo-50',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 bg-clip-text text-transparent mb-4">
            Employer Profile
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive overview of your organization's details and policies
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
          {/* Tabs */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 px-8 py-6">
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                    getColorClasses(section.color, activeTab === index)
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="hidden sm:inline">{section.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {sections[activeTab].title}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
            {sections[activeTab].content}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced InfoCard component
function InfoCard({ label, value, icon, color }) {
  const getCardColors = (color) => {
    const colors = {
      blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
      green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
      purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
      orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
      red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
      indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200',
      yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
      pink: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${getCardColors(color)}`}>
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-bold text-gray-800">{label}</h3>
      </div>
      <p className="text-gray-700 font-medium text-lg">{value}</p>
    </div>
  );
}

// Enhanced PolicyCard component
function PolicyCard({ title, description, icon, color }) {
  const getCardColors = (color) => {
    const colors = {
      blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
      green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
      purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
      orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
      yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
      pink: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${getCardColors(color)}`}>
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
}

// Enhanced ContactCard component
function ContactCard({ title, email, type, color }) {
  const getContactColors = (color) => {
    const colors = {
      purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
      green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
      blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
      orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
    };
    return colors[color] || colors.purple;
  };

  const getIcon = (title) => {
    if (!title || typeof title !== 'string') return '📧'; 
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('email')) return '📧';
    if (lowerTitle.includes('mobile')) return '📱';
    if (lowerTitle.includes('pan')) return '🆔';
    if (lowerTitle.includes('gst')) return '🏢';
    return '📧';
  };
  

  return (
    <div className={`border-2 p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${getContactColors(color)}`}>
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-2xl">{getIcon(title)}</span>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-900 font-medium text-lg mb-1">{email}</p>
      <p className={`font-medium text-${color}-600`}>{type}</p>
    </div>
  );
}

// Enhanced LocationCard component
function LocationCard({ location }) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="flex items-start space-x-6">
        <div className="p-4 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl shadow-lg">
          <LocationIcon />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {location.workspaceName || "Office Location"}
          </h3>
          <div className="space-y-2 text-gray-700">
            <p className="text-lg font-medium">{location.address || "N/A"}</p>
            <p className="text-lg">
              {location.district?.districtName || "N/A"}, {location.state?.stateName || "N/A"}
            </p>
            <p className="text-lg font-medium text-orange-600">
              {location.country?.countryName || "N/A"}
            </p>
          </div>
          <button className="mt-6 flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-orange-600 hover:to-amber-600 hover:shadow-lg">
            <span>View on Map</span>
            <ExternalLinkIcon />
          </button>
        </div>
      </div>
    </div>
  );
}