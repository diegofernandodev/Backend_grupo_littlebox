const queryModel = require("../models/query.model")
const { ResponseStructure } = require("../helpers/ResponseStructure");
const { responseEdit } = require("../helpers/response.edit");



const controller = {}

//Show a single query:
controller.getAQuery = async (req, res) => {
  
  try {
     
    const tenantId = req.tenantId
    // const id = req.params.id
    // const query = await queryModel.findById({_id: id, tenantId: tenantId})
    const query = await queryModel.findById({_id: id})
    
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
    // const tenantId = req.tenantId
    // const query = await queryModel.findByIdAndUpdate({ _id: id, tenantId: tenantId }, { $set: edited });
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

// //Show queries whitout tenant: 
// controller.queryWhitoutTenant = async (req, res) => {
//   try {
//     const queries = await queryModel.find({ $or: [{ tenantId: { $exists: false } }, { tenantId: null }]});

//     res.json(queries);
//   } catch (error) {
//     ResponseStructure.status = "500"
//     ResponseStructure.message = "It could not be found."
//     ResponseStructure.data = error
//     res.status(500).send(ResponseStructure);
//   }
// }

//Show of all queries:
controller.showQueries = async (req, res) => {
  try {
    // const tenantId = req.tenantId
    // const queries = await queryModel.find({ tenantId })
    const queries = await queryModel.find().populate('subcategory', 'name');
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
    // const tenantId = req.tenantId
    // const removed = await queryModel.findByIdAndDelete({ _id:idParam, tenantId: tenantId});
    const removed = await queryModel.findByIdAndDelete({ _id:idParam });

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
    // const tenantId = req.tenantId
    // body.tenantId = tenantId
    // const newQuery = new queryModel(body, tenantId);
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

    
    if (!query || !query.identifier || !query.question || !query.answer || !query.subcategory) {
      ResponseStructure.status = 404;
      ResponseStructure.message = "The query does not exist or has an invalid format.";
      ResponseStructure.data = null;
      return res.status(404).json(ResponseStructure);
    }

   
    ResponseStructure.status = 200;
    ResponseStructure.message = "Query found.";
    ResponseStructure.data = query;
    res.status(200).json(ResponseStructure);
  } catch (err) {
    console.error('Search error:', err);
    ResponseStructure.status = 500;
    ResponseStructure.message = "An error occurred while searching for the query.";
    ResponseStructure.data = err;
    res.status(500).json(ResponseStructure);
  }
}


//Get query for subcategory id:
  controller.getQueriesBySubcategory = async (req, res) => {
    try {
      const identifier = req.params.identifier;
      // const tenantId = req.tenantId
      // const queries = await queryModel.find({ subcategory: identifier, tenantId: tenantId });
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