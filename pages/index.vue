<template>
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center">
      <!-- Background Effects -->
      <div
        class="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-20"
      ></div>
      <div
        class="absolute inset-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent"
      ></div>

      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Hero Content -->
          <div class="relative z-10">
            <h1 class="text-5xl lg:text-7xl font-bold mb-6">
              <span
                class="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-primary-400 to-neon-purple"
              >
                {{ $t("home.hero.title") }}
              </span>
            </h1>
            <p class="text-gray-300 text-lg lg:text-xl mb-8 max-w-2xl">
              {{ $t("home.hero.subtitle") }}
            </p>
            <div class="flex flex-wrap gap-4">
              <NuxtLink
                to="/products"
                class="px-8 py-4 bg-primary-500 hover:bg-primary-400 text-white rounded-lg transform hover:-translate-y-1 transition-all duration-200 shadow-[0_0_15px_rgba(0,115,245,0.5)] hover:shadow-[0_0_25px_rgba(0,115,245,0.8)]"
              >
                {{ $t("home.hero.browseProducts") }}
              </NuxtLink>
              <NuxtLink
                to="/contact"
                class="px-8 py-4 border border-primary-500/50 hover:border-primary-400 text-white rounded-lg transform hover:-translate-y-1 transition-all duration-200 hover:bg-primary-500/10"
              >
                {{ $t("home.hero.contactUs") }}
              </NuxtLink>
            </div>
          </div>

          <!-- Hero Image -->
          <div class="relative group animate-float">
            <div class="relative rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Hero Image"
                class="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"
              ></div>
            </div>
            <!-- Glow Effect -->
            <div
              class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-neon-purple opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 relative" :class="colorMode.value === 'dark' ? 'bg-gray-900' : 'bg-gray-50'">
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4" :class="colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'">
            <span class="text-blue-500">Why</span> Choose Us
          </h2>
          <p :class="[
            colorMode.value === 'dark' 
              ? 'text-gray-300' 
              : 'text-gray-700'
          ]" class="text-lg max-w-2xl mx-auto">
            {{ $t("home.features.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="group p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
            :class="[
              colorMode.value === 'dark' 
                ? 'shadow-[0_0_20px_rgba(0,115,245,0.2)]' 
                : 'shadow-lg bg-white'
            ]"
            :style="{
              backgroundColor: colorMode.value === 'dark' 
                ? 'rgba(17, 24, 39, 0.7)' 
                : '',
              borderLeft: `4px solid ${getFeatureColor(index)}`
            }"
          >
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all group-hover:scale-110"
              :style="{
                backgroundColor: `${getFeatureColor(index)}20`,
                color: getFeatureColor(index)
              }"
            >
              <Icon :name="feature.icon" class="w-6 h-6" :style="{ color: getFeatureColor(index) }" />
            </div>
            <h3
              class="text-xl font-semibold mb-2 transition-colors"
              :class="[
                colorMode.value === 'dark' 
                  ? 'text-white group-hover:text-primary-400' 
                  : 'text-gray-900'
              ]"
              :style="{ color: colorMode.value === 'light' ? getFeatureColor(index) : '' }"
            >
              {{ feature.title }}
            </h3>
            <p :class="[
              colorMode.value === 'dark' 
                ? 'text-gray-400' 
                : 'text-gray-700'
            ]">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-20 relative overflow-hidden" :class="colorMode.value === 'dark' ? '' : 'bg-white'">
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">
            <span :class="colorMode.value === 'dark' 
              ? 'bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-primary-400'
              : 'text-gray-900'">
              Our <span class="text-blue-500">Products</span>
            </span>
          </h2>
          <p :class="[
            colorMode.value === 'dark' 
              ? 'text-gray-300' 
              : 'text-gray-700'
          ]" class="text-lg max-w-2xl mx-auto">
            {{ $t('home.featuredProducts.subtitle') }}
          </p>
        </div>

        <!-- Products Carousel -->
        <div class="relative">
          <!-- Navigation Buttons -->
          <button @click="prevSlide" 
                  :class="[
                    colorMode.value === 'dark'
                      ? 'bg-gray-900/50 backdrop-blur-sm border-gray-700/50 text-white hover:bg-primary-500/20 hover:border-primary-500/50'
                      : 'bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                  ]"
                  class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full border transition-all duration-300">
            <Icon name="material-symbols:chevron-left" class="w-8 h-8" />
          </button>
          <button @click="nextSlide"
                  :class="[
                    colorMode.value === 'dark'
                      ? 'bg-gray-900/50 backdrop-blur-sm border-gray-700/50 text-white hover:bg-primary-500/20 hover:border-primary-500/50'
                      : 'bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                  ]"
                  class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full border transition-all duration-300">
            <Icon name="material-symbols:chevron-right" class="w-8 h-8" />
          </button>

          <!-- Carousel -->
          <div class="overflow-hidden">
            <div class="flex transition-transform duration-500 ease-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div v-for="(product, index) in featuredProducts" :key="index" 
                   class="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
                <div class="group overflow-hidden rounded-xl transition-all duration-300"
                     :class="[
                       colorMode.value === 'dark' 
                         ? 'bg-gray-900/80' 
                         : 'bg-white'
                     ]"
                     :style="{ 
                       boxShadow: colorMode.value === 'dark' 
                         ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                         : '0 2px 10px rgba(0, 0, 0, 0.05)'
                     }"
                >
                  <!-- Product Image -->
                  <div class="relative h-48 overflow-hidden">
                    <img :src="product.image" :alt="product.name"
                         class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    
                    <div class="absolute top-0 left-0 w-full h-full" 
                         :style="{
                           background: colorMode.value === 'dark'
                             ? 'linear-gradient(to top, rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 0))'
                             : 'linear-gradient(to top, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))'
                         }"></div>
                  </div>

                  <!-- Product Info -->
                  <div class="p-4">
                    <h3 class="text-xl font-bold mb-2"
                        :class="[
                          colorMode.value === 'dark' 
                            ? 'text-white' 
                            : 'text-gray-900'
                        ]">
                      {{ product.name }}
                    </h3>
                    <p :class="[
                      colorMode.value === 'dark' 
                        ? 'text-gray-300 mb-4' 
                        : 'text-gray-700 mb-4'
                    ]" class="line-clamp-2 text-sm">
                      {{ product.description }}
                    </p>
                    
                    <!-- Price and Action -->
                    <div class="flex items-center justify-between mt-auto">
                      <span class="text-xl font-bold"
                            :class="colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'">
                        ${{ product.price }}
                      </span>
                      <NuxtLink :to="'/products/' + product.id"
                                :class="[
                                  colorMode.value === 'dark'
                                    ? 'bg-blue-600 hover:bg-blue-500'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                ]"
                                class="px-4 py-1 text-white rounded-md text-sm transition-colors">
                        Learn More
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dots Navigation -->
          <div class="flex justify-center mt-8 gap-2">
            <button v-for="(_, index) in Math.ceil(featuredProducts.length / slidesPerView)" :key="index"
                    @click="goToSlide(index)"
                    class="w-2 h-2 rounded-full transition-all duration-300"
                    :class="currentSlide === index ? 'bg-blue-500 w-6' : 'bg-gray-400 hover:bg-gray-500'">
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-20 relative" :class="colorMode.value === 'dark' ? 'bg-gray-900' : 'bg-gray-50'">
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4" :class="colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'">
            How It <span class="text-blue-500">Works</span>
          </h2>
          <p :class="[
            colorMode.value === 'dark' 
              ? 'text-gray-300' 
              : 'text-gray-700'
          ]" class="text-lg max-w-2xl mx-auto">
            Get started with our software in three simple steps
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="relative group overflow-hidden rounded-xl transition-all duration-300 transform hover:-translate-y-2"
            :class="[
              colorMode.value === 'dark' 
                ? '' 
                : 'bg-white shadow-lg'
            ]"
          >
            <div
              v-if="colorMode.value === 'dark'"
              class="absolute -inset-1 opacity-70 transition-opacity duration-500 rounded-xl blur-sm group-hover:opacity-100"
              :style="{ background: `linear-gradient(45deg, ${getFeatureColor(index)}, ${getFeatureColor(index+1)})` }"
            ></div>
            <div
              class="relative p-8 rounded-xl overflow-hidden backdrop-blur-sm"
              :class="[
                colorMode.value === 'dark' 
                  ? 'bg-gray-900/60' 
                  : ''
              ]"
            >
              <div
                class="w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto transition-transform group-hover:scale-110 group-hover:rotate-12"
                :style="{ 
                  background: `linear-gradient(135deg, ${getFeatureColor(index)}40, ${getFeatureColor(index)}10)`,
                  border: `2px solid ${getFeatureColor(index)}`
                }"
              >
                <span 
                  class="text-2xl font-bold"
                  :style="{ color: getFeatureColor(index) }"
                >{{ index + 1 }}</span>
              </div>
              <h3 
                class="text-xl font-semibold mb-3 text-center"
                :class="[
                  colorMode.value === 'dark' 
                    ? 'text-white' 
                    : 'text-gray-900'
                ]"
              >
                {{ step.title }}
              </h3>
              <p 
                :class="[
                  colorMode.value === 'dark' 
                    ? 'text-gray-300' 
                    : 'text-gray-700'
                ]"
                class="text-center"
              >
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 relative">
      <div
        class="absolute inset-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent"
      ></div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl font-bold mb-6">
            <span
              class="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-primary-400"
            >
              {{ $t("home.cta.title") }}
            </span>
          </h2>
          <p class="text-gray-300 text-lg mb-8">
            {{ $t("home.cta.subtitle") }}
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink
              to="/products"
              class="px-8 py-4 bg-primary-500 hover:bg-primary-400 text-white rounded-lg transform hover:-translate-y-1 transition-all duration-200 shadow-[0_0_15px_rgba(0,115,245,0.5)] hover:shadow-[0_0_25px_rgba(0,115,245,0.8)]"
            >
              {{ $t("home.cta.browseProducts") }}
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="px-8 py-4 border border-primary-500/50 hover:border-primary-400 text-white rounded-lg transform hover:-translate-y-1 transition-all duration-200 hover:bg-primary-500/10"
            >
              {{ $t("home.cta.contactUs") }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
const colorMode = useColorMode();

// Function to get color for features
const featureColors = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#8B5CF6', // violet-500
  '#F59E0B', // amber-500
  '#EC4899', // pink-500
  '#06B6D4'  // cyan-500
];

