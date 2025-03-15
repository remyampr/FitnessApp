const Trainer = require('../Models/Trainer');


const checkCertification = async (req, res, next) => {
    try {
      const trainer = await Trainer.findById(req.user.id);
      if (!trainer || !trainer.isApproved) {
        return res.status(403).json({ error: 'Trainer is not Approved!' });
      }
      next();
    } catch (error) {
        next(error);
    }
}


module.exports = checkCertification;