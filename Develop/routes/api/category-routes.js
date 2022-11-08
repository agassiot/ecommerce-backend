const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint


router.route('/:id')
.get(async (req, res) => {
  var cat = await Category.findByPk(req.params.id, {
    include: [{ model: Product,}]
  });
  res.status(200).json(cat);
})

.put(async (req, res) => {
  await Category.update(req.body, {
    where: {
      id: req.params.id,
    }, 
  });
  res.status(200).json({message: 'category update successful'});
})

.delete(async (req, res) => {
  await Category.destroy({
    where: {
      id: req.params.id
    }
  });
  res.status(200).json({message: 'category delete successful'});
});


//-------------------------------------------------------------------


router.route('/')
.post('/', async (req, res) => {
  var newCat = await Category.create(req.body);
  res.status(200).json(newCat);
})

.get('/', async (req, res) => {
  var allCats = await Category.findAll({
    include: [{ model: Product,}]
  });
  res.status(200).json(allCats);
});


module.exports = router;