const getFeatureColor = (index: number) => {
  return featureColors[index % featureColors.length];
};

const features = [
  {
    icon: "material-symbols:verified",
    title: "Genuine Software",
    description:
      "All our licenses are genuine and come directly from official software publishers.",
  },
  {
    icon: "material-symbols:bolt",
    title: "Instant Delivery",
    description: "Get your license key immediately after purchase via email.",
  },
  {
    icon: "material-symbols:support-agent",
    title: "24/7 Support",
    description:
      "Our dedicated support team is always ready to help you with any issues.",
  },
  {
    icon: "material-symbols:security",
    title: "Secure Payment",
    description:
      "Your transactions are protected with industry-standard encryption.",
  },
  {
    icon: "material-symbols:update",
    title: "Free Updates",
    description:
      "Enjoy free software updates for the duration of your license.",
  },
  {
    icon: "material-symbols:money-back",
    title: "Money Back Guarantee",
    description: `30-day money-back guarantee if you're not satisfied.`,
  },
];

const steps = [
  {
    title: "Choose Your Software",
    description:
      "Browse our wide selection of premium software and choose the one that fits your needs.",
  },
  {
    title: "Complete Purchase",
    description: "Make a secure payment using your preferred payment method.",
  },
  {
    title: "Start Using",
    description:
      "Receive your license key instantly and start using your software right away.",
  },
];

