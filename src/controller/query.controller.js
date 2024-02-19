const queryModel = require("../models/query.model")
const { ResponseStructure } = require("../helpers/ResponseStructure");
const { responseEdit } = require("../helpers/response.edit");



const controller = {}

//Show a single query:
controller.getAQuery = async (req, res) => {
  
  try {
     
    const id = req.params.id
    const query = await queryModel.findById(id)
    
    if (!query) {
      ResponseStructure.status = "500";
      ResponseStructure.message = "The query does not exist.";
      ResponseStructure.data = error;
      res.status(404).send(ResponseStructure);
    }
    
    res.status(200).send(query);


  }catch(err){
    console.error('Search error:',err);
    ResponseStructure.status = "500";
    ResponseStructure.message = "Could not be found correctly.";
    ResponseStructure.data = error;
    res.status(500).send(ResponseStructure);
  }
}

//Edit query:
controller.editQuery = async ( req, res ) => {

  try {

    const id = req.params.id;
    const edited = req.body
    const query = await queryModel.findByIdAndUpdate({ _id: id }, { $set: edited });
    
    responseEdit.status = "200"
    responseEdit.message = "It has been edited successfully."
    responseEdit.former = query
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

//List of all queries:
controller.showQueries = async (req, res) => {
  try {
    const queries = await queryModel.find()
    res.json(queries);

  } catch (err) {
    ResponseStructure.status = "500"
    ResponseStructure.message = "It could not be found."
    ResponseStructure.data = error
    res.status(500).send(ResponseStructure);
  }
}

//Delete query:
controller.deleteQuery = async (req , res) => {
   try {
    const idParam = req.params.id;
    const removed = await queryModel.findByIdAndDelete(idParam);

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

//Save query:
controller.saveQuery = async (req, res) =>{
  try{
    const body = req.body;
    const newQuery = new queryModel(body);
    await newQuery.save();
    
    ResponseStructure.status = 200;
    ResponseStructure.message = "The query has been saved successfully.";
    ResponseStructure.data = body;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    const errorsCatch = error.errors;
    const errors = {};

    for (let i in errorsCatch) {
        errors[i] = errorsCatch[i].message;
      }
  
      ResponseStructure.status = 500;
      ResponseStructure.message = "An error occurred, the query could not be saved.";
      ResponseStructure.data = errors;
      
      res.status(500).json(ResponseStructure);
    }
  }

//Show query by identifier:
  controller.getConsultationIdentifier = async (req, res) => {
    try {
      const identifier = req.params.identifier;
      const query = await queryModel.findOne({ identifier: identifier });
  
      if (!query) {
        ResponseStructure.status = 500;
        ResponseStructure.message = "The query does not exist.";
        ResponseStructure.data = errors;

        res.status(404).send(ResponseStructure);
      }
  
      res.status(200).send(query);
    } catch (err) {
      console.error('Search error:', err);
      ResponseStructure.status = "500";
      ResponseStructure.message = "Could not be found correctly.";
      ResponseStructure.data = err;
      res.status(500).send(ResponseStructure);
    }
  }

//Get query for subclass id:
  controller.getQueriesBySubcategory = async (req, res) => {
    try {
      const identifier = req.params.identifier;
      const queries = await queryModel.find({ subcategory: identifier });
  
      res.status(200).json(queries);
      
    } catch (error) {
      console.error('Search error:', err);
      ResponseStructure.status = "500";
      ResponseStructure.message = "Could not be found correctly.";
      ResponseStructure.data = err;
      res.status(500).send(ResponseStructure);
    }
  };

  
module.exports = controller