import wrap from 'express-async-handler';
import Campground from '../models/Campground.js';
import Review from '../models/Review.js';

class CampgroundController {

    getIndex = wrap(async (req, res) => {
        const allCamps = await Campground.find();
        res.render('campgrounds/index', { campgrounds: allCamps });
    });

    create = wrap(async (req, res) => {
        const campground = new Campground(req.body.campground);
        campground.owner = req.user._id;
        await campground.save();
        req.flash('success', 'Your campground was created');
        res.redirect(`/campgrounds/${campground._id}`);
    });

    getNew = (req, res) => {
        res.render('campgrounds/new');
    };

    show = wrap(async (req, res) => {
        const campground = await Campground.populateDocument(res.locals.campground);
        res.render('campgrounds/show', { campground });
    });

    edit = wrap(async (req, res) => {
        const campground = res.locals.campground;
        res.render('campgrounds/edit', { campground });
    });

    update = wrap(async (req, res) => {
        const { id: campgroundId } = req.params;
        await Campground.updateOne({ campgroundId }, req.body.campground);

        req.flash('success', 'Your campground was updated');
        res.redirect(`/campgrounds/${campgroundId}`);
    });

    delete = wrap(async (req, res) => {
        const { id: campgroundId } = req.params;
        await Campground.deleteOne({ _id: campgroundId });

        req.flash('success', 'Your campground was deleted');
        res.redirect('/campgrounds');
    });

    createReview = wrap(async (req, res) => {
        const campground = res.locals.campground;
        const campgroundId = campground._id;

        const { rating, content } = req.body.review;
        const review = new Review({ rating, content, campgroundId });

        campground.reviews.unshift(review);
        review.campground = campground;

        req.user.reviews.unshift(review); // TODO not pushing
        review.author = req.user._id; // while this works

        await review.save();
        await campground.save();

        req.flash('success', 'Your review was sent');
        res.redirect(`/campgrounds/${campgroundId}`);
    });

    deleteReview = wrap(async (req, res) => {

        const { id: campgroundId, reviewId } = req.params;

        await Review.deleteOne({ _id: reviewId });

        await Campground.updateOne({ _id: campgroundId }, {
            $pull: { reviews: reviewId }
        });

        req.flash('success', 'Review was deleted');
        res.redirect(`/campgrounds/${campgroundId}`);
    });
}

export default new CampgroundController();