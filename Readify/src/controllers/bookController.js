const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");
const mongoose = require("mongoose");
const moment = require("moment");

const { isValidExcerpt, isValidTitle, isValidISBN, checkDate } = require("../Validators/validatte");




//_______________________________________________________createBook________________________________________________________________________________________


const createBook = async (req, res) => {
  try {
    let bookData = req.body;
   // if (Object.keys(bookData).length == 0) return res.status(400).send({ status: false, message: "Please put book data" });

    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt, } = bookData;

    // if (title != undefined && typeof title != "string") {
    //   return res.status(400).send({ status: false, message: "plese enter valid title" });
    // }
    if (!title ) return res.status(400).send({ status: false, message: "Please enter book title" });
   // if (!isValidTitle(title)) return res.status(400).send({ status: false, message: "title can contain only letters and numbers" });

    let isTitleExits = await bookModel.findOne({ title: title });
    if (isTitleExits) return res.status(400).send({ status: false, message: "Title already exits" });

    // if (excerpt != undefined && typeof (excerpt) != "string") {
    //   return res.status(400).send({ status: false, message: "plese enter valid excerpt" });
    // }
    if (!excerpt )
      return res.status(400).send({ status: false, message: "Please enter book excerpt" });
  //  if (!isValidExcerpt(excerpt)) return res.status(400).send({ status: false, message: "please provide a valid excerpt" });



    if (!userId )
      return res.status(400).send({ status: false, message: "Please enter book userId" });
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ status: false, message: "please enter valid userID" });
   

    // if (ISBN != undefined && typeof (ISBN) != "string") {
    //   return res.status(400).send({ status: false, message: "plese enter valid ISBN" });
    // }
    if (!ISBN )
      return res.status(400).send({ status: false, message: "Please enter book ISBN" });
   // if (!isValidISBN(ISBN.trim())) return res.status(400).send({ status: false, message: "Please enter valid ISBN" });

    let isISBNExits = await bookModel.findOne({ ISBN: ISBN });
    if (isISBNExits)
      return res.status(400).send({ status: false, message: "ISBN already exits" });

    // if (category != undefined && typeof (category) != "string") {
    //   return res.status(400).send({ status: false, message: "plese enter valid category" });
    // }
    if (!category )
      return res.status(400).send({ status: false, message: "Please enter book category" });

    // if (subcategory != undefined && typeof (subcategory) != "string") {
    //   return res.status(400).send({ status: false, message: "plese enter valid subcategory" });
    // }
    if (!subcategory )
      return res.status(400).send({ status: false, message: "Please enter book subcategory" });


      if(releasedAt){
        // if(!checkDate(releasedAt)){
          
        //   return res.status(400).send({status:false,message:"please enter valid format:YYYY-MM-DD"})
         
        // }
        bookData.releasedAt = releasedAt

    }else{
      releasedAt = moment().format("YYYY-MM-DD")
      bookData.releasedAt = releasedAt
    
  }
  
    bookData.title = title.trim();
    bookData.excerpt = excerpt.trim();
    bookData.category = category.trim();
    bookData.subcategory = subcategory.trim();
    bookData.ISBN = ISBN.trim();
    // bookData.bookCover=req.bookLink
    let createBook = await bookModel.create(bookData);
    return res.status(201).send({ status: true, message: "Success", Data: createBook });
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message });
  }
};


//_______________________________________________________getBooksByQuery________________________________________________________________________________________


const getBooks = async (req, res) => {
  let data = req.query;
  if (Object.keys(data).length == 0) {
    let foundData = await bookModel.find({ isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1,bookCover:1 });

    if (foundData.length == 0) return res.status(404).send({ status: false, message: "No data available" });

    foundData = foundData.sort((a, b) => a.title.localeCompare(b.title));
    return res.status(200).send({ status: true, message: "Books list", data: foundData });
  }

  if (data.userId) {
    if (!mongoose.isValidObjectId(data.userId))
      return res.status(400).send({ status: false, message: "Invalid userID" });
  }

  let expectedQueries = ["category", "subcategory", "userId"];
  let queries = Object.keys(data);
  let count = 0;
  for (let i = 0; i < queries.length; i++) {
    if (!expectedQueries.includes(queries[i])) count++;
  }
  if (count > 0)
    return res.status(400).send({ status: false, message: "queries can only have userId,category and subcategory" });

  let foundData = await bookModel.find({ ...data, isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 });
  if (foundData.length == 0) return res.status(404).send({ status: false, message: "No data found with given parameters" });

  foundData = foundData.sort((a, b) => a.title.localeCompare(b.title));
  return res.status(200).send({ status: true, message: "Books list", data: foundData });

};



