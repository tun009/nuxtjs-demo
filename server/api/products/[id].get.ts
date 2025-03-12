export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const { $supabase } = event.context;

  // Mock data for testing - Replace this with your actual database query
  const products = {
    1: {
      id: 1,
      name: "Windows 11 Pro",
      description: "Get the latest Windows 11 Pro with advanced security features and professional tools for your business.",
      price: 199.99,
      license: "Lifetime License",
      image: "https://images.unsplash.com/photo-1624571409108-e9d2d79ca266",
      features: [
        "Advanced Security Features",
        "Professional Tools Suite",
        "Windows Hello Integration",
        "BitLocker Encryption",
        "Remote Desktop Access",
        "Virtual Machine Support"
      ],
      specifications: [
        {
          title: "System Requirements",
          description: "64-bit processor, 4GB RAM, 64GB storage"
        },
        {
          title: "Processor",
          description: "1 gigahertz (GHz) or faster"
        },
        {
          title: "Display",
          description: "720p display or higher"
        },
        {
          title: "Graphics",
          description: "DirectX 12 compatible with WDDM 2.0 driver"
        }
      ]
    },
    2: {
      id: 2,
      name: "Adobe Creative Cloud",
      description: "Access all Adobe creative apps including Photoshop, Illustrator, and more with this complete package.",
      price: 599.99,
      license: "Annual Subscription",
      image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea",
      features: [
        "All Creative Apps Access",
        "100GB Cloud Storage",
        "Adobe Fonts",
        "Adobe Portfolio",
        "Behance Network",
        "Premium Templates"
      ],
      specifications: [
        {
          title: "System Requirements",
          description: "Windows 10 or macOS Catalina, 8GB RAM"
        },
        {
          title: "Storage",
          description: "20GB minimum per app"
        },
        {
          title: "Display",
          description: "1280x800 display"
        },
        {
          title: "Internet",
          description: "Broadband Internet connection"
        }
      ]
    }
  };

  const product = products[id];

  if (!product) {
    throw createError({
      statusCode: 404,
      message: 'Product not found'
    });
  }

  return product;
}); 