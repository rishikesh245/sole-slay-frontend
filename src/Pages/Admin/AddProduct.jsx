import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { addProduct } from "../../api/productApi";
import { uploadImage } from "../../api/uploadApi";

import "./AddProduct.css";


function AddProduct() {

    const navigate = useNavigate();


    // PRODUCT FORM

    const [formData, setFormData] = useState({

        name: "",
        price: "",
        category: "1",
        subcategory_id: "",

        description: "",
        stock: ""

    });

    const [images, setImages] = useState([]);
    const [uploadStatus, setUploadStatus] = useState([]);
    const [uploadedUrls, setUploadedUrls] = useState([]);

    // SUBCATEGORIES

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


    // NORMAL INPUT CHANGE

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,
            [name]: value

        }));

    };


    // CATEGORY CHANGE

    const handleCategoryChange = (e) => {

        const selectedCategory = e.target.value;

        setFormData((prev) => ({

            ...prev,

            category: selectedCategory,
            subcategory_id: ""

        }));

    };


    // SELECT IMAGES


    const handleImageChange = (e) => {

    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) {
        return;
    }

    setImages((prev) =>  {
    
        const totalImages = prev.length + selectedFiles.length;

        if (totalImages > 5) {

            alert("You can select maximum 5 images");

            return prev;
        }

        return [
            ...prev,
            ...selectedFiles
        ];

    }
       
    );

    setUploadStatus([]);

    setUploadedUrls([]);

    e.target.value = "";

};

    // CHANGE INDIVIDUAL IMAGE

    const handleIndividualImageChange = (e, index) => {

    const file = e.target.files[0];

    if (!file) {
        return;
    }

     setImages((prev) => {

        const updated = [...prev];

        updated[index] = file;

        return updated;

    });

    // Because this image changed,
    // uploaded URLs are no longer valid
    setUploadedUrls([]);

    setUploadStatus([]);

};



    // REMOVE INDIVIDUAL IMAGE

    const removeImage = (index) => {

        setImages((prev) => {
           return prev.filter((_, i) => i !== index)
    });

        setUploadedUrls([]);

        setUploadStatus([]);

    };


    // UPLOAD IMAGES

    const handleUpload = async () => {


        // MUST HAVE ALL 3

        if (images.length < 3 ) {

            alert(
                "Please select at least 3 images before uploading"
            );

            return;

        }

        try {

        const urls = [];

        for (const image of images) {

            const response =
                await uploadImage(image);

            urls.push(
                response.data.imageUrl
            );

        }

        console.log("Cloudinary Urls:", urls);

        setUploadedUrls(urls);


        setUploadStatus(
            images.map(() => true)
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


    


          

    // ADD PRODUCT

   const handleSubmit = async (e) => {

    e.preventDefault();


    if (images.length < 3) {

        alert(
            "Please add at least 3 images before adding the product"
        );

        return;

              }

    if (uploadedUrls.length !== images.length) {

        alert(
            "Please click Upload All before adding the product"
        );

        return;
    }


    try {

        // Product data

        const productData = {

            name: formData.name,

            price: formData.price,

            subcategory_id:
                formData.subcategory_id,

            description:
                formData.description,

            stock:
                formData.stock,

            images:
                uploadedUrls

        };


        const response =
            await addProduct(productData);


        console.log(
            "PRODUCT ADDED:",
            response.data
        );


        alert(
            "Product added successfully!"
        );


        navigate("/admin/products");


    } catch (error) {

        console.error(
            "ADD PRODUCT ERROR:",
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
            "Failed to add product"
        );

    }

};

    return (

        <div>


            <form onSubmit={handleSubmit}>


                {/* PRODUCT NAME */}

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


                {/* PRICE */}

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


                {/* CATEGORY */}

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


                {/* SUBCATEGORY */}

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
                        ]?.map((subcategory) => (

                            <option
                                key={subcategory.id}
                                value={subcategory.id}
                            >

                                {subcategory.name}

                            </option>

                        ))}

                    </select>

                </div>


                {/* ================================
                    PRODUCT IMAGES
                ================================= */}

                <div className="form-group">

    <label>
        Product Images
    </label>


    {/* CHOOSE IMAGES */}

    <label className="small-upload-btn">

        Choose Images

        <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
        />

    </label>


    {/* SELECTED IMAGES */}

    {images.length > 0 && (

        <div className="selected-images">

            {images.map((image, index) => (

                <div
                    className="selected-image-name"
                    key={index}
                >

                    <span>
                        📎 {image.name}
                    </span>


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
                                handleIndividualImageChange(e,index)
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

            ))}

        </div>

    )}


    {/* UPLOAD */}

    <button
        type="button"
        className="upload-btn"
        onClick={handleUpload}
    >
        Upload All
    </button>

</div>


                {/* DESCRIPTION */}

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


                {/* STOCK */}

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


                {/* ADD PRODUCT */}

                <button type="submit">
                    Add Product
                </button>


            </form>


            {/* BACK BUTTON */}

            <button
                type="button"
                className="view-products-btn"
                onClick={() =>
                    navigate("/admin/products")
                }
            >
                Back to Products
            </button>


        </div>

    );

}


export default AddProduct;