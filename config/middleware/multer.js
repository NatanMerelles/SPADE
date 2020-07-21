const multer = require('multer')

module.exports = (multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './application/public/img/avatar');
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname+"-"+Date.now()+"."+file.mimetype.split("/")[1]);

        }
    }),
    fileFilter: (req, file, cb) => {

            const isAccepted = ['image/png', 'image/jpg', 'image/jpeg'].find( formatoAceito => formatoAceito == file.mimetype );
            if(isAccepted){
                return cb(null, true);
            }
            return cb(null, false);
    }
}))