const Product = require("../models/Product");
const SubCategory = require("../models/SubCategory");
const Cart = require("../models/Cart");
const CheckOut = require("../models/CheckOut");
const UserModel = require("../models/User");
const TokenModel = require("../models/Token");
const Coupon = require("../models/Coupon");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const lodash = require("lodash");
// Load the full build.
var _ = require('lodash');
// Load the core build.
var _ = require('lodash/core');


exports.userAuth = (req, res, next) => {
    if (req.user) {
        console.log(req.user);
        next();
    } else {
        console.log(req.user);
        res.redirect("/login");
    }
}

exports.index = (req, res) => {
    Product.find().then(data => {
        console.log(data)
        res.render("index", {
            data: req.user,
            displayData: data,
        })
    }).catch(error => {
        console.log("Something went wrong when fetch product details for front page :(");
    })
}

exports.products = (req, res) => {
    SubCategory.find().populate("category").exec((error, data) => {


        console.log(data);
        lodashData = lodash.groupBy(data, 'category.categoryName');
        console.log(lodashData);
        for (element in lodashData) {
            console.log(element);
        }
        _.forEach(lodashData, function(element, i) {
            console.log(element);
            for (let i = 0; i < element.length; i++) {
                console.log(element[i].subCategory);
            }
        });

        if (!error) {
            Product.find().then(products => {
                res.render("products", {
                    data: req.user,
                    displayData: lodashData,
                    allProducts: products,
                    message: req.flash('message'),
                    alert: req.flash('alert'),
                });
            }).catch(err => {
                console.log("Error while fetch product for product page");
            })
        } else {
            console.log("Something went wrong when fetching product for products page");
        }
    })
}

// exports.products = (req, res) => {
//     Category.find().then(data1 => {
//         SubCategory.find().then(data2 => {
//             console.log(data2);
//             res.render("products", {
//                 displayData1: data1,
//                 displayData2: data2
//             })
//         }).catch(error1 => {
//             console.log("Can't Find SubCategory....", error1);
//         })
//     }).catch(error2 => {
//         console.log("Can't Find Category....", error2);
//     })
// }

exports.fetchProduct = (req, res) => {
    Product.find({ subCategory: req.body.subCatId }).then(data => {
        res.send(data)
    }).catch(error => {
        console.log("error");
    })
}

exports.viewRegister = (req, res) => {
    res.render("register", {
        data: req.user,
        message: req.flash("message"),
        alert: req.flash("alert")
    })
}





exports.register = (req, res) => {
    UserModel({
        userName: req.body.username,
        email: req.body.email,
        contactNo: req.body.contact,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    }).save((err, user) => {
        if (!err) {
            // generate token
            TokenModel({
                _userId: user._id,
                token: crypto.randomBytes(16).toString('hex')
            }).save((err, token) => {
                if (!err) {
                    var transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: "my.dev1998@gmail.com",
                            pass: "My.Dev1998#@!"
                        }
                    });
                    var mailOptions = {
                        from: 'no-reply@ecom.com',
                        to: user.email,
                        subject: 'Account Verification',
                        text: 'Hello ' + req.body.username + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n'
                    };
                    transporter.sendMail(mailOptions, function(err) {
                        if (err) {
                            console.log("Techniclal Issue...");
                        } else {
                            req.flash("message", "A Verfication Email Sent To Your Mail ID.... Please Verify By Click The Link....");
                            req.flash("alert", "alert-success");
                            res.redirect("/register");

                        }
                    });
                } else {
                    console.log("Error When Create Token...", err);
                }
            })

        } else {
            console.log("Error When Create User...", err);
        }
    })
}

