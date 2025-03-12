export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const { $supabase } = event.context;

  // Mock data for testing - Replace this with your actual database query
  const productPackages = {
    1: [
      {
        id: 1,
        product_id: 1,
        name: "Personal License",
        price: 199.99,
        price_unit: "lifetime",
        limit_devices: 1,
        time_of_use: "Lifetime",
        is_active: true,
        status: "active"
      },
      {
        id: 2,
        product_id: 1,
        name: "Professional License",
        price: 299.99,
        price_unit: "lifetime",
        limit_devices: 5,
        time_of_use: "Lifetime",
        is_active: true,
        status: "active"
      },
      {
        id: 3,
        product_id: 1,
        name: "Enterprise License",
        price: 999.99,
        price_unit: "lifetime",
        limit_devices: "Unlimited",
        time_of_use: "Lifetime",
        is_active: true,
        status: "active"
      }
    ],
    2: [
      {
        id: 4,
        product_id: 2,
        name: "Monthly Plan",
        price: 52.99,
        price_unit: "month",
        limit_devices: 2,
        time_of_use: "1 Month",
        is_active: true,
        status: "active"
      },
      {
        id: 5,
        product_id: 2,
        name: "Annual Plan",
        price: 599.99,
        price_unit: "year",
        limit_devices: 2,
        time_of_use: "1 Year",
        is_active: true,
        status: "active"
      },
      {
        id: 6,
        product_id: 2,
        name: "Team Plan",
        price: 1299.99,
        price_unit: "year",
        limit_devices: 5,
        time_of_use: "1 Year",
        is_active: true,
        status: "active"
      }
    ]
  };

  const packages = productPackages[id];

  if (!packages) {
    throw createError({
      statusCode: 404,
      message: 'Packages not found for this product'
    });
  }

  return packages;
}); 