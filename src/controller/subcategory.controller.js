
const subcategoryModel = require('../models/subcategory.model');
const { ResponseStructure } = require ('../helpers/ResponseStructure')
const { responseEdit } = require("../helpers/response.edit");


const controller = {}


controller.showSubcategoriesWhith = async (req, res) => {

  try {
    const subcategories = await subcategoryModel.find ()
    res.json(subcategories)

  }catch(err){
    ResponseStructure.status = "500"
    ResponseStructure.message = "It could not be found."
    ResponseStructure.data = error
    res.status(500).send(ResponseStructure);
  }
}

//Show all subcategories:
controller.showSubcategories = async (req, res) => {
  
  try{
    const tenantId = req.tenantId
    const subcategories = await subcategoryModel.find({ tenantId })
    res.json(subcategories)

  }catch(err){
    ResponseStructure.status = "500"
    ResponseStructure.message = "It could not be found."
    ResponseStructure.data = error
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
    const tenantId = req.tenantId
    const edited = req.body
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

//Get subcategory through identifier: 
  controller.getSubcategoryIdentifier = async (req, res) => {
    try {
      const identifier = req.params.identifier;
      const tenantId = req.tenantId
      const subcategory = await subcategoryModel.findOne({ identifier: identifier, tenantId: tenantId });
  
      if (!subcategory) {
        ResponseStructure.status = 500;
        ResponseStructure.message = "The subcategory does not exist.";
        ResponseStructure.data = errors;

        res.status(404).send(ResponseStructure);
      }
  
      res.status(200).send(subcategory);
    } catch (err) {
      console.error('Search error:', err);
      ResponseStructure.status = "500";
      ResponseStructure.message = "Could not be found correctly.";
      ResponseStructure.data = err;
      res.status(500).send(ResponseStructure);
    }
  }

//Get subcategory through the category id:
  controller.getSubclassesByCategory = async (req, res) => {
    try {
      const identifier = req.params.identifier;
      const tenantId = req.tenantId
      const subcategories = await subcategoryModel.find({ category: identifier, tenantId: tenantId });
  
      res.status(200).json(subcategories);
    } catch (error) {
      console.error('Search error:', err);
      ResponseStructure.status = "500";
      ResponseStructure.message = "Could not be found correctly.";
      ResponseStructure.data = err;
      res.status(500).send(ResponseStructure);
    }
  };
  
  
  
  module.exports = controller