exports.confirmation = (req, res) => {
    TokenModel.findOne({ token: req.params.token }, (err, token) => {
        if (!token) {
            req.flash("message", "Verification Link May Be Expired");
            req.flash("alert", "alert-warning");
            res.redirect("/register");
        } else {
            UserModel.findOne({ _id: token._userId, email: req.params.email }, (err, user) => {
                if (!user) {
                    req.flash("message", "User Not Found");
                    req.flash("alert", "alert-danger");
                    res.redirect("/register");
                } else if (user.isVerified) {
                    req.flash("message", "User Already Verified");
                    req.flash("alert", "alert-warning");
                    res.redirect("/register");
                } else {
                    user.isVerified = true;
                    user.save().then(result => {
                        req.flash("message", "Your Account Successfully Verified");
                        req.flash("alert", "alert-success");
                        res.redirect("/register");
                    }).catch(err => {
                        console.log("Something Went Wrong...", err);
                    })
                }
            })
        }
    })
}

exports.viewLogin = (req, res) => {
    loginData = {}
    loginData.email = (req.cookies.email) ? req.cookies.email : undefined
    loginData.password = (req.cookies.password) ? req.cookies.password : undefined
    res.render("login", {
        message: req.flash('message'),
        alert: req.flash('alert'),
        data: req.data,
        displayData: loginData
    });
}

exports.login = (req, res, next) => {
    UserModel.findOne({
        email: req.body.email
    }, (err, data) => {
        if (data) {
            if (data.isVerified) {
                const hashPassword = data.password;
                if (bcrypt.compareSync(req.body.password, hashPassword)) {
                    const token = jwt.sign({
                        id: data._id,
                        username: data.userName,
                        email: data.email
                    }, "abhishek-23051998@", { expiresIn: '5h' });
                    res.cookie("userToken", token);
                    if (req.body.rememberme) {
                        res.cookie('email', req.body.email)
                        res.cookie('password', req.body.password)
                    }
                    console.log(data);
                    res.redirect("/products");
                } else {
                    // console.log("Invalid Password...");
                    // res.redirect("/");
                    req.flash("message", "Invalid Password");
                    req.flash("alert", "alert-danger");
                    res.redirect("/login");
                }
            } else {
                // console.log("Account Is Not Verified");
                req.flash("message", "Account Is Not Verified");
                req.flash("alert", "alert-danger");
                res.redirect("/login");
            }
        } else {
            // console.log("Invalid Email...");
            // res.redirect("/");
            req.flash("message", "Invalid Email");
            req.flash("alert", "alert-danger");
            res.redirect("/login");
        }
    })
}

exports.showCart = (req, res) => {
    Cart.find({ user: req.user.id }).populate("product").exec((err, data) => {
        if (!err) {
            Cart.find({ user: req.user.id }).populate("product").count((err, count) => {
                if (!err) {
                    console.log(data);
                    res.render("cart", {
                        data: req.user,
                        displayData: data,
                        count: count
                    })
                }
            })
        } else {
            console.log(err);
        }
    })
}

exports.logout = (req, res) => {
    res.clearCookie("userToken")
    res.redirect('/login')
}

exports.addToBag = (req, res) => {
    Cart.find({ product: req.params.id }).exec((err, data) => {
        if (!err) {
            if (data.length === 0) {
                Cart({
                    user: req.user.id,
                    product: req.params.id
                }).save().then(result => {
                    req.flash("message", "Item Added To Your Bag");
                    req.flash("alert", "alert-success");
                    res.redirect("/products");
                }).catch(error => {
                    console.log(error);
                })
            } else {
                req.flash("message", "Product Already In Your Bag");
                req.flash("alert", "alert-success");
                res.redirect("/products");
            }
        }
    })
}

exports.updateCart = (req, res) => {
    Cart.findByIdAndUpdate(req.body.productId, {
        quantity: req.body.quant
    }).then(result => {
        console.log("Cart Updated...");
        res.send(result);
    }).catch(err => {
        res.send(result);
        console.log("Cart Not Updated...");
    })
}

exports.searchProduct = (req, res) => {
    Product.find({ "productName": { $regex: req.body.str, "$options": "i" } }).then(result => {
        res.send(result)
    }).catch(err => {
        console.log(err);
    })
}

exports.deleteCart = (req, res) => {
    Cart.findByIdAndRemove(req.params.id).then(result => {
        console.log("Cart Deleted");
        res.redirect("/cart");
    }).catch(error => {
        console.log("Something Went Wrong");
    })
}

