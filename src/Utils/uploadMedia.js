import axios from 'axios';
import { toast } from 'react-toastify';
 export const handleImageUpload = async (imageFile) => {
  if (!imageFile) return "";

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset",import.meta.env.VITE_CLOUDINARY_API_PRESET);  // Replace with your actual preset

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("Image upload failed");
    return "";
  }
};

 