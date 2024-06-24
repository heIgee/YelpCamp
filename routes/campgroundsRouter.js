import express from 'express';

import CampgroundValidator from '../helpers/CampgroundValidator.js';
import CampgroundController from '../controllers/CampgroundController.js';

import { cloudinary, storage } from '../cloudinary/index.js';

import {
    ensureLoggedIn,
    verifyCampground,
    verifyCampgroundAndOwner,
    verifyReviewAndAuthor
} from '../middleware.js';

import multer from 'multer';
const upload = multer({ storage });

const router = express.Router();

router.route('/')
    .get(CampgroundController.getIndex)
    .post(ensureLoggedIn,
        upload.array('images'),
        CampgroundValidator.test,
        CampgroundController.create
    );

router.get('/new',
    ensureLoggedIn,
    CampgroundController.getNew
);

router.route('/:id')
    .get(verifyCampground,
        CampgroundController.show
    )
    .put(ensureLoggedIn,
        verifyCampgroundAndOwner,
        CampgroundValidator.test,
        CampgroundController.update
    )
    .delete(ensureLoggedIn,
        CampgroundController.delete
    );

router.get('/:id/edit',
    ensureLoggedIn,
    verifyCampgroundAndOwner,
    CampgroundController.edit
);

export default router;
