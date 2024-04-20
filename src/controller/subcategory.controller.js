
const subcategoryModel = require('../models/subcategory.model');
const { ResponseStructure } = require ('../helpers/ResponseStructure')
const { responseEdit } = require("../helpers/response.edit");


const controller = {}




//Show all subcategories:
controller.showSubcategories = async (req, res) => {
  
  try{
    const tenantId = req.tenantId
    const subcategories = await subcategoryModel.find({ tenantId }).populate('category', 'name');
    res.json(subcategories)

  }catch(err){
    ResponseStructure.status = "500"
    ResponseStructure.message = "It could not be found."
    ResponseStructure.data = err
    res.status(500).send(ResponseStructure);
  }
}

//Show a single subcategory:
controller.getASubcategory = async (req, res) => {
  
  try {
     
    const id = req.params.id
    const tenantId = req.tenantId
    const subcategory = await subcategoryModel.findById({ _id: id, tenantId : tenantId })
    
    if (!subcategory) {
      ResponseStructure.status = "500";
      ResponseStructure.message = "The query does not exist.";
      ResponseStructure.data = error;
      res.status(404).send(ResponseStructure);
    }
    
    res.status(200).send(subcategory);


  }catch(err){
    console.error('Search error:',err);
    ResponseStructure.status = "500";
    ResponseStructure.message = "Could not be found correctly.";
    ResponseStructure.data = error;
    res.status(500).send(ResponseStructure);
  }
}

//Save Subcategory
controller.saveSubcategory = async (req, res) => {
  try {
    const { tenantId } = req;

    let queryCounter = 1.001; 

    const lastSubcategory = await subcategoryModel.findOne({ tenantId }).sort({ identifier: -1 });

    if (lastSubcategory && typeof lastSubcategory.identifier === 'number') {
      let nextCounter = lastSubcategory.identifier + 0.001;
      queryCounter = parseFloat(nextCounter.toFixed(3));
    }

    const body = req.body;
    body.identifier = queryCounter;
    body.tenantId = tenantId;

    const newSubcategory = new subcategoryModel(body);
    await newSubcategory.save();

    const ResponseStructure = {
      status: 200,
      message: "The Subcategory has been saved successfully.",
      data: body
    };

    res.status(200).json(ResponseStructure);
  } catch (error) {
    console.error('An error occurred, the subcategory could not be saved:', error);
    const ResponseStructure = {
      status: 500,
      message: "An error occurred, the subcategory could not be saved.",
      error: error.message
    };
    res.status(500).json(ResponseStructure);
  }
};

//Edit subcategory
controller.editSubcategory = async (req, res) => {
  try {
    const id = req.params.id;
    const editedSubcategory = req.body;
    const tenantId = req.tenantId;

    const originalSubcategory = await subcategoryModel.findOne({ _id: id, tenantId: tenantId });

    if (!originalSubcategory) {
      return res.status(404).json({ status: 404, message: "Subcategory not found or does not belong to the current tenant." });
    }

    const originalIdentifier = originalSubcategory.identifier;

    delete editedSubcategory.identifier;

    const updatedSubcategory = await subcategoryModel.findOneAndUpdate(
      { _id: id, tenantId: tenantId },
      editedSubcategory,
      { new: true }
    );

    if (!updatedSubcategory) {
      return res.status(500).json({ status: 500, message: "Could not update correctly." });
    }

    const responseEdit = {
      status: 200,
      message: "The subcategory has been edited successfully.",
      former: {
        ...originalSubcategory.toObject(),
        identifier: originalIdentifier 
      },
      edited: updatedSubcategory
    };

    res.status(200).json(responseEdit);
  } catch (error) {
    console.error('Error occurred while editing subcategory:', error);
    const ResponseStructure = {
      status: 500,
      message: "Could not update correctly.",
      data: error
    };
    res.status(500).json(ResponseStructure);
  }
};