exports.checkOut = (req, res) => {
    Cart.find({ user: req.user.id }).populate("product").exec((err, data) => {
        if (!err) {
            Cart.find({ user: req.user.id }).populate("product").count((err, count) => {
                if (!err) {
                    console.log(data);
                    User.find({ _id: req.user.id }).then(user => {
                        console.log(user);
                        res.render("checkout", {
                            data: req.user,
                            displayData: data,
                            count: count,
                            user: user
                        })
                    }).catch(err => {
                        console.log("Error while fetching user details");
                    })
                }
            })
        } else {
            console.log(err);
        }
    })
}

exports.postCheckOut = (req, res) => {
    Cart.find({ user: req.user.id }).populate("product").exec((err, data) => {
        if (!err) {
            Cart.find({ user: req.user.id }).populate("product").count((err, count) => {
                var add = 0,
                    shipping = 0;
                if (!err) {
                    var product = [];
                    var productQuant = [];
                    for (element of data) {
                        //console.log(element.product._id);
                        product.push(element.product._id);
                        productQuant.push(element.quantity);
                    }
                    for (i = 0; i < count; i++) {
                        add += data[i].product.price * data[i].quantity;
                    }
                    if (add < 500) {
                        shipping = 100;
                    }
                    let token = crypto.randomBytes(16).toString('hex');
                    CheckOut({
                        user: req.user.id,
                        product: product,
                        quantity: productQuant,
                        name: req.body.name,
                        address: req.body.address,
                        contact: req.body.contact,
                        email: req.body.email,
                        country: req.body.country,
                        city: req.body.city,
                        district: req.body.district,
                        zip: req.body.zip,
                        subTotal: add,
                        shipping: shipping,
                        token: token,
                        total: add + shipping
                    }).save().then(result => {
                        res.cookie("checkoutToken", token);
                        console.log(result);
                        console.log("Checkout");
                        res.redirect("payments")
                    }).catch(err => {
                        console.log("not check out");
                    })
                }
            })
        } else {
            console.log(err);
        }
    })
}


exports.viewSingleProduct = (req, res) => {
    Product.findById(req.params.id).populate("category").exec((err, data) => {
        if (!err) {
            console.log(data);
            res.render("single-product", {
                data: req.user,
                displayData: data
            })
        }
    })
}

exports.viewPayments = (req, res) => {
    CheckOut.find({ token: req.cookies.checkoutToken }).then(data => {
        console.log(data);
        res.render("payment", {
            data: req.user,
            displayData: data,
            message: req.flash("message"),
            alert: req.flash("alert")
        })
    }).catch(err => {
        console.log("Error While fetch checkout details");
    })
}

exports.postPayment = (req, res) => {
    CheckOut.findOneAndUpdate({ token: req.cookies.checkoutToken }, {
        paymentType: req.body.payment,
        status: true,
        orderDate: Date.now()
    }).then(result => {
        res.clearCookie("checkoutToken");
        Cart.deleteMany({ user: req.user.id }).then(result => {
            res.redirect("thnx");
        }).catch(err => {
            console.log("Cart not deleted");
        })
    }).catch(err => {
        console.log(err);
    })
}

exports.applyCoupon = (req, res) => {
    Coupon.find({ couponCode: req.body.coupon }).exec((err, data) => {
        if (!err) {
            console.log(data);
            if (data.length > 0 && data[0].isActive) {
                console.log(req.cookies.checkoutToken);
                CheckOut.findOneAndUpdate({ token: req.cookies.checkoutToken }, {
                    discount: data[0].discount
                }).then(result => {
                    console.log(result);
                    console.log("Coupon Applied");
                    req.flash("message", "Coupon Applied Successfully");
                    req.flash("alert", "alert-success");
                    res.redirect("payments");
                }).catch(err => {
                    console.log("Coupon Not Applied");
                })
            } else {
                req.flash("message", "Coupon Not Applied");
                req.flash("alert", "alert-danger");
                res.redirect("payments");
            }
        }
    })
}

exports.thnx = (req, res) => {
    res.render("thnx", {
        data: req.user,
    });
}