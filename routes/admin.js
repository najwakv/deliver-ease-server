import express from "express";
import { addCategory, addDriver, addProduct, addVendor, deleteDriver, deleteProduct, deleteVendor, doLogin, getCategories, getCategory, getDriver, getDrivers, getProduct, getProducts, getVendor, getVendors, toggleBlockDriver, toggleIsAvailable, updateDriver, updateProduct, updateVendor } from "../controllers/adminController.js";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js";
const router = express.Router();


router.get("/drivers", adminAuthMiddleware, getDrivers);
router.get("/drivers/:driverId", adminAuthMiddleware, getDriver);
router.get("/vendors", adminAuthMiddleware, getVendors);
router.get("/vendors/:vendorId", adminAuthMiddleware, getVendor);
router.get("/categories", adminAuthMiddleware, getCategories);
router.get("/categories/:categoryId", adminAuthMiddleware, getCategory);
router.get("/products", adminAuthMiddleware, getProducts);
router.get("/products/:productId", adminAuthMiddleware, getProduct);
router.post("/login", doLogin);
router.post("/drivers/addDriver", adminAuthMiddleware, addDriver);
router.post("/vendors/addVendor", adminAuthMiddleware, addVendor);
router.post("/category/addCategory", adminAuthMiddleware, addCategory);
router.post("/products/addProduct", adminAuthMiddleware, addProduct);
router.patch("/drivers/:driverId", adminAuthMiddleware, updateDriver);
router.patch("/drivers/:driverId/toggleBlockDriver", toggleBlockDriver);
router.patch("/vendors/:vendorId", adminAuthMiddleware, updateVendor);
router.patch("/products/:productId", adminAuthMiddleware, updateProduct);
router.patch("/products/:productId/toggleIsAvailable", adminAuthMiddleware, toggleIsAvailable);
router.delete("/drivers/:driverId", adminAuthMiddleware, deleteDriver);
router.delete("/vendors/:vendorId", adminAuthMiddleware, deleteVendor);
router.delete("/products/:productId", adminAuthMiddleware, deleteProduct);

export default router;