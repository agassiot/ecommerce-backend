const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.route('/')
.get( async (req, res) => {
  var tags = await Tag.findAll({
    include: [  Product,   ]
  });

  res.status(200).json(tags);
})

.post( async (req, res) => {
  var tag = await Tag.create(req.body);

    res.status(200).json(tag);
})




router.route('/:id')
.put( async (req, res) => {
  await Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
 
  res.status(200).json({message: 'tag update succesful'});
})

.delete( async (req, res) => {
  await Tag.destroy({
    where: {
      id: req.params.id
    },
  });

  res.status(200).json('category delete successful');
})

.get( async (req, res) => {
  var tag = await Tag.findByPk(req.params.id, {
    include: [ Product, ]
  });

  res.status(200).json(tag);
})


module.exports = router;
