export const useProducts = () => {
  const config = useRuntimeConfig();
  
  // Lấy danh sách sản phẩm
  const getProducts = async () => {
    try {
      // Trong thực tế, bạn sẽ gọi API thực tế
      // Đây là dữ liệu giả
      return [
        {
          id: 1,
          name: 'Windows 11 Pro',
          description: 'Windows 11 Pro includes all the features of Windows 11 Home, plus important business functionality for encryption, remote log in, creating virtual machines, and more.',
          price: 199.99,
          image: '/images/products/windows11.jpg',
          category: 'Operating System',
          rating: 4.5,
          inStock: true
        },
        {
          id: 2,
          name: 'Adobe Creative Cloud',
          description: 'Adobe Creative Cloud gives you the world\'s best creative apps and services so you can make anything you can imagine, wherever you\'re inspired.',
          price: 52.99,
          image: '/images/products/adobe-cc.jpg',
          category: 'Design Software',
          rating: 4.8,
          inStock: true
        },
        {
          id: 3,
          name: 'Microsoft Office 365',
          description: 'Microsoft 365 is the productivity cloud designed to help you pursue your passion and run your business. Get all the premium apps, 1 TB of cloud storage.',
          price: 99.99,
          image: '/images/products/office365.jpg',
          category: 'Productivity Software',
          rating: 4.7,
          inStock: true
        }
      ];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };
  
  // Lấy thông tin chi tiết sản phẩm
  const getProductById = async (id: number | string) => {
    try {
      // Trong thực tế, bạn sẽ gọi API thực tế
      // Đây là dữ liệu giả
      const products = [
        {
          id: 1,
          name: 'Windows 11 Pro',
          description: 'Windows 11 Pro includes all the features of Windows 11 Home, plus important business functionality for encryption, remote log in, creating virtual machines, and more.',
          longDescription: 'Windows 11 Pro is designed for hybrid work and learning, with an interface that\'s modern, fresh, clean and beautiful, bringing you a sense of calm and ease. Windows 11 Pro provides a zero-trust ready operating system to protect data and access across devices. New Windows 11 features like snap layouts, desktops, and a new more-intuitive redocking experience help you multitask and optimize your screen real estate. Chat from Microsoft Teams integrated into the taskbar provides a faster way to connect to the people you care about. Widgets, a new personalized feed powered by AI, provides a faster way to access the information you care about.',
          price: 199.99,
          image: '/images/products/windows11.jpg',
          category: 'Operating System',
          rating: 4.5,
          inStock: true,
          specifications: [
            { name: 'Processor', value: '1 gigahertz (GHz) or faster with 2 or more cores on a compatible 64-bit processor' },
            { name: 'RAM', value: '4 gigabyte (GB)' },
            { name: 'Storage', value: '64 GB or larger storage device' },
            { name: 'System firmware', value: 'UEFI, Secure Boot capable' },
            { name: 'TPM', value: 'Trusted Platform Module (TPM) version 2.0' },
            { name: 'Graphics card', value: 'Compatible with DirectX 12 or later with WDDM 2.0 driver' },
            { name: 'Display', value: 'High definition (720p) display that is greater than 9" diagonally, 8 bits per color channel' }
          ]
        },
        {
          id: 2,
          name: 'Adobe Creative Cloud',
          description: 'Adobe Creative Cloud gives you the world\'s best creative apps and services so you can make anything you can imagine, wherever you\'re inspired.',
          longDescription: 'Creative Cloud is a collection of 20+ desktop and mobile apps and services for photography, design, video, web, UX, and more. Now you can take your ideas to new places with Photoshop on the iPad, draw and paint with Adobe Fresco, and design for 3D and AR. Join our global creative community — and make something better together.',
          price: 52.99,
          image: '/images/products/adobe-cc.jpg',
          category: 'Design Software',
          rating: 4.8,
          inStock: true,
          specifications: [
            { name: 'Operating System', value: 'Windows 10 (64-bit) version 1909 or later; macOS Mojave (version 10.14) or later' },
            { name: 'Processor', value: 'Intel or AMD processor with 64-bit support; 2 GHz or faster processor' },
            { name: 'RAM', value: '8 GB of RAM (16 GB recommended)' },
            { name: 'Hard disk space', value: '4 GB of available hard-disk space; additional free space required during installation' },
            { name: 'Monitor resolution', value: '1280 x 800 display at 100% UI scaling' },
            { name: 'GPU', value: 'OpenGL 2.0-capable system' },
            { name: 'Internet', value: 'Internet connection and registration are necessary for required software activation' }
          ]
        },
        {
          id: 3,
          name: 'Microsoft Office 365',
          description: 'Microsoft 365 is the productivity cloud designed to help you pursue your passion and run your business. Get all the premium apps, 1 TB of cloud storage.',
          longDescription: 'Microsoft 365 is a subscription that includes the most collaborative, up-to-date features in one seamless, integrated experience. Microsoft 365 includes the robust Office desktop apps that you\'re familiar with, like Word, PowerPoint, and Excel. You also get extra online storage and cloud-connected features that let you collaborate on files in real time. With a subscription, you\'ll always have the latest features, fixes, and security updates along with ongoing tech support at no extra cost. You can choose to pay for your subscription on a monthly or yearly basis, and the Microsoft 365 Family plan lets you share your subscription with your family for up to 6 people, and use your apps on multiple PCs, Macs, tablets, and phones.',
          price: 99.99,
          image: '/images/products/office365.jpg',
          category: 'Productivity Software',
          rating: 4.7,
          inStock: true,
          specifications: [
            { name: 'Operating System', value: 'Windows 11, Windows 10, Windows 8.1, Windows Server 2019, or Windows Server 2016' },
            { name: 'Computer and processor', value: '1.6 GHz or faster, 2-core' },
            { name: 'Memory', value: '4 GB RAM; 2 GB RAM (32-bit)' },
            { name: 'Hard disk', value: '4 GB of available disk space' },
            { name: 'Display', value: '1280 x 768 screen resolution' },
            { name: 'Graphics', value: 'Graphics hardware acceleration requires DirectX 9 or later' },
            { name: 'Internet connection', value: 'Internet functionality requires an internet connection' }
          ]
        }
      ];
      
      return products.find(product => product.id === Number(id)) || null;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      return null;
    }
  };
  
  // Lấy danh sách gói license cho sản phẩm
  const getProductPackages = async (productId: number | string) => {
    try {
      // Trong thực tế, bạn sẽ gọi API thực tế
      // Đây là dữ liệu giả
      const packages = {
        1: [ // Windows 11 Pro
          {
            id: 1,
            name: 'Single License',
            description: 'License for 1 PC, lifetime validity',
            price: 199.99,
            duration: 'Lifetime',
            deviceLimit: 1
          },
          {
            id: 2,
            name: 'Family Pack',
            description: 'License for up to 3 PCs, lifetime validity',
            price: 299.99,
            duration: 'Lifetime',
            deviceLimit: 3
          },
          {
            id: 3,
            name: 'Business License',
            description: 'License for up to 10 PCs, lifetime validity with priority support',
            price: 899.99,
            duration: 'Lifetime',
            deviceLimit: 10
          }
        ],
        2: [ // Adobe Creative Cloud
          {
            id: 4,
            name: 'Monthly Subscription',
            description: 'Full access to all apps, monthly billing',
            price: 52.99,
            duration: '1 Month',
            deviceLimit: 2
          },
          {
            id: 5,
            name: 'Annual Subscription',
            description: 'Full access to all apps, annual billing (save 16%)',
            price: 599.99,
            duration: '1 Year',
            deviceLimit: 2
          },
          {
            id: 6,
            name: 'Student & Teacher',
            description: 'Full access to all apps for students and teachers, annual billing',
            price: 239.99,
            duration: '1 Year',
            deviceLimit: 2
          }
        ],
        3: [ // Microsoft Office 365
          {
            id: 7,
            name: 'Personal',
            description: 'For 1 person, includes premium Office apps, 1TB cloud storage',
            price: 69.99,
            duration: '1 Year',
            deviceLimit: 5
          },
          {
            id: 8,
            name: 'Family',
            description: 'For up to 6 people, includes premium Office apps, 1TB cloud storage per person',
            price: 99.99,
            duration: '1 Year',
            deviceLimit: 30
          },
          {
            id: 9,
            name: 'Business Standard',
            description: 'For businesses, includes premium Office apps, email, and Microsoft Teams',
            price: 12.50,
            duration: '1 Month per user',
            deviceLimit: 5
          }
        ]
      };
      
      return packages[productId as keyof typeof packages] || [];
    } catch (error) {
      console.error(`Error fetching packages for product ${productId}:`, error);
      return [];
    }
  };
  
  return {
    getProducts,
    getProductById,
    getProductPackages
  };
}; 