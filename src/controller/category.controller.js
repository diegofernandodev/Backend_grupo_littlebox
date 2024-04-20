
const { ResponseStructure } = require ('../helpers/ResponseStructure')
const categoryModel = require('../models/category.model');
const { responseEdit } = require("../helpers/response.edit");


const controller = {}


//Show all categories:
controller.showCategories = async (req, res) => {
  
  try{
    const tenantId = req.tenantId
    const categories = await categoryModel.find({ tenantId })
    res.json(categories)

  }catch(err){
    ResponseStructure.status = "500"
    ResponseStructure.message = "It could not be found."
    ResponseStructure.data = error
    res.status(500).send(ResponseStructure);
  }
}

//Show a single category:
controller.getACategory = async (req, res) => {
  
  try {
     
    const id = req.params.id
    const tenantId = req.tenantId
    const category = await categoryModel.findById({_id: id, tenantId: tenantId})
    
    if (!category) {
      ResponseStructure.status = "500";
      ResponseStructure.message = "The category does not exist.";
      ResponseStructure.data = error;
      res.status(500).send(ResponseStructure);
    }
    
    res.status(200).send(category);


  }catch(err){
    console.error('Search error:',err);
    ResponseStructure.status = "500";
    ResponseStructure.message = "Category not found.";
    ResponseStructure.data = error;
    res.status(500).send(ResponseStructure);
  }
}


//Save category:
controller.saveCategory = async (req, res) => {
  try {
    const tenantId = req.tenantId; 
    let categoryCounter = 1; 

    const lastCategory = await categoryModel.findOne({ tenantId }).sort({ identifier: -1 });

    if (lastCategory && typeof lastCategory.identifier === 'number') {
      categoryCounter = lastCategory.identifier + 1;
    }

    if (isNaN(categoryCounter)) {
      throw new Error('categoryCounter is not a valid number.');
    }

    const body = req.body;
    body.identifier = categoryCounter;
    body.tenantId = tenantId; 

    const newCategory = new categoryModel(body);
    await newCategory.save();

    const ResponseStructure = {
      status: 200,
      message: "The category has been saved successfully.",
      data: body
    };

    res.status(200).json(ResponseStructure);
  } catch (error) {
    console.error('An error occurred, the category could not be saved:', error);
    const ResponseStructure = {
      status: 500,
      message: "An error occurred, the category could not be saved.",
      error: error.message
    };

    res.status(500).json(ResponseStructure);
  }
};

// Edit a category
controller.editCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const edited = req.body;
    const tenantId = req.tenantId;

    const originalCategory = await categoryModel.findOne({ _id: id, tenantId: tenantId });

    if (!originalCategory) {
      return res.status(404).json({ status: 404, message: "Category not found or does not belong to the current tenant." });
    }

    const originalIdentifier = originalCategory.identifier;

    delete edited.identifier;

    const updatedCategory = await categoryModel.findOneAndUpdate({ _id: id, tenantId: tenantId }, edited, { new: true });

    if (!updatedCategory) {
      return res.status(500).json({ status: 500, message: "Could not update correctly." });
    }

    const responseEdit = {
      status: 200,
      message: "Category has been edited successfully.",
      former: {
        ...originalCategory.toObject(),
        identifier: originalIdentifier
      },
      edited: updatedCategory
    };

    res.status(200).json(responseEdit);
  } catch (error) {
    console.error('Error occurred while editing category:', error);

    const ResponseStructure = {
      status: 500,
      message: "Could not update correctly.",
      data: error
    };

    res.status(500).json(ResponseStructure);
  }
};


//Delete category
controller.deleteCategory = async (req, res) => {
  try {
    const idParam = req.params.id;
    const tenantId = req.tenantId;
    
    const removed = await categoryModel.findByIdAndDelete({ _id: idParam, tenantId: tenantId });

    if (!removed) {
      return res.status(404).json({ status: 404, message: "Category not found or does not belong to the current tenant." });
    }

    const categoriesToUpdate = await categoryModel.find({ identifier: { $gt: removed.identifier }, tenantId: tenantId });

    for (const category of categoriesToUpdate) {
      category.identifier -= 1;
      await category.save();
    }

    const ResponseStructure = {
      status: 200,
      message: "Category has been successfully removed.",
      data: removed
    };

    res.status(200).json(ResponseStructure);
  } catch (error) {
    console.error('Error occurred while deleting category:', error);

    const ResponseStructure = {
      status: 500,
      message: "Could not delete category correctly.",
      data: error
    };

    res.status(500).json(ResponseStructure);
  }
};

