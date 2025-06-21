const { productlisting, mediafile, productcategory, productcondition, user } = require('../models');
const { APPROVAL_STATUS, DELETE_STATUS } = require('../constants/productStatus');
const now = new Date().toISOString();




exports.getApprovedProductListings = async (req, res) => {
  try {
    const listings = await productlisting.findAll({
      attributes: [
        'id', 'title', 'description', 'price', 'tags', 'location', 'status', 'created_at', 'updated_at'
      ],
      where: {
        status: APPROVAL_STATUS.APPROVED,
        is_deleted: DELETE_STATUS.ACTIVE
      },
      include: [
        { model: mediafile, as: 'mediafiles', attributes: ['file_path'], where: { is_approved: true }, required: true },
        { model: productcategory, as: 'category' },
        { model: productcondition, as: 'condition' },
        { model: user, as: 'creator' }
      ]
    });
    return res.success('Product listings fetched successfully', listings, 200);
  } catch (err) {
    return res.error(err.message || 'Internal Server Error', 500);
  }
};

exports.getListingById = async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    const listing = await productlisting.findByPk(id, {
      include: [
        { model: mediafile, as: 'mediafiles' },
        { model: productcategory, as: 'category' },
        { model: productcondition, as: 'condition' },
        { model: user, as: 'creator' }
      ]
    });
    if (!listing) return res.error('Listing not found', 404);
    return res.success('Listing fetched successfully', listing, 200);
  } catch (err) {
    return res.error(err.message || 'Internal Server Error', 500);
  }
};

exports.createListing = async (req, res) => {
  try {
    const { mediafiles = [], ...data } = req.body;
    data.status = APPROVAL_STATUS.PENDING;
    data.previous_status = APPROVAL_STATUS.PENDING;

    // 🔧 Convert tags array to comma-separated string
    if (Array.isArray(data.tags)) {
      data.tags = data.tags.join(',');
    }

    const listing = await productlisting.create(
      { ...data, mediafiles, created_at: now, updated_at: now },
      { include: [{ model: mediafile, as: 'mediafiles' }] }
    );

    return res.success('Listing created successfully', listing, 201);
  } catch (err) {
    return res.error(err.message || 'Failed to create listing', 500);
  }
};


// exports.updateListing = async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);

//     const existingListing = await productlisting.findByPk(id);
//     if (!existingListing) {
//       return res.error('Listing not found', 404);
//     }

//     await productlisting.update(req.body, { where: { id } });

//     const updatedListing = await productlisting.findByPk(id);
//     return res.success('Listing updated successfully', updatedListing, 200);
//   } catch (err) {
//     return res.error(err.message || 'Failed to update listing', 500);
//   }
// };



exports.updateListing = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existingListing = await productlisting.findByPk(id);
    if (!existingListing) {
      return res.error('Listing not found', 404);
    }

    const { tags, removed_media_ids = [], ...updateData } = req.body;

    // ✅ Handle tag array conversion
    if (Array.isArray(tags)) {
      updateData.tags = tags.join(','); // Store as CSV
    } else if (typeof tags === 'string') {
      updateData.tags = tags; // Already a CSV
    }

    // ✅ Update product listing
    await productlisting.update(updateData, { where: { id } });

    // ✅ Remove deleted media files
    if (Array.isArray(removed_media_ids) && removed_media_ids.length > 0) {
      await mediafile.destroy({
        where: {
          id: removed_media_ids,
          product_id: id
        }
      });
    }

    // ✅ Fetch updated listing
    const updatedListing = await productlisting.findByPk(id, {
      include: [
        { model: mediafile, as: 'mediafiles' }
      ]
    });

    return res.success('Listing updated successfully', updatedListing, 200);
  } catch (err) {
    return res.error(err.message || 'Failed to update listing', 500);
  }
};



exports.deleteProductListing = async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    const listing = await productlisting.findByPk(id);
    if (!listing) return res.error('Listing not found', 404);

    listing.is_deleted = DELETE_STATUS.DELETED;
    await listing.save();

    return res.success('Product listing deleted successfully', null, 200);
  } catch (err) {
    return res.error(err.message || 'Failed to delete listing', 500);
  }
};

//retrive products of an user 
exports.getUserProducts = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        message: 'user_id is required',
        status: 400
      });
    }

    const products = await productlisting.findAll({
      where: {
        created_by_id: user_id,
        is_deleted: DELETE_STATUS.ACTIVE // ✅ consistent with your constants
      },
      include: [
        { model: mediafile, as: 'mediafiles' },
        { model: productcategory, as: 'category' },
        { model: productcondition, as: 'condition' }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      message: 'User products retrieved successfully',
      status: 200,
      data: products
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Server error',
      status: 500
    });
  }
};



// update product status
exports.updateProductStatus = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { status: newStatus } = req.body;

    const product = await productlisting.findOne({
      where: {
        id: productId,
        is_deleted: DELETE_STATUS.ACTIVE
      }
    });

    if (!product) {
      return res.error('Product not found or has been deleted', 404);
    }

    await product.update({
      previous_status: product.status,
      status: newStatus,
      updated_at: new Date().toISOString()
    });

    const updatedListing = await productlisting.findByPk(productId);
    return res.success('Product status updated successfully', updatedListing, 200);

  } catch (error) {
    return res.error(error.message || 'Internal Server Error', 500);
  }
};

