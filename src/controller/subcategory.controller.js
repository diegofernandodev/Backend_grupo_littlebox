
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


//Edit Subcategory:
controller.editSubcategory = async ( req, res ) => {

  try {

    const id = req.params.id;
    const edited = req.body
    const tenantId = req.tenantId
    const subcategory = await subcategoryModel.findByIdAndUpdate({ _id: id, tenantId: tenantId }, { $set: edited });
    
    responseEdit.status = "200"
    responseEdit.message = "It has been edited successfully."
    responseEdit.former = subcategory
    responseEdit.edited = edited

    res.status(200).send(responseEdit);
    
  } catch (error) {
    console.error('Error editing:', error);

    ResponseStructure.status = "500"
    ResponseStructure.message = "Could not update correctly."
    ResponseStructure.data = error

    res.status(500).send(ResponseStructure);
  }
}



//Delete Subcategories:
controller.deleteSubcategories = async (req , res) => {
   try {
    const idParam = req.params.id;
    const tenantId = req.tenantId
    const removed = await subcategoryModel.findByIdAndDelete({ _id:idParam, tenantId: tenantId});

    ResponseStructure.status = "200";
    ResponseStructure.message = "It has been successfully removed.";
    ResponseStructure.data = removed;
    res.status(200).send(ResponseStructure);
  

  } catch (error) {
    console.error('Error, not removed:', error);
    ResponseStructure.status = "500";
    ResponseStructure.message = "Could not delete correctly.";
    ResponseStructure.data = error;
    res.status(500).send(ResponseStructure);
  }
}

//Save subcategory:
controller.saveSubcategory = async (req, res) =>{
  try{
    const body = req.body;
    const tenantId = req.tenantId
    body.tenantId = tenantId
    const newSubcategory = new subcategoryModel(body, tenantId);
    await newSubcategory.save();
    
    ResponseStructure.status = 200;
    ResponseStructure.message = "The Subcategory has been saved successfully.";
    ResponseStructure.data = body;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    const errorsCatch = error.errors;
    const errors = {};

    for (let i in errorsCatch) {
        errors[i] = errorsCatch[i].message;
      }
  
      ResponseStructure.status = 500;
      ResponseStructure.message = "An error occurred, the subcategory could not be saved.";
      ResponseStructure.data = errors;
      
      res.status(500).json(ResponseStructure);
    }
  }






//Get subcategory through the category id:
  controller.getSubcategoriesByCategory = async (req, res) => {
    try {
      const id = req.params.id;
      const tenantId = req.tenantId
      const subcategories = await subcategoryModel.find({ category: id, tenantId: tenantId });
  
      res.status(200).json(subcategories);
    } catch (error) {
      console.error('Search error:', err);
      ResponseStructure.status = "500";
      ResponseStructure.message = "Could not be found correctly.";
      ResponseStructure.data = err;
      res.status(500).send(ResponseStructure);
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
      const edited = req.body;
      const subcategory = await subcategoryModel.findByIdAndUpdate({ _id: id, tenantId: { $exists: false } }, { $set: edited });
      const responseEdit = {
        status: "200",
        message: "It has been edited successfully.",
        former: subcategory,
        edited: edited
      };
      res.status(200).send(responseEdit);
    } catch (error) {
      console.error('Error editing:', error);
      const ResponseStructure = {
        status: "500",
        message: "Could not update correctly.",
        data: error
      };
      res.status(500).send(ResponseStructure);
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