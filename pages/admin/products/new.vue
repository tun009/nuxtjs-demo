<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";

definePageMeta({
  // middleware: ["admin"],
  layout: "admin",
});

// Form data
const product = ref({
  name: "",
  slug: "",
  version: "",
  meta_data: { key: "value" },
  update_url: "",
  download_url: "",
  encrypt_public_key: "",
  encrypt_private_key: "",
  status: "active",
  image: null,
  post: {
    title: "",
    description: "",
    html: "",
    keywords: "",
    show_full_page: true,
  },
});

// Editor instance
const editor = ref(null);
const editorElement = ref(null);

// Khởi tạo CKEditor từ CDN
onMounted(() => {
  // Đảm bảo chỉ chạy ở client-side
  if (process.client) {
    // Tạo script element để load CKEditor từ CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.ckeditor.com/ckeditor5/40.0.0/classic/ckeditor.js';
    script.async = true;
    
    script.onload = () => {
      // Khi script đã load xong, khởi tạo editor
      if (editorElement.value && window.ClassicEditor) {
        window.ClassicEditor
          .create(editorElement.value, {
            toolbar: {
              items: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'outdent',
                'indent',
                '|',
                'imageUpload',
                'blockQuote',
                'insertTable',
                'undo',
                'redo',
              ]
            },
            licenseKey: 'GPL',
          })
          .then(newEditor => {
            editor.value = newEditor;
            
            // Đặt giá trị ban đầu
            editor.value.setData(product.value.post.html);
            
            // Lắng nghe sự kiện thay đổi
            editor.value.model.document.on('change:data', () => {
              product.value.post.html = editor.value.getData();
            });
            
            console.log('CKEditor 5 is ready!', editor.value);
          })
          .catch(error => {
            console.error('Không thể khởi tạo editor:', error);
          });
      }
    };
    
    // Thêm script vào document
    document.head.appendChild(script);
  }
});

// Tạo slug từ tên sản phẩm
const generateSlug = () => {
  if (!product.value.name) return;

  // Chuyển đổi tiếng Việt sang không dấu
  let str = product.value.name;
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Thay thế các ký tự đặc biệt và khoảng trắng
  product.value.slug = str
    .toLowerCase()
    .replace(/[đĐ]/g, "d")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Tự động cập nhật title của post khi thay đổi tên sản phẩm
watch(
  () => product.value.name,
  (newName) => {
    if (!product.value.post.title) {
      product.value.post.title = newName;
    }
  }
);

// Upload image
const fileInput = ref(null);
const previewImage = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    product.value.image = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Submit form
const isSubmitting = ref(false);
const router = useRouter();

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    console.log("Submitting product:", product.value);
    
    // Giả lập API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to products page
    router.push("/admin/products");
  } catch (error) {
    console.error("Error creating product:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Cleanup khi component unmounted
onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy()
      .catch(error => {
        console.error('Lỗi khi hủy editor:', error);
      });
  }
});
</script>

<template>
  <div>
    <div class="flex items-center mb-6">
      <NuxtLink
        to="/admin/products"
        class="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <Icon name="heroicons:arrow-left" class="h-5 w-5" />
      </NuxtLink>
      <h1 class="text-2xl font-bold">Add New Product</h1>
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-medium mb-4">Basic Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Product Name</label
            >
            <input
              id="name"
              v-model="product.name"
              @input="generateSlug"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label
              for="slug"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Slug</label
            >
            <input
              id="slug"
              v-model="product.slug"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="product-slug"
              required
            />
          </div>

          <div>
            <label
              for="version"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Version</label
            >
            <input
              id="version"
              v-model="product.version"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="1.0.0"
              required
            />
          </div>

          <div>
            <label
              for="status"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Status</label
            >
            <select
              id="status"
              v-model="product.status"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label
              for="update_url"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Update URL</label
            >
            <input
              id="update_url"
              v-model="product.update_url"
              type="url"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="https://example.com/update"
            />
          </div>

          <div>
            <label
              for="download_url"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Download URL</label
            >
            <input
              id="download_url"
              v-model="product.download_url"
              type="url"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="https://example.com/download"
            />
          </div>

          <div>
            <label
              for="encrypt_public_key"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Encrypt Public Key</label
            >
            <input
              id="encrypt_public_key"
              v-model="product.encrypt_public_key"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Public key"
            />
          </div>

          <div>
            <label
              for="encrypt_private_key"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Encrypt Private Key</label
            >
            <input
              id="encrypt_private_key"
              v-model="product.encrypt_private_key"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Private key"
            />
          </div>

          <div class="md:col-span-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Product Image</label
            >
            <div
              @click="triggerFileInput"
              class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
            >
              <div class="space-y-1 text-center" v-if="!previewImage">
                <Icon
                  name="heroicons:photo"
                  class="mx-auto h-12 w-12 text-gray-400"
                />
                <div class="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    class="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                  >
                    <span>Upload a file</span>
                    <input
                      ref="fileInput"
                      type="file"
                      class="sr-only"
                      accept="image/*"
                      @change="handleFileUpload"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <div v-else class="relative w-full h-40">
                <img
                  :src="previewImage"
                  class="h-full mx-auto object-contain"
                />
                <button
                  type="button"
                  @click.stop="
                    previewImage = null;
                    product.image = null;
                  "
                  class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-lg"
                >
                  <Icon name="heroicons:x-mark" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Post Information -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-medium mb-4">Product Post Information</h2>
        <div class="space-y-6">
          <div>
            <label
              for="post-title"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Post Title</label
            >
            <input
              id="post-title"
              v-model="product.post.title"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter post title"
              required
            />
          </div>

          <div>
            <label
              for="post-description"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Post Description</label
            >
            <textarea
              id="post-description"
              v-model="product.post.description"
              rows="3"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter post description"
              required
            ></textarea>
          </div>

          <div>
            <label
              for="post-keywords"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Keywords (comma separated)</label
            >
            <input
              id="post-keywords"
              v-model="product.post.keywords"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          <div class="flex items-center">
            <input
              id="show-full-page"
              v-model="product.post.show_full_page"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              for="show-full-page"
              class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >Show as full page</label
            >
          </div>

          <div>
            <label
              for="product-html"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >HTML Content</label
            >
            <div class="ckeditor-container">
              <div 
                ref="editorElement" 
                class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg min-h-[300px]"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="flex justify-end space-x-3">
        <NuxtLink
          to="/admin/products"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          :disabled="isSubmitting"
        >
          <Icon
            v-if="isSubmitting"
            name="heroicons:arrow-path"
            class="h-5 w-5 mr-2 animate-spin"
          />
          <Icon v-else name="heroicons:check" class="h-5 w-5 mr-2" />
          {{ isSubmitting ? "Saving..." : "Save Product" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style>
.ckeditor-container {
  position: relative;
}

/* Đảm bảo editor có chiều cao tối thiểu */
.ck-editor__editable {
  min-height: 300px;
  max-height: 600px;
}
</style>
