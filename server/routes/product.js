router.get('/:id', async (req, res) => {
    try {
      const flower = await Flower.findById(req.params.id);
      if (!flower) return res.status(404).json({ message: 'Flower not found' });
      res.json(flower);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });
  