import React, { useState, useEffect } from "react";
import { BASE_URL, userId } from "../../constants/config";
import { uploadImage } from "../../firebaseConfig";

const MAX_IMAGES = 4;

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    condition: "",
    price: "",
    location: "",
    images: [],
    tags: "", // Tags added here
  });

  const [categories, setCategories] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    category: "",
    condition: "",
    mediafiles: "",
  });

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(BASE_URL + "product-categories");
      const data = await response.json();
      if (data.status === 200) {
        setCategories(data.data); // Populate categories
      } else {
        alert("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch conditions from API
  useEffect(() => {
    const fetchConditions = async () => {
      const response = await fetch(BASE_URL + "product-conditions");
      const data = await response.json();
      if (data.status === 200) {
        setConditions(data.data); // Populate conditions
      } else {
        alert("Failed to fetch conditions.");
      }
    };
    fetchConditions();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length <= MAX_IMAGES) {
      setFormData({ ...formData, images: [...formData.images, ...files] });
    } else {
      alert("You can upload a maximum of 4 images.");
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Process the tags as an array (split by commas)
    const tagsArray = formData.tags.split(",").map((tag) => tag.trim());

    // Upload images to Firebase Storage and get their URLs
    const imageUrls = await uploadImage(formData.images);

    // Check if imageUrls is an array before using it
    if (!Array.isArray(imageUrls)) {
      console.error("imageUrls is not an array:", imageUrls);
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
      created_by_id: userId, // Assuming the logged-in user ID is available
      mediafiles: imageUrls.map((url) => ({ file_path: url })),
      tags: tagsArray, // Add tags as an array
    };

    try {
      const response = await fetch(BASE_URL + "listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Product created successfully!");
      } else {
        // Handle validation errors and show them
        const errors = data.errors || [];
        const errorMessages = {
          category: errors.find((error) => error.path === "category_id")?.msg || "",
          condition: errors.find((error) => error.path === "product_condition_id")?.msg || "",
          mediafiles: errors.find((error) => error.path === "mediafiles")?.msg || "",
        };
        setErrorMessages(errorMessages); // Update error messages
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Something went wrong while creating the product!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-black tracking-tight">
            Create Product
          </h2>
          <p className="mt-2 text-gray-600 text-lg">Fill in the details to list your item</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your product"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Category and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option>Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errorMessages.category && <p className="text-red-500 text-sm">{errorMessages.category}</p>}
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                  Condition
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option>Select Condition</option>
                  {conditions.map((condition) => (
                    <option key={condition.id} value={condition.id}>
                      {condition.name}
                    </option>
                  ))}
                </select>
                {errorMessages.condition && <p className="text-red-500 text-sm">{errorMessages.condition}</p>}
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
                  id="price"
                  name="price"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                id="tags"
                name="tags"
                placeholder="Enter tags separated by commas"
                value={formData.tags}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <p className="mt-2 text-xs text-gray-500">Add tags separated by commas (e.g. "phone, camera, electronics")</p>
            </div>

            {/* Image Uploads */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((image, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:border-blue-500 transition-colors duration-200"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt="preview"
                      className="object-cover w-full h-full rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                      onClick={() => handleRemoveImage(i)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                {formData.images.length < MAX_IMAGES && (
                  <div className="relative aspect-square rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:border-blue-500 transition-colors duration-200">
                    <label className="cursor-pointer w-full h-full flex flex-col justify-center items-center text-gray-400 hover:text-blue-500 transition-colors duration-200">
                      <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs">Add Image</span>
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
              <p className="mt-2 text-sm text-gray-500 text-center">Upload up to 4 images</p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 text-white font-medium rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