//_______________________________________________________getBooksById________________________________________________________________________________________


const getBookById = async function (req, res) {
  try {
    bookId = req.params.bookId;

    if (!bookId)
      return res.status(400).send({ status: false, message: "Blog Id Is Needed" });

    if (!mongoose.isValidObjectId(bookId))
      return res.status(400).send({ status: false, message: "Invalid bookId" });

    const bookData = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ __v: 0 }).lean();
    if (!bookData)
      return res.status(404).send({ status: false, msg: "No Book Found With Given Book Id" });



    let reviews = await reviewModel.find({ bookId: bookId, isDeleted: false });
    let data = { ...bookData, reviewsData: reviews };

    return res.status(200).send({ status: "true", message: "Booklist", data: data });
  } catch (error) {
    return res.status(500).send({ msg: "Error", error: error.message });
  }
};





//_______________________________________________________updateBooks________________________________________________________________________________________


const updateBooks = async (req, res) => {
  try {
    
    if (Object.keys(req.body).length == 0)
      return res.status(400).send({ status: false, message: "Please provide some data to update" });
    let bookId = req.params.bookId;

    if (!bookId ) {
      return res.status(400).send({ status: false, message: `please provide bookId in order to update..` });
    }
    if (!mongoose.isValidObjectId(bookId)) {
      return res.status(400).send({ status: false, message: `please provide valid bookId in order to update..` });
    }

    let isBookExist = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ userId: 1 });
    if (!isBookExist) {
      return res.status(404).send({ status: false, message: `sorry there is no book in database with provided bookId..` });

    }
//_______________________________________________________AUTHORIZATION__________________________________________

    if (isBookExist.userId != req.userId) {
      return res.status(403).send({ status: false, message: "Unauthorized" });
    }
    //_______________________________________________________________________________________________________

 
    let { ...query } = req.body;
    let { title, excerpt, ISBN, releasedAt } = req.body;
    let queries = Object.keys(query);
    let validQueries = ["title", "excerpt", "releasedAt", "ISBN"];
    let count = 0;
    queries.forEach((x) => {
      if (!validQueries.includes(x)) count++;

    });
    if (count > 0) return res.status(400).send({ status: false, message: `you can only update ${validQueries} attributes ` });

    // if (title != undefined && typeof title !== "string") {
    //   return res.status(400).send({ status: false, message: "Please enter valid title" });
    // }

    // if (excerpt != undefined && typeof excerpt !== "string") {
    //   return res.status(400).send({ status: false, message: "Please enter valid excerpt" });
    // }

    // if (ISBN != undefined && !isValidISBN(ISBN)) {
    //   return res.status(400).send({ status: false, message: "Please enter valid ISBN" });
    // }
    let isTitleExist = await bookModel.findOne({title:title,isDeleted: false,});

    let isISBNExits = await bookModel.findOne({ISBN: ISBN,isDeleted: false,});

    if (isTitleExist) {
      return res.status(400).send({ status: false, message: `please check your title as there is already one document with same title...` });
    }
    if (isISBNExits) {
      return res.status(400).send({ status: false, message: `please check your ISBN as there is already one document with same ISBN number...` });
    }
    // if (releasedAt != undefined && !checkDate(releasedAt)) {
    //   return res.status(400).send({ status: false, message: `please provide valid date in order to update`, });
    // }


    // if (title != undefined) query.title = query.title.trim();
    // if (excerpt != undefined) query.excerpt = query.excerpt.trim();
    query.releasedAt = moment().format("YYYY-MM-DD");
    let updatedData = await bookModel.findOneAndUpdate({ _id: bookId }, query, { new: true, }).select({ __v: 0 });
    return res.status(200).send({ status: true, message: `success`, data: updatedData });

  } catch (err) {
    return res.status(500).send({ status: false, err: err.message });
  }
};








//_______________________________________________________deleteBooks________________________________________________________________________________________


const deleteById = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    if (!mongoose.isValidObjectId(bookId))
      return res.status(400).send({ status: false, message: "Invalid bookId" });

    let foundBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!foundBook)
      return res.status(404).send({ status: false, message: "No Data Found to Delete" });


//_______________________________________________________AUTHORIZATION__________________________________________

    if (foundBook.userId != req.userId)
      return res.status(403).send({ status: false, message: "Unauthorized" });
//_______________________________________________________________________________________________________________

    foundBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true } });

    return res.status(200).send({ status: true, message: "Book Deleted Successfully" });
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message });
  }
};

module.exports = { createBook, getBooks, getBookById, updateBooks, deleteById };
