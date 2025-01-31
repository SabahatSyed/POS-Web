import axios from "axios";
export async function uploadImageToCloudinary(file: any) {
  console.log("sdsaf", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "preset1"); // Replace with your actual upload preset
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
        //   "Content-Type": "multipart/form-data",
          'X-Requested-With': 'XMLHttpRequest', // Optional, can help resolve CORS issues
        },
      }
    );
    return response.data.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
}
