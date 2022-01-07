$(document).ready(function() {

    // for subcategory population
    $("#category").on("change", function() {
        // alert("Changed");
        const catID = this.value;
        let myHtmlCode = "";
        let myDefaultStyle = "<option disabled selected>Select Sub Category</option>";
        $('#subcategory').empty();
        // console.log(catID);
        $.ajax({
            url: "fetch-sub-category",
            type: "POST",
            data: {
                catID: catID
            },
            success: function(result) {
                // console.log(result);
                $.each(result, function(key, value) {
                    console.log(key + " => " + value.subCategory);
                    myHtmlCode += '<option value="' + value._id + '">' + value.subCategory + '</option>';
                });
                $("#subcategory").append(myDefaultStyle + myHtmlCode);
            },
            error: function(err) {
                console.log(err);
            }
        })
    })

    //for product filter

    $(".subCategory").on("click", function(e) {
        e.preventDefault();
        $(".allproducts").hide();
        $(".filterproducts").empty();
        let myHtmlCode = "";
        let val = $(this).data("value");
        //alert(val);
        $.ajax({
            url: "fetch-product",
            type: "POST",
            data: {
                subCatId: val
            },
            success: function(result) {
                $.each(result, function(key, value) {
                    console.log(key + " => " + value.productName);
                    myHtmlCode += '<div class="col-lg-3 col-md-6 "><div class="single-product "> <a href="view-single-product/' + value._id + '"><img class="img-fluid productimg " src="uploads/' + value.image + '" alt=""></a> <div class = "product-details" > <h6>' + value.productName + '</h6> <div class = "price" ><h6>&#8377;' + value.price + '</h6><h6 class= "l-through" > &#8377;' + value.price + '</h6></div><div class= "prd-bottom" ><a href = "add-to-bag/' + value._id + '"' + 'class = "social-info" ><span class = "ti-bag" > </span> <p class = "hover-text" > add to bag </p></a></div> </div></div></div>';
                })
                $(".filterproducts").append(myHtmlCode);
            },
            error: function(err) {
                console.log(err);
            }
        })
    })

    // ecom cart product quant updation

    $(".productquant").on("input", function(e) {
        if (!isNaN($(this).val()) && $(this).val() > 0 && $(this).val().length > 0) {
            $.ajax({
                url: "/update-cart",
                type: "POST",
                data: {
                    quant: $(this).val(),
                    productId: $(this).attr('id')
                },
                success: function(result) {
                    // alert("Cart Updated!!!");
                    window.location.reload();
                },
                error: function(err) {
                    alert("Something went wrong!!!");
                }
            });
            // alert($(this).attr('id'));
        }
    });

    // for search

    $("#search_input").on("input", function() {
        let htmlCode = "";
        $(".showSearchResult").empty();
        if ($(this).val().length > 0) {
            $.ajax({
                url: "/search-product",
                type: "POST",
                data: {
                    str: $(this).val()
                },
                success: function(result) {
                    console.log(result);
                    $.each(result, function(key, value) {
                        htmlCode += '<a href="/view-single-product/' + value._id + '"><li><img src="/uploads/' + value.image + '" alt="" width="50px"> <h4 style = "margin-left: 30px;"> ' + value.productName + ' </h4></li></a>';
                    })
                    $(".showSearchResult").append(htmlCode);
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    });

    $(".cartplus").on("click", function(e) {

        // console.log(value);
        // console.log($(".productquant")[$(this).attr("id")].value);
        // console.log($(".productquant")[$(this).attr("id")].value);
        if ($(".productquant")[$(this).attr("id")].value < 12) {
            let value = +$(".productquant")[$(this).attr("id")].value + 1;
            $(".productquant")[$(this).attr("id")].value = value;
        }
        var quant = $(".productquant")[$(this).attr("id")].value;
        console.log(quant);
        //$(".productquant")[$(this).attr("id")].val(value);
        //$(".productquant #" + $(this).attr('id')).val(value);
        $.ajax({
            url: "/update-cart",
            type: "POST",
            data: {
                quant: quant,
                productId: $(this).val()
            },
            success: function(result) {
                // console.log(result);
                // alert("Cart Updated!!!");
                // $(".productquant").val(value)
                window.location.reload();
            },
            error: function(err) {
                // alert("Something went wrong!!!");
                console.log(err);
            }
        });
        // alert($(this).attr('id'));
    });

    $(".cartminus").on("click", function(e) {

        // console.log(value);
        // console.log($(".productquant")[$(this).attr("id")].value);
        // console.log($(".productquant")[$(this).attr("id")].value);
        if ($(".productquant")[$(this).attr("id")].value > 1) {
            let value = +$(".productquant")[$(this).attr("id")].value - 1;
            $(".productquant")[$(this).attr("id")].value = value;
        } else {
            $(".productquant")[$(this).attr("id")].value = 1;
        }
        var quant = $(".productquant")[$(this).attr("id")].value;
        console.log(quant);
        //$(".productquant")[$(this).attr("id")].val(value);
        //$(".productquant #" + $(this).attr('id')).val(value);
        $.ajax({
            url: "/update-cart",
            type: "POST",
            data: {
                quant: quant,
                productId: $(this).val()
            },
            success: function(result) {
                // console.log(result);
                // alert("Cart Updated!!!");
                // $(".productquant").val(value)
                window.location.reload();
            },
            error: function(err) {
                // alert("Something went wrong!!!");
                console.log(err);
            }
        });
        // alert($(this).attr('id'));
    });

})