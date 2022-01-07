const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const AdminController = require("../controllers/Admin");

// Setup file storage

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + 'product' + path.extname(file.originalname));
    }
})

const maxSize = 1 * 1024 * 1024; // for 1MB

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
    limits: {
        fileSize: maxSize
    }
});

router.get("/dashboard", AdminController.adminAuth, AdminController.adminDashboard);
router.get("/add-category", AdminController.adminAuth, AdminController.showAddCategory);
router.post("/add-category", AdminController.adminAuth, AdminController.addCategory);
router.get("/view-category", AdminController.adminAuth, AdminController.viewCategory);
router.get("/add-sub-category", AdminController.adminAuth, AdminController.showAddSubCategory);
router.post("/add-sub-category", AdminController.adminAuth, AdminController.addSubCategory);
router.get("/view-sub-category", AdminController.adminAuth, AdminController.viewSubCategory);
router.get("/add-product", AdminController.adminAuth, AdminController.showAddProduct);
router.post("/fetch-sub-category", AdminController.adminAuth, AdminController.fetchSubCategory);
router.post("/add-product", AdminController.adminAuth, upload.single('productimage'), AdminController.addProduct);
router.get("/view-product", AdminController.adminAuth, AdminController.viewProduct);
router.get("/orders", AdminController.adminAuth, AdminController.orders);
router.get("", AdminController.showIndex);
router.get("/add-coupon", AdminController.adminAuth, AdminController.showAddCoupon);
router.post("/add-coupon", AdminController.adminAuth, AdminController.addCoupon);
router.get("/view-coupon", AdminController.adminAuth, AdminController.viewCoupon);
router.get("/delete-coupon/(:id)", AdminController.adminAuth, AdminController.deleteCoupon);
// router.get("/delete-category/(:id)", AdminController.adminAuth, AdminController.deleteCategory);
router.get("/deactivate-coupon/(:id)", AdminController.adminAuth, AdminController.deactiveCoupon);
router.get("/activate-coupon/(:id)", AdminController.adminAuth, AdminController.activeCoupon);
router.post("/login", AdminController.login);
router.get("/logout", AdminController.logout);

// router.post("/admin/registration", AdminController.registration);




module.exports = router;