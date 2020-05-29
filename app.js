//REQUIRING NPM MODULES
var express=require("express");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var flash=require("connect-flash");

//REQUIRING MODELS
var Contact=require("./models/contact");

//MONGOOSE CONNECT
var url= process.env.DATABASEURL || "mongodb://localhost/rm_phone_book";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

//APP CONFIGURATION
var app=express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret:"This statement needs to be the secret statement",
    resave: false,
    saveUninitialized: false
}));

//MIDDLEWARE
app.use(function(req,res,next){
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    res.locals.info=req.flash("info");
    next();
})

app.locals.moment=require('moment');

//=========================================================================
//------------------------------- ROUTES ----------------------------------
//=========================================================================

app.get("/",function(req,res){
    res.redirect("/contacts/page/1");
})

app.get("/contacts",function(req,res){
    res.redirect("/contacts/page/1");
})

//INDEX - Show all contacts
app.get("/contacts/page/:page",function(req,res){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    var perPage = 4;
    var page = req.params.page || 1;
    Contact
        .find({name:regex})
        .sort('name')
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function (err, contacts) {
            if(err){
                console.log(err)
            }
            Contact.countDocuments().exec(function(err,count){
                if(err) {
                    console.log(err);
                }
                res.render("index",{
                    contacts: contacts,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
})

function escapeRegex(text) {
    if(text){
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
};

//NEW - Add new contact
app.get("/contacts/new",function(req,res){
    res.render("new");
})

//CREATE
app.post("/contacts",function(req,res){
    Contact.create(req.body.contact,function(err,newContact){
        if(err){
            console.log(err);
        } else {
            req.body.phone.forEach(function(phone){
                if(phone!='')
                    newContact.phone.push(phone);
            });
            req.body.email.forEach(function(email){
                if(email!='')
                    newContact.email.push(email);
            });
            newContact.save();
            res.redirect("/contacts/page/1");
        }
    })
})

//EDIT - Edit contact
app.get("/contacts/:id/edit",function(req,res){
    Contact.findById(req.params.id,function(err,foundContact){
        if(err){
            console.log(err);
        } else {
            res.render("edit",{contact:foundContact});
        }
    })
})

//UPDATE- Update the contact
app.put("/contacts/:id",function(req,res){
    Contact.findByIdAndUpdate(req.params.id, req.body.contact, function (err, updatedContact) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            res.redirect("/contacts/page/1");
        }
    })
})

//DELETE - Delete contact
app.delete("/contacts/:id",function(req,res){
    Contact.findByIdAndRemove(req.params.id,function(err,foundContact){
        if(err){
            console.log(err);
        } else {
            res.redirect("/contacts/page/1");
        }
    })
})

//SERVER LISTEN
app.listen(process.env.PORT || 3000,function(){
    console.log("The YelpCamp Server has started at port 3000")
})