const router = require('express').Router();
const bwipjs = require('bwip-js');

router.get('/:id.png', async (req, res) => {
  const id = String(req.params.id || 'unknown');

  try {
    bwipjs.toBuffer(
      {
        bcid: 'code128',
        text: id,
        scale: 3,
        height: 60,
        includetext: true,
        textxalign: 'center',
        textsize: 13,
      },
      (err, png) => {
        if (err) {
          return res.status(400).json({ success: false, message: err.message || 'Invalid barcode data.' });
        }

        res.type('image/png');
        res.send(png);
      }
    );
  } catch (err) {
    console.error('Barcode generation error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate barcode.' });
  }
});

module.exports = router;
