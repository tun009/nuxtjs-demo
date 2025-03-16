<template>
  <div class="ckeditor-container">
    <textarea :id="editorId" :value="modelValue" class="hidden"></textarea>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  editorId: {
    type: String,
    default: () => `editor-${Math.random().toString(36).substring(2, 9)}`,
  },
  config: {
    type: Object,
    default: () => ({}),
  },
  height: {
    type: [Number, String],
    default: 300,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "ready", "focus", "blur"]);
const editor = ref(null);

// Mặc định config
const defaultConfig = {
  toolbar: [
    {
      name: "document",
      items: [
        "Source",
        "-",
        "Save",
        "NewPage",
        "Preview",
        "Print",
        "-",
        "Templates",
      ],
    },
    {
      name: "clipboard",
      items: [
        "Cut",
        "Copy",
        "Paste",
        "PasteText",
        "PasteFromWord",
        "-",
        "Undo",
        "Redo",
      ],
    },
    {
      name: "editing",
      items: ["Find", "Replace", "-", "SelectAll", "-", "Scayt"],
    },
    "/",
    {
      name: "basicstyles",
      items: [
        "Bold",
        "Italic",
        "Underline",
        "Strike",
        "Subscript",
        "Superscript",
        "-",
        "RemoveFormat",
      ],
    },
    {
      name: "paragraph",
      items: [
        "NumberedList",
        "BulletedList",
        "-",
        "Outdent",
        "Indent",
        "-",
        "Blockquote",
        "CreateDiv",
        "-",
        "JustifyLeft",
        "JustifyCenter",
        "JustifyRight",
        "JustifyBlock",
      ],
    },
    { name: "links", items: ["Link", "Unlink", "Anchor"] },
    {
      name: "insert",
      items: ["Image", "Table", "HorizontalRule", "SpecialChar"],
    },
    "/",
    { name: "styles", items: ["Styles", "Format", "Font", "FontSize"] },
    { name: "colors", items: ["TextColor", "BGColor"] },
    { name: "tools", items: ["Maximize", "ShowBlocks"] },
  ],
  language: "en",
  height: props.height,
  removePlugins: "elementspath",
  resize_enabled: true,
  extraPlugins: "justify,colorbutton,font",
  contentsCss: ["https://cdn.ckeditor.com/4.25.1/full/contents.css"],
};

// Tải CKEditor từ CDN
const loadCKEditorScript = () => {
  return new Promise((resolve, reject) => {
    if (window.CKEDITOR) {
      resolve(window.CKEDITOR);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.ckeditor.com/4.16.2/standard-all/ckeditor.js";
    script.async = true;
    script.onload = () => resolve(window.CKEDITOR);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Khởi tạo CKEditor
const initCKEditor = () => {
  if (typeof window === "undefined" || !window.CKEDITOR) return;

  // Kết hợp config mặc định và config từ props
  const editorConfig = {
    ...defaultConfig,
    ...props.config,
    readOnly: props.readOnly,
  };

  // Khởi tạo editor
  editor.value = window.CKEDITOR.replace(props.editorId, editorConfig);

  // Xử lý sự kiện thay đổi nội dung
  editor.value.on("change", () => {
    const data = editor.value.getData();
    emit("update:modelValue", data);
  });

  // Xử lý các sự kiện khác
  editor.value.on("instanceReady", (evt) => {
    emit("ready", evt);

    // Cập nhật nội dung ban đầu
    if (props.modelValue) {
      editor.value.setData(props.modelValue);
    }
  });

  editor.value.on("focus", (evt) => {
    emit("focus", evt);
  });

  editor.value.on("blur", (evt) => {
    emit("blur", evt);
  });
};

// Theo dõi thay đổi từ bên ngoài
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value && newValue !== editor.value.getData()) {
      editor.value.setData(newValue);
    }
  }
);

// Theo dõi thay đổi readOnly
watch(
  () => props.readOnly,
  (newValue) => {
    if (editor.value) {
      editor.value.setReadOnly(newValue);
    }
  }
);

// Khởi tạo khi component được mount
onMounted(() => {
  if (process.client) {
    loadCKEditorScript()
      .then(() => {
        initCKEditor();
      })
      .catch((error) => {
        console.error("Failed to load CKEditor:", error);
      });
  }
});

// Dọn dẹp khi component bị hủy
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
    editor.value = null;
  }
});

// Expose editor instance
defineExpose({ editor });
</script>

<style>
.ckeditor-container {
  position: relative;
}

/* Tùy chỉnh giao diện CKEditor */
.cke_chrome {
  border-color: #d1d5db !important;
  border-radius: 0.375rem !important;
}

/* Dark mode support */
.dark .cke_chrome {
  border-color: #4b5563 !important;
  background-color: #1f2937 !important;
}

.dark .cke_top,
.dark .cke_bottom {
  background-color: #374151 !important;
  border-color: #4b5563 !important;
}

.dark .cke_reset_all,
.dark .cke_reset_all * {
  color: #e5e7eb !important;
}

.dark .cke_combo_button {
  background-color: #374151 !important;
  border-color: #4b5563 !important;
}

.dark .cke_button {
  background-color: #374151 !important;
}

.dark .cke_button:hover {
  background-color: #4b5563 !important;
}

.dark .cke_button_on {
  background-color: #4b5563 !important;
}

.dark .cke_dialog_body {
  background-color: #1f2937 !important;
  border-color: #4b5563 !important;
}

.dark .cke_dialog_title {
  background-color: #374151 !important;
  color: #e5e7eb !important;
  border-color: #4b5563 !important;
}

.dark .cke_dialog_footer {
  background-color: #374151 !important;
  border-color: #4b5563 !important;
}

.dark .cke_dialog_tab {
  background-color: #374151 !important;
  color: #e5e7eb !important;
  border-color: #4b5563 !important;
}

.dark .cke_dialog_tab_selected {
  background-color: #4b5563 !important;
}
</style>