// Show category by identifier
controller.getCategoryByNumber = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const tenantId = req.tenantId;

    const category = await categoryModel.findOne({ identifier: identifier, tenantId: tenantId });

    if (!category || !category.identifier || !category.name || !category.description) {
      return res.status(404).json({ status: 404, message: "The category does not exist or has an invalid format.", data: null });
    }

    const ResponseStructure = {
      status: 200,
      message: "Category found.",
      data: {
        ...category.toObject(),
        identifier: category.identifier 
      }
    };

    res.status(200).json(ResponseStructure);
  } catch (err) {
    console.error('Search error:', err);
    const ResponseStructure = {
      status: 500,
      message: "An error occurred while searching for the category.",
      data: err
    };
    res.status(500).json(ResponseStructure);
  }
};


  //Chatback: 
  controller.showCategoriesWT = async (req, res) => {
    try {
      const categories = await categoryModel.find({ $or: [{ tenantId: { $exists: false } }, { tenantId: null }] });
      res.json(categories);
    } catch (err) {
      console.error('Error:', err);
      const ResponseStructure = {
        status: 500,
        message: "No se pudieron encontrar las categorías correctamente.",
        data: err
      };
      res.status(500).send(ResponseStructure);
    }
  };
  
  // Mostrar una sola categoría sin (tenant)
  controller.getCategoryWT = async (req, res) => {
    try {
      const id = req.params.id;
      const category = await categoryModel.findById({ _id: id, tenantId: { $exists: false } });
      if (!category) {
        const ResponseStructure = {
          status: 404,
          message: "La categoría no existe."
        };
        return res.status(404).json(ResponseStructure);
      }
      res.status(200).send(category);
    } catch (err) {
      console.error('Error:', err);
      const ResponseStructure = {
        status: 500,
        message: "No se pudo encontrar la categoría correctamente.",
        data: err
      };
      res.status(500).send(ResponseStructure);
    }
  };
  
  // Editar categoría sin (tenant)
  controller.editCategoryWT = async (req, res) => {
    try {
      const id = req.params.id;
      const edited = req.body;
      const category = await categoryModel.findByIdAndUpdate({ _id: id, tenantId: { $exists: false } }, { $set: edited });
      if (!category) {
        const ResponseStructure = {
          status: 404,
          message: "La categoría no existe."
        };
        return res.status(404).json(ResponseStructure);
      }
      const responseEdit = {
        status: "200",
        message: "Se ha editado la categoría correctamente.",
        former: category,
        edited: edited
      };
      res.status(200).send(responseEdit);
    } catch (error) {
      console.error('Error:', error);
      const ResponseStructure = {
        status: "500",
        message: "No se pudo actualizar la categoría correctamente.",
        data: error
      };
      res.status(500).send(ResponseStructure);
    }
  };
  
  // Eliminar categoría sin (tenant)
  controller.deleteCategoryWT = async (req, res) => {
    try {
      const idParam = req.params.id;
      const removed = await categoryModel.findByIdAndDelete({ _id: idParam, tenantId: { $exists: false } });
      if (!removed) {
        const ResponseStructure = {
          status: 404,
          message: "La categoría no existe."
        };
        return res.status(404).json(ResponseStructure);
      }
      const ResponseStructure = {
        status: "200",
        message: "Se ha eliminado la categoría correctamente.",
        data: removed
      };
      res.status(200).send(ResponseStructure);
    } catch (error) {
      console.error('Error:', error);
      const ResponseStructure = {
        status: "500",
        message: "No se pudo eliminar la categoría correctamente.",
        data: error
      };
      res.status(500).send(ResponseStructure);
    }
  };
  
  // Guardar categoría sin (tenant)
  controller.saveCategoryWT = async (req, res) => {
    try {
      const body = req.body;
      const newCategory = new categoryModel(body);
      await newCategory.save();
      const ResponseStructure = {
        status: 200,
        message: "La categoría se ha guardado correctamente.",
        data: body
      };
      res.status(200).send(ResponseStructure);
    } catch (error) {
      console.error('Error:', error);
      const ResponseStructure = {
        status: 500,
        message: "Se produjo un error, no se pudo guardar la categoría.",
        data: error
      };
      res.status(500).json(ResponseStructure);
    }
  };
  
  
  module.exports = controller
