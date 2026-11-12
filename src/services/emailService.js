import axios from "axios";

// EmailJS official REST API endpoint
const EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";

// User-specified EmailJS Credentials
const DEFAULT_SERVICE_ID = "service_t54irft";
const DEFAULT_TEMPLATE_ID = "template_nbz6z1g";
const DEFAULT_PUBLIC_KEY = "9Y_OWI2Fr5nAFcZvF";

/**
 * Dispatches an order confirmation email to the customer using EmailJS.
 *
 * @param {Object} params
 * @param {Object} params.order - The created order object returned by the backend.
 * @param {Array} params.items - Cart items array containing product name, size, quantity, and price.
 * @param {Object} params.user - Current authenticated user object.
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const sendOrderConfirmationEmail = async ({ order, items = [], user }) => {
  const serviceId =
    import.meta.env.VITE_EMAILJS_SERVICE_ID || DEFAULT_SERVICE_ID;
  const templateId =
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID || DEFAULT_TEMPLATE_ID;
  const publicKey =
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY || DEFAULT_PUBLIC_KEY;

  // Build clean text summary of purchased items
  const itemsSummary = (items || [])
    .map((item, index) => {
      const name = item.name || "Footwear";
      const size = item.selectedSize || item.size || "7";
      const qty = Number(item.quantity) || 1;
      const unitPrice = Number(item.price) || 0;
      const subtotal = unitPrice * qty;
      return `${index + 1}. ${name} (Size: UK ${size}) x ${qty} — ₹${subtotal.toLocaleString("en-IN")}`;
    })
    .join("\n");

  const customerName = order.name || user?.name || "Shoe Lover";
  const customerEmail = order.email || user?.email || "";
  const orderId = order.id ? `#${order.id}` : "CONFIRMED";
  const formattedTotal = `₹${Number(order.total_amount || 0).toLocaleString("en-IN")}`;

  // Comprehensive template parameters matching standard EmailJS template formats
  const templateParams = {
    to_name: customerName,
    name: customerName,
    to_email: customerEmail,
    customer_email: customerEmail,
    email: customerEmail,
    order_id: orderId,
    order_total: formattedTotal,
    total_amount: formattedTotal,
    items_summary: itemsSummary || "Luxury Footwear Items",
    order_items: itemsSummary || "Luxury Footwear Items",
    shipping_address: order.address || "Standard Doorstep Delivery",
    address: order.address || "",
    customer_phone: order.mobile || "",
    mobile: order.mobile || "",
    order_date: new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    store_name: "Sole Slay Footwear",
  };

  try {
    const sendWithService = async (targetServiceId) => {
      const payload = {
        service_id: targetServiceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams,
      };

      return await axios.post(EMAILJS_API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000,
      });
    };

    let response;
    try {
      response = await sendWithService(serviceId);
    } catch (primaryError) {
      const errorMsg =
        typeof primaryError.response?.data === "string"
          ? primaryError.response.data
          : "";

      // If specified service ID is not found in the account, automatically fallback to default_service
      if (
        (errorMsg.includes("service ID not found") ||
          errorMsg.includes("No records found")) &&
        serviceId !== "default_service"
      ) {
        console.warn(
          `⚠️ [EmailJS] Service "${serviceId}" was not found. Retrying with "default_service"...`
        );
        response = await sendWithService("default_service");
      } else {
        throw primaryError;
      }
    }

    console.log("✅ [EmailJS] Order confirmation email sent successfully:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    const errorDetails = error.response?.data || error.message;
    console.error("❌ [EmailJS] Email send failed:", errorDetails);
    return { success: false, error: errorDetails };
  }
};

