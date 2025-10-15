import { useState } from 'react';
import PageMeta from '../../components/common/PageMeta';

interface Product {
  id: number;
  product_name: string;
  product_title: string;
  product_title_bn: string;
  product_image: string;
  price: number;
  stock: number;
  product_url: string;
  product_type: string;
  created_at: string;
}

const dummyProducts: Product[] = [
  {
    id: 1,
    product_name: 'Yealink T44U',
    product_title: 'Professional business IP phone with WiFi and Bluetooth',
    product_title_bn: 'WiFi ও Bluetooth সহ প্রফেশনাল বিজনেস IP ফোন',
    product_image: 'assets/connect/img/yealink.png',
    price: 0.00,
    stock: 0,
    product_url: '',
    product_type: 'ipphone',
    created_at: '2025-07-23 15:59:40'
  },
  {
    id: 2,
    product_name: 'Fanvil X303W',
    product_title: 'Enterprise IP phone with color display and HD voice',
    product_title_bn: 'রঙিন ডিসপ্লে ও এইচডি ভয়েস সহ এন্টারপ্রাইজ IP ফোন',
    product_image: 'assets/connect/img/1753274414_fanvil-ezgif_com-webp-to-jpg-converter.jpg',
    price: 0.00,
    stock: 0,
    product_url: '',
    product_type: 'ipphone',
    created_at: '2025-07-23 15:59:40'
  },
  {
    id: 3,
    product_name: 'Grandstream GRP2602P',
    product_title: 'Supports 4 SIP accounts & 2 Line Keys 5-Way Conferencing',
    product_title_bn: '৪টি SIP অ্যাকাউন্ট, ২টি লাইন কী ও ৫-ওয়ে কনফারেন্সিং সাপোর্ট করে',
    product_image: 'assets/connect/img/grndstrm.webp',
    price: 0.00,
    stock: 0,
    product_url: '',
    product_type: 'ipphone',
    created_at: '2025-07-23 15:59:40'
  },
  {
    id: 6,
    product_name: 'GA10 SIP ATA Gateway',
    product_title: 'GA10 SIP ATA Gateway',
    product_title_bn: 'GA10 SIP ATA গেটওয়ে',
    product_image: 'assets/connect/img/1753275098_11396lf4fv.png',
    price: 0.00,
    stock: 10,
    product_url: 'https://www.fanvil.com/products/p1/ata gateway/20220411/7336.html#',
    product_type: 'Gateway',
    created_at: '2025-07-23 18:51:38'
  },
  {
    id: 7,
    product_name: 'Grandstream GXW4232 32 FXS Port VoIP Gateway',
    product_title: 'Grandstream GXW4232 32 FXS Port VoIP Gateway',
    product_title_bn: 'Grandstream GXW4232 ৩২টি FXS পোর্টযুক্ত VoIP গেটওয়ে',
    product_image: 'assets/connect/img/1753275397_grandstream-gxw4232-32-fxs-port-voip-gateway-1100x1100_jpg.png',
    price: 0.00,
    stock: 0,
    product_url: '',
    product_type: 'Gateway',
    created_at: '2025-07-23 18:56:37'
  },
  {
    id: 9,
    product_name: 'Fanvil X7 20-SIP Enterprise PoE IP Phone',
    product_title: 'Fanvil X7 20-SIP Enterprise PoE IP Phone',
    product_title_bn: 'Fanvil X7 - ২০টি SIP অ্যাকাউন্ট সমর্থিত এন্টারপ্রাইজ PoE আইপি ফোন',
    product_image: 'assets/connect/img/1753275751_fanvil-x7-20-sip-enterprise-poe-ip-11676714618.png',
    price: 0.00,
    stock: 0,
    product_url: 'https://www.ryans.com/fanvil-x7-20-sip-enterprise-poe-ip-phone',
    product_type: 'Phone',
    created_at: '2025-07-23 19:02:31'
  }
];

export default function Products() {
  const [products] = useState<Product[]>(dummyProducts);

  const getProductImage = (productName: string) => {
    const imageMap: { [key: string]: string } = {
      'Yealink T44U': 'https://connect.sohub.com.bd/assets/connect/img/yealink.png',
      'Fanvil X303W': 'https://connect.sohub.com.bd/assets/connect/img/1753274414_fanvil-ezgif_com-webp-to-jpg-converter.jpg',
      'Grandstream GRP2602P': 'https://connect.sohub.com.bd/assets/connect/img/grndstrm.webp',
      'GA10 SIP ATA Gateway': 'https://connect.sohub.com.bd/assets/connect/img/1753275098_11396lf4fv.png',
      'Grandstream GXW4232 32 FXS Port VoIP Gateway': 'https://connect.sohub.com.bd/assets/connect/img/1753275397_grandstream-gxw4232-32-fxs-port-voip-gateway-1100x1100_jpg.png',
      'Fanvil X7 20-SIP Enterprise PoE IP Phone': 'https://connect.sohub.com.bd/assets/connect/img/1753274414_fanvil-ezgif_com-webp-to-jpg-converter.jpg'
    };
    return imageMap[productName] || 'https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=Product+Image';
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ipphone':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'gateway':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'phone':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock > 0) {
      return { text: `${stock} in stock`, color: 'text-green-600 dark:text-green-400' };
    }
    return { text: 'Out of stock', color: 'text-red-600 dark:text-red-400' };
  };

  return (
    <>
      <PageMeta
        title="Products | SOHUB Connect"
        description="Manage products and hardware catalog"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
            <p className="text-gray-600 dark:text-gray-400">Hardware catalog and product inventory</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            return (
              <div key={product.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={getProductImage(product.product_name)} 
                    alt={product.product_name}
                    className="w-full h-48 object-contain p-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=Product+Image';
                    }}
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(product.product_type)}`}>
                      {product.product_type}
                    </span>
                    <span className={`text-sm font-medium ${stockStatus.color}`}>
                      {stockStatus.text}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {product.product_name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {product.product_title}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {product.price > 0 ? `৳${product.price}` : 'Contact for Price'}
                    </div>
                    
                    <button
                      onClick={() => window.open('tel:09678076482', '_self')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.16 10.928c-.65.35-.65 1.094 0 1.444l3.468 1.86a1 1 0 001.444 0l3.468-1.86c.65-.35.65-1.094 0-1.444l-4.064-2.181a1 1 0 01-.502-1.21L11.472 3.684A1 1 0 0112.42 3h3.28a2 2 0 012 2v1a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                      </svg>
                      Call Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No products found.
          </div>
        )}
      </div>
    </>
  );
}