// Featured Products Data
const featuredProducts = [
  {
    id: 1,
    name: "Windows 11 Pro",
    description: "Get the latest Windows 11 Pro with advanced security features and professional tools for your business.",
    price: 199.99,
    category: "Operating System",
    rating: 4.8,
    reviews: 1250,
    image: "https://images.unsplash.com/photo-1624571409108-e9d2d79ca266?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Adobe Creative Cloud",
    description: "Access all Adobe creative apps including Photoshop, Illustrator, and more with this complete package.",
    price: 599.99,
    category: "Design",
    rating: 4.9,
    reviews: 3420,
    image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Microsoft Office 365",
    description: "Complete suite of productivity tools including Word, Excel, PowerPoint, and more.",
    price: 99.99,
    category: "Productivity",
    rating: 4.7,
    reviews: 5280,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "AutoCAD 2024",
    description: "Professional CAD software for 2D and 3D design and drafting.",
    price: 1499.99,
    category: "Engineering",
    rating: 4.8,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Norton 360 Deluxe",
    description: "Complete antivirus protection for all your devices with VPN and dark web monitoring.",
    price: 89.99,
    category: "Security",
    rating: 4.6,
    reviews: 2150,
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Visual Studio Enterprise",
    description: "Ultimate IDE for developing applications across all platforms.",
    price: 799.99,
    category: "Development",
    rating: 4.9,
    reviews: 1820,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

// Carousel Logic
const currentSlide = ref(0);
const windowWidth = ref(process.client ? window.innerWidth : 1024);

// Responsive slides per view
const slidesPerView = computed(() => {
  if (windowWidth.value < 640) return 1; // Mobile
  if (windowWidth.value < 1024) return 2; // Tablet
  return 3; // Desktop
});

// Update window width on resize
onMounted(() => {
  if (process.client) {
    window.addEventListener('resize', () => {
      windowWidth.value = window.innerWidth;
    });
  }
});

// Navigation methods
const nextSlide = () => {
  const maxSlides = Math.ceil(featuredProducts.length / slidesPerView.value) - 1;
  currentSlide.value = currentSlide.value >= maxSlides ? 0 : currentSlide.value + 1;
};

const prevSlide = () => {
  const maxSlides = Math.ceil(featuredProducts.length / slidesPerView.value) - 1;
  currentSlide.value = currentSlide.value <= 0 ? maxSlides : currentSlide.value - 1;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

// Auto-play carousel
let autoplayInterval: NodeJS.Timeout;

onMounted(() => {
  autoplayInterval = setInterval(nextSlide, 5000);
});

onUnmounted(() => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
});
</script>
