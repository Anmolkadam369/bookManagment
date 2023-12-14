const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");
const mongoose = require('mongoose')
const moment = require("moment")
const { isValidName, isValidReview, checkDate } = require("../Validators/validatte")




//_______________________________________________________createReview________________________________________________________________________________________

const createReview = async (req, res) => {
  try {
    let reviewData = req.body
    let bookId = req.params.bookId
    if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "invalid bookId" })
    let { reviewedBy, rating, review, reviewedAt } = reviewData

   // if (Object.keys(reviewData).length == 0) return res.status(400).send({ status: false, message: "please enter the review details" })
    if (reviewedBy) {
      //if (reviewedBy != undefined && typeof (reviewedBy) != "string") return res.status(400).send({ status: false, message: "type of name should be text" })
      if (reviewedBy.trim() == "") return res.status(400).send({ status: false, message: "please provide reviewer name" })
      //if (!isValidName(reviewedBy)) return res.status(400).send({ status: false, message: "please enter the valid reviewer name" })
      reviewData.reviewedBy = reviewedBy
    }

    if (!rating ) return res.status(400).send({ status: false, message: "please give rating" })
    if (typeof rating !== 'number' || !/^[1-5]{1}$/.test(rating)) {
      return res.status(400).send({ status: false, message: "rating should be integers between [1,5] " })
    }

    if (review) {
    //  if (review != undefined && typeof (review) != "string") return res.status(400).send({ status: false, message: "type of name should be string" })
      if (review.trim() == "") return res.status(400).send({ status: false, message: "please provide review" })
     // if (!isValidReview(review)) return res.status(400).send({ status: false, message: "review should contain only letters and numbers" })
      reviewData.review = review
    }
    let isBookExist = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true }).lean();//1

    if (!isBookExist) return res.status(404).send({ status: false, message: "book not found" })

    if(reviewedAt){
      // if(!checkDate(reviewedAt)){
      //   return res.status(400).send({status:false,message:"please enter valid format:YYYY-MM-DD"})
      // }
      reviewData.reviewedAt=reviewedAt
    }else{
    reviewedAt = moment().format("YYYY-MM-DD")
    reviewData.reviewedAt = reviewedAt
    }

    
    reviewData.bookId = bookId


    let createdReview = await reviewModel.create(reviewData);//2


    let bookWithReviews = { ...isBookExist, reviewsData: createdReview };


    return res.status(201).send({ status: true,message:"succesfull" ,data: bookWithReviews })

  }
  catch (error) {
    return res.status(500).send({ status: false, error: error.message })
  }

}

//_______________________________________________________updateReview________________________________________________________________________________________


const updateReview = async (req, res) => {
  try {
    let data = req.body;
    let { review, rating, reviewedBy } = data



   // if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "No data in body" });
    let bookId = req.params.bookId;
    if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "No valid bookId" });

    let reviewId = req.params.reviewId
    if (!mongoose.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Invalid reviewId" })


    let queries = Object.keys(data);
    let validQueries = ["review", "rating", "reviewedBy"];
    let count = 0;
    if (queries.length == 0) {
      return res.status(400).send({ status: false, message: "please enter some data in order to update" })

    }
    queries.forEach((x) => {
      if (!validQueries.includes(x)) {
        count++;
      }
    });
    if (count > 0) {
      return res.status(400).send({ status: false, message: `you can only update ${validQueries} attributes ` });
    }


    // if (review != undefined && typeof review !== "string") {
    //   return res.status(400).send({ status: false, message: "Please enter valid review" });
    // }
    // if ((rating != undefined) && (typeof rating !== "number" || !/^[1-5]{1}$/.test(rating))) {
    //   return res.status(400).send({ status: false, message: "Please enter valid rating" });
    // // }
    // if (reviewedBy != undefined && typeof reviewedBy !== "string") {
    //   return res.status(400).send({ status: false, message: "Please enter valid reviewedBy" });
    // }


    let isBookExist = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean();//3

    if (!isBookExist) return res.status(404).send({ status: false, message: "No book found" });


    let isReviewExist = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })//2
    if (!isReviewExist) return res.status(404).send({ status: false, message: "no review found" });

    let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { ...data }, { new: true });//1

    let bookWithReviews = { ...isBookExist, reviewsData: updatedReview };

    return res.status(200).send({ status: true, message: 'Success', data: bookWithReviews })
  }
  catch (error) {
    return res.status(500).send({ status: false, error: error.message })

  }
}



//_______________________________________________________deleteReview________________________________________________________________________________________


const deleteByReviewId = async function (req, res) {

  try {

    const bookId = req.params.bookId

    if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Invalid bookId" })

    const reviewId = req.params.reviewId
    if (!mongoose.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Invalid reviewId" })


    const deletedReview = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })
    if (!deletedReview) return res.status(404).send({ status: false, message: "no review found on this book" })





    let isBookExist = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } });
    if (!isBookExist) return res.status(404).send({ status: false, message: "The book not found." })





    await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId }, { isDeleted: true, deletedAt: Date.now() }, { new: true });

    return res.status(200).send({ status: true, message: "Review is succesfully deleted" })

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}






module.exports = { createReview, deleteByReviewId, updateReview }