//Delete subcategory
controller.deleteSubcategories = async (req, res) => {
  try {
    const idParam = req.params.id;
    const tenantId = req.tenantId;

    const removedSubcategory = await subcategoryModel.findOneAndDelete({ _id: idParam, tenantId: tenantId });

    if (!removedSubcategory) {
      return res.status(404).json({ status: 404, message: "Subcategory not found or does not belong to the current tenant." });
    }

    const subcategoriesToUpdate = await subcategoryModel.find({ identifier: { $gt: removedSubcategory.identifier }, tenantId: tenantId });

    for (const subcategory of subcategoriesToUpdate) {
      subcategory.identifier -= 0.001;
      subcategory.identifier = parseFloat(subcategory.identifier.toFixed(3));
      await subcategory.save();
    }

    const ResponseStructure = {
      status: 200,
      message: "The subcategory has been successfully removed.",
      data: removedSubcategory
    };
    res.status(200).json(ResponseStructure);
  } catch (error) {
    console.error('Error occurred while deleting subcategory:', error);
    const ResponseStructure = {
      status: 500,
      message: "Could not delete the subcategory correctly.",
      data: error
    };
    res.status(500).json(ResponseStructure);
  }
};

 

  //Get subcategoryByNumber
  controller.getSubcategoryByNumber = async (req, res) => {
    try {
      const identifier = req.params.identifier;
      
      const subcategory = await subcategoryModel.findOne({ identifier: identifier });
  
      if (!subcategory || !subcategory.identifier || !subcategory.name || !subcategory.description) {
        const ResponseStructure = {
          status: 404,
          message: "The subcategory does not exist or has an invalid format.",
          data: null
        };
        return res.status(404).json(ResponseStructure);
      }
  
      const ResponseStructure = {
        status: 200,
        message: "Subcategory found.",
        data: subcategory
      };
      res.status(200).json(ResponseStructure);
    } catch (err) {
      console.error('Search error:', err);
      const ResponseStructure = {
        status: 500,
        message: "An error occurred while searching for the subcategory.",
        data: err
      };
      res.status(500).json(ResponseStructure);
    }
  };

  //Chatback: 
  //ShowWt
  controller.showSubcategoriesWT = async (req, res) => {
    try {
      const subcategories = await subcategoryModel.find({ $or: [{ tenantId: { $exists: false } }, { tenantId: null }] }).populate('category', 'name');
      res.json(subcategories);
    } catch (err) {
      const ResponseStructure = {
        status: 500,
        message: "It could not be found.",
        data: err
      };
      res.status(500).send(ResponseStructure);
    }
  };
  
  // Show a single subcategory without tenant
  controller.getSubcategoryWT = async (req, res) => {
    try {
      const id = req.params.id;
      const subcategory = await subcategoryModel.findById({ _id: id, tenantId: { $exists: false } });
      if (!subcategory) {
        const ResponseStructure = {
          status: 404,
          message: "The subcategory does not exist."
        };
        return res.status(404).json(ResponseStructure);
      }
      res.status(200).send(subcategory);
    } catch (err) {
      console.error('Search error:', err);
      const ResponseStructure = {
        status: 500,
        message: "Could not be found correctly.",
        data: err
      };
      res.status(500).send(ResponseStructure);
    }
  };
  
  // Edit subcategory without tenant
  controller.editSubcategoryWT = async (req, res) => {
    try {
      const id = req.params.id;
      const editedSubcategory = req.body;
  
      const originalSubcategory = await subcategoryModel.findOne({ _id: id });
  
      if (!originalSubcategory) {
        return res.status(404).json({ status: 404, message: "Subcategory not found or does not belong to the current tenant." });
      }
  
      const originalIdentifier = originalSubcategory.identifier;
  
      delete editedSubcategory.identifier;
  
      const updatedSubcategory = await subcategoryModel.findOneAndUpdate(
        { _id: id },
        editedSubcategory,
        { new: true }
      );
  
      if (!updatedSubcategory) {
        return res.status(500).json({ status: 500, message: "Could not update correctly." });
      }
  
      const responseEdit = {
        status: 200,
        message: "The subcategory has been edited successfully.",
        former: {
          ...originalSubcategory.toObject(),
          identifier: originalIdentifier 
        },
        edited: updatedSubcategory
      };
  
      res.status(200).json(responseEdit);
    } catch (error) {
      console.error('Error occurred while editing subcategory:', error);
      const ResponseStructure = {
        status: 500,
        message: "Could not update correctly.",
        data: error
      };
      res.status(500).json(ResponseStructure);
    }
  };
  
  // Delete subcategory without tenant
  controller.deleteSubcategoryWT = async (req, res) => {
    try {
      const idParam = req.params.id;
      const removed = await subcategoryModel.findByIdAndDelete({ _id: idParam, tenantId: { $exists: false } });
      const ResponseStructure = {
        status: "200",
        message: "It has been successfully removed.",
        data: removed
      };
      res.status(200).send(ResponseStructure);
    } catch (error) {
      console.error('Error, not removed:', error);
      const ResponseStructure = {
        status: "500",
        message: "Could not delete correctly.",
        data: error
      };
      res.status(500).send(ResponseStructure);
    }
  };
  
  // Save subcategory without tenant
  controller.saveSubcategoryWT = async (req, res) => {
    try {
      const body = req.body;
      const newSubcategory = new subcategoryModel(body);
      await newSubcategory.save();
      const ResponseStructure = {
        status: 200,
        message: "The Subcategory has been saved successfully.",
        data: body
      };
      res.status(200).send(ResponseStructure);
    } catch (error) {
      const errorsCatch = error.errors;
      const errors = {};
      for (let i in errorsCatch) {
        errors[i] = errorsCatch[i].message;
      }
      const ResponseStructure = {
        status: 500,
        message: "An error occurred, the subcategory could not be saved.",
        data: errors
      };
      res.status(500).json(ResponseStructure);
    }
  };
  
  // Get subcategories by category without tenant
  controller.getSubcategoriesByCategoryWT = async (req, res) => {
    try {
      const id = req.params.id;
      const subcategories = await subcategoryModel.find({ category: id, tenantId: { $exists: false } });
      res.status(200).json(subcategories);
    } catch (error) {
      console.error('Search error:', error);
      const ResponseStructure = {
        status: "500",
        message: "Could not be found correctly.",
        data: error
      };
      res.status(500).send(ResponseStructure);
    }
  };
  
  
  
  
  module.exports = controller