const mongoose = require('mongoose');
//const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Product owner is required']
    },

    name: {
      type: String,
      required: [true, 'Product name is required'],
      minlength: [5, 'Product name must be at least 5 characters'],
      maxlength: [20, 'Product name cannot exceed 20 characters'],
      trim: true
    },

    category: {
      type: String,
      default: 'General'
    },

    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// productSchema.plugin(AutoIncrement, { inc_field: 'productId' });

productSchema.index({ owner: 1, name: 1 }, { unique: true });


productSchema.virtual('status').get(function () {
  if (this.quantity > 2) return 'available';
  if (this.quantity > 0) return 'low stock';
  return 'out of stock';
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
