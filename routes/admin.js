import express from "express";
import { addCategory, addDriver, addOrder, addProduct, addVendor, deleteDriver, deleteProduct, deleteVendor, doLogin, getCategories, getCategory, getDriver, getDrivers, getOrder, getOrders, getProduct, getProducts, getVendor, getVendors, toggleBlockDriver, toggleIsAvailable, updateDriver, updateProduct, updateVendor } from "../controllers/adminController.js";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js";
import { validateLogin } from "../validators/adminValidators.js";
import { validateDriver, validateDriverId, validateUpdateDriver } from "../validators/driverValidators.js";
import { validateUpdateVendor, validateVendor, validateVendorId } from "../validators/vendorValidators.js";
import { validateProduct, validateProductId, validateUpdateProduct } from "../validators/productValidators.js";
import { validateCategory, validateCategoryId } from "../validators/categoryValidators.js";
import { validateOrder, validateOrderId } from "../validators/orderValidators.js";
const router = express.Router();


router.get("/drivers", adminAuthMiddleware, getDrivers);
router.get("/drivers/:driverId", adminAuthMiddleware, validateDriverId, getDriver);
router.get("/vendors", adminAuthMiddleware, getVendors);
router.get("/vendors/:vendorId", adminAuthMiddleware, validateVendorId, getVendor);
router.get("/categories", adminAuthMiddleware, getCategories);
router.get("/categories/:categoryId", adminAuthMiddleware, validateCategoryId, getCategory);
router.get("/products", adminAuthMiddleware, getProducts);
router.get("/products/:productId", adminAuthMiddleware, validateProductId, getProduct);
router.get("/orders", adminAuthMiddleware, getOrders);
router.get("/orders/:orderId", adminAuthMiddleware, validateOrderId, getOrder);
router.post("/login", validateLogin, doLogin);
router.post("/drivers/addDriver", adminAuthMiddleware, validateDriver, addDriver);
router.post("/vendors/addVendor", adminAuthMiddleware, validateVendor, addVendor);
router.post("/category/addCategory", adminAuthMiddleware, validateCategory, addCategory);
router.post("/products/addProduct", adminAuthMiddleware, validateProduct, addProduct);
router.post("/orders/addOrder", adminAuthMiddleware, validateOrder, addOrder);
router.patch("/drivers/:driverId", adminAuthMiddleware, validateDriverId, validateUpdateDriver, updateDriver);
router.patch("/drivers/:driverId/toggleBlockDriver", adminAuthMiddleware, validateDriverId, toggleBlockDriver);
router.patch("/vendors/:vendorId", adminAuthMiddleware, validateVendorId, validateUpdateVendor, updateVendor);
router.patch("/products/:productId", adminAuthMiddleware, validateProductId, validateUpdateProduct, updateProduct);
router.patch("/products/:productId/toggleIsAvailable", adminAuthMiddleware, validateProductId, toggleIsAvailable);
router.delete("/drivers/:driverId", adminAuthMiddleware, validateDriverId, deleteDriver);
router.delete("/vendors/:vendorId", adminAuthMiddleware, validateVendorId, deleteVendor);
router.delete("/products/:productId", adminAuthMiddleware, validateProductId, deleteProduct);

export default router;