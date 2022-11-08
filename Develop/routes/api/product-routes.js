const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

router.route('/:id')
.get(async (req, res) => {
  const products = await Product.findByPk(req.params.id, {
      
    include: [{ model: Category, Tag  }]
  });
  res.status(200).json(products);
})

.put((req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((product) => {
    return ProductTag.findAll({ where: { product_id: req.params.id } });
  })
  .then((productTags) => {
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    const newProductTags = req.body.tagIds
    .filter((tag_id) => !productTagIds.includes(tag_id))
    .map((tag_id) => {
      return {
        product_id: req.params.id,
        tag_id,
      };
    });
    const productTagsToRemove = productTags
    .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
    .map(({ id }) => id);
    
    return Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);
  })
  .then((updatedProductTags) => res.json(updatedProductTags))
  .catch((err) => {
      res.status(400).json(err);
    });
  })
  
  .delete(async (req, res) => {
    await Product.destroy({
      where: {
        id: req.params.id
      }
    })
  });


  
 router.route('/') 
  .get(async (req, res) => {
    const allProds = await Product.findAll({
      include: [{ model: Category, Tag  }]

    });
    res.status(200).json(allProds);
  })
  
.post((req, res) => {
   Product.create(req.body)
   .then((product) => {
     if (req.body.tagIds.length) {
       const productTagIdArr = req.body.tagIds.map((tag_id) => {
         return {
           product_id: product.id,
           tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
  })
  
  module.exports = router;
  