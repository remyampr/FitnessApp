const Trainer = require('../Models/Trainer');


const checkCertification = async (req, res, next) => {
    try {
      const trainer = await Trainer.findById(req.user.id);
      if (!trainer || !trainer.isCertified) {
        return res.status(403).json({ error: 'Trainer is not certified!' });
      }
      next();
    } catch (error) {
        next(error);
    }
}


module.exports = checkCertification;