const router = require("express").Router();
const UserController = require("../controllers/User");
const verifySignup = require("../middlewares/verifySignup");



router.get("/", UserController.index);
router.get("/products", UserController.products);
router.post("/fetch-product", UserController.fetchProduct);
router.get("/register", UserController.viewRegister);
router.post("/register", [verifySignup.checkDuplicateEntries], UserController.register);
router.get("/confirmation/:email/:token", UserController.confirmation);
router.get("/login", UserController.viewLogin);
router.post("/login", UserController.login);
router.get("/logout", UserController.logout);
router.get("/cart", UserController.userAuth, UserController.showCart);
router.post("/update-cart", UserController.userAuth, UserController.updateCart);
router.post("/search-product", UserController.searchProduct);
router.get("/add-to-bag/(:id)", UserController.userAuth, UserController.addToBag);
router.get("/deletecart/(:id)", UserController.deleteCart);
router.get("/checkout", UserController.userAuth, UserController.checkOut);
router.get("/view-single-product/(:id)", UserController.viewSingleProduct);
router.post("/checkout", UserController.userAuth, UserController.postCheckOut);
router.get("/payments", UserController.userAuth, UserController.viewPayments);
router.post("/postpayment", UserController.userAuth, UserController.postPayment)
router.post("/apply-coupon", UserController.userAuth, UserController.applyCoupon);
router.get("/thnx", UserController.userAuth, UserController.thnx);
module.exports = router;