import { useState } from 'react';
import PageMeta from '../../components/common/PageMeta';

interface PackageFeature {
  id: number;
  package_id: number;
  feature_text: string;
  feature_text_bn: string;
  is_available: number;
}

interface Package {
  id: number;
  name: string;
  name_bn: string;
  price: number;
  discount_percent: number;
  discount_price: number;
  billing_period: string;
  billing_period_bn: string;
  description: string;
  description_bn: string;
  is_custom: number;
  status: number;
  created_at: string;
  features: PackageFeature[];
}

const dummyPackages: Package[] = [
  {
    id: 1,
    name: 'Free',
    name_bn: 'ফ্রি',
    price: 0.00,
    discount_percent: 0.00,
    discount_price: 0.00,
    billing_period: '/User / Month',
    billing_period_bn: '/ইউজার / প্রতি মাস',
    description: 'Unlock modern business calling with essential features – absolutely free',
    description_bn: 'ফ্রি-তেই আধুনিক বিজনেস কলিং এর যাত্রা শুরু করুন',
    is_custom: 0,
    status: 1,
    created_at: '2025-05-08 17:08:07',
    features: [
      { id: 1, package_id: 1, feature_text: 'Access up to 5 extension users & 3 channels', feature_text_bn: 'সর্বোচ্চ ৫ জন ইউজার ও ৩ টি চ্যানেল', is_available: 1 },
      { id: 3, package_id: 1, feature_text: 'Advanced Call Flow / IVR (e.g: press 1 for Sales)', feature_text_bn: 'কল ফ্লো / IVR (যেমন: সেলসের জন্য ১ চাপুন)', is_available: 1 },
      { id: 4, package_id: 1, feature_text: 'Standard calling features (hold, transfer, DND)', feature_text_bn: 'স্ট্যান্ডার্ড কলিং ফিচার (হোল্ড, ট্রান্সফার, DND)', is_available: 1 },
      { id: 5, package_id: 1, feature_text: 'Call Detail Reports (CDR)', feature_text_bn: 'কল রিপোর্ট (CDR)', is_available: 1 },
      { id: 6, package_id: 1, feature_text: 'Real-time Dashboard', feature_text_bn: 'রিয়েল-টাইম ড্যাশবোর্ড', is_available: 1 },
      { id: 46, package_id: 1, feature_text: 'Get access to the Hotscan feature', feature_text_bn: 'Hotscan ফিচার ব্যবহারের সুযোগ', is_available: 1 },
      { id: 47, package_id: 1, feature_text: 'Community Support', feature_text_bn: 'কমিউনিটি সহায়তা', is_available: 1 }
    ]
  },
  {
    id: 2,
    name: 'Plus',
    name_bn: 'প্লাস',
    price: 100.00,
    discount_percent: 50.00,
    discount_price: 50.00,
    billing_period: '/User /Month',
    billing_period_bn: '/ ইউজার / প্রতি মাস',
    description: 'Level up your team\'s productivity and control with expanded access',
    description_bn: 'আপনার টিমের কাজের গতি ও কন্ট্রোল বাড়াতে আনলিমিটেড এক্সেস',
    is_custom: 0,
    status: 1,
    created_at: '2025-05-08 17:08:07',
    features: [
      { id: 17, package_id: 2, feature_text: 'Includes everything in Free', feature_text_bn: 'ফ্রি প্ল্যানের সকল সুবিধা', is_available: 1 },
      { id: 18, package_id: 2, feature_text: 'Unlimited User Access with unlimited channels', feature_text_bn: 'আনলিমিটেড ইউজার ও চ্যানেল ব্যবহারের সুযোগ', is_available: 1 },
      { id: 19, package_id: 2, feature_text: 'Connect to verified IPTSP number (trunk)', feature_text_bn: 'ভেরিফায়েড IPTSP নম্বারের সাথে সংযুক্তি (trunk)', is_available: 1 },
      { id: 50, package_id: 2, feature_text: 'Support Ticket System', feature_text_bn: 'সাপোর্ট টিকেট সিস্টেম', is_available: 1 },
      { id: 52, package_id: 2, feature_text: 'AI Agent (coming soon)', feature_text_bn: 'AI এজেন্ট (শীঘ্রই আসছে)', is_available: 1 }
    ]
  },
  {
    id: 3,
    name: 'Pro',
    name_bn: 'প্রো',
    price: 0.00,
    discount_percent: 0.00,
    discount_price: 0.00,
    billing_period: '',
    billing_period_bn: '',
    description: 'For growing teams, call centers, and advanced needs',
    description_bn: 'বড় টিম, কল সেন্টার এবং উন্নত ফিচারের জন্য সর্বোচ্চ অ্যাক্সেস',
    is_custom: 1,
    status: 1,
    created_at: '2025-05-08 17:08:07',
    features: [
      { id: 33, package_id: 3, feature_text: 'Everything in Plus', feature_text_bn: 'প্লাস প্ল্যানের সকল সুবিধা', is_available: 1 },
      { id: 34, package_id: 3, feature_text: 'Customized Features', feature_text_bn: 'কাস্টমাইজড ফিচার', is_available: 1 },
      { id: 48, package_id: 3, feature_text: 'API Integration Support', feature_text_bn: 'API ইন্টিগ্রেশন সাপোর্ট', is_available: 1 },
      { id: 49, package_id: 3, feature_text: 'Technical Support', feature_text_bn: 'টেকনিক্যাল সাপোর্ট', is_available: 1 },
      { id: 51, package_id: 3, feature_text: 'Support Ticket System', feature_text_bn: 'সাপোর্ট টিকেট সিস্টেম', is_available: 1 },
      { id: 53, package_id: 3, feature_text: 'On-premise setup available', feature_text_bn: 'On-premise সেটআপ করার সুবিধা', is_available: 1 }
    ]
  }
];

export default function Packages() {
  const [packages] = useState<Package[]>(dummyPackages);

  const getPackageColor = (name: string) => {
    switch (name) {
      case 'Free':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'Plus':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'Pro':
        return 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20';
    }
  };

  return (
    <>
      <PageMeta
        title="Packages | SOHUB Connect"
        description="Manage system packages and pricing plans"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Packages</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage system packages and pricing plans</p>
          </div>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`rounded-xl border-2 p-6 ${getPackageColor(pkg.name)}`}>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {pkg.name}
                </h3>
                <div className="mb-4">
                  {pkg.price > 0 ? (
                    <div>
                      {pkg.discount_percent > 0 ? (
                        <div>
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            ৳{pkg.discount_price}
                          </span>
                          <span className="text-lg text-gray-500 line-through ml-2">
                            ৳{pkg.price}
                          </span>
                          <div className="text-sm text-green-600 font-medium">
                            {pkg.discount_percent}% OFF
                          </div>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          ৳{pkg.price}
                        </span>
                      )}
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {pkg.billing_period}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {pkg.is_custom ? 'Custom' : 'Free'}
                      </span>
                      {pkg.billing_period && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {pkg.billing_period}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {pkg.description}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Features:</h4>
                <ul className="space-y-2">
                  {pkg.features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature.feature_text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  pkg.name === 'Free' 
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : pkg.name === 'Plus'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}>
                  {pkg.is_custom ? 'Contact Sales' : pkg.price > 0 ? 'Subscribe' : 'Current Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}