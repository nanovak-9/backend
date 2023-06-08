const express =  require('express')
const router = express.Router()
const {getTareas, setTarea, updateTarea, deleteTarea} = require('../controllers/tareasControllers')
const {protect} = require('../middleware/authMiddleware')

router.route('/').get(protect, getTareas).post(protect, setTarea) //Forma simplificada de las siguientes dos lineas

/*router.get('/', protect, getTareas)
router.post('/', setTarea)*/

router.route('/:id').delete(protect, deleteTarea).put(protect, updateTarea) //Forma simplificada de las siguientes dos lineas

/*router.put('/:id', updateTarea)
router.delete('/:id', deleteTarea)*/

module.exports = router