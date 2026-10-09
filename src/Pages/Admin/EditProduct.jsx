import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
    getProductById,
    updateProduct
} from "../../api/productApi";

import { uploadImage } from "../../api/uploadApi";

import "./AddProduct.css";


function EditProduct() {

    const { id } = useParams();


    // =========================================
    // PRODUCT FORM
    // =========================================

    const [formData, setFormData] = useState({

        name: "",
        price: "",
        category: "1",
        subcategory_id: "",
        description: "",
        stock: ""

    });


    // =========================================
    // IMAGES
    // Existing image = URL string
    // New image = File object
    // =========================================

    const [images, setImages] = useState([]);


    // =========================================
    // UPLOADED URLS
    // =========================================

    const [uploadedUrls, setUploadedUrls] = useState([]);


    // =========================================
    // UPLOAD STATUS
    // =========================================

    const [uploadStatus, setUploadStatus] = useState([]);


    // =========================================
    // SUBCATEGORIES
    // =========================================

    const subcategories = {

        1: [
            { id: 1, name: "Running" },
            { id: 2, name: "Sneakers" },
            { id: 3, name: "Formal" }
        ],

        2: [
            { id: 8, name: "Running" },
            { id: 5, name: "Heels" },
            { id: 6, name: "Flats" }
        ]

    };


    // =========================================
    // GET PRODUCT
    // =========================================

    useEffect(() => {

        getProductById(id)
            .then((response) => {

                const product = response.data;

                console.log(
                    "EDIT PRODUCT:",
                    product
                );


                setFormData({

                    name: product.name || "",

                    price: product.price || "",

                    category:
                        product.Subcategory?.Category?.id?.toString() || "1",

                    subcategory_id:
                        product.subcategory_id?.toString() || "",

                    description:
                        product.description || "",

                    stock:
                        product.stock ?? ""

                });


                // Get existing images

                const existingImages =
                    product.images?.map(
                        (item) => item.image_url
                    ) || [];


                setImages(existingImages);

                setUploadedUrls(existingImages);

                setUploadStatus(
                    existingImages.map(() => true)
                );

            })
            .catch((error) => {

                console.error(
                    "GET PRODUCT ERROR:",
                    error
                );

            });

    }, [id]);


    // =========================================
    // NORMAL INPUT CHANGE
    // =========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,
            [name]: value

        }));

    };


    // =========================================
    // CATEGORY CHANGE
    // =========================================

    const handleCategoryChange = (e) => {

        const selectedCategory =
            e.target.value;


        setFormData((prev) => ({

            ...prev,

            category: selectedCategory,

            subcategory_id: ""

        }));

    };


    // =========================================
    // ADD NEW IMAGES
    // =========================================

    const handleImageChange = (e) => {

        const selectedFiles =
            Array.from(e.target.files);


        if (selectedFiles.length === 0) {

            return;

        }


        setImages((prev) => {

            const totalImages =
                prev.length + selectedFiles.length;


            if (totalImages > 5) {

                alert(
                    "You can have maximum 5 images"
                );

                return prev;

            }


            return [
                ...prev,
                ...selectedFiles
            ];

        });


        // New images are not uploaded yet

        setUploadedUrls([]);

        setUploadStatus([]);


        // Allow selecting same file again

        e.target.value = "";

    };


    // =========================================
    // CHANGE INDIVIDUAL IMAGE
    // =========================================

    const handleIndividualImageChange = (
        e,
        index
    ) => {

        const file =
            e.target.files[0];


        if (!file) {

            return;

        }


        setImages((prev) => {

            const updated =
                [...prev];

            updated[index] = file;

            return updated;

        });


        // Previous uploaded URLs are no longer valid

        setUploadedUrls([]);

        setUploadStatus([]);


        e.target.value = "";

    };


    // =========================================
    // REMOVE INDIVIDUAL IMAGE
    // =========================================

    const removeImage = (index) => {

        setImages((prev) => {

            return prev.filter(
                (_, i) => i !== index
            );

        });


        // Reset upload information

        setUploadedUrls([]);

        setUploadStatus([]);

    };


    // =========================================
    // UPLOAD ALL IMAGES
    // =========================================

    const handleUpload = async () => {

        // Minimum 3 images

        if (images.length < 3) {

            alert(
                "Please have at least 3 images"
            );

            return;

        }


        try {

            const urls = [];


            // Process every image

            for (const image of images) {


                // =================================
                // EXISTING CLOUDINARY IMAGE
                // =================================

                if (typeof image === "string") {

                    urls.push(image);

                    continue;

                }


                // =================================
                // NEW IMAGE FILE
                // =================================

                const response =
                    await uploadImage(image);


                urls.push(
                    response.data.imageUrl
                );

            }


            console.log(
                "FINAL IMAGE URLS:",
                urls
            );


            setUploadedUrls(urls);

            setUploadStatus(
                urls.map(() => true)
            );


            alert(
                `${urls.length} images uploaded successfully!`
            );

        } catch (error) {

            console.error(
                "IMAGE UPLOAD ERROR:",
                error
            );


            alert(
                "Image upload failed"
            );

        }

    };


    // =========================================
    // UPDATE PRODUCT
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // =================================
        // CHECK MINIMUM IMAGES
        // =================================

        if (images.length < 3) {

            alert(
                "Please add at least 3 images"
            );

            return;

        }


        // =================================
        // CHECK MAXIMUM IMAGES
        // =================================

        if (images.length > 5) {

            alert(
                "Maximum 5 images are allowed"
            );

            return;

        }


        // =================================
        // CHECK UPLOAD
        // =================================

        if (
            uploadedUrls.length !==
            images.length
        ) {

            alert(
                "Please click Upload before updating"
            );

            return;

        }


        try {

            const productData = {

                name:
                    formData.name,

                price:
                    formData.price,

                subcategory_id:
                    formData.subcategory_id,

                description:
                    formData.description,

                stock:
                    formData.stock,

                images:
                    uploadedUrls

            };


            console.log(
                "UPDATE DATA:",
                productData
            );


            const response =
                await updateProduct(
                    id,
                    productData
                );


            console.log(
                "PRODUCT UPDATED:",
                response.data
            );


            alert(
                "Product updated successfully!"
            );


        } catch (error) {

            console.error(
                "UPDATE ERROR:",
                error
            );


            console.log(
                "STATUS:",
                error.response?.status
            );


            console.log(
                "MESSAGE:",
                error.response?.data?.message
            );


            alert(
                error.response?.data?.message ||
                "Update failed"
            );

        }

    };


    // =========================================
    // UI
    // =========================================

    return (

        <div>

            <form onSubmit={handleSubmit}>


                {/* =================================
                    PRODUCT NAME
                ================================= */}

                <div className="form-group">

                    <label>
                        Product Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                </div>


                {/* =================================
                    PRICE
                ================================= */}

                <div className="form-group">

                    <label>
                        Price
                    </label>

                    <input
                        type="number"
                        min="0"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />

                </div>


                {/* =================================
                    CATEGORY
                ================================= */}

                <div className="form-group">

                    <label>
                        Category
                    </label>

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleCategoryChange}
                    >

                        <option value="1">
                            Men
                        </option>

                        <option value="2">
                            Women
                        </option>

                    </select>

                </div>


                {/* =================================
                    SUBCATEGORY
                ================================= */}

                <div className="form-group">

                    <label>
                        Subcategory
                    </label>

                    <select
                        name="subcategory_id"
                        value={formData.subcategory_id}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select Subcategory
                        </option>


                        {subcategories[
                            formData.category
                        ]?.map(
                            (subcategory) => (

                                <option
                                    key={subcategory.id}
                                    value={subcategory.id}
                                >

                                    {subcategory.name}

                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* =================================
                    PRODUCT IMAGES
                ================================= */}

                <div className="form-group">

                    <label>
                        Product Images
                    </label>


                    {/* =================================
                        SELECTED IMAGES
                    ================================= */}

                    {images.length > 0 && (

                        <div className="selected-images">

                            {images.map(
                                (image, index) => (

                                    <div
                                        className="selected-image-name"
                                        key={index}
                                    >

                                        {/* FILE NAME */}

                                        <span>

                                            📎{" "}

                                            {typeof image === "string"
                                                ? `Image ${index + 1}`
                                                : image.name
                                            }

                                        </span>


                                        {/* UPLOAD STATUS */}

                                        {uploadStatus[index] && (

                                            <span className="uploaded-icon">

                                                ✓

                                            </span>

                                        )}


                                        {/* CHANGE */}

                                        <label className="change-image-btn">

                                            Change

                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleIndividualImageChange(
                                                        e,
                                                        index
                                                    )
                                                }
                                            />

                                        </label>


                                        {/* REMOVE */}

                                        <button
                                            type="button"
                                            className="remove-image-btn"
                                            onClick={() =>
                                                removeImage(index)
                                            }
                                        >

                                            ×

                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {/* =================================
                        CHOOSE NEW IMAGES
                    ================================= */}

                    <label className="small-upload-btn">

                        Choose Images

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />

                    </label>


                    {/* =================================
                        IMAGE COUNT
                    ================================= */}

                    <small>

                        {images.length} / 5 images
                        {" "}
                        (minimum 3)

                    </small>


                    {/* =================================
                        UPLOAD ALL
                    ================================= */}

                    <button
                        type="button"
                        className="upload-btn"
                        onClick={handleUpload}
                    >

                        Upload All

                    </button>

                </div>


                {/* =================================
                    DESCRIPTION
                ================================= */}

                <div className="form-group">

                    <label>
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />

                </div>


                {/* =================================
                    STOCK
                ================================= */}

                <div className="form-group">

                    <label>
                        Stock
                    </label>

                    <input
                        type="number"
                        min="0"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                    />

                </div>


                {/* =================================
                    UPDATE PRODUCT
                ================================= */}

                <button type="submit">

                    Update Product

                </button>


            </form>


            {/* =================================
                BACK
            ================================= */}

            <Link
                to="/admin/products"
                className="view-products-btn"
            >

                Back to Products

            </Link>

        </div>

    );

}


export default EditProduct;