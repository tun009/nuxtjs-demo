import { ref, watch } from 'vue';

interface CartItem {
  id: number;
  productId: number;
  packageId: number;
  name: string;
  packageName: string;
  price: number;
  quantity: number;
  image?: string;
}

export const useCart = () => {
  const cart = ref<CartItem[]>([]);
  const isCartOpen = ref(false);
  
  // Khởi tạo giỏ hàng từ localStorage (nếu có)
  if (process.client) {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        cart.value = JSON.parse(savedCart);
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
      }
    }
  }
  
  // Lưu giỏ hàng vào localStorage khi có thay đổi
  watch(cart, (newCart) => {
    if (process.client) {
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  }, { deep: true });
  
  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItem = cart.value.find(
      cartItem => cartItem.productId === item.productId && cartItem.packageId === item.packageId
    );
    
    if (existingItem) {
      // Nếu đã có, tăng số lượng
      existingItem.quantity += 1;
    } else {
      // Nếu chưa có, thêm mới
      cart.value.push({
        ...item,
        quantity: 1
      });
    }
    
    // Mở giỏ hàng
    isCartOpen.value = true;
  };
  
  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id: number) => {
    const index = cart.value.findIndex(item => item.id === id);
    if (index !== -1) {
      cart.value.splice(index, 1);
    }
  };
  
  // Cập nhật số lượng sản phẩm
  const updateQuantity = (id: number, quantity: number) => {
    const item = cart.value.find(item => item.id === id);
    if (item) {
      if (quantity <= 0) {
        // Nếu số lượng <= 0, xóa sản phẩm
        removeFromCart(id);
      } else {
        // Cập nhật số lượng
        item.quantity = quantity;
      }
    }
  };
  
  // Tính tổng tiền
  const getTotal = () => {
    return cart.value.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    cart.value = [];
  };
  
  // Đóng/mở giỏ hàng
  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value;
  };
  
  return {
    cart,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotal,
    clearCart,
    toggleCart
  };
}; 