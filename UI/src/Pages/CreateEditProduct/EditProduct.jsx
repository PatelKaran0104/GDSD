import React, { useState, useEffect } from "react";
import { BASE_URL, userId } from "../../constants/config";
import { useParams } from "react-router-dom";
import { uploadImage } from "../../firebaseConfig";

const MAX_IMAGES = 4;

const EditProduct = () => {
  const { productId } = useParams(); // Access productId from the URL
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    condition: "",
    price: "",
    location: "",
    images: [], // Array to store selected images
    tags: "", // Tags as a comma-separated string
  });

  const [categories, setCategories] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // For loading state

  // Fetch product categories
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(BASE_URL + "product-categories");
      const data = await response.json();
      if (data.status === 200) {
        setCategories(data.data);
      } else {
        alert("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch product conditions
  useEffect(() => {
    const fetchConditions = async () => {
      const response = await fetch(BASE_URL + "product-conditions");
      const data = await response.json();
      if (data.status === 200) {
        setConditions(data.data);
      } else {
        alert("Failed to fetch conditions.");
      }
    };
    fetchConditions();
  }, []);

  // Fetch product data for editing
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}listings?id=${productId}`);
        const data = await response.json();
        if (response.ok) {
          const product = data.data;
          setFormData({
            name: product.title,
            description: product.description,
            category: product.category_id,
            condition: product.product_condition_id,
            price: product.price,
            location: product.location,
            images: product.mediafiles || [], // Assuming mediafiles are an array of image URLs
            tags: product.tags || "", // Assuming product tags are returned as a string
          });
          setIsLoading(false);
        } else {
          alert("Failed to fetch product details.");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        alert("Error fetching product data.");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length <= MAX_IMAGES) {
      setFormData({
        ...formData,
        images: [...formData.images, ...files], // Add selected files to images
      });
    } else {
      alert(`You can upload a maximum of ${MAX_IMAGES} images.`);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Process tags as an array (split by commas)
    const tagsArray = formData.tags.split(",").map((tag) => tag.trim());

    // Upload images to Firebase and get the URLs
    const mediafiles = await uploadImage(formData.images);

    // Check if mediafiles is valid
    if (!Array.isArray(mediafiles)) {
      console.error("mediafiles is not an array:", mediafiles);
      alert("Something went wrong with the image upload.");
      return;
    }

    const productData = {
      title: formData.name,
      description: formData.description,
      category_id: formData.category,
      price: parseFloat(formData.price),
      product_condition_id: formData.condition,
      location: formData.location,
      created_by_id: userId, // Assuming logged-in user ID is available
      mediafiles: mediafiles.map((url) => ({ file_path: url })), // Prepare mediafiles for server
      tags: tagsArray, // Add tags as an array
    };

    try {
      const response = await fetch(`${BASE_URL}listings/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      if (response.status === 200) {
        alert("Product updated successfully!");
      } else {
        alert("Failed to update product: " + data.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Something went wrong while updating the product!");
    }
  };

  // Loading spinner or message
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow-sm space-y-6">
      <h2 className="text-2xl font-bold text-center">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
          rows="3"
          required
        />

        {/* Category and Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
              Condition
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Condition</option>
              {conditions.map((condition) => (
                <option key={condition.id} value={condition.id}>
                  {condition.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Location</option>
              <option value="berlin">Berlin</option>
              <option value="munich">Munich</option>
              <option value="hamburg">Hamburg</option>
            </select>
          </div>
        </div>

        {/* Tags Input */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
          <input
            type="text"
            name="tags"
            placeholder="Enter tags separated by commas"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
          />
          <p className="mt-2 text-xs text-gray-500">Add tags separated by commas (e.g. "phone, camera, electronics")</p>
        </div>

        {/* Image Uploads */}
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2">
            {formData.images.map((image, i) => (
              <div
                key={i}
                className="relative border w-20 h-20 rounded flex items-center justify-center overflow-hidden bg-gray-50"
              >
                {/* Local image preview */}
                {image instanceof File ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img
                    src={image.file_path || image} // Use the file_path if it's a remote image
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                )}

                {/* Remove image button */}
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1"
                  onClick={() => handleRemoveImage(i)}
                >
                  ×
                </button>
              </div>
            ))}

            {/* Add Image Button */}
            {formData.images.length < MAX_IMAGES && (
              <div className="relative aspect-square rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:border-blue-500 transition-colors duration-200">
                <label className="cursor-pointer w-full h-full flex flex-col justify-center items-center text-gray-400 hover:text-blue-500 transition-colors duration-200">
                  +
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 text-center">(up to 4 images)</p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
