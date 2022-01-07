const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Product = require("../models/Product");
const CheckOut = require("../models/CheckOut");
const Admin = require("../models/Admin");
const Coupon = require("../models/Coupon");

exports.adminAuth = (req, res, next) => {
    if (req.admin) {
        console.log(req.admin);
        next();
    } else {
        console.log(req.admin);
        res.redirect("/admin");
    }
}

exports.adminDashboard = (req, res) => {
    if (req.admin) {
        Admin.find({}, function(err, adminDetails) {
            if (!err) {
                res.render("admin/admin-dashboard", {
                    data: req.admin,
                    details: adminDetails
                })
            } else {
                console.log(err);
            }
        })
    }
}

exports.showAddCategory = (req, res) => {
    res.render("admin/add-category", {
        data: req.admin,
        message: req.flash('message'),
    });
}

exports.addCategory = (req, res) => {
    Category({
        categoryName: req.body.category
    }).save().then(result => {
        req.flash("message", "Category Added Successfully!!!");
        res.redirect("add-category");
    }).catch(error => {
        console.log("Category Not Added", error);
    })

}

exports.viewCategory = (req, res) => {
    Category.find().then(data => {
        res.render("admin/view-category", {
            data: req.admin,
            displayData: data
        })
    }).catch(error => {
        console.log(error);
    })
}

exports.showAddSubCategory = (req, res) => {
    Category.find().then(data => {
        console.log(data)
        res.render("admin/add-sub-category", {
            data: req.admin,
            categories: data,
            message: req.flash("message")
        });
    })
}

exports.addSubCategory = (req, res) => {
    SubCategory({
        subCategory: req.body.subcategory,
        category: req.body.category
    }).save().then(result => {
        req.flash("message", "SubCategory Added Successfully!!!")
        res.redirect("add-sub-category");
    }).catch(error => {
        console.log(error);
    })
}

exports.viewSubCategory = (req, res) => {
    SubCategory.find().populate("category").exec((error, data) => {
        if (!error) {
            res.render("admin/view-sub-category", {
                data: req.admin,
                displayData: data
            })
        } else {
            console.log(error);
        }
    })
}

exports.showAddProduct = (req, res) => {
    Category.find().then(result => {
        res.render("admin/add-product", {
            data: req.admin,
            displayData: result,
            message: req.flash("message")
        })
    })
}

exports.fetchSubCategory = (req, res) => {
    // console.log(req.body.catID);
    //res.send(req.body.catID)
    SubCategory.find({ category: req.body.catID }).then(result => {
        res.send(result)
    })
}

exports.addProduct = (req, res) => {
    Product({
        category: req.body.category,
        subCategory: req.body.subcategory,
        productName: req.body.productname,
        price: req.body.price,
        image: req.file.filename
    }).save().then(result => {
        req.flash("message", "Product Added Successfully!!!");
        res.redirect("add-product");
    }).catch(error => {
        console.log(error);
    });
}

exports.viewProduct = (req, res) => {
    Product.find().populate("subCategory").populate("category").exec((error, data) => {
        if (!error) {
            console.log(data);
            res.render("admin/view-product", {
                data: req.admin,
                displayData: data
            });

        } else {
            console.log(error);
        }
    })
}

exports.showIndex = (req, res) => {
    loginData = {}
    loginData.email = (req.cookies.email) ? req.cookies.email : undefined
    loginData.password = (req.cookies.password) ? req.cookies.password : undefined
    res.render("admin", {
        loginData: loginData,
        message: req.flash("message")
    });
}

// exports.registration = (req, res) => {
//     Admin({
//         email: req.body.email,
//         password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
//     }).save((err, user) => {
//         if (!err) {

//             console.log("Admin Created");

//         } else {
//             console.log("Error When Create Admin...", err);
//         }
//     })
// }


exports.login = (req, res, next) => {
    Admin.findOne({
        email: req.body.email
    }, (err, data) => {
        if (data) {
            const hashPassword = data.password;
            if (bcrypt.compareSync(req.body.password, hashPassword)) {
                const token = jwt.sign({
                    id: data._id,
                    email: data.email
                }, "abhishek-23051998@#1!4959", { expiresIn: '50m' });
                res.cookie("adminToken", token);
                if (req.body.rememberme) {
                    res.cookie('email', req.body.email)
                    res.cookie('password', req.body.password)
                }
                console.log(data);
                res.redirect("dashboard");
            } else {
                req.flash("message", "Invalid Password");
                res.redirect("/admin");
            }
        } else {
            req.flash("message", "Invalid Email");
            res.redirect("/admin");
        }
    })
}

exports.orders = (req, res) => {
    CheckOut.find().populate("product").populate("user").exec((err, result) => {
        // for (data of result) {
        //     console.log(data.product[0]);
        // }
        console.log(result);
        res.render("admin/all-orders", {
            data: req.admin,
            displayData: result
        })
    })
}



exports.showAddCoupon = (req, res) => {
    res.render("admin/add-coupon", {
        data: req.admin,
        message: req.flash("message")
    });
}

exports.addCoupon = (req, res) => {
    Coupon.find({ couponCode: req.body.coupon }).exec((err, result) => {
        if (result.length > 0) {
            console.log(result);
            req.flash("message", "Coupon Already Exists");
            // req.flash("alert", "alert-success");
            res.redirect("add-coupon");
        } else {
            Coupon({
                couponCode: req.body.coupon,
                discount: req.body.coupondiscount
            }).save().then(result => {
                req.flash("message", "Coupon Added Successfully");
                // req.flash("alert", "alert-success");
                res.redirect("add-coupon");
            }).catch(err => {
                console.log("Error when add coupon", err);
            })
        }
    })
}

exports.viewCoupon = (req, res) => {
    Coupon.find().then(result => {
        res.render("admin/view-coupon", {
            data: req.admin,
            displayData: result,
            message: req.flash("message")
        })
    }).catch(err => {
        console.log("Error when fetching coupons");
    })
}

exports.deleteCoupon = (req, res) => {
    Coupon.findByIdAndRemove(req.params.id, (err, data) => {
        if (!err) {
            console.log("Coupon Deleted!!!!");
            res.redirect("/admin/view-coupon");
        } else {
            console.log("err");
        }
    })
}

// exports.deleteCategory = (req, res) => {
//     Category.findByIdAndRemove(req.params.id, (err, data) => {
//         if (!err) {
//             console.log("Category Deleted!!!!");
//             res.redirect("/admin/view-category");
//         } else {
//             console.log("err");
//         }
//     })
// }


exports.deactiveCoupon = (req, res) => {
    Coupon.findByIdAndUpdate(req.params.id, {
        isActive: false
    }).then(result => {
        req.flash("message", "Coupon Deactivated Successfully");
        res.redirect("/admin/view-coupon");
    })
}

exports.activeCoupon = (req, res) => {
    Coupon.findByIdAndUpdate(req.params.id, {
        isActive: true
    }).then(result => {
        req.flash("message", "Coupon Activated Successfully");
        res.redirect("/admin/view-coupon");
    })
}


















exports.logout = (req, res) => {
    res.clearCookie("adminToken")
    res.redirect('/admin')
}